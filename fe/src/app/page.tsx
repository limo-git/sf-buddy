import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Brain, FileText, MessageSquare, Heart } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"
import { LanguageSelector } from "@/components/language-selector"
import { MentalHealthCard } from "@/components/mental-health-card"

export default function Home() {
  return (
    <div className="flex items-center p-4 bg-[#030712] justify-center w-full h-full">
    <div className="min-h-screen bg-gray-950 p-4 text-gray-100">
      <header className="border-b border-gray-800 py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold">EduSmart AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#languages" className="text-gray-300 hover:text-white transition-colors">
              Languages
            </Link>
            <Link href="#mental-health" className="text-gray-300 hover:text-white transition-colors">
              Mental Health
            </Link>
            <Link href="/path" className="text-gray-300 hover:text-white transition-colors">
              Get Started
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-950">
              Sign In
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Sign Up</Button>
          </div>
        </div>
      </header>

      <HeroSection />

      <section id="features" className="py-20 bg-[#030712]">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-orange-500" />}
              title="Personalized Learning Path"
              description="Upload your study materials and get a customized learning schedule tailored to your needs and availability."
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-orange-500" />}
              title="Tutor Mode"
              description="Get step-by-step guidance and explanations for complex topics in a conversational interface."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-orange-500" />}
              title="Interactive Quizzes"
              description="Test your knowledge with time-bound quizzes that adapt to your learning progress."
            />
            <FeatureCard
              icon={<Heart className="h-10 w-10 text-orange-500" />}
              title="Mental Health Support"
              description="Receive timely nudges and support for managing stress and anxiety during your learning journey."
            />
          </div>
        </div>
      </section>

      <section id="demo" className="py-20 bg-gray-950">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Experience EduSmart AI</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-orange-500" />
                  <CardTitle className="text-white">Personalized Learning Path</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Upload your PDF and set your schedule to get a customized learning path
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-800">
                    <h3 className=" text-white font-medium mb-2">Quadratic Equations Learning Schedule</h3>
                    <div className="space-y-3 text-sm text-white">
                      <div className="text-white">
                        <p className="text-orange-400">Day 1 (Monday - 2 hours)</p>
                        <ul className="list-disc list-inside pl-4 text-gray-300">
                          <li>Introduction to Quadratic Equations</li>
                          <li>Understanding the standard form: ax² + bx + c = 0</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-orange-400">Day 2 (Tuesday - 2 hours)</p>
                        <ul className="list-disc list-inside pl-4 text-gray-300">
                          <li>Solving Quadratic Equations by Factorization</li>
                          <li>Factoring quadratic expressions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/path" className="w-full">
    <Button className="w-full bg-orange-500 hover:bg-orange-600">
      Generate Learning Path
    </Button>
  </Link>

              </CardFooter>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="h-6 w-6 text-orange-500" />
                  <CardTitle className="text-white">Knowledge Assessment</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Test your understanding with interactive time-bound quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-gray-800 text-white">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-400">Question 1 of 20</p>
                    <div className="flex items-center gap-1 text-orange-400">
                      <Clock className="h-4 w-4" />
                      <span>59s</span>
                    </div>
                  </div>
                  <h3 className="font-medium mb-4">
                    Which of the following is NOT a method to solve quadratic equations discussed in the text?
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Solution by factorisation",
                      "Solution by completing the square",
                      "Solution using a formula",
                      "Solution by differentiation",
                    ].map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 rounded-lg border border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                      >
                        <div className="h-4 w-4 rounded-full border border-gray-500 mr-3"></div>
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section id="languages" className="py-20 bg-gray-900">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">Supports 22 Indian Languages</h2>
          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
            Learn in your preferred language with our multilingual support system
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "Hindi",
              "Bengali",
              "Telugu",
              "Marathi",
              "Tamil",
              "Urdu",
              "Gujarati",
              "Kannada",
              "Odia",
              "Punjabi",
              "Malayalam",
              "Assamese",
              "Maithili",
              "Sanskrit",
              "Kashmiri",
              "Nepali",
              "Konkani",
              "Sindhi",
              "Bodo",
              "Dogri",
              "Manipuri",
              "Santhali",
            ].map((language, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded-lg text-center hover:bg-gray-700 transition-colors">
                {language}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mental-health" className="py-20 bg-gray-950">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Mental Health Support</h2>
          <MentalHealthCard />
        </div>
      </section>

      <section id="get-started" className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning Experience?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Join thousands of students who have improved their learning outcomes with EduSmart AI's personalized
            approach.
          </p>
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
            Get Started for Free
          </Button>
        </div>
      </section>

      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Brain className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold">EduSmart AI</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                FAQ
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} LearnMate AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
    </div>
  )
}
