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
import { Star, MessageSquare, User, Award } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

type Rating = Database['public']['Tables']['ratings']['Row'] & {
  rater: Database['public']['Tables']['profiles']['Row']
  rated: Database['public']['Tables']['profiles']['Row']
  swap_requests: Database['public']['Tables']['swap_requests']['Row'] & {
    requested_skill: Database['public']['Tables']['user_skills_offered']['Row'] & {
      skills: Database['public']['Tables']['skills']['Row']
    }
    offered_skill: Database['public']['Tables']['user_skills_offered']['Row'] & {
      skills: Database['public']['Tables']['skills']['Row']
    }
  }
}

type CompletedSwap = Database['public']['Tables']['swap_requests']['Row'] & {
  requester: Database['public']['Tables']['profiles']['Row']
  provider: Database['public']['Tables']['profiles']['Row']
  requested_skill: Database['public']['Tables']['user_skills_offered']['Row'] & {
    skills: Database['public']['Tables']['skills']['Row']
  }
  offered_skill: Database['public']['Tables']['user_skills_offered']['Row'] & {
    skills: Database['public']['Tables']['skills']['Row']
  }
}

export default function RatingsPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [completedSwaps, setCompletedSwaps] = useState<CompletedSwap[]>([])
  const [activeTab, setActiveTab] = useState<'received' | 'given' | 'pending'>('received')
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedSwap, setSelectedSwap] = useState<CompletedSwap | null>(null)

  useEffect(() => {
    if (profile) {
      fetchRatings()
      fetchCompletedSwaps()
    }
  }, [profile])

  const fetchRatings = async () => {
    if (!profile) return

    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        rater:profiles!ratings_rater_id_fkey (*),
        rated:profiles!ratings_rated_id_fkey (*),
        swap_requests (
          *,
          requested_skill:user_skills_offered!swap_requests_requested_skill_id_fkey (
            *,
            skills (*)
          ),
          offered_skill:user_skills_offered!swap_requests_offered_skill_id_fkey (
            *,
            skills (*)
          )
        )
      `)
      .or(`rater_id.eq.${profile.id},rated_id.eq.${profile.id}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching ratings:', error)
    } else {
      setRatings(data || [])
    }
  }

  const fetchCompletedSwaps = async () => {
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
      .eq('status', 'completed')
      .or(`requester_id.eq.${profile.id},provider_id.eq.${profile.id}`)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching completed swaps:', error)
    } else {
      setCompletedSwaps(data || [])
    }

    setLoading(false)
  }

  const submitRating = async (swapId: string, ratedUserId: string, rating: number, feedback: string) => {
    if (!profile) return

    const { error } = await supabase
      .from('ratings')
      .insert({
        swap_request_id: swapId,
        rater_id: profile.id,
        rated_id: ratedUserId,
        rating,
        feedback
      })

    if (error) {
      toast.error('Failed to submit rating')
      console.error('Error submitting rating:', error)
    } else {
      toast.success('Rating submitted successfully!')
      fetchRatings()
      fetchCompletedSwaps()
      setShowRatingModal(false)
      setSelectedSwap(null)
    }
  }

  const receivedRatings = ratings.filter(rating => rating.rated_id === profile?.id)
  const givenRatings = ratings.filter(rating => rating.rater_id === profile?.id)
  
  const pendingRatings = completedSwaps.filter(swap => {
    const hasRated = ratings.some(rating => 
      rating.swap_request_id === swap.id && rating.rater_id === profile?.id
    )
    return !hasRated
  })

  const averageRating = receivedRatings.length > 0 
    ? receivedRatings.reduce((sum, rating) => sum + rating.rating, 0) / receivedRatings.length 
    : 0

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
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
              <h1 className="text-3xl font-bold text-gray-900">Ratings & Feedback</h1>
              <p className="mt-2 text-gray-600">
                View your ratings and provide feedback for completed skill swaps.
              </p>
            </div>

            {/* Rating Summary */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="h-8 w-8 text-yellow-500 mr-2" />
                      <span className="text-3xl font-bold text-gray-900">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                    {renderStars(Math.round(averageRating), 'lg')}
                    <p className="text-sm text-gray-500 mt-1">Average Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{receivedRatings.length}</div>
                    <p className="text-sm text-gray-500">Total Reviews</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{completedSwaps.length}</div>
                    <p className="text-sm text-gray-500">Completed Swaps</p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                    Received ({receivedRatings.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('given')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'given'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Given ({givenRatings.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'pending'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Pending ({pendingRatings.length})
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {activeTab === 'pending' && (
                <>
                  {pendingRatings.map((swap) => (
                    <Card key={swap.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                              Skill swap with {swap.requester_id === profile?.id ? swap.provider.full_name : swap.requester.full_name}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-1">You learned:</h4>
                                <p className="text-blue-800">{swap.requested_skill.skills.name}</p>
                              </div>
                              <div className="p-3 bg-green-50 rounded-lg">
                                <h4 className="font-medium text-green-900 mb-1">You taught:</h4>
                                <p className="text-green-800">{swap.offered_skill.skills.name}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              Completed {formatRelativeTime(swap.updated_at)}
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              setSelectedSwap(swap)
                              setShowRatingModal(true)
                            }}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Rate Experience
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {pendingRatings.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending ratings</h3>
                        <p className="text-gray-500">All your completed swaps have been rated.</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {(activeTab === 'received' || activeTab === 'given') && (
                <>
                  {(activeTab === 'received' ? receivedRatings : givenRatings).map((rating) => (
                    <Card key={rating.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">
                                {activeTab === 'received' ? rating.rater.full_name : rating.rated.full_name}
                              </h3>
                              <div className="flex items-center space-x-2">
                                {renderStars(rating.rating)}
                                <span className="text-sm text-gray-500">
                                  {formatRelativeTime(rating.created_at)}
                                </span>
                              </div>
                            </div>
                            {rating.feedback && (
                              <p className="text-gray-700 mb-3">{rating.feedback}</p>
                            )}
                            <div className="text-sm text-gray-500">
                              Skill: {rating.swap_requests.requested_skill.skills.name}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {(activeTab === 'received' ? receivedRatings : givenRatings).length === 0 && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No {activeTab} ratings
                        </h3>
                        <p className="text-gray-500">
                          {activeTab === 'received' 
                            ? "You haven't received any ratings yet."
                            : "You haven't given any ratings yet."
                          }
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rating Modal */}
        {showRatingModal && selectedSwap && (
          <RatingModal
            swap={selectedSwap}
            currentUserId={profile?.id || ''}
            onClose={() => {
              setShowRatingModal(false)
              setSelectedSwap(null)
            }}
            onSubmit={submitRating}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}

interface RatingModalProps {
  swap: CompletedSwap
  currentUserId: string
  onClose: () => void
  onSubmit: (swapId: string, ratedUserId: string, rating: number, feedback: string) => void
}

function RatingModal({ swap, currentUserId, onClose, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)

  const otherUser = swap.requester_id === currentUserId ? swap.provider : swap.requester

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating > 0) {
      onSubmit(swap.id, otherUser.id, rating, feedback)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">
          Rate your experience with {otherUser.full_name}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How was your experience?
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Share your experience and any feedback..."
            />
          </div>

          <div className="flex space-x-3">
            <Button type="submit" disabled={rating === 0}>
              Submit Rating
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
