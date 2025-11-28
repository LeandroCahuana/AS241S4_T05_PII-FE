"use client"

import { Search } from "lucide-react"

export default function SearchBar({ placeholder = "Buscar...", onSearch }) {
  return (
    <div className="relative flex items-center">
      <div className="absolute left-0 flex items-center justify-center w-11 h-11 bg-[#ffd60a] rounded-full">
        <Search className="w-5 h-5 text-[#003566]" strokeWidth={2.5} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className="w-full pl-14 pr-5 py-2.5 bg-white rounded-full text-[#4a4a4a] text-sm placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#ffd60a]/50 shadow-sm"
      />
    </div>
  )
}
