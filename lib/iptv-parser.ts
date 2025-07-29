export interface Channel {
  id: string
  name: string
  logo: string
  url: string
  category: string
  country?: string
  language?: string
  tvgId?: string
}

export function parseM3U(m3uContent: string): Channel[] {
  const channels: Channel[] = []
  const lines = m3uContent.split('\n').map(line => line.trim()).filter(line => line)
  
  let currentChannel: Partial<Channel> = {}
  let channelIndex = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.startsWith('#EXTINF:')) {
      // Parse channel info from EXTINF line
      const extinf = line
      
      // Extract channel name (last part after comma)
      const nameMatch = extinf.match(/,(.+)$/)
      if (nameMatch) {
        currentChannel.name = nameMatch[1].trim()
      }
      
      // Extract logo
      const logoMatch = extinf.match(/tvg-logo="([^"]+)"/)
      if (logoMatch) {
        currentChannel.logo = logoMatch[1]
      } else {
        currentChannel.logo = '/placeholder.svg'
      }
      
      // Extract category/group
      const groupMatch = extinf.match(/group-title="([^"]+)"/)
      if (groupMatch) {
        currentChannel.category = groupMatch[1]
      } else {
        currentChannel.category = 'General'
      }
      
      // Extract country
      const countryMatch = extinf.match(/tvg-country="([^"]+)"/)
      if (countryMatch) {
        currentChannel.country = countryMatch[1]
      }
      
      // Extract language
      const languageMatch = extinf.match(/tvg-language="([^"]+)"/)
      if (languageMatch) {
        currentChannel.language = languageMatch[1]
      }
      
      // Extract tvg-id
      const tvgIdMatch = extinf.match(/tvg-id="([^"]+)"/)
      if (tvgIdMatch) {
        currentChannel.tvgId = tvgIdMatch[1]
      }
      
      currentChannel.id = `channel_${channelIndex++}`
      
    } else if (line.startsWith('http') && currentChannel.name) {
      // This is the stream URL
      currentChannel.url = line
      
      // Add the complete channel to the list
      channels.push({
        id: currentChannel.id || `channel_${channelIndex}`,
        name: currentChannel.name || 'Unknown Channel',
        logo: currentChannel.logo || '/placeholder.svg',
        url: currentChannel.url || '',
        category: currentChannel.category || 'General',
        country: currentChannel.country,
        language: currentChannel.language,
        tvgId: currentChannel.tvgId
      })
      
      // Reset for next channel
      currentChannel = {}
    }
  }
  
  return channels
}

export async function fetchIPTVPlaylist(url?: string): Promise<Channel[]> {
  try {
    // Use local API proxy to avoid CORS issues
    const apiUrl = url || '/api/iptv'
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const m3uContent = await response.text()
    return parseM3U(m3uContent)
  } catch (error) {
    console.error('Error fetching IPTV playlist:', error)
    throw error
  }
}

export const IPTV_PLAYLIST_URL = '/api/iptv' // Use local proxy
