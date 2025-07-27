# Replit.md - AI Procurement Cost Estimation System

## Overview

This is a comprehensive web application that helps organizations create accurate cost estimates for procurement requests using artificial intelligence. The system analyzes procurement documents, extracts specifications, and provides intelligent cost estimation with market research capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.
Hebrew terminology preferences:
- "אומדן" instead of "הערכה" for estimates
- "דרישות רכש" instead of "בקשות רכש" 
- System title: "מערכת ניהול אומדני עלויות רכש"

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with custom shadcn/ui implementation
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization
- **Language Support**: Hebrew (RTL) with Arabic numerals

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Style**: RESTful API architecture
- **File Processing**: Multer for handling document uploads
- **Development**: Vite for fast development and HMR

### Data Storage
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM with Zod validation
- **Connection**: Neon Database serverless connection
- **Schema**: Shared schema definitions between client and server
- **Storage Strategy**: In-memory storage for development/MVP with database ready for production

## Key Components

### Core Modules
1. **Dashboard**: Overview with cost statistics, trends, and performance metrics
2. **Procurement Request Management**: Create, view, and manage procurement requests
3. **AI Document Analysis**: Extract specifications from uploaded documents
4. **Cost Estimation Engine**: Generate detailed cost estimates with confidence levels
5. **Market Research**: Supplier comparisons and price trend analysis
6. **AI Recommendations**: Cost-saving opportunities and risk assessments
7. **Dynamic Market Research**: Real-time market intelligence with contextual supplier data and pricing trends
8. **Authentication & User Management**: JWT-based authentication with role-based access control

### Database Schema
- **Users**: User management with role-based access
- **Procurement Requests**: Core procurement data with specifications
- **Suppliers**: Supplier information with ratings and reliability metrics
- **Cost Estimations**: AI-generated cost estimates with confidence levels
- **Documents**: File upload tracking with AI analysis results
- **Market Insights**: Market data and pricing trends

### UI Components
- **Custom Components**: Procurement-specific forms, AI analysis panels, progress indicators
- **Charts**: Cost trends, accuracy breakdowns, supplier comparisons
- **File Upload**: Drag-and-drop interface with progress tracking
- **Forms**: React Hook Form with Zod validation

## Data Flow

### Document Processing Flow
1. User uploads procurement documents
2. Files are processed and stored with metadata
3. AI analysis extracts specifications and requirements
4. Results are stored and displayed to user

### Cost Estimation Flow
1. AI analyzes procurement specifications
2. Market research is conducted for pricing
3. Cost estimation is generated with confidence levels
4. Recommendations are provided for optimization

### API Communication
- REST endpoints for CRUD operations
- Real-time progress updates for AI processing
- File upload handling with progress feedback
- Error handling with user-friendly messages

## External Dependencies

### Frontend Dependencies
- **@radix-ui/***: Comprehensive UI component library
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling with validation
- **recharts**: Data visualization library
- **wouter**: Lightweight routing
- **date-fns**: Date manipulation utilities

### Backend Dependencies
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **multer**: File upload handling
- **express**: Web framework
- **zod**: Schema validation
- **bcrypt**: Password hashing for secure authentication
- **jsonwebtoken**: JWT token generation and verification

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the application
- **ESBuild**: Fast bundling for production
- **Tailwind CSS**: Utility-first CSS framework

## Deployment Strategy

### Development Environment
- **Hot Module Replacement**: Vite provides fast development experience
- **TypeScript Checking**: Full type safety during development
- **File Watching**: Auto-restart server on changes

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild bundles server code for Node.js
- **Database**: Drizzle handles schema migrations
- **Environment**: Configured for production deployment

### File Structure
- **client/**: React frontend application
- **server/**: Express.js backend application
- **shared/**: Shared TypeScript definitions and schemas
- **migrations/**: Database migration files

### Configuration
- **Environment Variables**: DATABASE_URL for PostgreSQL connection
- **Build Scripts**: Separate development and production builds
- **Path Aliases**: Configured for clean imports across the application

The application uses a monorepo structure with shared TypeScript definitions, ensuring type safety across the full stack. The dark theme with Hebrew language support provides a professional interface for procurement professionals.

## Recent Changes (January 2024)

✓ Complete MVP implementation with all four main modules functional
✓ Fixed all critical API endpoints and data loading issues
✓ Implemented comprehensive Hebrew RTL support with terminology preferences
✓ Added navigation improvements with "חזרה" (back) buttons across all pages
✓ Fixed chart colors for dark theme compatibility using bright colors: #60a5fa, #34d399, #fbbf24, #f87171
✓ Updated system title and terminology per user feedback
✓ Complete cost estimation results page with justification tables and action buttons
✓ **NEW: Dynamic Market Research Service** - Intelligent real-time market analysis with supplier comparisons and pricing intelligence
✓ **NEW: Authentication System** - JWT-based authentication with role-based access control and comprehensive user management
✓ **Enhanced TypeScript Architecture** - Complete type definitions for market research and user management features
✓ **Fixed TypeScript Compilation** - Resolved circular dependencies and type mismatches across the codebase
✓ All critical bugs resolved and system ready for deployment with advanced features