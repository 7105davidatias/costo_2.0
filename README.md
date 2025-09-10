# AI Procurement Cost Estimation System
## מערכת ניהול אומדני עלויות רכש

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://postgresql.org/)

A comprehensive web application that helps organizations create accurate cost estimates for procurement requests using artificial intelligence. The system analyzes procurement documents, extracts specifications, and provides intelligent cost estimation with market research capabilities.

## 🌟 Features

### Core Functionality
- **📊 Smart Dashboard**: Real-time cost statistics, trends, and performance metrics
- **📋 Procurement Management**: Create, view, and manage procurement requests with full lifecycle tracking
- **🤖 AI Document Analysis**: Automated extraction of specifications from uploaded documents
- **💰 Intelligent Cost Estimation**: AI-generated cost estimates with confidence levels and market analysis
- **🔍 Market Research**: Comprehensive supplier comparisons and price trend analysis
- **💡 AI Recommendations**: Cost-saving opportunities and risk assessments

### Technical Features
- **🌐 Hebrew RTL Support**: Full right-to-left language support with Arabic numerals
- **🌙 Dark Theme**: Professional dark interface optimized for procurement workflows
- **📱 Responsive Design**: Mobile-friendly interface with adaptive layouts
- **⚡ Real-time Updates**: Live progress tracking for AI processing and analysis
- **🔒 Type Safety**: End-to-end TypeScript with shared schemas across frontend and backend
- **📁 File Processing**: Advanced document upload with progress tracking and analysis

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** 13+
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-procurement-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/procurement_db
   NODE_ENV=development
   PORT=5000
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:5000](http://localhost:5000) in your browser

## 🏗️ Architecture

### Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── charts/     # Data visualization components
│   │   │   ├── layout/     # Layout components (header, sidebar)
│   │   │   ├── procurement/ # Business logic components
│   │   │   └── ui/         # shadcn/ui component library
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── pages/          # Route components
│   │   └── App.tsx         # Main application component
│   └── index.html          # HTML entry point
├── server/                 # Express.js backend application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data access layer
│   └── vite.ts            # Vite development server setup
├── shared/                 # Shared TypeScript definitions
│   └── schema.ts          # Database schema and types
└── uploads/               # File upload directory
```

### Technology Stack

#### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with Hot Module Replacement
- **UI Library**: Radix UI with custom shadcn/ui implementation
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation

#### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Style**: RESTful API architecture
- **File Processing**: Multer for handling document uploads
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod for runtime type checking

#### Database & ORM
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Shared schema definitions with automatic type inference
- **Migrations**: Drizzle Kit for schema management

## 📊 Database Schema

### Core Entities

#### Users
- User authentication and role management
- Support for multiple user roles and permissions

#### Procurement Requests
- Complete procurement lifecycle management
- Specifications and extracted data storage
- Status tracking and cost estimation linkage

#### Suppliers
- Supplier information with ratings and reliability metrics
- Contact information and business terms
- Preferred supplier management

#### Cost Estimations
- AI-generated cost estimates with confidence levels
- Market price analysis and potential savings
- Detailed justifications and recommendations

#### Documents
- File upload tracking with metadata
- AI analysis results and extracted specifications
- Version control and analysis history

#### Market Insights
- Market data and pricing trends
- Risk assessments and supplier analytics
- Historical price tracking

## 🔌 API Documentation

### Authentication Endpoints

```typescript
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/user
```

### Procurement Management

```typescript
GET    /api/procurement-requests          # List all requests
POST   /api/procurement-requests          # Create new request
GET    /api/procurement-requests/:id      # Get specific request
PUT    /api/procurement-requests/:id      # Update request
DELETE /api/procurement-requests/:id      # Delete request
```

### Cost Estimation

```typescript
POST   /api/cost-estimation/:id           # Generate cost estimate
GET    /api/cost-estimation/:id           # Get estimation results
PUT    /api/cost-estimation/:id           # Update estimation
```

### Document Processing

```typescript
POST   /api/documents/upload              # Upload documents
GET    /api/documents/:id                 # Get document details
POST   /api/documents/:id/analyze         # Trigger AI analysis
```

### Market Research

```typescript
GET    /api/market-research/:category     # Get market insights
GET    /api/suppliers                     # List suppliers
GET    /api/suppliers/:id/quotes          # Get supplier quotes
```

## 🎨 UI Components

### Custom Components

#### Procurement Request Form
- Multi-step form with validation
- File upload with drag-and-drop
- Real-time specification extraction
- Cost estimation integration

#### AI Analysis Panel
- Progress tracking for AI processing
- Results visualization with charts
- Confidence indicators and recommendations
- Interactive cost breakdown

#### Dashboard Widgets
- Cost trends and analytics
- Performance metrics and KPIs
- Recent activity and notifications
- Quick action buttons

#### Market Research Tools
- Supplier comparison tables
- Price trend charts
- Risk assessment indicators
- Recommendation engine results

## 🌐 Internationalization

### Hebrew Language Support

The application provides comprehensive Hebrew language support with:

- **RTL Layout**: Right-to-left text direction for Hebrew content
- **Custom Terminology**: Specialized procurement terms in Hebrew
  - "אומדן" (Omdan) for estimates
  - "דרישות רכש" (Drishot Rechesh) for procurement requirements
- **Arabic Numerals**: Numbers displayed in Arabic numerals for clarity
- **Date Formatting**: Hebrew date formats with proper localization

### Terminology Preferences

| English | Hebrew | Usage |
|---------|--------|-------|
| Estimate | אומדן | Cost estimations and budget projections |
| Procurement Request | דרישות רכש | Official procurement documentation |
| System Title | מערכת ניהול אומדני עלויות רכש | Main application title |

## 🔧 Development

### Getting Started

1. **Fork and clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up your environment**: Copy `.env.example` to `.env`
4. **Start development server**: `npm run dev`

### Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run start    # Start production server
npm run check    # TypeScript type checking
npm run db:push  # Push database schema changes
```

### Code Style and Standards

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting with consistent style
- **Conventional Commits**: Standardized commit message format

### Testing

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## 🚀 Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   DATABASE_URL=your_production_database_url
   NODE_ENV=production
   PORT=5000
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `5000` |
| `VITE_API_URL` | Frontend API URL | No | `/api` |

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
Error: listen EADDRINUSE: address already in use 0.0.0.0:5000
```
**Solution**: Kill existing processes using the port:
```bash
pkill -f "tsx server/index.ts"
npm run dev
```

#### Database Connection Issues
```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solutions**:
1. Ensure PostgreSQL is running
2. Verify `DATABASE_URL` is correct
3. Check database credentials and permissions

#### TypeScript Compilation Errors
```bash
npm run check
```
**Solution**: Review and fix TypeScript errors before running the application

### Performance Optimization

- **Database Indexing**: Ensure proper indexes on frequently queried columns
- **Image Optimization**: Compress uploaded images for faster loading
- **Caching**: Implement Redis caching for frequently accessed data
- **Bundle Analysis**: Use `npm run build` with bundle analyzer for optimization

## 📈 Monitoring and Analytics

### Performance Metrics

- **Response Times**: API endpoint performance tracking
- **Error Rates**: Application error monitoring and alerting
- **User Analytics**: Usage patterns and feature adoption
- **Cost Estimation Accuracy**: AI model performance metrics

### Logging

- **Structured Logging**: JSON-formatted logs with correlation IDs
- **Error Tracking**: Comprehensive error reporting and stack traces
- **Audit Trail**: User action logging for compliance and debugging

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Process

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Ensure all tests pass**: `npm test`
6. **Update documentation** as needed
7. **Submit a pull request**

### Pull Request Guidelines

- **Clear Description**: Explain what changes were made and why
- **Tests**: Include tests for new features and bug fixes
- **Documentation**: Update relevant documentation
- **Code Style**: Follow existing code style and conventions

### Issue Reporting

When reporting issues, please include:

- **Environment**: OS, Node.js version, npm version
- **Steps to Reproduce**: Clear steps to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable, include screenshots

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team and Support

### Core Team
- **Development Team**: Full-stack developers specializing in procurement systems
- **AI/ML Team**: Machine learning engineers for cost estimation algorithms
- **UX/UI Team**: Design specialists with expertise in enterprise applications

### Support

- **Documentation**: Comprehensive guides and API documentation
- **Community**: Active community support and discussions
- **Enterprise Support**: Available for enterprise deployments

### Contact

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🏆 Acknowledgments

- **Radix UI**: For providing excellent accessible UI components
- **Tailwind CSS**: For the utility-first CSS framework
- **Drizzle ORM**: For type-safe database operations
- **React Team**: For the amazing React ecosystem
- **TypeScript Team**: For bringing type safety to JavaScript

---

**Built with ❤️ for procurement professionals worldwide**

*This system revolutionizes procurement cost estimation through intelligent automation and comprehensive market analysis, helping organizations make informed purchasing decisions while reducing costs and improving efficiency.*