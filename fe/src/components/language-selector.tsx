"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"

export function LanguageSelector() {
  const [language, setLanguage] = useState("English")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-300">
          <Languages className="h-4 w-4" />
          <span>{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
        {["English", "Hindi", "Bengali", "Telugu", "Tamil", "Marathi"].map((lang) => (
          <DropdownMenuItem
            key={lang}
            className="text-gray-200 focus:bg-gray-700 focus:text-white cursor-pointer"
            onClick={() => setLanguage(lang)}
          >
            {lang}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
