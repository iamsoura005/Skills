# Skill Swap Platform

A modern web application that enables users to exchange skills within their community. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

![Skill Swap Platform](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Skill+Swap+Platform)

## 🚀 Quick Start

### Automated Setup (Recommended)

**For Windows (PowerShell as Administrator):**
```powershell
.\setup.ps1
```

**For macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup
See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed manual installation instructions.

## ✨ Features

### 👤 User Features
- **Complete Profile Management**: Personal info, location, bio, and availability settings
- **Skill Portfolio**: List skills you can teach with proficiency levels
- **Learning Goals**: Track skills you want to learn with priority levels
- **Privacy Controls**: Public/private profile visibility
- **Smart Discovery**: Browse and search users by skills, location, and categories
- **Swap Requests**: Send, receive, accept, or reject skill exchange requests
- **Rating & Reviews**: Rate experiences and build reputation
- **Request Tracking**: Monitor all swap activities and statuses

### 🛡️ Admin Features
- **Platform Analytics**: Comprehensive dashboard with user and activity statistics
- **Content Moderation**: Review and moderate user-generated content
- **User Management**: Monitor user behavior and manage platform policies
- **Data Export**: Export user data, swaps, and ratings for analysis
- **Platform Messaging**: Send announcements to all users

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with role-based access control
- **UI Components**: Custom component library with Lucide React icons
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **State Management**: React Context API

## 📱 Screenshots

### Homepage
Clean, modern landing page with clear value proposition and call-to-action.

### User Dashboard
Comprehensive dashboard showing profile completion, active swaps, and quick actions.

### Skill Management
Intuitive interface for managing skills you can teach and want to learn.

### Browse Skills
Discover other users with advanced search and filtering capabilities.

### Swap Requests
Streamlined process for requesting, managing, and tracking skill exchanges.

## 🎯 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)

### Quick Installation

1. **Run the setup script:**
   ```bash
   # Windows (PowerShell as Administrator)
   .\setup.ps1

   # macOS/Linux
   chmod +x setup.sh && ./setup.sh
   ```

2. **Set up Supabase:**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Run SQL from `database/schema.sql`
   - Add your credentials to `.env.local`

3. **Start developing:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main tables:

- **profiles**: User information and settings
- **skills**: Available skills in the platform
- **user_skills_offered**: Skills that users can teach
- **user_skills_wanted**: Skills that users want to learn
- **swap_requests**: Skill exchange requests between users
- **ratings**: User ratings and feedback after swaps

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
