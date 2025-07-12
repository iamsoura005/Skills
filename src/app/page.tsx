import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Users, Search, Star, Shield, Sparkles, Zap, Globe, TrendingUp, ArrowRight, Play, BookOpen, MessageSquare, Award, Rocket } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-700 font-medium mb-8 fade-in-up">
                <Sparkles className="w-4 h-4 mr-2" />
                Join 10,000+ skill swappers worldwide
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 fade-in-up text-shadow">
                Learn New Skills by{' '}
                <span className="gradient-text">Teaching What You Know</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed fade-in-up">
                Connect with passionate learners in your community. Share your expertise,
                discover new talents, and grow together in the world's most collaborative learning platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 fade-in-up">
                <Link href="/auth/register" className="btn-primary text-lg px-10 py-4 group">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/browse" className="btn-outline text-lg px-10 py-4 group">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto fade-in-up">
                <div className="stats-card text-center">
                  <div className="text-3xl font-bold gradient-text">10K+</div>
                  <div className="text-gray-600 font-medium">Active Users</div>
                </div>
                <div className="stats-card text-center">
                  <div className="text-3xl font-bold gradient-text">50K+</div>
                  <div className="text-gray-600 font-medium">Skills Shared</div>
                </div>
                <div className="stats-card text-center">
                  <div className="text-3xl font-bold gradient-text">25K+</div>
                  <div className="text-gray-600 font-medium">Successful Swaps</div>
                </div>
                <div className="stats-card text-center">
                  <div className="text-3xl font-bold gradient-text">4.9★</div>
                  <div className="text-gray-600 font-medium">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-medium mb-6">
                <Rocket className="w-4 h-4 mr-2" />
                How It Works
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Simple Steps to <span className="gradient-text">Start Learning</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of learners who are already exchanging skills and building meaningful connections
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="feature-card text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Create Your Profile</h3>
                <p className="text-gray-600 leading-relaxed">
                  Build your skill portfolio and tell the community what you can teach and what you want to learn
                </p>
              </div>

              <div className="feature-card text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Search className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Discover Matches</h3>
                <p className="text-gray-600 leading-relaxed">
                  Use our smart matching system to find people with complementary skills in your area
                </p>
              </div>

              <div className="feature-card text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Connect & Swap</h3>
                <p className="text-gray-600 leading-relaxed">
                  Send swap requests, arrange sessions, and start your collaborative learning journey
                </p>
              </div>

              <div className="feature-card text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Build Reputation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Rate your experiences and build trust within the community through authentic feedback
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-green-700 font-medium mb-6">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Why Choose SkillSwap
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Learn Faster, <span className="gradient-text">Teach Better</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Experience the power of peer-to-peer learning. Our platform connects you with real people
                  who share your passion for growth and knowledge exchange.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Global Community</h3>
                      <p className="text-gray-600">Connect with learners and teachers from around the world</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Safe & Secure</h3>
                      <p className="text-gray-600">Verified profiles and secure communication channels</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Matching</h3>
                      <p className="text-gray-600">AI-powered recommendations for perfect skill matches</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="card-glass p-6 floating-animation">
                      <BookOpen className="w-8 h-8 text-purple-600 mb-4" />
                      <h4 className="font-bold text-gray-900 mb-2">40+ Categories</h4>
                      <p className="text-gray-600 text-sm">From coding to cooking, find any skill</p>
                    </div>
                    <div className="card-glass p-6 floating-animation" style={{animationDelay: '1s'}}>
                      <Star className="w-8 h-8 text-yellow-500 mb-4" />
                      <h4 className="font-bold text-gray-900 mb-2">4.9/5 Rating</h4>
                      <p className="text-gray-600 text-sm">Trusted by thousands of users</p>
                    </div>
                  </div>
                  <div className="space-y-6 mt-12">
                    <div className="card-glass p-6 floating-animation" style={{animationDelay: '0.5s'}}>
                      <Users className="w-8 h-8 text-blue-600 mb-4" />
                      <h4 className="font-bold text-gray-900 mb-2">10K+ Users</h4>
                      <p className="text-gray-600 text-sm">Growing community worldwide</p>
                    </div>
                    <div className="card-glass p-6 floating-animation" style={{animationDelay: '1.5s'}}>
                      <MessageSquare className="w-8 h-8 text-green-600 mb-4" />
                      <h4 className="font-bold text-gray-900 mb-2">25K+ Swaps</h4>
                      <p className="text-gray-600 text-sm">Successful skill exchanges</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Start Your <span className="text-yellow-300">Learning Journey?</span>
            </h2>
            <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto">
              Join thousands of passionate learners and teachers. Your next skill is just a swap away.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/register" className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get Started Free
              </Link>
              <Link href="/browse" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105">
                Explore Skills
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold gradient-text">SkillSwap</h3>
                </div>
                <p className="text-gray-400 mb-6 max-w-md">
                  Building the world's largest community of skill sharers. Learn anything, teach everything, grow together.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                    <span className="text-sm font-bold">f</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                    <span className="text-sm font-bold">t</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-colors cursor-pointer">
                    <span className="text-sm font-bold">ig</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6">Platform</h4>
                <ul className="space-y-3 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Browse Skills</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6">Support</h4>
                <ul className="space-y-3 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 SkillSwap Platform. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm mt-4 md:mt-0">
                Made with ❤️ for the learning community
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
