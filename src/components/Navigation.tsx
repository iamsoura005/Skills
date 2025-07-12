'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { LogOut, User, Settings, Menu, X, Sparkles, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const { user, profile, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20'
        : 'bg-white/60 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">SkillSwap</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link href="/browse" className="nav-link">
                  Browse Skills
                </Link>
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                {profile?.role === 'admin' && (
                  <Link href="/admin" className="nav-link">
                    Admin
                  </Link>
                )}

                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <Bell className="h-5 w-5" />
                  <div className="notification-badge">3</div>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-purple-50 transition-all duration-200 group"
                  >
                    <div className="profile-avatar">
                      {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-purple-600">
                      {profile?.full_name || 'User'}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                        <p className="text-sm text-gray-500">{profile?.email}</p>
                      </div>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/browse" className="nav-link">
                  Browse Skills
                </Link>
                <Link href="/auth/login" className="nav-link">
                  Sign In
                </Link>
                <Link href="/auth/register">
                  <Button className="btn-primary">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                    <div className="profile-avatar">
                      {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{profile?.full_name || 'User'}</p>
                      <p className="text-sm text-gray-500">{profile?.email}</p>
                    </div>
                  </div>
                  <Link href="/browse" className="block py-2 text-gray-700 hover:text-purple-600" onClick={() => setShowMobileMenu(false)}>
                    Browse Skills
                  </Link>
                  <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-purple-600" onClick={() => setShowMobileMenu(false)}>
                    Dashboard
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link href="/admin" className="block py-2 text-gray-700 hover:text-purple-600" onClick={() => setShowMobileMenu(false)}>
                      Admin
                    </Link>
                  )}
                  <Link href="/dashboard/profile" className="block py-2 text-gray-700 hover:text-purple-600" onClick={() => setShowMobileMenu(false)}>
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setShowMobileMenu(false)
                    }}
                    className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/browse" className="block py-2 text-gray-700 hover:text-purple-600" onClick={() => setShowMobileMenu(false)}>
                    Browse Skills
                  </Link>
                  <Link href="/auth/login" className="block py-2 text-gray-700 hover:text-purple-600" onClick={() => setShowMobileMenu(false)}>
                    Sign In
                  </Link>
                  <Link href="/auth/register" onClick={() => setShowMobileMenu(false)}>
                    <Button className="btn-primary w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
