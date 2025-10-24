export interface Course {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  features: string[];
}

export interface Instructor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  bio: string;
}

export interface Enrollment {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  course_id: number;
  message: string;
  status: string;
  created_at: string;
}

export const API_URL = 'https://functions.poehali.dev/b0d7aa51-2c0f-4f88-bd58-959eec7781db';
export const ADMIN_PASSWORD = 'AutoProfi2024!';
