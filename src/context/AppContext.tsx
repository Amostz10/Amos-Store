import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserAccount,
  UserDocument,
  SystemNotification,
  ActivityLog,
  SystemSettings,
  FeatureFlags,
  RolePermission,
  DocumentStatus,
  UserStatus,
  UserRole,
  UserProfile
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_SETTINGS,
  INITIAL_FEATURES,
  INITIAL_ROLE_PERMISSIONS
} from '../data/mockData';

interface AppContextType {
  currentUser: UserAccount | null;
  activeRole: UserRole;
  portalView: 'user' | 'admin';
  userTab: 'dashboard' | 'profile' | 'documents' | 'certificates' | 'notifications' | 'activity' | 'digital_id' | 'settings';
  adminTab: 'dashboard' | 'users' | 'documents' | 'administrators' | 'roles' | 'reports' | 'activities' | 'features' | 'settings' | 'backup';
  isMobileFrameView: boolean;
  showSplash: boolean;
  users: UserAccount[];
  documents: UserDocument[];
  notifications: SystemNotification[];
  activityLogs: ActivityLog[];
  settings: SystemSettings;
  features: FeatureFlags;
  rolePermissions: RolePermission[];
  
  // Navigation & View actions
  setPortalView: (view: 'user' | 'admin') => void;
  setUserTab: (tab: AppContextType['userTab']) => void;
  setAdminTab: (tab: AppContextType['adminTab']) => void;
  setIsMobileFrameView: (val: boolean | ((prev: boolean) => boolean)) => void;
  triggerSplash: () => void;
  dismissSplash: () => void;
  
  // Auth actions
  loginAs: (userId: string) => void;
  logout: () => void;
  loginWithCredentials: (identifier: string, pass: string) => { success: boolean; message: string };
  registerNewUser: (formData: any) => { success: boolean; message: string };
  
  // User Actions
  updateUserProfile: (userId: string, profile: Partial<UserProfile>) => void;
  calculateProfileCompletion: (user: UserAccount) => number;
  uploadDocument: (docData: Omit<UserDocument, 'id' | 'uploadedAt' | 'status'>) => void;
  deleteDocument: (docId: string) => void;
  
  // Admin Actions
  updateDocumentStatus: (docId: string, status: DocumentStatus, reason?: string) => void;
  setUserAccountStatus: (userId: string, status: UserStatus) => void;
  updateUserAccount: (userId: string, partial: Partial<UserAccount>) => void;
  addNewUserByAdmin: (user: {
    username?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
    profile: Partial<UserProfile> & { fullName: string };
  }) => void;
  deleteUserAccount: (userId: string) => void;
  resetUserPassword: (userId: string) => string;
  updateRolePermission: (role: UserRole, permissionKey: keyof RolePermission['permissions'], value: boolean) => void;
  
  // Notifications & Logs
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  logActivity: (action: string, details: string, role?: UserRole) => void;
  
  // Settings & Features
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  toggleFeature: (featureKey: keyof FeatureFlags) => void;
  
  // Modals & Viewers
  selectedDocForView: UserDocument | null;
  setSelectedDocForView: (doc: UserDocument | null) => void;
  selectedDocForReview: UserDocument | null;
  setSelectedDocForReview: (doc: UserDocument | null) => void;
  showDigitalId: boolean;
  setShowDigitalId: (show: boolean) => void;
  
  // Backup
  exportBackup: () => string;
  importBackup: (jsonString: string) => { success: boolean; message: string };
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'amos_store_data_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial mock data
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash initially once
    return sessionStorage.getItem('amos_splash_seen') !== 'true';
  });

  const [isMobileFrameView, setIsMobileFrameView] = useState<boolean>(() => {
    // If desktop screen, default to mobile frame preview toggle available
    return window.innerWidth > 768;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const savedUserId = localStorage.getItem(`${STORAGE_KEY}_current_user_id`);
    if (savedUserId) {
      const found = users.find(u => u.id === savedUserId);
      if (found) return found;
    }
    return INITIAL_USERS[0]; // Default to Amos Tungaraza
  });

  const [portalView, setPortalView] = useState<'user' | 'admin'>(() => {
    if (currentUser?.role === 'super_admin' || currentUser?.role === 'admin' || currentUser?.role === 'staff') {
      return 'admin';
    }
    return 'user';
  });

  const [userTab, setUserTab] = useState<AppContextType['userTab']>('dashboard');
  const [adminTab, setAdminTab] = useState<AppContextType['adminTab']>('dashboard');

  const [documents, setDocuments] = useState<UserDocument[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_documents`);
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [features, setFeatures] = useState<FeatureFlags>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_features`);
    return saved ? JSON.parse(saved) : INITIAL_FEATURES;
  });

  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_role_perms`);
    return saved ? JSON.parse(saved) : INITIAL_ROLE_PERMISSIONS;
  });

  const [selectedDocForView, setSelectedDocForView] = useState<UserDocument | null>(null);
  const [selectedDocForReview, setSelectedDocForReview] = useState<UserDocument | null>(null);
  const [showDigitalId, setShowDigitalId] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_documents`, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_features`, JSON.stringify(features));
  }, [features]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_role_perms`, JSON.stringify(rolePermissions));
  }, [rolePermissions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_current_user_id`, currentUser.id);
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_current_user_id`);
    }
  }, [currentUser]);

  const activeRole: UserRole = currentUser?.role || 'user';

  const triggerSplash = () => {
    setShowSplash(true);
  };

  const dismissSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem('amos_splash_seen', 'true');
  };

  const logActivity = (action: string, details: string, overrideRole?: UserRole) => {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser?.id || 'sys_guest',
      userName: currentUser?.profile.fullName || 'Guest / System',
      userRole: overrideRole || currentUser?.role || 'user',
      action,
      details,
      ipAddress: '192.168.1.100',
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const loginAs = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      logActivity('User Authentication', `${target.profile.fullName} logged in as ${target.role}`);
      if (target.role === 'super_admin' || target.role === 'admin' || target.role === 'staff') {
        setPortalView('admin');
        setAdminTab('dashboard');
      } else {
        setPortalView('user');
        setUserTab('dashboard');
      }
    }
  };

  const logout = () => {
    if (currentUser) {
      logActivity('User Logout', `${currentUser.profile.fullName} securely logged out`);
    }
    setCurrentUser(null);
  };

  const loginWithCredentials = (identifier: string, pass: string): { success: boolean; message: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const user = users.find(
      u => u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId
    );
    if (!user) {
      return { success: false, message: 'Invalid credentials. User not found.' };
    }
    if (user.status === 'suspended') {
      return { success: false, message: 'This account has been suspended by an administrator.' };
    }
    if (user.status === 'inactive') {
      return { success: false, message: 'This account is currently inactive. Contact support.' };
    }
    if (!pass || pass.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    setCurrentUser(user);
    logActivity('User Authentication', `${user.profile.fullName} authenticated successfully`);

    if (user.role === 'super_admin' || user.role === 'admin' || user.role === 'staff') {
      setPortalView('admin');
      setAdminTab('dashboard');
    } else {
      setPortalView('user');
      setUserTab('dashboard');
    }

    return { success: true, message: 'Welcome back!' };
  };

  const registerNewUser = (formData: any): { success: boolean; message: string } => {
    if (!features.userRegistration) {
      return { success: false, message: 'New user registration is currently disabled by administrator.' };
    }

    const email = formData.email?.trim().toLowerCase();
    const username = formData.username?.trim().toLowerCase();

    if (!email || !username || !formData.fullName) {
      return { success: false, message: 'Please complete all required fields.' };
    }

    const exists = users.some(u => u.email.toLowerCase() === email || u.username.toLowerCase() === username);
    if (exists) {
      return { success: false, message: 'An account with this email or username already exists.' };
    }

    const newId = `usr_${Date.now()}`;
    const newUser: UserAccount = {
      id: newId,
      username,
      email,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      profile: {
        fullName: formData.fullName,
        username,
        email,
        phone: formData.phone || '',
        altPhone: formData.altPhone || '',
        gender: formData.gender || 'Male',
        dateOfBirth: formData.dateOfBirth || '2000-01-01',
        address: formData.address || '',
        region: formData.region || '',
        district: formData.district || '',
        country: formData.country || 'Tanzania',
        occupation: formData.occupation || 'Professional',
        educationLevel: formData.educationLevel || 'Degree',
        institution: formData.institution || 'University',
        emergencyContact: {
          name: formData.emergencyName || '',
          relationship: formData.emergencyRel || 'Relative',
          phone: formData.emergencyPhone || ''
        },
        profilePhotoUrl: AMOS_EMBLEM_URL,
        bio: 'New member at Amos Store Information & Document Vault.'
      }
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setPortalView('user');
    setUserTab('dashboard');

    logActivity('User Registration', `New user registered: ${newUser.profile.fullName} (${newUser.email})`);

    // Add welcome notification
    const welcomeNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      userId: newId,
      title: 'Welcome to Amos Store!',
      message: 'Your account is active. Complete your personal profile and upload your certificates to get verified.',
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [welcomeNotif, ...prev]);

    return { success: true, message: 'Account registered successfully.' };
  };

  const calculateProfileCompletion = (user: UserAccount): number => {
    const p = user.profile;
    const checks = [
      Boolean(p.fullName),
      Boolean(p.username),
      Boolean(p.email),
      Boolean(p.phone),
      Boolean(p.altPhone),
      Boolean(p.gender),
      Boolean(p.dateOfBirth),
      Boolean(p.address),
      Boolean(p.region && p.district),
      Boolean(p.country),
      Boolean(p.occupation),
      Boolean(p.educationLevel),
      Boolean(p.institution),
      Boolean(p.emergencyContact?.name && p.emergencyContact?.phone),
      Boolean(p.profilePhotoUrl)
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  };

  const updateUserProfile = (userId: string, updatedProfile: Partial<UserProfile>) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updated = {
            ...u,
            profile: { ...u.profile, ...updatedProfile },
            updatedAt: new Date().toISOString()
          };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    logActivity('Profile Update', `User updated personal profile information`);
  };

  const uploadDocument = (docData: Omit<UserDocument, 'id' | 'uploadedAt' | 'status'>) => {
    const newDoc: UserDocument = {
      ...docData,
      id: `doc_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      status: 'pending'
    };

    setDocuments(prev => [newDoc, ...prev]);

    logActivity('Document Upload', `${docData.userFullName} uploaded ${docData.documentName} – ${new Date().toLocaleDateString()}`);

    // Create system notification for user
    const userNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      userId: docData.userId,
      title: 'Document Uploaded Successfully',
      message: `${docData.documentName} is queued for review by Amos Store administrators.`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString(),
      documentId: newDoc.id
    };
    setNotifications(prev => [userNotif, ...prev]);
  };

  const deleteDocument = (docId: string) => {
    const target = documents.find(d => d.id === docId);
    if (!target) return;
    setDocuments(prev => prev.filter(d => d.id !== docId));
    logActivity('Document Deletion', `${currentUser?.profile.fullName} deleted document ${target.documentName}`);
  };

  const updateDocumentStatus = (docId: string, status: DocumentStatus, reason?: string) => {
    const target = documents.find(d => d.id === docId);
    if (!target) return;

    setDocuments(prev =>
      prev.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            status,
            rejectionReason: reason || (status === 'approved' ? undefined : d.rejectionReason),
            reviewedAt: new Date().toISOString(),
            reviewedBy: currentUser?.profile.fullName || 'Administrator'
          };
        }
        return d;
      })
    );

    const statusTitleMap: Record<DocumentStatus, string> = {
      approved: 'Document Approved!',
      rejected: 'Document Rejected',
      requires_correction: 'Correction Required',
      pending: 'Document Under Review'
    };

    const notifTypeMap: Record<DocumentStatus, SystemNotification['type']> = {
      approved: 'success',
      rejected: 'error',
      requires_correction: 'warning',
      pending: 'info'
    };

    const notifMessage = status === 'approved'
      ? `Your document "${target.documentName}" was reviewed and approved.`
      : status === 'rejected'
      ? `Your document "${target.documentName}" was rejected. Reason: ${reason || 'Does not satisfy validation requirements.'}`
      : `Your document "${target.documentName}" requires correction: ${reason || 'Please review and resubmit.'}`;

    // Add user notification
    const userNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      userId: target.userId,
      title: statusTitleMap[status],
      message: notifMessage,
      type: notifTypeMap[status],
      isRead: false,
      createdAt: new Date().toISOString(),
      documentId: docId
    };
    setNotifications(prev => [userNotif, ...prev]);

    logActivity(
      status === 'approved' ? 'Document Approval' : status === 'rejected' ? 'Document Rejection' : 'Document Review',
      `${currentUser?.profile.fullName} marked "${target.documentName}" as ${status.toUpperCase()} for ${target.userFullName}${reason ? ` (${reason})` : ''}`
    );
  };

  const setUserAccountStatus = (userId: string, status: UserStatus) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status, updatedAt: new Date().toISOString() } : u))
    );
    const target = users.find(u => u.id === userId);
    logActivity('User Status Change', `Admin updated status of ${target?.profile.fullName} to ${status}`);
  };

  const updateUserAccount = (userId: string, partial: Partial<UserAccount>) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updated = { ...u, ...partial, updatedAt: new Date().toISOString() };
          if (currentUser?.id === userId) setCurrentUser(updated);
          return updated;
        }
        return u;
      })
    );
  };

  const addNewUserByAdmin = (user: {
    username?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
    profile: Partial<UserProfile> & { fullName: string };
  }) => {
    const newId = `usr_${Date.now()}`;
    const newUser: UserAccount = {
      id: newId,
      username: user.username || `user_${Date.now().toString().slice(-4)}`,
      email: user.email || 'user@amosstore.io',
      role: user.role || 'user',
      status: user.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        fullName: user.profile.fullName || 'New Amos User',
        username: user.username || `user_${Date.now().toString().slice(-4)}`,
        email: user.email || 'user@amosstore.io',
        phone: user.profile.phone || '+1 (555) 000-0000',
        gender: user.profile.gender || 'Male',
        dateOfBirth: user.profile.dateOfBirth || '1995-01-01',
        address: user.profile.address || 'Central City',
        region: user.profile.region || 'Region 1',
        district: user.profile.district || 'District A',
        country: user.profile.country || 'United States',
        occupation: user.profile.occupation || 'Consultant',
        educationLevel: user.profile.educationLevel || 'Graduate',
        institution: user.profile.institution || 'State University',
        emergencyContact: {
          name: user.profile.emergencyContact?.name || 'Contact Person',
          relationship: user.profile.emergencyContact?.relationship || 'Family',
          phone: user.profile.emergencyContact?.phone || '+1 (555) 111-2222'
        },
        profilePhotoUrl: user.profile.profilePhotoUrl || AMOS_EMBLEM_URL,
        bio: user.profile.bio || 'Created by Administrator in Amos Store.'
      }
    };

    setUsers(prev => [newUser, ...prev]);
    logActivity('User Creation', `Administrator created account for ${newUser.profile.fullName} (${newUser.role})`);
  };

  const deleteUserAccount = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    setUsers(prev => prev.filter(u => u.id !== userId));
    setDocuments(prev => prev.filter(d => d.userId !== userId));
    logActivity('User Deletion', `Administrator removed account for ${target.profile.fullName}`);
  };

  const resetUserPassword = (userId: string): string => {
    const tempPass = `Amos#${Math.floor(1000 + Math.random() * 9000)}`;
    logActivity('Password Reset', `Password reset token generated for user ID: ${userId}`);
    return tempPass;
  };

  const updateRolePermission = (role: UserRole, permissionKey: keyof RolePermission['permissions'], value: boolean) => {
    setRolePermissions(prev =>
      prev.map(rp => {
        if (rp.role === role) {
          return {
            ...rp,
            permissions: {
              ...rp.permissions,
              [permissionKey]: value
            }
          };
        }
        return rp;
      })
    );
    logActivity('Role Permissions Updated', `Permissions updated for ${role} role: ${String(permissionKey)} = ${value}`);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications(prev =>
      prev.map(n => (n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logActivity('System Settings', `System settings updated by ${currentUser?.profile.fullName}`);
  };

  const toggleFeature = (featureKey: keyof FeatureFlags) => {
    setFeatures(prev => {
      const nextVal = !prev[featureKey];
      logActivity('Feature Management', `Feature "${featureKey}" toggled to ${nextVal ? 'ON' : 'OFF'}`);
      return {
        ...prev,
        [featureKey]: nextVal
      };
    });
  };

  const exportBackup = (): string => {
    const backupData = {
      system: 'Amos Store Personal Information & Document Vault',
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser?.profile.fullName,
      settings,
      features,
      rolePermissions,
      users,
      documents,
      notifications,
      activityLogs
    };
    logActivity('System Backup', `Full system database backup exported by ${currentUser?.profile.fullName}`);
    return JSON.stringify(backupData, null, 2);
  };

  const importBackup = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.users || !parsed.documents || !parsed.settings) {
        return { success: false, message: 'Invalid backup structure. Missing required database entities.' };
      }
      setUsers(parsed.users);
      setDocuments(parsed.documents);
      setSettings(parsed.settings);
      if (parsed.features) setFeatures(parsed.features);
      if (parsed.rolePermissions) setRolePermissions(parsed.rolePermissions);
      if (parsed.activityLogs) setActivityLogs(parsed.activityLogs);
      if (parsed.notifications) setNotifications(parsed.notifications);

      logActivity('System Restore', `System restored from external JSON backup snapshot`);
      return { success: true, message: 'Database backup restored successfully.' };
    } catch (e: any) {
      return { success: false, message: `Failed to parse backup JSON: ${e.message}` };
    }
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setDocuments(INITIAL_DOCUMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setSettings(INITIAL_SETTINGS);
    setFeatures(INITIAL_FEATURES);
    setRolePermissions(INITIAL_ROLE_PERMISSIONS);
    setCurrentUser(INITIAL_USERS[0]);
    setPortalView('user');
    setUserTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        portalView,
        userTab,
        adminTab,
        isMobileFrameView,
        showSplash,
        users,
        documents,
        notifications,
        activityLogs,
        settings,
        features,
        rolePermissions,
        setPortalView,
        setUserTab,
        setAdminTab,
        setIsMobileFrameView,
        triggerSplash,
        dismissSplash,
        loginAs,
        logout,
        loginWithCredentials,
        registerNewUser,
        updateUserProfile,
        calculateProfileCompletion,
        uploadDocument,
        deleteDocument,
        updateDocumentStatus,
        setUserAccountStatus,
        updateUserAccount,
        addNewUserByAdmin,
        deleteUserAccount,
        resetUserPassword,
        updateRolePermission,
        markNotificationRead,
        markAllNotificationsRead,
        logActivity,
        updateSettings,
        toggleFeature,
        selectedDocForView,
        setSelectedDocForView,
        selectedDocForReview,
        setSelectedDocForReview,
        showDigitalId,
        setShowDigitalId,
        exportBackup,
        importBackup,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
