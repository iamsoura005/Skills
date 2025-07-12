'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'
import toast from 'react-hot-toast'
import { Users, MessageSquare, Star, Activity, Shield, AlertTriangle, Download } from 'lucide-react'

type AdminStats = {
  totalUsers: number
  totalSwaps: number
  pendingSwaps: number
  completedSwaps: number
  totalRatings: number
  averageRating: number
  publicProfiles: number
  privateProfiles: number
}

export default function AdminDashboard() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalSwaps: 0,
    pendingSwaps: 0,
    completedSwaps: 0,
    totalRatings: 0,
    averageRating: 0,
    publicProfiles: 0,
    privateProfiles: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchAdminStats()
      fetchRecentActivity()
    }
  }, [profile])

  const fetchAdminStats = async () => {
    setLoading(true)

    try {
      // Fetch user stats
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('is_public')

      if (usersError) throw usersError

      // Fetch swap stats
      const { data: swaps, error: swapsError } = await supabase
        .from('swap_requests')
        .select('status')

      if (swapsError) throw swapsError

      // Fetch rating stats
      const { data: ratings, error: ratingsError } = await supabase
        .from('ratings')
        .select('rating')

      if (ratingsError) throw ratingsError

      const totalUsers = users?.length || 0
      const publicProfiles = users?.filter(u => u.is_public).length || 0
      const privateProfiles = totalUsers - publicProfiles

      const totalSwaps = swaps?.length || 0
      const pendingSwaps = swaps?.filter(s => s.status === 'pending').length || 0
      const completedSwaps = swaps?.filter(s => s.status === 'completed').length || 0

      const totalRatings = ratings?.length || 0
      const averageRating = totalRatings > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
        : 0

      setStats({
        totalUsers,
        totalSwaps,
        pendingSwaps,
        completedSwaps,
        totalRatings,
        averageRating,
        publicProfiles,
        privateProfiles
      })
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      toast.error('Failed to load admin statistics')
    }

    setLoading(false)
  }

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent swap requests
      const { data: recentSwaps, error: swapsError } = await supabase
        .from('swap_requests')
        .select(`
          *,
          requester:profiles!swap_requests_requester_id_fkey (full_name),
          provider:profiles!swap_requests_provider_id_fkey (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      if (swapsError) throw swapsError

      // Fetch recent ratings
      const { data: recentRatings, error: ratingsError } = await supabase
        .from('ratings')
        .select(`
          *,
          rater:profiles!ratings_rater_id_fkey (full_name),
          rated:profiles!ratings_rated_id_fkey (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (ratingsError) throw ratingsError

      // Combine and sort by date
      const activity = [
        ...(recentSwaps || []).map(swap => ({
          type: 'swap',
          data: swap,
          created_at: swap.created_at
        })),
        ...(recentRatings || []).map(rating => ({
          type: 'rating',
          data: rating,
          created_at: rating.created_at
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setRecentActivity(activity.slice(0, 10))
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    }
  }

  const exportData = async (type: 'users' | 'swaps' | 'ratings') => {
    try {
      let data: any[] = []
      let filename = ''

      switch (type) {
        case 'users':
          const { data: users } = await supabase
            .from('profiles')
            .select('*')
          data = users || []
          filename = 'users_export.json'
          break
        case 'swaps':
          const { data: swaps } = await supabase
            .from('swap_requests')
            .select('*')
          data = swaps || []
          filename = 'swaps_export.json'
          break
        case 'ratings':
          const { data: ratings } = await supabase
            .from('ratings')
            .select('*')
          data = ratings || []
          filename = 'ratings_export.json'
          break
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`${type} data exported successfully`)
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Monitor platform activity and manage the skill swap community.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.publicProfiles} public, {stats.privateProfiles} private
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Swap Requests</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSwaps}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingSwaps} pending, {stats.completedSwaps} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ratings</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRatings}</div>
                  <p className="text-xs text-muted-foreground">
                    Avg: {stats.averageRating.toFixed(1)} stars
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Good</div>
                  <p className="text-xs text-muted-foreground">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest platform activities and user interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          {activity.type === 'swap' ? (
                            <MessageSquare className="h-4 w-4 text-primary-600" />
                          ) : (
                            <Star className="h-4 w-4 text-primary-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          {activity.type === 'swap' ? (
                            <p className="text-sm">
                              <span className="font-medium">{activity.data.requester.full_name}</span>
                              {' '}requested a swap with{' '}
                              <span className="font-medium">{activity.data.provider.full_name}</span>
                            </p>
                          ) : (
                            <p className="text-sm">
                              <span className="font-medium">{activity.data.rater.full_name}</span>
                              {' '}rated{' '}
                              <span className="font-medium">{activity.data.rated.full_name}</span>
                              {' '}({activity.data.rating} stars)
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {recentActivity.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        No recent activity
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Admin Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Admin Actions</CardTitle>
                  <CardDescription>
                    Platform management and data export tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Data Export
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportData('users')}
                        >
                          Export Users
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportData('swaps')}
                        >
                          Export Swaps
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportData('ratings')}
                        >
                          Export Ratings
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Moderation
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <Button variant="outline" size="sm">
                          Review Reported Content
                        </Button>
                        <Button variant="outline" size="sm">
                          Manage User Bans
                        </Button>
                        <Button variant="outline" size="sm">
                          Skill Moderation
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Platform Messages
                      </h4>
                      <Button variant="outline" size="sm" className="w-full">
                        Send Platform Announcement
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
