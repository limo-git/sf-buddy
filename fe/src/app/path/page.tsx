"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, FileText, Clock, Calendar } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import ReactMarkdown from "react-markdown"
import { useRouter } from "next/navigation" 


export default function LearningPathForm() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null)
  const [availableDays, setAvailableDays] = useState("")
  const [hoursPerDay, setHoursPerDay] = useState(1)
  const [totalDays, setTotalDays] = useState(1)
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const router = useRouter()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files ? e.target.files[0] : null
    if (!selectedFile) return

    setFile(selectedFile)
    setUploadLoading(true)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const res = await fetch("http://localhost:8080/upload/", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Upload failed")
      }

      const data = await res.json()
      setUploadedFilename(data.filename)
    } catch (error) {
      console.error("File upload failed:", error)
      alert("File upload failed. Please try again.")
    } finally {
      setUploadLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!uploadedFilename) {
      alert("Please upload a PDF file first.")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("filename", uploadedFilename)
      formData.append("available_days", availableDays)
      formData.append("hours_per_day", hoursPerDay.toString())
      formData.append("total_days", totalDays.toString())

      const res = await fetch("http://localhost:8080/path/generate_learning_path", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Failed to generate learning path")
      }

      const data = await res.json()
      setResponse(data.learning_path)
      await fetch("/api/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    subject: "Your Personalized Learning Path",
    text: `Available Days: ${availableDays}\n\nLearning Path:\n${data.learning_path}`,
    html: `<p><strong>Available Days:</strong> ${availableDays}</p><pre>${data.learning_path}</pre>`,
  }),
});


    } catch (error) {
      console.error("API request failed:", error)
      setResponse({ error: "Failed to generate learning path. Please try again." })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="container mx-auto py-10 px-4 ">
      <Card className="max-w-4xl mx-auto bg-[#2a2a2e] text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-white font-bold">Personalized Learning Path</CardTitle>
          <CardDescription className="text-[#d3d3d3]">
            Upload your PDF and set your schedule to get a customized learning path
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="font-medium">
                Upload PDF
              </Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      id="file-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={handleUpload}
                      className="cursor-pointer text-[#d3d3d3]"
                      disabled={uploadLoading}
                    />
                    {uploadLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                </div>
                {file && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{file.name}</span>
                  </div>
                )}
              </div>
              {uploadedFilename && (
                <p className="text-sm text-green-600">✓ File uploaded successfully</p>
              )}
            </div>

            <div className="space-y-2 text-white">
              <Label htmlFor="available-days" className="font-medium">
                Available Days
              </Label>
              <div className="flex items-center gap-2 ">
                <Calendar className="h-4 w-4 text-white" />
                <Input
                  id="available-days"
                  className="text-white"
                  placeholder="e.g. Mon,Wed,Fri"
                  value={availableDays}
                  onChange={(e) => setAvailableDays(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hours-per-day" className="font-medium">
                    Hours per Day: {hoursPerDay}
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Clock className="h-4 w-4 text-white" />
                    <Slider
                      id="hours-per-day"
                      min={1}
                      max={12}
                      step={1}
                      value={[hoursPerDay]}
                      className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_[role=slider]]:shadow [&_[role=slider]]:shadow-white [&_[role=slider]]:hover:bg-white [&_[role=slider]]:focus:ring-white [&_[role=slider]]:focus-visible:ring-white"
                      onValueChange={(value) => setHoursPerDay(value[0])}
                    />
                    <span className="w-8 text-center">{hoursPerDay}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="total-days" className="font-medium">
                    Total Days: {totalDays}
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Calendar className="h-4 w-4 text-white" />
                    <Slider
                      id="total-days"
                      min={1}
                      max={90}
                      step={1}
                      value={[totalDays]}
                      className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_[role=slider]]:shadow [&_[role=slider]]:shadow-white [&_[role=slider]]:hover:bg-white [&_[role=slider]]:focus:ring-white [&_[role=slider]]:focus-visible:ring-white"
                      onValueChange={(value) => setTotalDays(value[0])}
                    />
                    <span className="w-8 text-center">{totalDays}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-white">
          <Button type="submit" className="w-full" disabled={loading || !uploadedFilename} onClick={handleSubmit}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <div className="text-whtie">Generating Learning Path...</div>
                
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                <div className="text-white">Generate Learning Path</div>
              </>
            )}
          </Button>

{response && (

      <>
            <Card className="w-full mt-6">
              <CardHeader>
                <CardTitle>Your Personalized Learning Path</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <div className="space-y-2 text-sm leading-relaxed">
                  <ReactMarkdown   components={{
                      p: ({ node, ...props }) => (
                        <p className="mb-3 text-sm text-black leading-relaxed" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-blue-400" {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em className="italic text-black" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc ml-6 space-y-1 text-sm text-black" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal ml-6 space-y-1 text-sm text-black" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="text-sm leading-snug text-black" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-blue-400 underline hover:text-blue-300" target="_blank" rel="noopener noreferrer" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-black" {...props} />
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
                        <h3 className="text-base font-semibold text-black my-2" {...props} />
                      ),
                    }}>{response}</ReactMarkdown>
                </div>
              </CardContent>
              
            </Card>
            <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => router.push("/chatbot")}
              >
                Let’s Begin
              </Button>
            </>
          )}
          
        </CardFooter>
      </Card>
    </div>
  )
}