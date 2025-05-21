import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, Clock, Heart } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-gray-950">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 to-transparent opacity-70"></div>

      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Your Personal AI Learning Assistant
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Personalized learning paths, interactive quizzes, and support in 22 Indian languages to help you master any
            subject at your own pace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-950">
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-white">
            <div className="flex flex-col items-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <FileText className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm text-gray-300">Personalized Learning</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <MessageSquare className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm text-gray-300">22 Indian Languages</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <Clock className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm text-gray-300">Interactive Quizzes</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <Heart className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm text-gray-300">Mental Health Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
