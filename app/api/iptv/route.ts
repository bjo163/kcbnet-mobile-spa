import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Try multiple possible URLs
    const urls = [
      'https://iptv.lancartech.co.id:443/playlist/mohrezza/mohrezza@Reg1-3/m3u_plus',
      'https://iptv.lancartech.co.id/playlist/mohrezza/mohrezza@Reg1-3/m3u_plus?output=hls',
      'https://cdn.lancartech.co.id/auth/124.m3u8',
      'https://iptv.lancartech.co.id/auth/124.m3u8'
    ]
    
    let lastError: Error | null = null
    
    for (const url of urls) {
      try {
        console.log(`Trying to fetch IPTV playlist from: ${url}`)
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Referer': 'https://lancartech.co.id',
          },
          // Add timeout
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const m3uContent = await response.text()
        
        // Basic validation - check if it looks like an M3U file
        if (!m3uContent.includes('#EXTM3U') && !m3uContent.includes('#EXTINF')) {
          throw new Error('Invalid M3U content received')
        }
        
        console.log(`Successfully fetched M3U playlist from: ${url}`)
        
        // Set CORS headers
        return new NextResponse(m3uContent, {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.apple.mpegURL',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
          },
        })
      } catch (error) {
        console.error(`Failed to fetch from ${url}:`, error)
        lastError = error as Error
        continue // Try next URL
      }
    }
    
    // If all URLs failed, return fallback M3U content
    console.log('All IPTV URLs failed, returning fallback content')
    
    const fallbackM3U = `#EXTM3U
#EXTINF:-1 tvg-id="bigbuckbunny" tvg-name="Big Buck Bunny" tvg-logo="/placeholder.svg" group-title="Demo",Big Buck Bunny
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXTINF:-1 tvg-id="sintel" tvg-name="Sintel" tvg-logo="/placeholder.svg" group-title="Demo",Sintel
https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8
#EXTINF:-1 tvg-id="apple-test" tvg-name="Apple Test Stream" tvg-logo="/placeholder.svg" group-title="Demo",Apple Test Stream
https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8
#EXTINF:-1 tvg-id="bbc-news" tvg-name="BBC News" tvg-logo="/placeholder.svg" group-title="News",BBC News (Demo)
https://d2vnbkvjbims7j.cloudfront.net/containerA/LTN/playlist.m3u8
#EXTINF:-1 tvg-id="cnn-live" tvg-name="CNN Live" tvg-logo="/placeholder.svg" group-title="News",CNN Live (Demo) 
https://cnn-cnninternational-1-gb.samsung.wurl.com/manifest/playlist.m3u8
#EXTINF:-1 tvg-id="al-jazeera" tvg-name="Al Jazeera English" tvg-logo="/placeholder.svg" group-title="News",Al Jazeera English
https://live-hls-web-aje.getaj.net/AJE/01.m3u8`

    return new NextResponse(fallbackM3U, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.mpegURL',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=60', // Cache fallback for 1 minute
      },
    })
    
  } catch (error) {
    console.error('Error in IPTV API route:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch IPTV playlist', details: (error as Error).message },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
