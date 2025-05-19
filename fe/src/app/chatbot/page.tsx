"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { Bot, Send, FilePlus, Trash } from "lucide-react"
import ReactMarkdown from "react-markdown"


interface Message {
  role: "user" | "assistant"
  content: string
}

export default function Chatbot(): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [docs, setDocs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const params = useSearchParams()
  const currentDoc = params.get("doc")

  const getStorageKey = () =>
    currentDoc ? `chat_history_${currentDoc}` : `chat_history_default`

  useEffect(() => {
    const stored = localStorage.getItem(getStorageKey())
    if (stored) {
      setMessages(JSON.parse(stored))
    } else {
      setMessages([])
    }
  }, [currentDoc])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(getStorageKey(), JSON.stringify(messages))
    }
  }, [messages, currentDoc])

  useEffect(() => {
    const storedDocs = localStorage.getItem("docChats")
    if (storedDocs) {
      setDocs(JSON.parse(storedDocs))
    } else {
      axios.get("http://localhost:8000/docs/").then(res => {
        setDocs(res.data.documents)
        localStorage.setItem("docChats", JSON.stringify(res.data.documents))
      })
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      if (currentDoc) {
        const res = await axios.post("http://localhost:8000/ask/", {
          question: input,
          doc_name: currentDoc,
        })
        setMessages(prev => [...prev, { role: "assistant", content: res.data.answer }])
      } else {
        const res = await axios.post("http://localhost:8000/chatbot/", {
          query: input,
        })
        setMessages(prev => [...prev, { role: "assistant", content: res.data.response }])
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Failed to get response." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    const res = await axios.post("http://localhost:8000/upload/", formData)
    const newDoc = res.data.filename

    const updated = [...docs, newDoc]
    setDocs(updated)
    localStorage.setItem("docChats", JSON.stringify(updated))
    router.push(`/chatbot?doc=${encodeURIComponent(newDoc)}`)
  }

  const handleClearChat = () => {
    localStorage.removeItem(getStorageKey())
    setMessages([])
  }

  const LoadingDots = () => (
  <div className="flex justify-center items-center space-x-2 mt-2">
    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
  </div>
)


  return (
    <div className="flex h-screen bg-[#1e1e20] text-white">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r border-gray-700 bg-[#2b2b2e] flex flex-col gap-6">
        <div>
          <button
            onClick={() => router.push("/chatbot")}
            className={`text-white hover:text-blue-400 text-lg font-semibold mb-4 block ${!currentDoc && "text-blue-400"}`}
          >
            🌐 General Chat
          </button>
          <div className="text-sm text-gray-400 mb-2 font-bold">📁 Your Documents</div>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {docs.map(doc => (
              <button
                key={doc}
                className={`text-left text-sm hover:text-blue-300 truncate ${currentDoc === doc && "text-blue-400"}`}
                onClick={() => router.push(`/chatbot?doc=${encodeURIComponent(doc)}`)}
              >
                {doc.split("_").slice(1).join("_")}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-3">
          <label className="cursor-pointer flex items-center gap-2 text-sm hover:text-green-400">
            <FilePlus className="w-4 h-4" />
            Upload New Document
            <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
          </label>
          <button
            onClick={handleClearChat}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400"
          >
            <Trash className="w-4 h-4" />
            Clear Current Chat
          </button>
        </div>
      </aside>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-700 px-6 py-4 bg-[#2a2a2e] text-lg font-bold flex items-center gap-2">
          <Bot className="w-5 h-5" />
          {currentDoc ? `Chat - ${currentDoc.split("_").slice(1).join("_")}` : "AI Assistant"}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 flex flex-col items-center">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`w-full max-w-2xl flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-md text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                <div className="prose prose-invert text-white max-w-none text-sm leading-relaxed">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="mb-3 text-sm text-gray-100 leading-relaxed" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-blue-400" {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em className="italic text-gray-300" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc ml-6 space-y-1 text-sm text-gray-200" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal ml-6 space-y-1 text-sm text-gray-200" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="text-sm leading-snug text-gray-300" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-blue-400 underline hover:text-blue-300" target="_blank" rel="noopener noreferrer" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400" {...props} />
                      ),
                      code: ({ node, ...props }) => (
                        <code className="bg-gray-800 text-green-300 px-1 py-0.5 rounded text-xs" {...props} />
                      ),
                      pre: ({ node, ...props }) => (
                        <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto text-sm my-4" {...props} />
                      ),
                      hr: () => (
                        <hr className="my-4 border-gray-700" />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1 className="text-xl font-bold text-white my-4" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-lg font-semibold text-white my-3" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-base font-semibold text-gray-300 my-2" {...props} />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {isLoading && (
            <div className="w-full max-w-2xl flex justify-start">
              <div className="bg-gray-700 rounded-md px-4 py-2 text-sm text-white">
                <LoadingDots />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 bg-[#2a2a2e] p-4">
          <div className="flex items-center gap-2 max-w-3xl mx-auto w-full">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-md bg-[#3a3a40] border border-gray-600 text-white placeholder-gray-400 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md text-white flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
