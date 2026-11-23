import { PricingTier } from '../types';

export const pricingTiers: PricingTier[] = [
  {
    id: 'essential-e-design',
    name: 'The Essential E-Design',
    price: 'Rs. 25,000',
    unit: 'per room',
    tagline: 'Digital design mastery delivered to your screen with curated sourcing',
    turnaround: '3 - 4 Weeks',
    bestFor: 'Clients who love our signature aesthetic and wish to manage their own local ordering and installation.',
    features: [
      'Comprehensive 1-on-1 virtual design consultation',
      'Precise 2D floor plans & furniture layout options',
      'High-resolution 3D photorealistic renderings (2 views/room)',
      'Digital interactive shopping list with exclusive designer trade discounts (15-25% off)',
      'Curated paint palette, wallpaper, & fabric swatch specifications',
      '2 rounds of collaborative design refinements',
      '30-day post-delivery email design support',
    ],
    deliverables: [
      'Interactive Digital Design Dossier (PDF & Web)',
      'Clickable Procurement Sheet with discount codes',
      'Styling Guide with step-by-step arrangement rules',
    ],
  },
  {
    id: 'signature-luxe',
    name: 'The Signature Luxe',
    price: 'Rs. 75,000',
    unit: 'per room',
    tagline: 'Turnkey full-service design, white-glove procurement, and on-site styling',
    isPopular: true,
    turnaround: '8 - 12 Weeks',
    bestFor: 'Discerning homeowners seeking a completely hands-off, five-star turnkey transformation.',
    features: [
      'All features included in Essential E-Design',
      'On-site laser measurements and architectural survey',
      'Custom bespoke millwork & cabinetry CAD shop drawings',
      'Physical tactile sample presentation box delivered to your home',
      'Full white-glove purchasing, receiving, damage inspection, & warehousing',
      'Direct coordination with general contractors, electricians, & painters',
      'Unlimited design revisions during concept phase',
      'Grand Reveal: Complete on-site staging and styling by our senior design team',
    ],
    deliverables: [
      'Full Architectural Spec Book & CAD Elevations',
      'White-Glove Delivery and Installation by Havenly Concierge',
      'Turnkey move-in ready reveal down to florals and bespoke scent',
    ],
  },
  {
    id: 'architectural-estate',
    name: 'The Architectural Estate',
    price: 'Rs. 1,50,000+',
    unit: 'custom project rate',
    tagline: 'Full residential architecture, structural renovations, and master curation',
    turnaround: '4 - 9 Months',
    bestFor: 'Historic renovations, luxury new builds, penthouses, and expansive multi-room estates.',
    features: [
      'All features included in Signature Luxe',
      'Whole-home architectural reconfiguration & interior permit drawings',
      'Custom one-of-a-kind furniture design fabricated by master artisans',
      'Private art advisory & gallery acquisition service',
      'Smart home automation, Lutron lighting, & acoustic engineering',
      'Dedicated Senior Project Director & Weekly On-Site Oversight',
      'International sourcing expeditions (Murano glass, French antiques, Italian marble)',
      'Lifetime archive of all finishes, replacement parts, & maintenance protocols',
    ],
    deliverables: [
      'Complete Permitted Architectural Drawing Sets',
      'Custom Bespoke Furniture Portfolio & Authenticity Certificates',
      'Dedicated Concierge Maintenance Manual',
    ],
  },
];

export const pricingFaqs = [
  {
    question: 'How do you calculate your design fees?',
    answer:
      'We believe in complete transparency. For single room transformations, we provide fixed flat fees so there are never surprises. For large-scale architectural gut-renovations, we offer hybrid pricing combining a fixed design documentation fee with a standard project management percentage.',
  },
  {
    question: 'Do you pass along your designer trade discounts?',
    answer:
      'Yes! Through our established relationships with world-class manufacturers and artisan ateliers, our clients receive access to designer-only discounts ranging from 15% to 35% off retail prices, frequently offsetting a substantial portion of our design fee.',
  },
  {
    question: 'Can you work with existing pieces of furniture or art we already own?',
    answer:
      'Absolutely. We celebrate personal heritage and meaningful collections. During our initial consultation, we audit your favorite heirlooms, artwork, and furniture, thoughtfully weaving them into the fresh design narrative.',
  },
  {
    question: 'What if I am outside of New York or London?',
    answer:
      'We routinely execute international projects. Our Essential E-Design service is available worldwide, while our Signature Luxe and Architectural Estate services include travel arrangements for in-person site visits and installation teams.',
  },
];
