import { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'tribeca-penthouse',
    title: 'The Tribeca Loft Sanctuary',
    subtitle: 'Warm minimalism meets industrial heritage',
    category: 'Living',
    location: 'Tribeca, New York',
    year: '2025',
    area: '3,800 sq ft',
    description:
      'A harmonious reimagining of a historic cast-iron loft into an expansive, light-bathed urban haven. We balanced original Douglas fir timber beams and patinated brick with honed travertine slabs, curved boucle seating, and custom smoked-oak millwork.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    ],
    style: 'Warm Minimalism & Organic Modern',
    highlights: [
      'Fluted Roman travertine fireplace surround',
      'Acoustic micro-cement ceiling treatments',
      'Custom Belgian linen modular seating',
      'Integrated Lutron architectural circadian lighting',
    ],
    clientQuote: {
      text: 'Havenly transformed our raw industrial shell into the most calming, tactile sanctuary we have ever inhabited.',
      client: 'Julian & Claire Vance',
    },
  },
  {
    id: 'cotswolds-master-suite',
    title: 'The Cotswolds Master Retreat',
    subtitle: 'Quiet luxury layered with tactile natural wools & oak',
    category: 'Bedroom',
    location: 'Chipping Norton, Oxfordshire',
    year: '2024',
    area: '1,200 sq ft',
    description:
      'Designed to foster deep restoration, this primary suite embraces sensory calm. A floating platform bed in fumed European oak is framed by bespoke slatted headboard wall panelling with integrated warm alabaster sconces.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef1?auto=format&fit=crop&w=1200&q=85',
    ],
    style: 'Modern English Country & Japandi',
    highlights: [
      'Bespoke walk-in wardrobe with smoked glass and cedar interiors',
      'Hand-loomed organic wool carpets from Scotland',
      'Automated blackout drapery concealed in ceiling coves',
      'Private sitting nook with fireplace and curated reading library',
    ],
    clientQuote: {
      text: 'Every morning feels like waking up in a private boutique resort in the hills.',
      client: 'Eleanor Sterling',
    },
  },
  {
    id: 'bel-air-culinary-atelier',
    title: 'The Bel-Air Culinary Pavilion',
    subtitle: 'Monolithic quartzite and brushed bronze cabinetry',
    category: 'Kitchen',
    location: 'Bel-Air, Los Angeles',
    year: '2025',
    area: '1,650 sq ft',
    description:
      'A masterclass in culinary elegance and entertaining functionality. Centered around a 14-foot monolithic Taj Mahal quartzite island with waterfall edges, paired with bespoke rift-sawn walnut joinery and concealed Gaggenau 400 Series appliances.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85',
    ],
    style: 'Contemporary Sculptural Luxe',
    highlights: [
      '14-foot Taj Mahal quartzite island with integrated brass bar',
      'Concealed butler pantry with secondary prep kitchen',
      'Handmade terracotta zellige splashback in subtle ivory',
      'Custom wine cellar displaying 400 vintages behind climate glass',
    ],
    clientQuote: {
      text: 'Cooking and entertaining has become an art form in this kitchen. The craftsmanship is flawless.',
      client: 'Chef Marcus & Dr. Nina Chen',
    },
  },
  {
    id: 'kyoto-inspired-spa-bath',
    title: 'The Kyoto-Inspired Wet Sanctuary',
    subtitle: 'Limestone microcement, Hinoki wood, and brushed brass',
    category: 'Bathroom',
    location: 'Aspen, Colorado',
    year: '2024',
    area: '680 sq ft',
    description:
      'Drawing from Japanese Onsen rituals, this master bath features a freestanding honed volcanic limestone soaking tub set before a floor-to-ceiling glass wall framing aspen pines. A double rain shower with steam system creates a private wellness retreat.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=85',
    ],
    style: 'Japandi Spa Wellness',
    highlights: [
      'Freestanding matte limestone tub with floor-mounted brass spout',
      'Frameless steam shower with aromatherapy & chromotherapy',
      'Floating vanity in reclaimed teak with recessed LED reveals',
      'Heated basalt tile floors with multi-zone digital thermostats',
    ],
    clientQuote: {
      text: 'The bath transports me into pure tranquility at the end of every demanding day.',
      client: 'Sophia Langdon',
    },
  },
  {
    id: 'mayfair-executive-study',
    title: 'The Mayfair Executive Library',
    subtitle: 'Bespoke burr walnut, saddlery leather, and bronze accents',
    category: 'Office',
    location: 'Mayfair, London',
    year: '2025',
    area: '920 sq ft',
    description:
      'Created for an international private equity founder, this home office commands presence while remaining intimate. Floor-to-ceiling bookcase millwork with brass ladder rails surrounds an iconic executive desk in fumed eucalyptus and cognac saddle leather.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
    ],
    style: 'Modern Classic Gentleman Luxury',
    highlights: [
      'Acoustically isolated walls finished in raw raw-silk wallcovering',
      'Concealed teleconference technology and high-definition video array',
      'Private bar alcove hidden within bespoke panelling',
      'Vintage mid-century lounge chairs reupholstered in Dedar velvet',
    ],
    clientQuote: {
      text: 'Our clients and global partners are continually mesmerized during video meetings and visits.',
      client: 'Alastair Montgomery',
    },
  },
  {
    id: 'palm-springs-modern-villa',
    title: 'The Palm Springs Desert Villa',
    subtitle: 'Seamless indoor-outdoor living with travertine & linen',
    category: 'Full Home',
    location: 'Palm Springs, California',
    year: '2024',
    area: '5,400 sq ft',
    description:
      'A full residential turnkey transformation celebrating mid-century architectural purity and organic desert tones. Pocket glass doors disappear into walls to connect the grand living salon to an olive-tree courtyard with water mirrors.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    ],
    style: 'Desert Organic Modernism',
    highlights: [
      'Continuous honed travertine flooring extending onto pool terrace',
      'Custom low-slung linen sectional seating 14 guests',
      'Integrated solar thermal shading and smart climate management',
      'Curated sculpture collection commissioned specifically for the site',
    ],
    clientQuote: {
      text: 'Havenly managed everything from architectural permits to the crystal wine glasses on move-in day.',
      client: 'Victoria & Mateo Morales',
    },
  },
];
