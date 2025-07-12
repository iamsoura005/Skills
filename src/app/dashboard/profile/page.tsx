'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    location: '',
    bio: '',
    availability: '',
    is_public: true,
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        location: profile.location || '',
        bio: profile.bio || '',
        availability: profile.availability || '',
        is_public: profile.is_public,
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          location: formData.location,
          bio: formData.bio,
          availability: formData.availability,
          is_public: formData.is_public,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile?.id)

      if (error) {
        toast.error('Failed to update profile')
        console.error('Profile update error:', error)
        return
      }

      await refreshProfile()
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="mt-2 text-gray-600">
                Manage your personal information and privacy settings.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <Input
                        label="Full Name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />

                      <Input
                        label="Location (Optional)"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., New York, NY"
                        helperText="Help others find local skill swaps"
                      />

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          Bio (Optional)
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows={4}
                          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Tell others about yourself and your interests..."
                        />
                        <p className="text-sm text-gray-500">
                          Share a bit about yourself to help others connect with you
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          Availability (Optional)
                        </label>
                        <textarea
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          rows={3}
                          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="e.g., Weekends, Evenings after 6 PM, Flexible schedule..."
                        />
                        <p className="text-sm text-gray-500">
                          Let others know when you're available for skill swaps
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_public"
                          name="is_public"
                          checked={formData.is_public}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_public" className="text-sm font-medium text-gray-700">
                          Make my profile public
                        </label>
                      </div>
                      <p className="text-sm text-gray-500 ml-6">
                        When enabled, other users can discover and contact you for skill swaps
                      </p>

                      <Button type="submit" loading={loading} className="w-full">
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Preview */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Preview</CardTitle>
                    <CardDescription>
                      How others will see your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl font-semibold text-primary-600">
                            {formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">{formData.full_name || 'Your Name'}</h3>
                        {formData.location && (
                          <p className="text-sm text-gray-500">{formData.location}</p>
                        )}
                      </div>

                      {formData.bio && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-1">About</h4>
                          <p className="text-sm text-gray-600">{formData.bio}</p>
                        </div>
                      )}

                      {formData.availability && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-1">Availability</h4>
                          <p className="text-sm text-gray-600">{formData.availability}</p>
                        </div>
                      )}

                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          Profile is {formData.is_public ? 'public' : 'private'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
