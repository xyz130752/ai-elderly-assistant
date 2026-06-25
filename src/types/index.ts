export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'ELDER' | 'PARENT';
  avatar?: string;
  membership: 'FREE' | 'BASIC' | 'PREMIUM' | 'FAMILY';
}

export interface ElderProfile {
  id: string;
  userId: string;
  age?: number;
  address?: string;
  hospital?: string;
  bloodType?: string;
  allergies?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  times: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  userId: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'PENDING' | 'TAKEN' | 'MISSED' | 'SKIPPED';
  date: string;
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  userId: string;
  type: 'CHECKUP' | 'DAILY' | 'CONSULT' | 'PRESCRIPTION';
  title: string;
  content: Record<string, any>;
  aiAnalysis?: string;
  fileUrl?: string;
  createdAt: string;
}

export interface VoiceLog {
  id: string;
  userId: string;
  transcript: string;
  intent: string;
  response: string;
  tokenUsage: number;
  createdAt: string;
}

export interface Alert {
  id: string;
  userId: string;
  parentId: string;
  type: 'SCAM_DETECTED' | 'SUSPICIOUS_CALL' | 'HEALTH_EMERGENCY' | 'MEDICATION_MISSED' | 'LOW_ACTIVITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface WeatherInfo {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind: string;
  suggestion: string;
}

export interface HospitalInfo {
  id: string;
  name: string;
  address: string;
  distance: string;
  departments: string[];
  rating: number;
}
