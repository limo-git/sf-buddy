import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Clock } from "lucide-react"

export function MentalHealthCard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 flex flex-col justify-center">
        <h3 className="text-2xl font-bold mb-4">We Care About Your Wellbeing</h3>
        <p className="text-gray-300 mb-6">
          Learning can be stressful. Our AI assistant provides timely mental health support and resources to help you
          manage stress and anxiety during your educational journey.
        </p>
        <ul className="space-y-3">
          {[
            "Anxiety management techniques",
            "Stress reduction exercises",
            "Mindfulness practices",
            "Personalized wellness nudges",
            "Crisis resources when needed",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <Heart className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-2">
        <Card className="bg-gray-900 border-gray-800 h-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-orange-500" />
              <CardTitle>Mental Health Support</CardTitle>
            </div>
            <CardDescription className="text-gray-400">Get support when you need it most</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="self-end max-w-[80%] bg-blue-600 rounded-lg p-3 text-white">
                I am having anxiety about my upcoming exam
              </div>

              <div className="self-start max-w-[80%] bg-gray-800 rounded-lg p-3">
                <p className="mb-2">
                  I understand you're feeling anxious. It's okay to feel that way, and you're not alone. Here are some
                  techniques that might help:
                </p>
                <ul className="space-y-2 pl-5 list-disc text-gray-300">
                  <li>Deep Breathing: Practice slow, deep breaths for a few minutes</li>
                  <li>
                    Grounding Techniques: Try the 5-4-3-2-1 method (identify 5 things you see, 4 things you can
                    touch...)
                  </li>
                  <li>Challenge Negative Thoughts: Question if your worries are realistic</li>
                </ul>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>Just now</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-950">
                  Breathing Exercise
                </Button>
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-950">
                  Study Break Timer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
