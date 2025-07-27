import { User, UserRole } from '../../shared/schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  phoneNumber?: string;
}

export class AuthService {
  private jwtSecret: string;
  private saltRounds: number;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.saltRounds = 12;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(user: Partial<User>): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    return jwt.sign(payload, this.jwtSecret, { 
      expiresIn: '7d',
      issuer: 'procurement-system'
    });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  validateUserRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
      'admin': 4,
      'procurement_manager': 3,
      'department_head': 2,
      'employee': 1
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  validateUserPermissions(user: User, action: string, resource?: any): boolean {
    switch (action) {
      case 'create_procurement_request':
        return ['admin', 'procurement_manager', 'department_head', 'employee'].includes(user.role);
      
      case 'approve_procurement_request':
        return ['admin', 'procurement_manager', 'department_head'].includes(user.role);
      
      case 'view_all_requests':
        return ['admin', 'procurement_manager'].includes(user.role);
      
      case 'manage_users':
        return user.role === 'admin';
      
      case 'conduct_market_research':
        return ['admin', 'procurement_manager', 'department_head'].includes(user.role);
      
      case 'view_cost_estimates':
        if (resource && resource.requestedBy) {
          // Users can always view their own requests
          if (resource.requestedBy === user.email) return true;
        }
        return ['admin', 'procurement_manager', 'department_head'].includes(user.role);
      
      case 'edit_procurement_request':
        if (resource && resource.requestedBy) {
          // Users can edit their own requests if still in draft/new status
          if (resource.requestedBy === user.email && resource.status === 'new') return true;
        }
        return ['admin', 'procurement_manager'].includes(user.role);
      
      default:
        return false;
    }
  }

  generateResetToken(email: string): string {
    const payload = { email, type: 'password_reset' };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });
  }

  verifyResetToken(token: string): { email: string } {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as any;
      if (payload.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }
      return { email: payload.email };
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }

  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  sanitizeUserData(user: User): Partial<User> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async checkUserExists(email: string, users: User[]): Promise<boolean> {
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  }

  generateUserDisplayName(user: User): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  }

  getUserRoleDisplayName(role: UserRole): string {
    const roleNames = {
      'admin': 'מנהל מערכת',
      'procurement_manager': 'מנהל רכש',
      'department_head': 'ראש מחלקה',
      'employee': 'עובד'
    };
    
    return roleNames[role] || role;
  }

  canUserAccessRequest(user: User, request: any): boolean {
    // Admin and procurement managers can access all requests
    if (['admin', 'procurement_manager'].includes(user.role)) {
      return true;
    }
    
    // Department heads can access requests from their department
    if (user.role === 'department_head' && user.department === request.department) {
      return true;
    }
    
    // Users can access their own requests
    if (request.requestedBy === user.email) {
      return true;
    }
    
    return false;
  }

  getDefaultPermissions(role: UserRole) {
    const permissions = {
      admin: [
        'manage_users',
        'view_all_requests',
        'approve_all_requests',
        'conduct_market_research',
        'view_system_analytics',
        'manage_system_settings'
      ],
      procurement_manager: [
        'view_all_requests',
        'approve_procurement_requests',
        'conduct_market_research',
        'view_cost_estimates',
        'manage_suppliers'
      ],
      department_head: [
        'create_procurement_request',
        'approve_department_requests',
        'view_department_requests',
        'conduct_market_research'
      ],
      employee: [
        'create_procurement_request',
        'view_own_requests',
        'edit_own_requests'
      ]
    };

    return permissions[role] || permissions.employee;
  }
}