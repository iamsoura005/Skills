'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'
import { Search, MapPin, Clock, Star, MessageSquare } from 'lucide-react'
import Link from 'next/link'

type Profile = Database['public']['Tables']['profiles']['Row']
type UserSkillOffered = Database['public']['Tables']['user_skills_offered']['Row'] & {
  skills: Database['public']['Tables']['skills']['Row']
  profiles: Profile
}

export default function BrowsePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [userSkills, setUserSkills] = useState<UserSkillOffered[]>([])
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchUserSkills()
    fetchCategories()
  }, [])

  const fetchUserSkills = async () => {
    setLoading(true)
    
    const { data, error } = await supabase
      .from('user_skills_offered')
      .select(`
        *,
        skills (*),
        profiles (*)
      `)
      .eq('profiles.is_public', true)
      .neq('user_id', user?.id || '')

    if (error) {
      console.error('Error fetching user skills:', error)
    } else {
      setUserSkills(data || [])
    }
    
    setLoading(false)
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('category')
      .order('category')

    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      const uniqueCategories = Array.from(new Set(data?.map(item => item.category) || []))
      setCategories(uniqueCategories)
    }
  }

  const filteredSkills = userSkills.filter(userSkill => {
    const matchesSearch = 
      userSkill.skills.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userSkill.profiles.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userSkill.profiles.location?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || userSkill.skills.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const groupedSkills = filteredSkills.reduce((acc, userSkill) => {
    const userId = userSkill.user_id
    if (!acc[userId]) {
      acc[userId] = {
        profile: userSkill.profiles,
        skills: []
      }
    }
    acc[userId].skills.push(userSkill)
    return acc
  }, {} as Record<string, { profile: Profile, skills: UserSkillOffered[] }>)

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Browse Skills</h1>
            <p className="mt-2 text-gray-600">
              Discover people in your community who can teach you new skills.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search skills, people, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedSkills).map(([userId, { profile, skills }]) => (
              <Card key={userId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary-600">
                        {profile.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{profile.full_name || 'Anonymous User'}</CardTitle>
                      {profile.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {profile.location}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2">{profile.bio}</p>
                    )}
                    
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Can teach:</h4>
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 3).map((userSkill) => (
                          <span
                            key={userSkill.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {userSkill.skills.name}
                          </span>
                        ))}
                        {skills.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {profile.availability && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="line-clamp-1">{profile.availability}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 mr-1" />
                        <span>No ratings yet</span>
                      </div>
                      {user ? (
                        <Link href={`/profile/${userId}`}>
                          <Button size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/auth/login">
                          <Button size="sm">
                            Sign in to contact
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {Object.keys(groupedSkills).length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No skills found</h3>
                <p className="text-sm">Try adjusting your search criteria or browse all categories.</p>
              </div>
              {!user && (
                <Link href="/auth/register">
                  <Button>Join the community</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
