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
import { Clock, CheckCircle, XCircle, Trash2, MessageSquare, User } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

type SwapRequest = Database['public']['Tables']['swap_requests']['Row'] & {
  requester: Database['public']['Tables']['profiles']['Row']
  provider: Database['public']['Tables']['profiles']['Row']
  requested_skill: Database['public']['Tables']['user_skills_offered']['Row'] & {
    skills: Database['public']['Tables']['skills']['Row']
  }
  offered_skill: Database['public']['Tables']['user_skills_offered']['Row'] & {
    skills: Database['public']['Tables']['skills']['Row']
  }
}

export default function SwapsPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')

  useEffect(() => {
    if (profile) {
      fetchSwapRequests()
    }
  }, [profile])

  const fetchSwapRequests = async () => {
    if (!profile) return

    setLoading(true)

    const { data, error } = await supabase
      .from('swap_requests')
      .select(`
        *,
        requester:profiles!swap_requests_requester_id_fkey (*),
        provider:profiles!swap_requests_provider_id_fkey (*),
        requested_skill:user_skills_offered!swap_requests_requested_skill_id_fkey (
          *,
          skills (*)
        ),
        offered_skill:user_skills_offered!swap_requests_offered_skill_id_fkey (
          *,
          skills (*)
        )
      `)
      .or(`requester_id.eq.${profile.id},provider_id.eq.${profile.id}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching swap requests:', error)
      toast.error('Failed to load swap requests')
    } else {
      setSwapRequests(data || [])
    }

    setLoading(false)
  }

  const updateSwapStatus = async (swapId: string, status: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from('swap_requests')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', swapId)

    if (error) {
      toast.error(`Failed to ${status} swap request`)
      console.error('Error updating swap status:', error)
    } else {
      toast.success(`Swap request ${status}!`)
      fetchSwapRequests()
    }
  }

  const deleteSwapRequest = async (swapId: string) => {
    const { error } = await supabase
      .from('swap_requests')
      .delete()
      .eq('id', swapId)

    if (error) {
      toast.error('Failed to delete swap request')
      console.error('Error deleting swap request:', error)
    } else {
      toast.success('Swap request deleted')
      fetchSwapRequests()
    }
  }

  const markAsCompleted = async (swapId: string) => {
    const { error } = await supabase
      .from('swap_requests')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', swapId)

    if (error) {
      toast.error('Failed to mark as completed')
      console.error('Error marking as completed:', error)
    } else {
      toast.success('Swap marked as completed!')
      fetchSwapRequests()
    }
  }

  const receivedRequests = swapRequests.filter(req => req.provider_id === profile?.id)
  const sentRequests = swapRequests.filter(req => req.requester_id === profile?.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'accepted': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      case 'cancelled': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Skill Swap Requests</h1>
              <p className="mt-2 text-gray-600">
                Manage your incoming and outgoing skill swap requests.
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('received')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'received'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Received ({receivedRequests.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('sent')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'sent'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Sent ({sentRequests.length})
                  </button>
                </nav>
              </div>
            </div>

            {/* Swap Requests List */}
            <div className="space-y-4">
              {(activeTab === 'received' ? receivedRequests : sentRequests).map((swap) => (
                <Card key={swap.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {activeTab === 'received' 
                                ? `${swap.requester.full_name} wants to learn from you`
                                : `Request to ${swap.provider.full_name}`
                              }
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatRelativeTime(swap.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-1">
                              {activeTab === 'received' ? 'They want to learn:' : 'You want to learn:'}
                            </h4>
                            <p className="text-blue-800">{swap.requested_skill.skills.name}</p>
                            <p className="text-sm text-blue-600">{swap.requested_skill.skills.category}</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-1">
                              {activeTab === 'received' ? 'They offer:' : 'You offer:'}
                            </h4>
                            <p className="text-green-800">{swap.offered_skill.skills.name}</p>
                            <p className="text-sm text-green-600">
                              {swap.offered_skill.skills.category} • {swap.offered_skill.proficiency_level} level
                            </p>
                          </div>
                        </div>

                        {swap.message && (
                          <div className="p-3 bg-gray-50 rounded-lg mb-4">
                            <h4 className="font-medium text-gray-900 mb-1">Message:</h4>
                            <p className="text-gray-700">{swap.message}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(swap.status)}`}>
                            {swap.status}
                          </span>

                          <div className="flex space-x-2">
                            {activeTab === 'received' && swap.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateSwapStatus(swap.id, 'accepted')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateSwapStatus(swap.id, 'rejected')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}

                            {swap.status === 'accepted' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsCompleted(swap.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark Complete
                              </Button>
                            )}

                            {activeTab === 'sent' && swap.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => deleteSwapRequest(swap.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(activeTab === 'received' ? receivedRequests : sentRequests).length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No {activeTab} requests
                    </h3>
                    <p className="text-gray-500">
                      {activeTab === 'received' 
                        ? "You haven't received any swap requests yet."
                        : "You haven't sent any swap requests yet."
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
