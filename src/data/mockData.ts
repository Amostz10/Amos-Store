import {
  UserAccount,
  UserDocument,
  SystemNotification,
  ActivityLog,
  SystemSettings,
  FeatureFlags,
  RolePermission
} from '../types';

import amosEmblem from '../assets/images/amos_store_emblem_1793373968181.jpg';
import amosAvatar from '../assets/images/avatar_amos_user_1793373969141.jpg';
import certSample from '../assets/images/sample_certificate_preview_1793373968732.jpg';

export const AMOS_EMBLEM_URL = amosEmblem;
export const AMOS_AVATAR_URL = amosAvatar;
export const CERTIFICATE_SAMPLE_URL = certSample;

export const INITIAL_SETTINGS: SystemSettings = {
  systemName: 'Amos Store',
  systemTagline: 'Personal Information, Document and User Management System',
  logoUrl: AMOS_EMBLEM_URL,
  supportEmail: 'support@amosstore.io',
  supportPhone: '+1 (555) 234-5678',
  maxUploadSizeMb: 10,
  allowedFileFormats: ['PDF', 'JPG', 'JPEG', 'PNG', 'WEBP'],
  maintenanceMode: false,
  allowPublicRegistration: true,
  requireStrongPassword: true,
  emailNotificationsEnabled: true
};

export const INITIAL_FEATURES: FeatureFlags = {
  userRegistration: true,
  documents: true,
  certificates: true,
  notifications: true,
  reports: true,
  digitalIdCard: true,
  qrVerification: true,
  messaging: false,
  appointments: false,
  payments: false
};

export const INITIAL_ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: 'super_admin',
    label: 'Super Administrator',
    description: 'Unrestricted control over system configuration, feature flags, backups, administrators, and security audits.',
    permissions: {
      manageUsers: true,
      manageAdmins: true,
      reviewDocuments: true,
      deleteDocuments: true,
      manageSettings: true,
      manageFeatures: true,
      viewReports: true,
      viewActivityLogs: true,
      manageBackups: true,
      accessAdminPortal: true
    }
  },
  {
    role: 'admin',
    label: 'Administrator',
    description: 'Manages user accounts, performs document verification reviews, and generates operations reports.',
    permissions: {
      manageUsers: true,
      manageAdmins: false,
      reviewDocuments: true,
      deleteDocuments: false,
      manageSettings: false,
      manageFeatures: false,
      viewReports: true,
      viewActivityLogs: true,
      manageBackups: false,
      accessAdminPortal: true
    }
  },
  {
    role: 'staff',
    label: 'Staff Member',
    description: 'Assigned restricted duties, primarily viewing registered users and queuing pending documents.',
    permissions: {
      manageUsers: false,
      manageAdmins: false,
      reviewDocuments: true,
      deleteDocuments: false,
      manageSettings: false,
      manageFeatures: false,
      viewReports: false,
      viewActivityLogs: false,
      manageBackups: false,
      accessAdminPortal: true
    }
  },
  {
    role: 'user',
    label: 'Standard User',
    description: 'Personal portal access to maintain profile, upload certificates and documents, and manage personal data.',
    permissions: {
      manageUsers: false,
      manageAdmins: false,
      reviewDocuments: false,
      deleteDocuments: false,
      manageSettings: false,
      manageFeatures: false,
      viewReports: false,
      viewActivityLogs: false,
      manageBackups: false,
      accessAdminPortal: false
    }
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_amos_01',
    username: 'amos',
    email: 'amos@amosstore.io',
    role: 'user',
    status: 'active',
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-10-29T14:30:00Z',
    lastLogin: '2026-10-30T08:15:00Z',
    profile: {
      fullName: 'Amos Tungaraza',
      username: 'amos',
      email: 'amos@amosstore.io',
      phone: '+1 (555) 345-6789',
      altPhone: '+1 (555) 987-6543',
      gender: 'Male',
      dateOfBirth: '1995-06-18',
      address: '742 Evergreen Terrace, Suite 402',
      region: 'Central District',
      district: 'Metro East',
      country: 'United States',
      occupation: 'Senior Systems Analyst & Cloud Architect',
      educationLevel: 'Bachelor of Science in Computer Science',
      institution: 'University of Edinburgh',
      emergencyContact: {
        name: 'Grace Tungaraza',
        relationship: 'Spouse',
        phone: '+1 (555) 765-4321'
      },
      profilePhotoUrl: AMOS_AVATAR_URL,
      bio: 'Cloud architecture specialist with an interest in distributed systems, security governance, and high-integrity document vaults.'
    }
  },
  {
    id: 'usr_super_admin',
    username: 'superadmin',
    email: 'superadmin@amosstore.io',
    role: 'super_admin',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-28T10:00:00Z',
    lastLogin: '2026-10-30T07:45:00Z',
    profile: {
      fullName: 'Dr. James Mwamba',
      username: 'superadmin',
      email: 'superadmin@amosstore.io',
      phone: '+1 (555) 100-2000',
      gender: 'Male',
      dateOfBirth: '1982-04-12',
      address: '100 Silicon Way, Executive Tower',
      region: 'HQ Command',
      district: 'Central',
      country: 'United States',
      occupation: 'Chief Information Security Officer',
      educationLevel: 'Ph.D. in Computer Engineering',
      institution: 'MIT',
      emergencyContact: {
        name: 'Sarah Mwamba',
        relationship: 'Sister',
        phone: '+1 (555) 100-2001'
      },
      profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
      bio: 'Super Administrator overseeing data integrity, cryptographic document vaults, and role-based policies.'
    }
  },
  {
    id: 'usr_admin_sarah',
    username: 'sarah.j',
    email: 'sarah.jenkins@amosstore.io',
    role: 'admin',
    status: 'active',
    createdAt: '2026-03-15T11:20:00Z',
    updatedAt: '2026-10-25T16:00:00Z',
    lastLogin: '2026-10-29T18:20:00Z',
    profile: {
      fullName: 'Sarah Jenkins',
      username: 'sarah.j',
      email: 'sarah.jenkins@amosstore.io',
      phone: '+1 (555) 222-3344',
      gender: 'Female',
      dateOfBirth: '1990-11-23',
      address: '450 North Meridian Street',
      region: 'West Region',
      district: 'North Harbor',
      country: 'United States',
      occupation: 'Senior Compliance & Verification Officer',
      educationLevel: 'Master in Information Systems',
      institution: 'Stanford University',
      emergencyContact: {
        name: 'David Jenkins',
        relationship: 'Spouse',
        phone: '+1 (555) 222-3345'
      },
      profilePhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80',
      bio: 'Document verification and identity compliance administrator.'
    }
  },
  {
    id: 'usr_fatima_04',
    username: 'fatima.z',
    email: 'fatima.zahra@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2026-09-02T13:45:00Z',
    updatedAt: '2026-10-20T10:15:00Z',
    lastLogin: '2026-10-27T09:10:00Z',
    profile: {
      fullName: 'Fatima Zahra',
      username: 'fatima.z',
      email: 'fatima.zahra@example.com',
      phone: '+1 (555) 888-9900',
      gender: 'Female',
      dateOfBirth: '1998-03-30',
      address: '12 Harbor View Ave',
      region: 'Coastline',
      district: 'Bay City',
      country: 'United States',
      occupation: 'Biomedical Data Scientist',
      educationLevel: 'Master of Science in Bioinformatics',
      institution: 'Johns Hopkins University',
      emergencyContact: {
        name: 'Tariq Zahra',
        relationship: 'Father',
        phone: '+1 (555) 888-9901'
      },
      profilePhotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80',
      bio: 'Genomics research fellow maintaining digital academic credentials.'
    }
  },
  {
    id: 'usr_david_05',
    username: 'david.k',
    email: 'david.kim@example.com',
    role: 'user',
    status: 'suspended',
    createdAt: '2026-08-10T15:00:00Z',
    updatedAt: '2026-10-24T12:00:00Z',
    lastLogin: '2026-10-24T11:45:00Z',
    profile: {
      fullName: 'David Kim',
      username: 'david.k',
      email: 'david.kim@example.com',
      phone: '+1 (555) 777-6655',
      gender: 'Male',
      dateOfBirth: '1992-09-14',
      address: '88 Tech Boulevard',
      region: 'Northern Heights',
      district: 'Valley Center',
      country: 'United States',
      occupation: 'Financial Analyst',
      educationLevel: 'Bachelor in Finance',
      institution: 'NYU Stern',
      emergencyContact: {
        name: 'Min Kim',
        relationship: 'Mother',
        phone: '+1 (555) 777-6656'
      },
      profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
      bio: 'Account temporarily suspended pending address document resubmission.'
    }
  }
];

export const INITIAL_DOCUMENTS: UserDocument[] = [
  {
    id: 'doc_amos_degree',
    userId: 'usr_amos_01',
    userFullName: 'Amos Tungaraza',
    category: 'education',
    categoryLabel: 'Education Certificate',
    documentName: 'Bachelor of Science Degree Certificate',
    documentNumber: 'EDI-ENG-2023-8894',
    issueDate: '2023-06-25',
    description: 'Official degree certificate from University of Edinburgh with First Class Honours.',
    fileUrl: CERTIFICATE_SAMPLE_URL,
    fileType: 'image/jpeg',
    fileSizeKb: 1420,
    status: 'approved',
    uploadedAt: '2026-10-29T14:30:00Z',
    reviewedAt: '2026-10-29T15:10:00Z',
    reviewedBy: 'Sarah Jenkins'
  },
  {
    id: 'doc_amos_birth',
    userId: 'usr_amos_01',
    userFullName: 'Amos Tungaraza',
    category: 'personal',
    categoryLabel: 'Personal Document',
    documentName: 'Official Birth Certificate',
    documentNumber: 'BC-99214-TZ-2020',
    issueDate: '2020-04-10',
    description: 'Certified national birth certificate record with registration seal.',
    fileUrl: CERTIFICATE_SAMPLE_URL,
    fileType: 'image/jpeg',
    fileSizeKb: 980,
    status: 'pending',
    uploadedAt: '2026-10-29T16:00:00Z'
  },
  {
    id: 'doc_amos_driving',
    userId: 'usr_amos_01',
    userFullName: 'Amos Tungaraza',
    category: 'personal',
    categoryLabel: 'Personal Document',
    documentName: 'Driver License Class C & Motorbike',
    documentNumber: 'DL-884029-EXP28',
    issueDate: '2023-01-15',
    expiryDate: '2028-01-15',
    description: 'Valid state driver license card front and back scan.',
    fileUrl: CERTIFICATE_SAMPLE_URL,
    fileType: 'image/jpeg',
    fileSizeKb: 1150,
    status: 'approved',
    uploadedAt: '2026-10-20T11:00:00Z',
    reviewedAt: '2026-10-21T09:30:00Z',
    reviewedBy: 'Sarah Jenkins'
  },
  {
    id: 'doc_amos_cisco',
    userId: 'usr_amos_01',
    userFullName: 'Amos Tungaraza',
    category: 'professional',
    categoryLabel: 'Professional Certificate',
    documentName: 'Cisco CCNP Enterprise Solutions Specialist',
    documentNumber: 'CSCO-1194021',
    issueDate: '2024-08-12',
    expiryDate: '2027-08-12',
    description: 'Enterprise networking and routing certification badge and transcript.',
    fileUrl: CERTIFICATE_SAMPLE_URL,
    fileType: 'image/jpeg',
    fileSizeKb: 1640,
    status: 'approved',
    uploadedAt: '2026-10-22T13:20:00Z',
    reviewedAt: '2026-10-23T10:15:00Z',
    reviewedBy: 'Sarah Jenkins'
  },
  {
    id: 'doc_fatima_diploma',
    userId: 'usr_fatima_04',
    userFullName: 'Fatima Zahra',
    category: 'education',
    categoryLabel: 'Education Certificate',
    documentName: 'Master of Science Diploma',
    documentNumber: 'JHU-BIO-2024-102',
    issueDate: '2024-05-18',
    description: 'Postgraduate diploma in Computational Biology.',
    fileUrl: CERTIFICATE_SAMPLE_URL,
    fileType: 'image/jpeg',
    fileSizeKb: 1890,
    status: 'pending',
    uploadedAt: '2026-10-28T16:45:00Z'
  },
  {
    id: 'doc_david_passport',
    userId: 'usr_david_05',
    userFullName: 'David Kim',
    category: 'personal',
    categoryLabel: 'Personal Document',
    documentName: 'International Passport Bio Page',
    documentNumber: 'P-99882201',
    issueDate: '2022-03-10',
    expiryDate: '2032-03-10',
    description: 'Passport biodata page photo scan.',
    fileUrl: CERTIFICATE_SAMPLE_URL,
    fileType: 'image/jpeg',
    fileSizeKb: 840,
    status: 'rejected',
    rejectionReason: 'Image is not clear or edges are cut off. Please upload a high resolution, uncropped flat copy with the MRZ lines visible.',
    uploadedAt: '2026-10-23T10:00:00Z',
    reviewedAt: '2026-10-24T11:30:00Z',
    reviewedBy: 'Dr. James Mwamba'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif_01',
    userId: 'usr_amos_01',
    title: 'Degree Certificate Approved',
    message: 'Your Bachelor of Science Degree Certificate has been verified and approved by Administrator Sarah Jenkins.',
    type: 'success',
    isRead: false,
    createdAt: '2026-10-29T15:10:00Z',
    documentId: 'doc_amos_degree'
  },
  {
    id: 'notif_02',
    userId: 'usr_amos_01',
    title: 'Birth Certificate Submitted',
    message: 'Your Official Birth Certificate was successfully uploaded and is currently queued for administrator review.',
    type: 'info',
    isRead: false,
    createdAt: '2026-10-29T16:00:00Z',
    documentId: 'doc_amos_birth'
  },
  {
    id: 'notif_03',
    userId: 'usr_amos_01',
    title: 'Profile 85% Complete',
    message: 'Complete your secondary contact number and emergency contact verification to reach 100% verified status.',
    type: 'warning',
    isRead: true,
    createdAt: '2026-10-28T09:00:00Z'
  },
  {
    id: 'notif_04',
    userId: 'usr_david_05',
    title: 'Passport Rejected - Resubmission Required',
    message: 'Image is not clear or edges are cut off. Please upload a high resolution, uncropped flat copy.',
    type: 'error',
    isRead: false,
    createdAt: '2026-10-24T11:30:00Z',
    documentId: 'doc_david_passport'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log_01',
    userId: 'usr_amos_01',
    userName: 'Amos Tungaraza',
    userRole: 'user',
    action: 'Document Upload',
    details: 'Amos uploaded Official Birth Certificate – 29/10/2026 16:00',
    ipAddress: '192.168.1.42',
    timestamp: '2026-10-29T16:00:00Z'
  },
  {
    id: 'log_02',
    userId: 'usr_admin_sarah',
    userName: 'Sarah Jenkins',
    userRole: 'admin',
    action: 'Document Approval',
    details: 'Sarah Jenkins approved Bachelor of Science Degree Certificate for Amos Tungaraza',
    ipAddress: '10.0.0.15',
    timestamp: '2026-10-29T15:10:00Z'
  },
  {
    id: 'log_03',
    userId: 'usr_amos_01',
    userName: 'Amos Tungaraza',
    userRole: 'user',
    action: 'Document Upload',
    details: 'Amos uploaded Diploma Certificate – 29/10/2026 14:30',
    ipAddress: '192.168.1.42',
    timestamp: '2026-10-29T14:30:00Z'
  },
  {
    id: 'log_04',
    userId: 'usr_super_admin',
    userName: 'Dr. James Mwamba',
    userRole: 'super_admin',
    action: 'Document Rejection',
    details: 'Dr. James Mwamba rejected Passport for David Kim: "Image is not clear."',
    ipAddress: '10.0.0.1',
    timestamp: '2026-10-24T11:30:00Z'
  },
  {
    id: 'log_05',
    userId: 'usr_amos_01',
    userName: 'Amos Tungaraza',
    userRole: 'user',
    action: 'Profile Update',
    details: 'Amos updated personal address and emergency contact details',
    ipAddress: '192.168.1.42',
    timestamp: '2026-10-20T14:12:00Z'
  },
  {
    id: 'log_06',
    userId: 'usr_amos_01',
    userName: 'Amos Tungaraza',
    userRole: 'user',
    action: 'User Authentication',
    details: 'Amos logged into User Portal via secure session',
    ipAddress: '192.168.1.42',
    timestamp: '2026-10-30T08:15:00Z'
  }
];
