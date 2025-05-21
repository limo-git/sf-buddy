import type { ReactNode } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-gray-800 text-white border-gray-700 hover:border-orange-500/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  )
}
