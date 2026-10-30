export type UserRole = 'super_admin' | 'admin' | 'staff' | 'user';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export type DocumentStatus = 'approved' | 'pending' | 'rejected' | 'requires_correction';

export type DocumentCategory = 
  | 'education' 
  | 'personal' 
  | 'professional' 
  | 'training' 
  | 'other';

export interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  altPhone?: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  address: string;
  region: string;
  district: string;
  country: string;
  occupation: string;
  educationLevel: string;
  institution: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  profilePhotoUrl: string;
  bio?: string;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profile: UserProfile;
}

export interface UserDocument {
  id: string;
  userId: string;
  userFullName: string;
  category: DocumentCategory;
  categoryLabel: string;
  documentName: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSizeKb: number;
  status: DocumentStatus;
  rejectionReason?: string;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface SystemNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  documentId?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface SystemSettings {
  systemName: string;
  systemTagline: string;
  logoUrl: string;
  supportEmail: string;
  supportPhone: string;
  maxUploadSizeMb: number;
  allowedFileFormats: string[]; // e.g. ['PDF', 'JPG', 'PNG', 'WEBP']
  maintenanceMode: boolean;
  allowPublicRegistration: boolean;
  requireStrongPassword: boolean;
  emailNotificationsEnabled: boolean;
}

export interface FeatureFlags {
  userRegistration: boolean;
  documents: boolean;
  certificates: boolean;
  notifications: boolean;
  reports: boolean;
  digitalIdCard: boolean;
  qrVerification: boolean;
  messaging: boolean;
  appointments: boolean;
  payments: boolean;
}

export interface RolePermission {
  role: UserRole;
  label: string;
  description: string;
  permissions: {
    manageUsers: boolean;
    manageAdmins: boolean;
    reviewDocuments: boolean;
    deleteDocuments: boolean;
    manageSettings: boolean;
    manageFeatures: boolean;
    viewReports: boolean;
    viewActivityLogs: boolean;
    manageBackups: boolean;
    accessAdminPortal: boolean;
  };
}
