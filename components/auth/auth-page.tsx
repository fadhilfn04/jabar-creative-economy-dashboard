"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <img 
              src="/logo/logo-parekraf.png" 
              alt="Logo Dashboard" 
              className="h-16 w-16 mb-6 bg-white/10 rounded-xl p-2"
            />
            <h1 className="text-4xl font-bold mb-4">
              Dashboard Ekonomi Kreatif
            </h1>
            <h2 className="text-2xl font-light mb-6">
              Jawa Barat
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Platform analitik komprehensif untuk memantau dan menganalisis 
              perkembangan ekonomi kreatif di Jawa Barat
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-blue-100">Data real-time dari seluruh wilayah</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-blue-100">Analisis mendalam per subsektor</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-blue-100">Visualisasi data interaktif</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
      </div>

      {/* Right Side - Authentication Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {mode === 'login' ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  )
}