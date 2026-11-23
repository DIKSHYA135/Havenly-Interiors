export type Page =
  | 'home'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'pricing'
  | 'calculator'
  | 'consultation'
  | 'blog'
  | 'contact'
  | 'reviews';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'Living' | 'Bedroom' | 'Kitchen' | 'Bathroom' | 'Office' | 'Full Home';
  location: string;
  year: string;
  area: string;
  description: string;
  image: string;
  gallery: string[];
  style: string;
  highlights: string[];
  clientQuote?: {
    text: string;
    client: string;
  };
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  inclusions: string[];
  deliverables: string[];
  idealFor: string;
  image: string;
  estimatedTimeline: string;
  startingPrice: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  unit: string;
  tagline: string;
  isPopular?: boolean;
  features: string[];
  deliverables: string[];
  turnaround: string;
  bestFor: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  location: string;
  projectTitle: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
  projectImage: string;
  verified: boolean;
  beforeAfter?: {
    before: string;
    after: string;
    notes: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  category: 'Trends' | 'Styling Tips' | 'Color Theory' | 'Architecture' | 'Sustainable Luxe';
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  coverImage: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  credentials: string;
  favoriteStyle: string;
}

export interface ConsultationFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  projectType: string;
  rooms: string[];
  budgetBracket: string;
  preferredStyle: string;
  consultationMode: string;
  preferredDate: string;
  preferredTime?: string;
  notes: string;
}

export interface CalculatorState {
  rooms: string[];
  sqft: number;
  tier: 'contemporary' | 'signature' | 'haute';
  addOns: string[];
}
