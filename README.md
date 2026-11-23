# Havenly Interiors — Luxury Interior Design & Architecture Website

A luxury, high-end interior design and architectural practice website built with **React**, **TypeScript**, and **Vite**.

Designed with a warm modern luxury aesthetic:
- **Palette:** Cream (`#FBF9F5`), warm beige, rich cognac brown (`#966A3D`), soft alabaster whites, and deep architectural charcoal.
- **Typography:** *Cormorant Garamond* (editorial serif headings) + *Plus Jakarta Sans* (clean modern UI).

---

## 🏛️ Pages & Features Included

1. **Homepage:**
   - Large hero showcase with headline, badges, and primary consultation CTAs.
   - Quick studio statistics bar (16+ Years, 480+ Homes, 24 Design Awards).
   - Studio manifesto on *Tactile Serenity*.
   - Curated portfolio preview cards.
   - Interactive Before & After transformation slider.
   - The Bespoke 4-Step Methodology.
   - Budget Calculator teaser banner & client review highlight.

2. **About Us Page (`/about`):**
   - The Havenly Atelier genesis and origin story.
   - The 4 Design Pillars (Sensory Material Honesty, Acoustic Calm, Circadian Light, Financial Transparency).
   - Master Designer Profiles (founders, architects, lighting specialists).
   - Accolades & Press features (Architectural Digest AD100, Elle Decor, Vogue Living).

3. **Services Page (`/services`):**
   - Room-by-room disciplines:
     - Living Room & Salon Sanctuaries
     - Master Suites & Bed Chambers
     - Culinary Architecture & Chef Kitchens
     - Spa Bathrooms & En-Suites
     - Executive Offices & Creative Studios
   - Deliverables breakdown, scope, starting fees, and timeline estimates.
   - White-glove concierge add-ons (Private Art Advisory, Custom Scent Branding, Wardrobe Archiving).

4. **Portfolio Gallery (`/portfolio`):**
   - Interactive category filter (All, Living, Bedroom, Kitchen, Bathroom, Office, Full Home).
   - Real-time search by city, style, or stone material.
   - **Interactive Case Study Modal:** Click any project to open a high-res lightbox with architectural brief, materials used, gallery photos, and direct consultation trigger.

5. **Pricing Packages (`/pricing`):**
   - 3 transparent packages: *The Essential E-Design*, *The Signature Luxe (Most Popular)*, and *The Architectural Estate*.
   - Comprehensive feature comparison matrix table.
   - Interactive pricing FAQ accordion.

6. **Interactive Budget Calculator (`/calculator`):**
   - Interactive multi-room selector (Living room, bedroom, kitchen, bathroom, office, etc.).
   - Square footage slider (300 to 6,000+ sq ft).
   - Craftsmanship tier selection (Contemporary, Signature Luxury, Haute Couture).
   - Architectural enhancements toggle (Millwork, Circadian Lighting, Micro-Cement, VR Walkthrough).
   - Dynamic real-time calculation showing furnishing budget, design fee, add-ons, and designer trade discount savings.
   - "Book Consultation With This Estimate" button that pre-populates the booking form.
   - "Copy Estimate Summary" to clipboard.

7. **Consultation Booking System:**
   - Dedicated Consultation page (`/consultation`) and global pop-up modal (`BookingModal`).
   - Real-time form validation (Name, email format, phone, city, room choices, date picker).
   - Appointment confirmation screen with unique reference number (e.g. `HAV-892104`).

8. **Customer Reviews (`/reviews`):**
   - Verified patron testimonials with 5-star ratings, locations, and roles.
   - Interactive Before & After transformation spotlight slider.

9. **The Havenly Journal / Blog (`/blog`):**
   - Editorial articles on Quiet Luxury, Tactile Layering, Natural Stone selection, and Circadian Lighting.
   - Category filtering and search.
   - Immersive reading modal (`ArticleModal`).

10. **Contact Page (`/contact`):**
    - 3 flagship studio ateliers: New York (Tribeca), London (Mayfair), Los Angeles (Beverly Hills) with addresses, hours, and direct lines.
    - Direct inquiry message form with real-time validation and confirmation receipt.

11. **Responsive Navigation & Global Elements:**
    - Sticky glassmorphism header with active indicators.
    - Mobile sliding drawer navigation.
    - Persistent floating quick-action buttons.
    - Safe image loader with graceful fallback so photos never break.

---

## 🚀 How to Run the Website Locally (Beginner Friendly)

### 1. Open your terminal in this project folder:
```bash
cd "/Users/dikshyashreesh/Desktop/Havenly interior"
```

### 2. Start the local development server:
```bash
npm run dev
```

### 3. Open your browser:
Open your web browser (Chrome, Safari, Firefox, or Edge) and navigate to the address shown in your terminal (typically):
```
http://localhost:5173/
```
*(If port 5173 is already in use by another program, Vite will automatically select `http://localhost:5174/`)*.

### 4. Build for production (optional):
To test the production build:
```bash
npm run build
```
This checks all TypeScript types and generates an optimized bundle in the `dist/` directory.
