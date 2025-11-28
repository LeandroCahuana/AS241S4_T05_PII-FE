import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';

export default function Header() {
    return (
        <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            {/* Left Section - Logo and Title */}
            <div className="flex items-center gap-4">
                {/* Logo Circle */}
                <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg"
                    style={{ backgroundColor: '#2563eb' }}
                >
                    DO
                </div>
                
                {/* Title and Subtitle */}
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">
                        Sistematización de la Hackathon
                    </h1>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <svg 
                            width="12" 
                            height="12" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                        <span>Instituto Valle Grande de Cañete</span>
                    </div>
                </div>
            </div>

            {/* Right Section - Search, Notifications, Logout */}
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar estudiantes..."
                        className="w-80 pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    {/* Magic Icon */}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <span className="text-xl">✨</span>
                    </div>
                </div>

                {/* Notifications Bell */}
                <button className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group">
                    <Bell className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
                    {/* Notification Badge */}
                    <div 
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                        style={{ backgroundColor: '#1e3a8a' }}
                    >
                        10
                    </div>
                </button>

                {/* Logout Button */}
                <button 
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-all duration-200 group"
                >
                    <LogOut className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600">
                        Cerrar Sesión
                    </span>
                </button>
            </div>
        </header>
    );
}