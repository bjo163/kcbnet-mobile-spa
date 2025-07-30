import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
    }

    console.log('Proxying stream request to:', url)

    // Fetch the stream with appropriate headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity', // Disable compression for streaming
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      // Don't follow redirects automatically for streams
      redirect: 'manual'
    })

    // Handle redirects manually
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (location) {
        console.log('Following redirect to:', location)
        const redirectResponse = await fetch(location, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
          }
        })
        
        if (!redirectResponse.ok) {
          console.error('Redirect failed:', redirectResponse.status, redirectResponse.statusText)
          return NextResponse.json({ 
            error: 'Stream not available', 
            status: redirectResponse.status 
          }, { status: redirectResponse.status })
        }

        // Get content type from redirect response
        const contentType = redirectResponse.headers.get('content-type') || 'application/vnd.apple.mpegurl'
        
        // Stream the response
        return new NextResponse(redirectResponse.body, {
          status: redirectResponse.status,
          headers: {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Range',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
      }
    }

    if (!response.ok) {
      console.error('Stream fetch failed:', response.status, response.statusText)
      return NextResponse.json({ 
        error: 'Stream not available', 
        status: response.status,
        statusText: response.statusText
      }, { status: response.status })
    }

    // Determine content type based on URL or response headers
    let contentType = response.headers.get('content-type')
    if (!contentType) {
      if (url.includes('.m3u8')) {
        contentType = 'application/vnd.apple.mpegurl'
      } else if (url.includes('.ts') || /\/\d+$/.test(url)) {
        contentType = 'video/mp2t'
      } else {
        contentType = 'application/octet-stream'
      }
    }

    console.log('Stream content type:', contentType)

    // Stream the response back to client
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        // Pass through range headers for seeking support
        ...(response.headers.get('accept-ranges') && {
          'Accept-Ranges': response.headers.get('accept-ranges')!
        }),
        ...(response.headers.get('content-range') && {
          'Content-Range': response.headers.get('content-range')!
        }),
        ...(response.headers.get('content-length') && {
          'Content-Length': response.headers.get('content-length')!
        })
      }
    })

  } catch (error) {
    console.error('Stream proxy error:', error)
    return NextResponse.json({ 
      error: 'Failed to proxy stream',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
    },
  })
}
