"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"

export default function AssessmentPage() {
  const [mcqs, setMcqs] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({})
  const [timer, setTimer] = useState(60)
  const [showResults, setShowResults] = useState(false)
  const [timePerQuestion, setTimePerQuestion] = useState<number[]>([])
  const [startTime, setStartTime] = useState(Date.now())
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [feedback, setFeedback] = useState("")
  const threshold = 60


  useEffect(() => {
    const stored = sessionStorage.getItem("mcqs")
    if (stored) setMcqs(JSON.parse(stored))
  }, [])

  useEffect(() => {
    if (showResults) return
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          handleNext()
          return threshold
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [current, showResults])

  const handleAnswer = (val: string) => {
    setUserAnswers(prev => ({ ...prev, [current]: val }))
  }

  const handleNext = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    setTimePerQuestion(prev => [...prev, elapsed])
    setStartTime(Date.now())

    if (current < mcqs.length - 1) {
        setCurrent(current + 1)
        setTimer(threshold)
    } else {
        setShowResults(true)
    }
  }


  const currentQuestion = mcqs[current]

  const analyzePerformance = async () => {
    setIsAnalyzing(true)
    setFeedback("")

    const payload = mcqs.map((q, i) => ({
        question: q.question,
        correct_answer: q.answer,
        user_answer: userAnswers[i] || "Not answered",
        time_taken: timePerQuestion[i] || threshold
    }))

    try {
        const res = await axios.post("http://localhost:8080/assessment/analyze_performance", {
          questions: payload
        })
        setFeedback(res.data.analysis)
    } catch (err) {
        setFeedback("❌ Failed to get performance analysis.")
    } finally {
        setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (showResults && mcqs.length > 0 && Object.keys(userAnswers).length > 0 && feedback === "") {
        analyzePerformance()
    }
  }, [showResults])



  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-100 p-6 flex flex-col items-center font-sans">
      <h1 className="text-3xl font-bold text-orange-700 mb-8">📝 Knowledge Assessment</h1>

      {!showResults && currentQuestion && (
        <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg border border-orange-200 transition-all duration-300">
          <div className="flex justify-between items-center mb-3 text-sm text-orange-500 font-medium">
            <span>Question {current + 1} of {mcqs.length}</span>
            <span className="text-orange-600 font-bold">⏱ {timer}s</span>
          </div>

          <p className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</p>

          <div className="space-y-3">
            {currentQuestion.options.map((opt: string, idx: number) => (
              <label key={idx} className="block bg-yellow-50 hover:bg-yellow-100 p-3 rounded-md cursor-pointer border border-yellow-200">
                <input
                  type="radio"
                  name={`q${current}`}
                  value={opt}
                  checked={userAnswers[current] === opt}
                  onChange={() => handleAnswer(opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleNext}
              className="bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 rounded-md text-sm shadow"
            >
              {current === mcqs.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      )}

      {showResults && (
        <div className="w-full max-w-5xl space-y-8">
            {/* Summary Card */}
            <div className="bg-white p-6 rounded-xl shadow border border-orange-200">
            <h2 className="text-xl font-bold text-orange-600 mb-3">🎯 Score Summary</h2>
            <p className="text-gray-700">
                Total Score:{" "}
                <span className="text-green-600 font-semibold">
                {Object.keys(userAnswers).filter(i => mcqs[i]?.answer === userAnswers[+i]).length} / {mcqs.length}
                </span>
            </p>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
            <h3 className="text-md font-semibold text-gray-800 mb-4">⏱️ Time Spent Per Question (seconds)</h3>
            <div className="flex gap-2 overflow-x-auto">
                {timePerQuestion.map((time, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div
                    className="w-8 bg-orange-400 rounded-t"
                    style={{ height: `${Math.min(time * 3, 120)}px` }}
                    title={`${time}s`}
                    ></div>
                    <span className="text-xs mt-1 text-gray-600">Q{i + 1}</span>
                </div>
                ))}
            </div>
            </div>

            {isAnalyzing && (
                <div className="mt-4 text-yellow-600 text-sm animate-pulse">
                    ⏳ Analyzing your performance using AI...
                </div>
                )}

                {feedback && (
                <div className="mt-6 bg-white p-6 rounded-xl shadow border border-yellow-200 whitespace-pre-wrap text-gray-800">
                    <h3 className="text-lg font-bold text-orange-700 mb-3">🧠 Personalized Feedback</h3>
                    <ReactMarkdown
                        components={{
                            p: ({ node, ...props }) => (
                            <p className="mb-3 text-sm text-gray-800 leading-relaxed" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                            <strong className="font-semibold text-orange-700" {...props} />
                            ),
                            em: ({ node, ...props }) => (
                            <em className="italic text-gray-600" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                            <ul className="list-disc ml-6 space-y-1 text-sm text-gray-800" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                            <ol className="list-decimal ml-6 space-y-1 text-sm text-gray-800" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                            <li className="text-sm leading-snug text-gray-700" {...props} />
                            ),
                            a: ({ node, ...props }) => (
                            <a
                                className="text-blue-600 underline hover:text-blue-800"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                            />
                            ),
                            blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-orange-400 pl-4 italic text-gray-600 bg-yellow-50 py-2 px-3 rounded" {...props} />
                            ),
                            code: ({ node, ...props }) => (
                            <code className="bg-yellow-100 text-orange-700 px-1 py-0.5 rounded text-xs font-mono" {...props} />
                            ),
                            pre: ({ node, ...props }) => (
                            <pre className="bg-yellow-100 text-gray-800 p-4 rounded-md overflow-x-auto text-sm my-4 border border-orange-200" {...props} />
                            ),
                            hr: () => (
                            <hr className="my-4 border-orange-300" />
                            ),
                            h1: ({ node, ...props }) => (
                            <h1 className="text-2xl font-bold text-orange-700 my-4" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                            <h2 className="text-xl font-semibold text-orange-600 my-3" {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                            <h3 className="text-lg font-semibold text-orange-500 my-2" {...props} />
                            ),
                        }}
                    >
                            {feedback}
                    </ReactMarkdown>

                </div>
            )}

            {/* Individual Question Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mcqs.map((q, i) => (
                <div key={i} className="bg-white p-5 rounded-xl shadow border border-yellow-100">
                <p className="font-semibold text-gray-800 mb-2">
                    {i + 1}. {q.question}
                </p>
                <p className="text-sm">
                    Your Answer:{" "}
                    <span className={userAnswers[i] === q.answer ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                    {userAnswers[i] || "Not answered"}
                    </span>
                </p>
                <p className="text-sm text-gray-600">
                    Correct Answer: <span className="text-green-700 font-medium">{q.answer}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">🕒 Time: {timePerQuestion[i]}s</p>
                </div>
            ))}
            </div>
        </div>
        )}
    </div>
  )
}
