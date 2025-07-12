'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'
import toast from 'react-hot-toast'
import { MapPin, Clock, Star, MessageSquare, BookOpen, Target } from 'lucide-react'

type Profile = Database['public']['Tables']['profiles']['Row']
type UserSkillOffered = Database['public']['Tables']['user_skills_offered']['Row'] & {
  skills: Database['public']['Tables']['skills']['Row']
}
type UserSkillWanted = Database['public']['Tables']['user_skills_wanted']['Row'] & {
  skills: Database['public']['Tables']['skills']['Row']
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile: currentUserProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [offeredSkills, setOfferedSkills] = useState<UserSkillOffered[]>([])
  const [wantedSkills, setWantedSkills] = useState<UserSkillWanted[]>([])
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('')
  const [myOfferedSkills, setMyOfferedSkills] = useState<UserSkillOffered[]>([])

  const userId = params.userId as string

  useEffect(() => {
    if (userId) {
      fetchUserProfile()
      fetchMyOfferedSkills()
    }
  }, [userId, user])

  const fetchUserProfile = async () => {
    setLoading(true)

    // Fetch profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      router.push('/browse')
      return
    }

    if (!profileData.is_public && profileData.id !== user?.id) {
      toast.error('This profile is private')
      router.push('/browse')
      return
    }

    setProfile(profileData)

    // Fetch offered skills
    const { data: offeredData, error: offeredError } = await supabase
      .from('user_skills_offered')
      .select(`
        *,
        skills (*)
      `)
      .eq('user_id', userId)

    if (offeredError) {
      console.error('Error fetching offered skills:', offeredError)
    } else {
      setOfferedSkills(offeredData || [])
    }

    // Fetch wanted skills
    const { data: wantedData, error: wantedError } = await supabase
      .from('user_skills_wanted')
      .select(`
        *,
        skills (*)
      `)
      .eq('user_id', userId)

    if (wantedError) {
      console.error('Error fetching wanted skills:', wantedError)
    } else {
      setWantedSkills(wantedData || [])
    }

    setLoading(false)
  }

  const fetchMyOfferedSkills = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('user_skills_offered')
      .select(`
        *,
        skills (*)
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching my offered skills:', error)
    } else {
      setMyOfferedSkills(data || [])
    }
  }

  const handleSwapRequest = async (requestedSkillId: string, message: string) => {
    if (!user || !selectedOfferedSkill) return

    const { error } = await supabase
      .from('swap_requests')
      .insert({
        requester_id: user.id,
        provider_id: userId,
        requested_skill_id: requestedSkillId,
        offered_skill_id: selectedOfferedSkill,
        message,
        status: 'pending'
      })

    if (error) {
      toast.error('Failed to send swap request')
      console.error('Swap request error:', error)
    } else {
      toast.success('Swap request sent successfully!')
      setShowSwapModal(false)
      setSelectedOfferedSkill('')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900">Profile not found</h1>
        </div>
      </div>
    )
  }

  const isOwnProfile = user?.id === userId

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-semibold text-primary-600">
                    {profile.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">{profile.full_name || 'Anonymous User'}</h1>
                  {profile.location && (
                    <div className="flex items-center text-gray-500 mt-1">
                      <MapPin className="h-5 w-5 mr-1" />
                      {profile.location}
                    </div>
                  )}
                  {profile.bio && (
                    <p className="text-gray-600 mt-3">{profile.bio}</p>
                  )}
                  {profile.availability && (
                    <div className="flex items-center text-gray-500 mt-2">
                      <Clock className="h-5 w-5 mr-1" />
                      <span>{profile.availability}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-500 mt-2">
                    <Star className="h-5 w-5 mr-1" />
                    <span>No ratings yet</span>
                  </div>
                </div>
                {!isOwnProfile && user && (
                  <Button onClick={() => setShowSwapModal(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request Skill Swap
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Offered */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                  <CardTitle>Skills {isOwnProfile ? 'I' : 'They'} Can Teach</CardTitle>
                </div>
                <CardDescription>
                  {offeredSkills.length} skill{offeredSkills.length !== 1 ? 's' : ''} available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {offeredSkills.map((userSkill) => (
                    <div key={userSkill.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{userSkill.skills.name}</h4>
                        <span className="text-sm text-gray-500 capitalize">
                          {userSkill.proficiency_level} level
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{userSkill.skills.category}</p>
                      {userSkill.description && (
                        <p className="text-sm text-gray-600 mt-2">{userSkill.description}</p>
                      )}
                    </div>
                  ))}
                  {offeredSkills.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      No skills offered yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills Wanted */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <CardTitle>Skills {isOwnProfile ? 'I' : 'They'} Want to Learn</CardTitle>
                </div>
                <CardDescription>
                  {wantedSkills.length} skill{wantedSkills.length !== 1 ? 's' : ''} wanted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wantedSkills.map((userSkill) => (
                    <div key={userSkill.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{userSkill.skills.name}</h4>
                        <span className="text-sm text-gray-500 capitalize">
                          {userSkill.urgency} priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{userSkill.skills.category}</p>
                      {userSkill.description && (
                        <p className="text-sm text-gray-600 mt-2">{userSkill.description}</p>
                      )}
                    </div>
                  ))}
                  {wantedSkills.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      No skills wanted yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <SwapRequestModal
          targetUser={profile}
          wantedSkills={wantedSkills}
          myOfferedSkills={myOfferedSkills}
          onClose={() => setShowSwapModal(false)}
          onSubmit={handleSwapRequest}
          selectedOfferedSkill={selectedOfferedSkill}
          setSelectedOfferedSkill={setSelectedOfferedSkill}
        />
      )}
    </div>
  )
}

interface SwapRequestModalProps {
  targetUser: Profile
  wantedSkills: UserSkillWanted[]
  myOfferedSkills: UserSkillOffered[]
  onClose: () => void
  onSubmit: (requestedSkillId: string, message: string) => void
  selectedOfferedSkill: string
  setSelectedOfferedSkill: (skillId: string) => void
}

function SwapRequestModal({
  targetUser,
  wantedSkills,
  myOfferedSkills,
  onClose,
  onSubmit,
  selectedOfferedSkill,
  setSelectedOfferedSkill
}: SwapRequestModalProps) {
  const [selectedWantedSkill, setSelectedWantedSkill] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedWantedSkill && selectedOfferedSkill) {
      onSubmit(selectedWantedSkill, message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">
          Request Skill Swap with {targetUser.full_name}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What skill do you want to learn?
            </label>
            <select
              value={selectedWantedSkill}
              onChange={(e) => setSelectedWantedSkill(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select a skill they can teach...</option>
              {wantedSkills.map((userSkill) => (
                <option key={userSkill.id} value={userSkill.id}>
                  {userSkill.skills.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What skill will you offer in return?
            </label>
            <select
              value={selectedOfferedSkill}
              onChange={(e) => setSelectedOfferedSkill(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select a skill you can teach...</option>
              {myOfferedSkills.map((userSkill) => (
                <option key={userSkill.id} value={userSkill.id}>
                  {userSkill.skills.name} ({userSkill.proficiency_level})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Introduce yourself and explain what you'd like to learn..."
            />
          </div>

          <div className="flex space-x-3">
            <Button type="submit" disabled={!selectedWantedSkill || !selectedOfferedSkill}>
              Send Request
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
