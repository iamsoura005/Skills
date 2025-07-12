# 🎓 Skill Swap Platform

> **A modern web application that enables users to exchange skills within their community**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

![Skill Swap Platform](https://via.placeholder.com/1200x600/667eea/FFFFFF?text=Skill+Swap+Platform+-+Modern+Community+Learning)

## ✨ **What is Skill Swap Platform?**

Skill Swap Platform is a **modern, full-stack web application** that connects people who want to learn new skills with those who can teach them. Built with cutting-edge technologies and featuring a **beautiful, modern UI** with glass morphism effects and smooth animations.

### 🎯 **Perfect For:**
- **Communities** wanting to share knowledge
- **Professionals** looking to expand their skillset
- **Students** seeking peer-to-peer learning
- **Organizations** building internal skill-sharing programs

---

## 🚀 **Quick Start**

### **⚡ Automated Setup (Recommended)**

**Windows (PowerShell as Administrator):**
```powershell
.\setup.ps1
```

**macOS/Linux:**
```bash
chmod +x setup.sh && ./setup.sh
```

### **📖 Manual Setup**
See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

---

## ✨ **Features**

### 👤 **For Users**
- 🏠 **Complete Profile Management** - Personal info, location, bio, availability
- 🎯 **Skill Portfolio** - List skills you can teach with proficiency levels
- 📚 **Learning Goals** - Track skills you want to learn with priorities
- 🔒 **Privacy Controls** - Public/private profile visibility
- 🔍 **Smart Discovery** - Browse and search users by skills, location, categories
- 🤝 **Swap Requests** - Send, receive, accept, or reject skill exchanges
- ⭐ **Rating & Reviews** - Rate experiences and build reputation
- 📊 **Request Tracking** - Monitor all swap activities and statuses

### 🛡️ **For Admins**
- 📈 **Platform Analytics** - Comprehensive dashboard with statistics
- 🛠️ **Content Moderation** - Review and moderate user content
- 👥 **User Management** - Monitor behavior and manage policies
- 📤 **Data Export** - Export data for analysis
- 📢 **Platform Messaging** - Send announcements to users

### 🎨 **Modern UI Features**
- 🌟 **Glass Morphism** - Beautiful frosted glass effects
- 🎭 **Smooth Animations** - 60fps transitions and micro-interactions
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🌈 **Gradient Design** - Modern purple-to-blue color scheme
- ♿ **Accessible** - WCAG compliant with keyboard navigation
- 🌙 **Dark Mode Ready** - Automatic dark mode support

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 14** - React framework with App Router
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security** - Database-level security policies
- **Supabase Auth** - Authentication with role-based access

### **UI & UX**
- **Custom Design System** - Consistent, modern components
- **Lucide React** - Beautiful, consistent icons
- **React Hook Form** - Performant forms with validation
- **React Hot Toast** - Elegant notifications

### **Development**
- **ESLint & Prettier** - Code quality and formatting
- **Husky** - Git hooks for quality assurance
- **TypeScript** - Full type safety

---

## 📱 **Screenshots**

### 🏠 **Modern Homepage**
- Stunning hero section with gradient backgrounds
- Animated statistics and feature cards
- Glass morphism effects throughout
- Professional call-to-action sections

### 📊 **User Dashboard**
- Clean, intuitive interface
- Profile completion tracking
- Active swaps overview
- Quick action buttons

### 🎯 **Skill Management**
- Easy skill addition and removal
- Proficiency and priority levels
- Category-based organization
- Search and filter capabilities

### 🔍 **Browse & Discovery**
- Advanced search functionality
- User profile cards with hover effects
- Filter by location and categories
- Responsive grid layout

### 🤝 **Swap Requests**
- Streamlined request workflow
- Status tracking and notifications
- Accept/reject functionality
- Rating system integration

---

## 🎯 **Getting Started**

### **Prerequisites**
- **Node.js 18+** and npm
- **Supabase account** (free tier available)

### **🚀 Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iamsoura005/Skills.git
   cd Skills
   ```

2. **Run setup script:**
   ```bash
   # Windows
   .\setup.ps1

   # macOS/Linux
   chmod +x setup.sh && ./setup.sh
   ```

3. **Set up Supabase:**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Run SQL from `database/complete-setup.sql`
   - Update `.env.local` with your credentials

4. **Start development:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [https://skills-swap-oddo.vercel.app/]https://skills-swap-oddo.vercel.app/

---

## 🗄️ **Database Schema**

### **Tables Overview**
- 👤 **profiles** - User accounts and settings
- 🎯 **skills** - Available skills with categories (40+ included)
- 📚 **user_skills_offered** - Skills users can teach
- 🎓 **user_skills_wanted** - Skills users want to learn
- 🤝 **swap_requests** - Skill exchange requests
- ⭐ **ratings** - User ratings and feedback

### **Sample Skills Included**
- **Programming**: JavaScript, React, Python, Node.js, TypeScript
- **Design**: Photoshop, Figma, UI/UX Design
- **Music**: Guitar, Piano, Singing
- **Languages**: Spanish, French, German
- **Business**: Excel, Marketing, Public Speaking
- **And 25+ more across 8 categories!**

See `database/complete-setup.sql` for the full schema.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard
│   ├── admin/          # Admin panel
│   └── api/            # API routes
├── components/         # Reusable components
│   ├── ui/            # Basic UI components
│   └── features/      # Feature-specific components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
└── hooks/             # Custom React hooks
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Implement proper error handling
- Write meaningful commit messages

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel (recommended for Next.js)
   - Netlify
   - Railway
   - Your own server

3. **Set environment variables** in your deployment platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
