"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { fetchIPTVPlaylist, IPTV_PLAYLIST_URL } from "@/lib/iptv-parser"
import type { Channel } from "@/lib/iptv-parser"
import Hls from 'hls.js'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Search,
  Grid,
  List,
  ArrowLeft,
  Tv,
  Radio,
  Film,
  Globe,
  Zap,
} from "lucide-react"
import Link from "next/link"

// Sample channel data - in production this would come from the API
const sampleChannels: Channel[] = [
  {
    id: "1",
    name: "Big Buck Bunny",
    logo: "/placeholder.svg",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    category: "Demo",
    country: "Demo",
    language: "English"
  },
  {
    id: "2", 
    name: "Sintel",
    logo: "/placeholder.svg",
    url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    category: "Demo",
    country: "Demo",
    language: "English"
  },
  {
    id: "3",
    name: "Apple Test Stream",
    logo: "/placeholder.svg", 
    url: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    category: "Demo",
    country: "Demo",
    language: "English"
  },
  {
    id: "4",
    name: "RCTI (Demo)",
    logo: "/placeholder.svg",
    url: "https://example.com/rcti.m3u8",
    category: "Entertainment", 
    country: "Indonesia",
    language: "Indonesian"
  },
  {
    id: "5",
    name: "SCTV (Demo)",
    logo: "/placeholder.svg",
    url: "https://example.com/sctv.m3u8",
    category: "Entertainment",
    country: "Indonesia", 
    language: "Indonesian"
  },
  {
    id: "6",
    name: "Metro TV (Demo)",
    logo: "/placeholder.svg",
    url: "https://example.com/metrotv.m3u8",
    category: "News",
    country: "Indonesia", 
    language: "Indonesian"
  }
]

export default function StreamPage() {
  const [channels, setChannels] = useState<Channel[]>(sampleChannels)
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>(sampleChannels)
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(100)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [streamQuality, setStreamQuality] = useState<'good' | 'poor' | 'reconnecting'>('good')
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  // Categories from the channels
  const categories = ["All", ...Array.from(new Set(channels.map(ch => ch.category)))]

  // Load M3U playlist from API
  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('Loading IPTV playlist...')
        const parsedChannels = await fetchIPTVPlaylist()
        
        if (parsedChannels.length === 0) {
          throw new Error('No channels found in playlist')
        }
        
        console.log(`Loaded ${parsedChannels.length} channels successfully`)
        setChannels(parsedChannels)
        setFilteredChannels(parsedChannels)
      } catch (error) {
        console.error('Error loading playlist:', error)
        setError('Failed to load IPTV channels. Using demo channels.')
        
        // Fallback to sample data if API fails
        console.log('Using fallback sample channels')
        setChannels(sampleChannels)
        setFilteredChannels(sampleChannels)
      } finally {
        setIsLoading(false)
      }
    }

    loadPlaylist()
  }, [])

  // Filter channels based on search and category
  useEffect(() => {
    let filtered = channels

    if (searchTerm) {
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        channel.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(channel => channel.category === selectedCategory)
    }

    setFilteredChannels(filtered)
  }, [searchTerm, selectedCategory, channels])

  const handleChannelSelect = (channel: Channel) => {
    setCurrentChannel(channel)
    setIsPlaying(true)
    setError(null)
    setRetryCount(0) // Reset retry count for new channel
    setStreamQuality('reconnecting') // Set quality to reconnecting while loading
    
    if (videoRef.current) {
      // Clean up previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }

      // Check if this is a TS stream or HLS stream
      const isTS = channel.url.includes('.ts') || 
                   !channel.url.includes('.m3u8') || 
                   /\/\d+$/.test(channel.url) // URLs ending with numbers (like /144, /145, etc.)
      console.log('Stream type detected:', isTS ? 'TS (Transport Stream)' : 'HLS')
      console.log('Stream URL pattern:', channel.url)

      // Use proxy for all stream URLs to avoid CORS
      const proxyUrl = `/api/stream?url=${encodeURIComponent(channel.url)}`
      console.log('Using proxy URL:', proxyUrl)

      if (Hls.isSupported()) {
        // Check if MediaSource and required codecs are supported
        const mediaSource = window.MediaSource || (window as any).WebKitMediaSource
        const supportsH264 = mediaSource && MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E"')
        const supportsAAC = mediaSource && MediaSource.isTypeSupported('audio/mp4; codecs="mp4a.40.2"')
        
        console.log('Codec support check:', { supportsH264, supportsAAC })
        console.log('Stream URL:', channel.url)
        
        // Use HLS.js for browsers with settings optimized for TS streams
        const hls = new Hls({
          debug: false,
          enableWorker: false,
          lowLatencyMode: false,
          // Buffer settings optimized for TS streaming
          backBufferLength: isTS ? 15 : 10, // More buffer for TS streams
          maxBufferLength: isTS ? 30 : 20,  // Larger buffer for TS
          maxMaxBufferLength: isTS ? 40 : 30, // Maximum buffer length
          maxBufferSize: isTS ? 15 * 1000 * 1000 : 10 * 1000 * 1000, // 15MB buffer for TS
          maxBufferHole: isTS ? 1.0 : 0.5,
          // Loading and recovery settings for TS
          maxLoadingDelay: isTS ? 8 : 5,
          maxFragLookUpTolerance: isTS ? 0.5 : 0.2,
          nudgeOffset: isTS ? 0.2 : 0.1,
          nudgeMaxRetry: isTS ? 8 : 5,
          // TS streaming optimizations
          liveSyncDurationCount: isTS ? 1 : 2, // More aggressive for raw TS
          liveMaxLatencyDurationCount: isTS ? 3 : 5,
          liveDurationInfinity: true,
          liveBackBufferLength: isTS ? 15 : 10, // Keep more buffer for TS
          maxLiveSyncPlaybackRate: isTS ? 1.02 : 1.01, // Slightly more aggressive catch-up for TS
          maxStarvationDelay: isTS ? 3 : 2,
          // Auto start and position
          autoStartLoad: true,
          startPosition: -1, // Start at live edge
          // Performance settings for TS
          capLevelOnFPSDrop: false, // Don't drop levels for TS
          capLevelToPlayerSize: false,
          ignoreDevicePixelRatio: true,
          initialLiveManifestSize: isTS ? 1 : 2,
          // Fragment retry settings - very tolerant for TS
          fragLoadingMaxRetry: isTS ? 15 : 10, // Even higher retry for raw TS
          fragLoadingMaxRetryTimeout: isTS ? 8000 : 5000, // Longer timeout for TS
          manifestLoadingMaxRetry: isTS ? 15 : 10,
          manifestLoadingMaxRetryTimeout: isTS ? 8000 : 5000,
          // TS stream settings
          startLevel: -1, // Auto-select best level for TS
          testBandwidth: !isTS, // Disable bandwidth testing for raw TS streams
          // Additional error tolerance settings for TS
          fragLoadingTimeOut: isTS ? 30000 : 20000, // 30 second timeout for raw TS
          manifestLoadingTimeOut: isTS ? 15000 : 10000, // 15 second timeout for manifest
          levelLoadingTimeOut: isTS ? 15000 : 10000, // 15 second timeout for level loading
          // Retry delay configuration for TS
          fragLoadingRetryDelay: isTS ? 1500 : 1000, // Wait longer between retries for TS
          levelLoadingRetryDelay: isTS ? 3000 : 2000, // Wait longer between level retries
          manifestLoadingRetryDelay: isTS ? 3000 : 2000, // Wait longer between manifest retries
          // TS specific configurations
          enableSoftwareAES: true, // Enable software AES for encrypted TS
          abrEwmaFastLive: isTS ? 5.0 : 3.0, // Much faster adaptation for raw TS
          abrEwmaSlowLive: isTS ? 15.0 : 9.0, // Much slower adaptation for stability
        })
        
        hlsRef.current = hls
        hls.loadSource(proxyUrl) // Use proxy URL instead of direct URL
        hls.attachMedia(videoRef.current)
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed successfully')
          setStreamQuality('good') // Set to good when manifest is successfully parsed
          
          // Check available levels and select the most compatible one
          const levels = hls.levels
          console.log('Available quality levels:', levels.map(l => `${l.width}x${l.height}@${l.bitrate}`))
          
          // For TS streams, start with auto level selection
          if (levels.length > 0) {
            hls.currentLevel = -1 // Auto-select best level for TS
            console.log('Using auto level selection for TS stream')
          }
          
          videoRef.current?.play().catch(e => {
            console.error('Failed to play video:', e)
            setError('Failed to play video. Please try again.')
            setStreamQuality('poor')
          })
        })
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error detected:', {
            type: data.type,
            details: data.details,
            fatal: data.fatal,
            reason: data.reason,
            response: data.response,
            frag: data.frag ? { url: data.frag.url, level: data.frag.level } : null,
            networkDetails: data.networkDetails,
            event: event
          })
          
          if (data.fatal) {
            console.log(`Fatal HLS error: ${data.type} - ${data.details}`)
            
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Fatal network error - attempting automatic recovery')
                
                // Check specific network error types
                if (data.details === 'manifestLoadError') {
                  setError('Cannot load stream playlist. The channel may be offline.')
                } else if (data.details === 'fragLoadError') {
                  setError('Stream fragments unavailable. Reconnecting...')
                } else if (data.details === 'manifestLoadTimeOut') {
                  setError('Connection timeout. Check your internet connection.')
                } else {
                  setError('Connection issue. Reconnecting...')
                }
                
                // For fatal network errors, try a more aggressive recovery
                if (retryCount < 3) {
                  setRetryCount(prev => prev + 1)
                  
                  // Wait a bit then try to restart the stream completely
                  setTimeout(() => {
                    if (hlsRef.current && currentChannel) {
                      console.log('Attempting full stream restart due to network error')
                      
                      // Destroy current instance
                      hlsRef.current.destroy()
                      hlsRef.current = null
                      
                      // Reset error count
                      setRetryCount(0)
                      
                      // Restart the channel selection
                      handleChannelSelect(currentChannel)
                    }
                  }, 2000)
                } else {
                  setError('Network connection lost. Please check your internet connection.')
                }
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log(`Fatal media error: ${data.details}`)
                
                // Handle specific media error types
                if (data.details === 'bufferAddCodecError' || data.details === 'bufferAppendError') {
                  console.log('Codec not supported, falling back to native playback')
                  setError('Video codec not supported. Trying alternative playback...')
                  
                  // Prevent infinite retries
                  if (retryCount >= 2) {
                    setError('This video format is not supported by your browser. Please try another channel.')
                    return
                  }
                  
                  setRetryCount(prev => prev + 1)
                  
                  // Cleanup HLS and try native playback
                  if (hlsRef.current) {
                    hlsRef.current.destroy()
                    hlsRef.current = null
                  }
                  
                  // Try native playback as fallback
                  setTimeout(() => {
                    if (videoRef.current && currentChannel) {
                      console.log('Attempting native video playback for TS stream via proxy')
                      const fallbackProxyUrl = `/api/stream?url=${encodeURIComponent(currentChannel.url)}`
                      videoRef.current.src = fallbackProxyUrl
                      videoRef.current.load() // Force reload
                      videoRef.current.play().catch(e => {
                        console.error('Native playback also failed:', e)
                        setError('This stream format is not supported by your browser. Try using a different browser or VLC.')
                      })
                    }
                  }, 1000)
                } else if (data.details === 'bufferStalledError') {
                  setError('Stream buffer stalled. Attempting recovery...')
                  if (retryCount < 3) {
                    setRetryCount(prev => prev + 1)
                    setTimeout(() => {
                      if (hlsRef.current) {
                        hlsRef.current.recoverMediaError()
                      }
                    }, 1000)
                  }
                } else if (data.details === 'bufferSeekOverHole') {
                  setError('Stream seeking issue. Jumping to live position...')
                  // Try to jump to live edge
                  if (videoRef.current && videoRef.current.buffered.length > 0) {
                    const bufferEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1)
                    videoRef.current.currentTime = bufferEnd - 2
                  }
                } else {
                  // Other media errors, try recovery only if retry count is low
                  if (retryCount < 3) {
                    setError('Playback issue. Recovering...')
                    setRetryCount(prev => prev + 1)
                    setTimeout(() => {
                      if (hlsRef.current) {
                        try {
                          hlsRef.current.recoverMediaError()
                        } catch (e) {
                          console.error('Recovery failed:', e)
                          setError('Unable to recover stream. Please try another channel.')
                        }
                      }
                    }, 500)
                  } else {
                    setError('Unable to recover from playback error. Please try another channel.')
                  }
                }
                break
              default:
                console.log(`Fatal error of type: ${data.type}, details: ${data.details}`)
                
                // Handle other error types
                if (data.type === Hls.ErrorTypes.MUX_ERROR) {
                  setError('Stream format error. This stream may not be compatible.')
                } else if (data.type === Hls.ErrorTypes.KEY_SYSTEM_ERROR) {
                  setError('DRM protection detected. This stream requires special authorization.')
                } else {
                  setError(`Stream error (${data.details || 'unknown'}). Reloading...`)
                }
                
                if (retryCount < 2) {
                  setRetryCount(prev => prev + 1)
                  setTimeout(() => {
                    if (videoRef.current && currentChannel) {
                      // Destroy current instance
                      if (hlsRef.current) {
                        hlsRef.current.destroy()
                        hlsRef.current = null
                      }
                      // Try reloading the channel
                      handleChannelSelect(currentChannel)
                    }
                  }, 2000)
                } else {
                  setError('Stream is not available. Please try another channel.')
                }
                break
            }
          } else {
            // Handle non-fatal errors with better logging
            console.log(`Non-fatal HLS error: ${data.type} - ${data.details}`, {
              reason: data.reason,
              response: data.response,
              networkDetails: data.networkDetails
            })
            
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              console.log('Network error (non-fatal):', data.details)
              
              // Count consecutive fragment errors
              if (data.details === 'fragLoadError') {
                const fragErrorCount = (hlsRef.current as any)._fragErrorCount || 0
                ;(hlsRef.current as any)._fragErrorCount = fragErrorCount + 1
                
                console.log(`Fragment error count: ${fragErrorCount + 1}`)
                
                // Update stream quality based on error frequency
                if (fragErrorCount > 20) {
                  setStreamQuality('poor')
                } else if (fragErrorCount > 5) {
                  setStreamQuality('reconnecting')
                }
                
                // If too many fragment errors, show warning but keep trying
                if (fragErrorCount > 10) {
                  setError('Stream having connectivity issues - trying to reconnect...')
                  
                  // Reset count after showing error
                  setTimeout(() => {
                    if (hlsRef.current) {
                      ;(hlsRef.current as any)._fragErrorCount = 0
                      if (error && error.includes('connectivity issues')) {
                        setError(null)
                        setStreamQuality('good')
                      }
                    }
                  }, 3000)
                }
              } else if (data.response?.code === 404) {
                setError('Stream segment not found - channel may be updating...')
              } else if (data.response?.code === 403) {
                setError('Access denied - stream may require authentication')
              } else if (data.details === 'manifestLoadError') {
                setError('Cannot load stream playlist - channel may be offline')
              }
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              console.log('Media error (non-fatal):', data.details)
              
              if (data.details.includes('buffer')) {
                console.log('Buffer related error, attempting automatic recovery')
                setStreamQuality('reconnecting')
              }
            } else {
              // Reset fragment error count on successful operations
              if (hlsRef.current) {
                ;(hlsRef.current as any)._fragErrorCount = 0
              }
            }
          }
        })

        // Additional recovery mechanisms
        hls.on(Hls.Events.BUFFER_APPENDING, () => {
          // Clear error when we start getting new data
          if (error && (error.includes('Reconnecting') || error.includes('connectivity issues'))) {
            setError(null)
          }
          // Reset fragment error count on successful buffer append
          if (hlsRef.current) {
            ;(hlsRef.current as any)._fragErrorCount = 0
            setStreamQuality('good') // Set quality back to good when data flows
          }
        })

        // Handle successful fragment loads to reset error counters
        hls.on(Hls.Events.FRAG_LOADED, () => {
          // Reset fragment error count on successful load
          if (hlsRef.current) {
            ;(hlsRef.current as any)._fragErrorCount = 0
            setStreamQuality('good') // Set quality back to good on successful load
          }
          // Clear connectivity error if it exists
          if (error && error.includes('connectivity issues')) {
            setError(null)
          }
        })

        // Handle manifest reloads - common with live streams
        hls.on(Hls.Events.LEVEL_UPDATED, () => {
          console.log('Live playlist updated')
          // Clear errors when playlist updates successfully
          if (error && (error.includes('unavailable') || error.includes('connectivity issues'))) {
            setError(null)
          }
        })

        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          console.log(`Quality switched to level ${data.level}`)
        })

        // Handle media recovery
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('Video and HLS.js are now bound together')
        })

        hls.on(Hls.Events.MEDIA_DETACHED, () => {
          console.log('Video and HLS.js are now unbound')
        })

        // Auto-recovery for buffering issues with more aggressive monitoring
        let bufferCheckInterval: NodeJS.Timeout
        let stallRecoveryTimeout: NodeJS.Timeout
        
        hls.on(Hls.Events.BUFFER_APPENDED, () => {
          // Clear any existing interval
          if (bufferCheckInterval) {
            clearInterval(bufferCheckInterval)
          }
          
          // Monitor for stalls every 3 seconds (longer for TS)
          bufferCheckInterval = setInterval(() => {
            if (videoRef.current && hlsRef.current) {
              const video = videoRef.current
              const buffered = video.buffered
              
              // Check if video is paused but not ended and should be playing
              if (video.paused && !video.ended && isPlaying) {
                console.log('Video unexpectedly paused, attempting to resume')
                video.play().catch(e => {
                  console.error('Failed to resume playback:', e)
                })
              }
              
              // Check buffer health - more lenient for TS streams
              if (buffered.length > 0) {
                const bufferEnd = buffered.end(buffered.length - 1)
                const currentTime = video.currentTime
                const bufferSize = bufferEnd - currentTime
                
                // For TS streams, allow larger buffer differences
                if (bufferSize < 1 || bufferSize > 30) {
                  console.log(`TS Buffer size: ${bufferSize}s, seeking to optimal position`)
                  video.currentTime = Math.max(0, bufferEnd - 5) // Stay further from edge for TS
                }
              }
            }
          }, 3000) // Check every 3 seconds for TS streams

          // Clear stall recovery timeout since we got new data
          if (stallRecoveryTimeout) {
            clearTimeout(stallRecoveryTimeout)
          }
        })

        // Set up stall recovery
        const setupStallRecovery = () => {
          if (stallRecoveryTimeout) {
            clearTimeout(stallRecoveryTimeout)
          }
          
          stallRecoveryTimeout = setTimeout(() => {
            if (videoRef.current && hlsRef.current && videoRef.current.paused && isPlaying) {
              console.log('Video stalled for too long, forcing recovery')
              const video = videoRef.current
              if (video.buffered.length > 0) {
                const bufferEnd = video.buffered.end(video.buffered.length - 1)
                video.currentTime = bufferEnd - 0.5
                video.play().catch(e => console.error('Recovery play failed:', e))
              }
            }
          }, 5000) // 5 second timeout
        }

        // Setup stall recovery on various events
        hls.on(Hls.Events.BUFFER_APPENDED, setupStallRecovery)
        hls.on(Hls.Events.FRAG_LOADED, setupStallRecovery)

      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl') || videoRef.current.canPlayType('video/mp2t')) {
        // Native HLS support (Safari) or TS support
        console.log('Using native video support for TS/HLS stream')
        setStreamQuality('good')
        videoRef.current.src = proxyUrl // Use proxy URL for native playback too
        videoRef.current.load()
        videoRef.current.play().catch(e => {
          console.error('Failed to play video natively:', e)
          setError('Failed to play video. Please try again.')
          setStreamQuality('poor')
        })
      } else {
        // Last resort: try direct URL playback for TS
        console.log('No HLS.js support, trying direct TS playback via proxy')
        setError('Loading stream...')
        setStreamQuality('reconnecting')
        
        // For TS streams (including numeric URLs), try using proxy URL
        if (isTS) {
          console.log('Attempting direct TS stream playback via proxy')
          
          // Try proxy URL first
          videoRef.current.src = proxyUrl
          videoRef.current.load()
          videoRef.current.play().catch(e => {
            console.error('Proxy playback failed, trying blob method:', e)
            
            // Try blob method for numeric URL TS streams
            fetch(proxyUrl)
              .then(response => response.blob())
              .then(blob => {
                console.log('Creating TS blob with MIME type')
                const tsBlob = new Blob([blob], { type: 'video/mp2t' })
                const blobUrl = URL.createObjectURL(tsBlob)
                
                videoRef.current!.src = blobUrl
                videoRef.current!.load()
                return videoRef.current!.play()
              })
              .catch(e2 => {
                console.error('All playback methods failed:', e2)
                setError('This TS stream format is not supported by your browser. Try using VLC or another media player.')
                setStreamQuality('poor')
              })
          })
        } else {
          // Non-TS stream, try proxy URL
          videoRef.current.src = proxyUrl
          videoRef.current.load()
          videoRef.current.play().catch(e => {
            console.error('Proxy playback failed:', e)
            setError('This video format is not supported by your browser')
            setStreamQuality('poor')
          })
        }
      }
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [])

  // Video event handlers for continuous playback
  useEffect(() => {
    const video = videoRef.current
    if (!video || !currentChannel) return

    const handleLoadStart = () => {
      console.log('Video load started')
      setError(null)
    }

    const handleCanPlayThrough = () => {
      console.log('Video can play through')
      setError(null)
    }

    const handleWaiting = () => {
      console.log('Video is waiting for more data - buffering')
      // Don't set error immediately, give it time to buffer
    }

    const handleStalled = () => {
      console.log('Video stalled, attempting recovery')
      // For live streams, try jumping to live edge
      if (videoRef.current && hlsRef.current) {
        const video = videoRef.current
        if (video.buffered.length > 0) {
          const bufferEnd = video.buffered.end(video.buffered.length - 1)
          const currentTime = video.currentTime
          const lag = bufferEnd - currentTime
          
          // If we're more than 5 seconds behind, jump closer to live
          if (lag > 5) {
            console.log(`Jumping forward ${lag} seconds to catch up to live`)
            video.currentTime = bufferEnd - 1
          }
        }
      }
    }

    const handleError = (e: Event) => {
      console.error('Video error:', e)
      setError('Video playback error occurred')
    }

    const handleEnded = () => {
      console.log('Video ended')
      setIsPlaying(false)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleTimeUpdate = () => {
      // Auto-recovery: if video is significantly behind live edge, seek forward
      // More lenient for TS streams
      if (hlsRef.current && video.buffered.length > 0) {
        const bufferEnd = video.buffered.end(video.buffered.length - 1)
        const currentTime = video.currentTime
        const lag = bufferEnd - currentTime
        
        // If we're more than 60 seconds behind for TS streams, jump to near live edge
        if (lag > 60) {
          console.log(`TS Video is ${lag}s behind, jumping closer to live edge`)
          video.currentTime = bufferEnd - 10 // Stay further from edge for TS
        }
      }
    }

    // Add event listeners
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplaythrough', handleCanPlayThrough)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('stalled', handleStalled)
    video.addEventListener('error', handleError)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      // Clean up event listeners
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplaythrough', handleCanPlayThrough)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('stalled', handleStalled)
      video.removeEventListener('error', handleError)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [currentChannel?.id]) // Only depend on channel ID, not the whole object

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading IPTV Channels...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-400 rounded-lg flex items-center justify-center">
                  <Tv className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">KCBNet IPTV</h1>
                  <p className="text-sm text-slate-400">Live TV Streaming</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                {filteredChannels.length} Channels
              </Badge>
              {error && (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                    Warning
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  >
                    Retry
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentChannel ? currentChannel.name : "Select a Channel"}</span>
                  {currentChannel && (
                    <div className="flex items-center space-x-2">
                      {/* Stream Quality Indicator */}
                      <Badge 
                        className={
                          streamQuality === 'good' 
                            ? "bg-green-500/20 text-green-400 border-green-500/30" 
                            : streamQuality === 'poor'
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        <div className={`w-2 h-2 rounded-full mr-1 ${
                          streamQuality === 'good' 
                            ? "bg-green-400" 
                            : streamQuality === 'poor'
                            ? "bg-red-400 animate-pulse"
                            : "bg-yellow-400 animate-pulse"
                        }`}></div>
                        {streamQuality === 'good' ? 'HD' : streamQuality === 'poor' ? 'Poor' : 'Connecting'}
                      </Badge>
                      <Badge className="bg-red-500/20 text-red-400">
                        <Zap className="w-3 h-3 mr-1" />
                        LIVE
                      </Badge>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  {currentChannel ? (
                    <>
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        controls={false}
                        autoPlay
                        muted={isMuted}
                        playsInline
                        preload="none"
                        crossOrigin="anonymous"
                      >
                        <source src={`/api/stream?url=${encodeURIComponent(currentChannel.url)}`} type="application/x-mpegURL" />
                        <source src={`/api/stream?url=${encodeURIComponent(currentChannel.url)}`} type="video/mp2t" />
                        Your browser does not support the video tag.
                      </video>
                      
                      {/* Error Display */}
                      {error && (
                        <div className="absolute top-4 left-4 right-4 bg-red-500/90 backdrop-blur-sm rounded-lg p-3 z-10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
                              <div>
                                <p className="text-white text-sm font-medium">{error}</p>
                                {error.includes('connectivity issues') && (
                                  <p className="text-red-200 text-xs mt-1">
                                    This is normal for live streams. The player will automatically recover.
                                  </p>
                                )}
                              </div>
                            </div>
                            {error.includes('Network connection lost') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => currentChannel && handleChannelSelect(currentChannel)}
                                className="border-red-300 text-red-100 hover:bg-red-500/20 text-xs"
                              >
                                Retry
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Custom Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={togglePlayPause}
                              className="text-white hover:text-blue-400"
                            >
                              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={toggleMute}
                              className="text-white hover:text-blue-400"
                            >
                              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </Button>
                            
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={volume}
                              onChange={(e) => handleVolumeChange(Number(e.target.value))}
                              className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFullscreen}
                            className="text-white hover:text-blue-400"
                          >
                            <Maximize className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Tv className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">Select a channel to start watching</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {currentChannel && (
                  <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{currentChannel.name}</h3>
                        <p className="text-sm text-slate-400">
                          {currentChannel.category} • {currentChannel.country}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-green-500/30 text-green-400">
                        HD Quality
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Debug Information Panel - Only show when there are issues */}
                {(error || streamQuality !== 'good') && currentChannel && (
                  <div className="mt-4 p-3 bg-slate-800/20 rounded-lg border border-slate-700/30">
                    <div className="text-xs text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Stream URL:</span>
                        <span className="text-blue-400 truncate max-w-xs ml-2">{currentChannel.url}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stream Type:</span>
                        <span className="text-yellow-400">
                          {(() => {
                            if (currentChannel.url.includes('.ts')) return 'TS File'
                            if (currentChannel.url.includes('.m3u8')) return 'HLS/M3U8'
                            if (/\/\d+$/.test(currentChannel.url)) return 'TS Stream (Numeric)'
                            return 'Unknown'
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Player:</span>
                        <span className="text-green-400">
                          {hlsRef.current ? 'HLS.js' : 'Native'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality:</span>
                        <span className={
                          streamQuality === 'good' ? 'text-green-400' : 
                          streamQuality === 'poor' ? 'text-red-400' : 'text-yellow-400'
                        }>
                          {streamQuality}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Retry Count:</span>
                        <span className="text-orange-400">{retryCount}/3</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Channel List */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Channels</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                      className="text-slate-400 hover:text-white"
                    >
                      {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search channels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/30 border-slate-700/30 text-white"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-slate-700/30 text-slate-300 hover:text-white hover:bg-slate-800/50"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Channel List */}
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredChannels.map((channel) => (
                    <div
                      key={channel.id}
                      onClick={() => handleChannelSelect(channel)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-800/50 ${
                        currentChannel?.id === channel.id
                          ? "bg-blue-600/20 border border-blue-500/30"
                          : "bg-slate-800/20 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Tv className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">{channel.name}</h4>
                          <p className="text-xs text-slate-400 truncate">{channel.category}</p>
                        </div>
                        {currentChannel?.id === channel.id && (
                          <Badge className="bg-red-500/20 text-red-400 text-xs">
                            <Zap className="w-2 h-2 mr-1" />
                            LIVE
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredChannels.length === 0 && (
                  <div className="text-center py-8">
                    <Tv className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No channels found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
