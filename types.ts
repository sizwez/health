
export interface UserProfile {
  name: string;
  province: string;
  age?: number;
  onboarded: boolean;
  subscription: 'Free' | 'Premium';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  consultationFee: number;
  image: string;
  availability: string[];
}

export interface PharmacyProduct {
  id: string;
  name: string;
  category: 'Prescription' | 'OTC' | 'Supplement' | 'Wellness';
  price: number;
  image: string;
  description: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  TRIAGE = 'triage',
  TELEMEDICINE = 'telemedicine',
  PHARMACY = 'pharmacy',
  FITNESS = 'fitness',
  PROFILE = 'profile'
}

export interface FitnessPlan {
  workout: string[];
  nutrition: string[];
  advice: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface HealthReading {
  type: 'BP' | 'Weight' | 'Glucose';
  value: string;
  date: string;
}
