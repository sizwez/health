
import React from 'react';
import { Doctor, PharmacyProduct } from './types';

export const DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Molefe',
    specialty: 'General Practitioner',
    location: 'Soweto, Johannesburg',
    rating: 4.8,
    consultationFee: 450,
    image: 'https://picsum.photos/seed/doc1/200/200',
    availability: ['09:00', '11:30', '14:00', '16:00']
  },
  {
    id: '2',
    name: 'Dr. Johan Pretorius',
    specialty: 'Pediatrician',
    location: 'Pretoria East',
    rating: 4.9,
    consultationFee: 650,
    image: 'https://picsum.photos/seed/doc2/200/200',
    availability: ['10:00', '12:00', '15:30']
  },
  {
    id: '3',
    name: 'Dr. Amina Pillay',
    specialty: 'Dermatologist',
    location: 'Durban North',
    rating: 4.7,
    consultationFee: 550,
    image: 'https://picsum.photos/seed/doc3/200/200',
    availability: ['08:30', '13:00', '16:30']
  }
];

export const PHARMACY_ITEMS: PharmacyProduct[] = [
  {
    id: 'p1',
    name: 'Panado Tablets 24s',
    category: 'OTC',
    price: 45.00,
    description: 'Relief of mild to moderate pain and fever.',
    image: 'https://picsum.photos/seed/med1/200/200'
  },
  {
    id: 'p2',
    name: 'Multivitamin Complex',
    category: 'Supplement',
    price: 185.50,
    description: 'Daily support for immune health and energy.',
    image: 'https://picsum.photos/seed/med2/200/200'
  },
  {
    id: 'p3',
    name: 'Hypertension Support Plus',
    category: 'Prescription',
    price: 320.00,
    description: 'Requires a valid prescription from a registered practitioner.',
    image: 'https://picsum.photos/seed/med3/200/200'
  }
];
