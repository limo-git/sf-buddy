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

const languages = [
  { code: "hindi", name: "hindi" },
  { code: "bengali", name: "bengali" },
  { code: "telugu", name: "telugu" },
  { code: "marathi", name: "marathi" },
  { code: "tamil", name: "tamil" },
  { code: "urdu", name: "urdu" },
  { code: "gujarati", name: "gujarati" },
  { code: "kannada", name: "kannada" },
  { code: "odia", name: "odia" },
  { code: "malayalam", name: "malayalam" },
  { code: "punjabi", name: "punjabi" },
  { code: "assamese", name: "assamese" },
  { code: "maithili", name: "maithili" },
  { code: "bhojpuri", name: "bhojpuri" },
  { code: "sindhi", name: "sindhi" },
  { code: "khmer", name: "khmer" },
  { code: "konkani", name: "konkani" },
  { code: "nepali", name: "nepali" },
  { code: "sanskrit", name: "sanskrit" },
  { code: "sanskrit", name: "sanskrit" },
  { code: "dogri", name: "dogri" },
  { code: "lushai", name: "lushai" }
]


export default function Chatbot(): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [docs, setDocs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const params = useSearchParams()
  const currentDoc = params.get("doc")
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [visitedSteps, setVisitedSteps] = useState<number[]>([])
  const [isChunkLoading, setIsChunkLoading] = useState(false)
  const [showChunkBar, setShowChunkBar] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState("en")



  useEffect(() => {
  if (!currentDoc) return

    axios
      .get(`http://localhost:8080/doc/count/steps_count?doc_name=${currentDoc}`)
      .then(res => {
        setTotalSteps(res.data.total_steps)
      })
  }, [currentDoc])


  const startAssessment = async () => {
    const res = await axios.get(`http://localhost:8080/assessment/generate_question?doc_name=${currentDoc}`)
    sessionStorage.setItem("mcqs", JSON.stringify(res.data.questions))
    router.push("/assessment")
  }


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
      axios.get("http://localhost:8080/doc/").then(res => {
        setDocs(res.data.documents)
        localStorage.setItem("docChats", JSON.stringify(res.data.documents))
      })
    }
  }, [])

  useEffect(() => {
    if (isLoading || isChunkLoading || messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading, isChunkLoading])


  const sendMessage = async () => {
  if (!input.trim()) return

  const userMessage: Message = { role: "user", content: input }
  setMessages(prev => [...prev, userMessage])
  setInput("")
  setIsLoading(true)

  try {
    if (currentDoc) {
      const res = await axios.post("http://localhost:8080/ask/", {
        question: input,
        doc_name: currentDoc,
        language: selectedLanguage,  // <-- Add this line to send the selected language
      })
      setMessages(prev => [...prev, { role: "assistant", content: res.data.answer }])
    } else {
      const res = await axios.post("http://localhost:8080/chatbot/", {
        message: input,
        language: selectedLanguage,  // <-- Also here if needed
      })
      setMessages(prev => [...prev, { role: "assistant", content: res.data.response }])
    }
  } catch {
    setMessages(prev => [...prev, { role: "assistant", content: "Failed to get response :(" }])
  } finally {
    setIsLoading(false)
  }
}


  const fetchChunk = async (step: number) => {
    if (!currentDoc || isChunkLoading) return
    setIsChunkLoading(true)
    try {
      const res = await axios.get(
        `http://localhost:8080/learn/?doc_name=${currentDoc}&step=${step}&language=${selectedLanguage}`
      )
      const summary = res.data.summary
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `🧾 Summary of chunk ${step + 1}:\n\n${summary}` },
      ])
      setCurrentStep(step)
      setVisitedSteps(prev => (prev.includes(step) ? prev : [...prev, step]))
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `⚠️ Failed to load chunk ${step + 1}` },
      ])
    } finally {
      setIsChunkLoading(false)
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

    const res = await axios.post("http://localhost:8080/upload/", formData)
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
        {/* General Chat */}
        <div>
          <button
            onClick={() => router.push("/chatbot")}
            className={`w-full text-left px-3 py-2 mb-4 rounded-md text-white hover:bg-gray-800 hover:text-blue-400 text-sm font-medium ${
              !currentDoc ? "bg-gray-800 text-blue-400 font-semibold" : ""
            }`}
          >
            🌐 General Chat
          </button>

          <div className="text-xs text-gray-400 mb-2 font-semibold">📁 Your Documents</div>

          {/* Document List */}
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-300px)] pr-1">
            {docs.map(doc => {
              const isActive = currentDoc === doc
              const displayName = doc.split("_").slice(1).join("_")

              return (
                
                <div
                  key={doc}
                  className={`group flex items-center justify-between px-3 py-2 rounded-md transition-all ${
                    isActive
                      ? "bg-gray-800 text-gray-300 font-semibold"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  

                  <button
                    className="truncate text-sm flex-1 text-left"
                    onClick={() => router.push(`/chatbot?doc=${encodeURIComponent(doc)}`)}
                    title={displayName}
                  >
                    {displayName}
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem(`chat_history_${doc}`)
                      if (currentDoc === doc) setMessages([])
                    }}
                    className="invisible group-hover:visible text-gray-500 hover:text-red-500 transition"
                    title="Clear chat"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upload */}
        <div className="mt-auto flex flex-col gap-3">
          <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-300 hover:text-green-400">
            <FilePlus className="w-4 h-4" />
            Upload New Document
            <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </aside>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-700 px-6 py-4 bg-[#2a2a2e] text-lg font-bold flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <Bot className="w-5 h-5" />
            {currentDoc
              ? `AI Assistant - ${currentDoc.split("_").slice(1).join("_")}`
              : "AI Assistant"}
          </div>
          {currentDoc && (
            <button
              onClick={startAssessment}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-sm"
            >
              📝 Start Assessment
            </button>
          )}
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
          {(isLoading || isChunkLoading) && (
            <div className="w-full max-w-2xl flex justify-start">
              <div className="bg-gray-700 rounded-md px-4 py-2 text-sm text-white">
                <LoadingDots />
              </div>
            </div>
          )}
        </div>
        
        {showChunkBar && currentDoc && (
          <div className="bg-[#2a2a2e] border-t border-b border-gray-700 text-sm px-6 py-2">
            <div className="w-full overflow-x-auto">
              <div className="flex space-x-2 w-max">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchChunk(i)}
                    disabled={isChunkLoading || isLoading}
                    className={`px-3 py-1 rounded-md border text-xs truncate max-w-[160px] ${
                      currentStep === i
                        ? "bg-blue-600 text-white"
                        : visitedSteps.includes(i)
                        ? "bg-gray-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setShowChunkBar(false)}
                className="text-xs text-gray-400 hover:text-blue-400"
              >
                Hide
              </button>
            </div>
          </div>
        )}

        {!showChunkBar && currentDoc && (
          <div className="px-6 py-2 text-sm text-gray-400">
            <button onClick={() => setShowChunkBar(true)} className="hover:text-blue-400 underline">Show Chunk Navigator</button>
          </div>
        )}


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
              disabled={isChunkLoading || isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md text-white flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
            <div className="mb-2 px-6 py-2 bg-[#2a2a2e] border-b border-gray-700 text-white flex items-center gap-2 max-w-3xl mx-auto">
  <label htmlFor="language-select" className="text-sm font-medium">Translate to:</label>
  <select
    id="language-select"
    className="bg-[#3a3a40] border border-gray-600 text-white rounded-md px-2 py-1"
    value={selectedLanguage}
    onChange={e => setSelectedLanguage(e.target.value)}
  >
    <option value="en">English (default)</option>
    {languages.map(lang => (
      <option key={lang.code} value={lang.code}>{lang.name}</option>
    ))}
  </select>
</div>
          </div>
        </div>
      </div>
    </div>
  )
}
