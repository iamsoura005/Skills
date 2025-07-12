'use client'

import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { User, BookOpen, MessageSquare, Star, Settings } from 'lucide-react'

export default function DashboardPage() {
  const { profile } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {profile?.full_name || 'User'}!
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your skills, track your swaps, and discover new learning opportunities.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Complete</div>
                  <p className="text-xs text-muted-foreground">
                    Manage your profile and skills
                  </p>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" size="sm" className="mt-2">
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Skills</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Skills offered and wanted
                  </p>
                  <Link href="/dashboard/skills">
                    <Button variant="outline" size="sm" className="mt-2">
                      Manage Skills
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Swap Requests</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Pending requests
                  </p>
                  <Link href="/dashboard/swaps">
                    <Button variant="outline" size="sm" className="mt-2">
                      View Swaps
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    Your average rating
                  </p>
                  <Link href="/dashboard/ratings">
                    <Button variant="outline" size="sm" className="mt-2">
                      View Ratings
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Swap Requests</CardTitle>
                  <CardDescription>
                    Your latest skill swap activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-gray-500">
                    No recent swap requests
                  </div>
                  <Link href="/browse">
                    <Button className="w-full">
                      Browse Skills
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Skills</CardTitle>
                  <CardDescription>
                    Skills you might be interested in learning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-gray-500">
                    Complete your profile to get recommendations
                  </div>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" className="w-full">
                      Complete Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
