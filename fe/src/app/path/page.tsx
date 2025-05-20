"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, FileText, Clock, Calendar } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function LearningPathForm() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null)
  const [strengths, setStrengths] = useState("")
  const [weaknesses, setWeaknesses] = useState("")
  const [availableDays, setAvailableDays] = useState("")
  const [hoursPerDay, setHoursPerDay] = useState(1)
  const [totalDays, setTotalDays] = useState(1)
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)

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
      // Create form data with all the form values
      const formData = new FormData()
      formData.append("filename", uploadedFilename)
      formData.append("strengths", strengths)
      formData.append("weaknesses", weaknesses)
      formData.append("available_days", availableDays)
      formData.append("hours_per_day", hoursPerDay.toString())
      formData.append("total_days", totalDays.toString())

      // Send request to the specified endpoint
      const res = await fetch("http://localhost:8080/path/generate_learning_path", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Failed to generate learning path")
      }

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      console.error("API request failed:", error)
      setResponse({ error: "Failed to generate learning path. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Personalized Learning Path Generator</CardTitle>
          <CardDescription>
            Upload your PDF and provide some information to get a customized learning path
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
                      className="cursor-pointer"
                      disabled={uploadLoading}
                    />
                    {uploadLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
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
                <p className="text-sm text-green-600">✓ File uploaded successfully: {uploadedFilename}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="strengths" className="font-medium">
                Your Strengths
              </Label>
              <Textarea
                id="strengths"
                placeholder="List your strengths (comma separated or description)"
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weaknesses" className="font-medium">
                Areas to Improve
              </Label>
              <Textarea
                id="weaknesses"
                placeholder="List areas you want to improve (comma separated or description)"
                value={weaknesses}
                onChange={(e) => setWeaknesses(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="available-days" className="font-medium">
                Available Days
              </Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="available-days"
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
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      id="hours-per-day"
                      min={1}
                      max={12}
                      step={1}
                      value={[hoursPerDay]}
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
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      id="total-days"
                      min={1}
                      max={90}
                      step={1}
                      value={[totalDays]}
                      onValueChange={(value) => setTotalDays(value[0])}
                    />
                    <span className="w-8 text-center">{totalDays}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading || !uploadedFilename} onClick={handleSubmit}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Learning Path...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Generate Learning Path
              </>
            )}
          </Button>

          {response && (
            <div className="w-full mt-6 p-4 bg-slate-50 rounded-md">
              <h3 className="font-medium mb-2">Generated Learning Path:</h3>
              <pre className="text-sm overflow-auto p-2 bg-slate-100 rounded max-h-[300px]">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
