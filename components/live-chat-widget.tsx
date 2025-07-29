"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X, Send, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo! Selamat datang di KCBNet.id 👋\nAda yang bisa kami bantu?",
      sender: "agent",
      time: "Just now",
    },
  ])

  // Simulate online status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1) // 90% online
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      time: "Just now",
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Auto reply
    setTimeout(() => {
      const autoReply = {
        id: messages.length + 2,
        text: "Terima kasih atas pesan Anda! Tim kami akan segera merespons. Untuk respon lebih cepat, silakan hubungi WhatsApp kami di +62 859-2502-1988 📱",
        sender: "agent",
        time: "Just now",
      }
      setMessages((prev) => [...prev, autoReply])
    }, 1500)
  }

  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/6285925021988?text=Halo%20KCBNet,%20saya%20tertarik%20dengan%20layanan%20internet%20fiber",
      "_blank",
    )
  }

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
            isOpen
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500"
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}

          {/* Online Indicator */}
          {!isOpen && isOnline && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
            </div>
          )}
        </Button>

        {/* Floating Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-20 right-0 bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl whitespace-nowrap animate-bounce max-w-[200px] sm:max-w-none">
            <div className="text-sm font-semibold">💬 Butuh bantuan?</div>
            <div className="text-xs text-slate-300">Chat dengan kami!</div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 animate-slide-up ${
            // Full screen on mobile, positioned on desktop
            "inset-0 sm:bottom-24 sm:right-6 sm:top-auto sm:left-auto sm:w-96 sm:h-96 sm:inset-auto"
          }`}
        >
          <Card className="h-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl sm:rounded-lg rounded-none">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-sky-400 text-white p-4 sm:rounded-t-lg rounded-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">KCBNet Support</CardTitle>
                    <p className="text-sm text-blue-100">{isOnline ? "🟢 Online" : "🔴 Offline"}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col h-full p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        msg.sender === "user" ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-100"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="p-3 border-t border-slate-700/50">
                <div className="flex space-x-2 mb-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleWhatsApp}
                    className="flex-1 text-xs border-green-500/50 text-green-400 hover:bg-green-500/10 bg-transparent"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    WhatsApp
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => (window.location.href = "tel:+6285925021988")}
                    className="flex-1 text-xs border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                </div>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ketik pesan..."
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-400"
                  />
                  <Button size="sm" onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
