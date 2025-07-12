'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'
import toast from 'react-hot-toast'
import { Plus, X, BookOpen, Target } from 'lucide-react'

type Skill = Database['public']['Tables']['skills']['Row']
type UserSkillOffered = Database['public']['Tables']['user_skills_offered']['Row'] & {
  skills: Skill
}
type UserSkillWanted = Database['public']['Tables']['user_skills_wanted']['Row'] & {
  skills: Skill
}

export default function SkillsPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [offeredSkills, setOfferedSkills] = useState<UserSkillOffered[]>([])
  const [wantedSkills, setWantedSkills] = useState<UserSkillWanted[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddOffered, setShowAddOffered] = useState(false)
  const [showAddWanted, setShowAddWanted] = useState(false)

  useEffect(() => {
    fetchSkills()
    fetchUserSkills()
  }, [profile])

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching skills:', error)
      return
    }

    setSkills(data || [])
  }

  const fetchUserSkills = async () => {
    if (!profile) return

    // Fetch offered skills
    const { data: offered, error: offeredError } = await supabase
      .from('user_skills_offered')
      .select(`
        *,
        skills (*)
      `)
      .eq('user_id', profile.id)

    if (offeredError) {
      console.error('Error fetching offered skills:', offeredError)
    } else {
      setOfferedSkills(offered || [])
    }

    // Fetch wanted skills
    const { data: wanted, error: wantedError } = await supabase
      .from('user_skills_wanted')
      .select(`
        *,
        skills (*)
      `)
      .eq('user_id', profile.id)

    if (wantedError) {
      console.error('Error fetching wanted skills:', wantedError)
    } else {
      setWantedSkills(wanted || [])
    }
  }

  const addOfferedSkill = async (skillId: string, proficiency: string, description: string) => {
    if (!profile) return

    setLoading(true)
    const { error } = await supabase
      .from('user_skills_offered')
      .insert({
        user_id: profile.id,
        skill_id: skillId,
        proficiency_level: proficiency as any,
        description,
      })

    if (error) {
      toast.error('Failed to add skill')
      console.error('Error adding offered skill:', error)
    } else {
      toast.success('Skill added successfully!')
      fetchUserSkills()
      setShowAddOffered(false)
    }
    setLoading(false)
  }

  const addWantedSkill = async (skillId: string, urgency: string, description: string) => {
    if (!profile) return

    setLoading(true)
    const { error } = await supabase
      .from('user_skills_wanted')
      .insert({
        user_id: profile.id,
        skill_id: skillId,
        urgency: urgency as any,
        description,
      })

    if (error) {
      toast.error('Failed to add skill')
      console.error('Error adding wanted skill:', error)
    } else {
      toast.success('Skill added successfully!')
      fetchUserSkills()
      setShowAddWanted(false)
    }
    setLoading(false)
  }

  const removeOfferedSkill = async (id: string) => {
    const { error } = await supabase
      .from('user_skills_offered')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to remove skill')
    } else {
      toast.success('Skill removed')
      fetchUserSkills()
    }
  }

  const removeWantedSkill = async (id: string) => {
    const { error } = await supabase
      .from('user_skills_wanted')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to remove skill')
    } else {
      toast.success('Skill removed')
      fetchUserSkills()
    }
  }

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
              <p className="mt-2 text-gray-600">
                Manage the skills you can teach and the skills you want to learn.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills I Can Teach */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-primary-600" />
                      <CardTitle>Skills I Can Teach</CardTitle>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowAddOffered(true)}
                      disabled={showAddOffered}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Skill
                    </Button>
                  </div>
                  <CardDescription>
                    Skills you can offer to teach others
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {offeredSkills.map((userSkill) => (
                      <div key={userSkill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{userSkill.skills.name}</h4>
                          <p className="text-sm text-gray-500 capitalize">{userSkill.proficiency_level} level</p>
                          {userSkill.description && (
                            <p className="text-sm text-gray-600 mt-1">{userSkill.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOfferedSkill(userSkill.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {offeredSkills.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        No skills added yet. Add your first skill to get started!
                      </div>
                    )}

                    {showAddOffered && (
                      <AddSkillForm
                        skills={filteredSkills}
                        type="offered"
                        onAdd={addOfferedSkill}
                        onCancel={() => setShowAddOffered(false)}
                        loading={loading}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Skills I Want to Learn */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <CardTitle>Skills I Want to Learn</CardTitle>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowAddWanted(true)}
                      disabled={showAddWanted}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Skill
                    </Button>
                  </div>
                  <CardDescription>
                    Skills you're interested in learning from others
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {wantedSkills.map((userSkill) => (
                      <div key={userSkill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{userSkill.skills.name}</h4>
                          <p className="text-sm text-gray-500 capitalize">{userSkill.urgency} priority</p>
                          {userSkill.description && (
                            <p className="text-sm text-gray-600 mt-1">{userSkill.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWantedSkill(userSkill.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {wantedSkills.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        No skills added yet. Add skills you want to learn!
                      </div>
                    )}

                    {showAddWanted && (
                      <AddSkillForm
                        skills={filteredSkills}
                        type="wanted"
                        onAdd={addWantedSkill}
                        onCancel={() => setShowAddWanted(false)}
                        loading={loading}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                      />
                    )}
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

interface AddSkillFormProps {
  skills: Skill[]
  type: 'offered' | 'wanted'
  onAdd: (skillId: string, level: string, description: string) => void
  onCancel: () => void
  loading: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
}

function AddSkillForm({ skills, type, onAdd, onCancel, loading, searchTerm, setSearchTerm }: AddSkillFormProps) {
  const [selectedSkill, setSelectedSkill] = useState('')
  const [level, setLevel] = useState(type === 'offered' ? 'intermediate' : 'medium')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSkill) {
      onAdd(selectedSkill, level, description)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border border-gray-200 rounded-lg bg-white space-y-4">
      <Input
        label="Search Skills"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a skill..."
      />

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Select Skill</label>
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          <option value="">Choose a skill...</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name} ({skill.category})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {type === 'offered' ? 'Proficiency Level' : 'Priority Level'}
        </label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {type === 'offered' ? (
            <>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </>
          ) : (
            <>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder={type === 'offered' ? 'Describe your experience with this skill...' : 'What specifically do you want to learn?'}
        />
      </div>

      <div className="flex space-x-2">
        <Button type="submit" loading={loading} disabled={!selectedSkill}>
          Add Skill
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
