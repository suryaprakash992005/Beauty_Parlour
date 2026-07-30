import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, Calendar, Phone, ArrowRight, HelpCircle, ChevronDown } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import '../styles/services.css';

interface ServiceDetailData {
  slug: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  heroImage: string;
  tagline: string;
  description: string;
  priceRange: string;
  duration: string;
  features: string[];
  whyUs: string[];
  processSteps: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  relatedServices: { slug: string; name: string }[];
}

export const SERVICES_DATA: Record<string, ServiceDetailData> = {
  'hair-spa': {
    slug: 'hair-spa',
    name: 'Hair Spa Treatment',
    seoTitle: 'Hair Spa Treatment in Mohanur | Deep Nourishment | ZHA Salon',
    seoDescription: 'Revitalize your hair with luxury Hair Spa treatment in Mohanur, Namakkal. Deep conditioning, anti-dandruff care, hair fall control & scalp massage. Book now!',
    heroImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80',
    tagline: 'Deep Conditioning & Scalp Revitalization in Mohanur',
    description: 'Transform dry, damaged hair into soft, silky locks with our premium Hair Spa treatments at ZHA Aesthetic Salon in Mohanur. Our expert stylists combine nutrient-rich creams with therapeutic scalp massage to boost blood circulation and restore hair vitality.',
    priceRange: 'Starting at ₹599',
    duration: '45 - 60 Mins',
    features: [
      'Intense Moisture & Hydration Retention',
      'Scalp Detox & Dandruff Elimination',
      'Hair Fall Reduction & Follicle Strengthening',
      'Relaxing Therapeutic Head & Neck Massage',
      'Protection Against Heat & Environmental Damage'
    ],
    whyUs: [
      'Certified Hair Care Specialists with over 10 years experience',
      'Exclusive usage of premium ammonia-free & organic products',
      'Private, hygienic spa environment in the heart of Mohanur',
      'Customized hair diagnosis before every treatment session'
    ],
    processSteps: [
      { title: '1. Hair & Scalp Analysis', desc: 'Our stylist inspects your scalp texture, moisture levels, and porosity to select the ideal hair mask.' },
      { title: '2. Deep Cleansing Shampoo', desc: 'Washing away impurities and product buildup with a gentle sulphate-free cleanser.' },
      { title: '3. Cream Application & Massage', desc: 'Applying intense nourishment cream lock by lock followed by a 20-minute acupressure head massage.' },
      { title: '4. Micro-Steam Treatment', desc: 'Gentle warmth opens hair cuticles, allowing deep absorption of essential oils and proteins.' },
      { title: '5. Rinse & Blow Dry Styling', desc: 'Rinsing with cool water to seal cuticles and finishing with lightweight serum and blow dry.' }
    ],
    faqs: [
      { question: 'How often should I get a Hair Spa in Mohanur?', answer: 'For best results, we recommend getting a Hair Spa treatment every 3 to 4 weeks. If you suffer from severe dryness, hair fall, or chemically treated hair, bi-weekly sessions are ideal.' },
      { question: 'Can I get a Hair Spa after hair colouring?', answer: 'Yes! Hair Spa is highly recommended after colouring as it restores lost moisture and locks in vibrant pigment.' },
      { question: 'Where is ZHA Aesthetic Salon located in Mohanur?', answer: 'We are located at 1st floor, MPS Traders Building, opposite to Taluka Office, Nehru Nagar, Mohanur, Namakkal.' }
    ],
    relatedServices: [
      { slug: 'keratin-treatment', name: 'Keratin Treatment' },
      { slug: 'hair-colour', name: 'Hair Colouring & Highlights' },
      { slug: 'facials', name: 'Luxury Facials' }
    ]
  },
  'bridal-makeup': {
    slug: 'bridal-makeup',
    name: 'HD & Airbrush Bridal Makeup',
    seoTitle: 'Bridal Makeup in Mohanur | HD & Airbrush Packages | ZHA Salon',
    seoDescription: 'Look picture-perfect on your wedding day with HD & Airbrush Bridal Makeup in Mohanur, Namakkal. Includes hair styling, saree draping & pre-bridal care. Book trial!',
    heroImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=80',
    tagline: 'Celebrity-Grade HD & Airbrush Bridal Artistry in Mohanur',
    description: 'Your wedding day deserves nothing less than perfection. At ZHA Aesthetic Salon Mohanur, our senior bridal makeup artists specialize in long-lasting HD and Airbrush bridal makeup tailored to match your skin tone, outfit, and personal vision.',
    priceRange: 'Custom Bridal Packages Available',
    duration: '3 - 4 Hours',
    features: [
      'High-Definition (HD) & Airbrush Waterproof Base',
      'Customized Eye Makeup & Premium False Lashes',
      'Traditional & Contemporary Hair Styling',
      'Saree & Dupatta Pleating & Draping',
      'Pre-Bridal Skin Alignment & Hydration Trial'
    ],
    whyUs: [
      'Top-rated bridal studio in Mohanur with hundreds of happy brides',
      'Premium international brands (MAC, Bobbi Brown, Huda Beauty, NARS)',
      'On-location venue travel options across Mohanur & Namakkal district',
      'Complete pre-bridal skin & hair preparation timetables'
    ],
    processSteps: [
      { title: '1. Personal Consultation & Trial', desc: 'Discussing your bridal attire, jewellery, skin type, and preferred makeup style.' },
      { title: '2. Skin Preparation & Hydration', desc: 'Pre-makeup facial cleansing, toning, and deep hydration serum application for a flawless base.' },
      { title: '3. HD/Airbrush Base Application', desc: 'Flawless complexion matching, subtle contouring, highlighting, and waterproof setting.' },
      { title: '4. Hair Styling & Accessories', desc: 'Elaborate bridal bun, traditional flower decor (Gajra), or modern crown styling.' },
      { title: '5. Saree Draping & Final Touch-up', desc: 'Perfect pleating, secure pinning, lip touch-up, and long-wear setting mist.' }
    ],
    faqs: [
      { question: 'How far in advance should I book my bridal makeup in Mohanur?', answer: 'We recommend booking 2 to 3 months in advance, especially during peak wedding seasons in Tamil Nadu, to secure your preferred date and stylist.' },
      { question: 'What is the difference between HD and Airbrush Bridal Makeup?', answer: 'HD makeup uses micro-pigmented products applied with brushes for a natural look that looks flawless under camera lenses. Airbrush makeup uses a specialized spray gun for an ultra-smooth, transfer-proof finish that lasts up to 18 hours.' },
      { question: 'Do you offer on-location wedding venue services in Mohanur & Namakkal?', answer: 'Yes! Our senior makeup team travels to wedding venues, hotels, and homes across Mohanur and Namakkal district.' }
    ],
    relatedServices: [
      { slug: 'facials', name: 'Bridal Glow Facials' },
      { slug: 'hair-spa', name: 'Pre-Bridal Hair Spa' },
      { slug: 'manicure-pedicure', name: 'Bridal Manicure & Pedicure' }
    ]
  },
  'keratin-treatment': {
    slug: 'keratin-treatment',
    name: 'Keratin Hair Treatment',
    seoTitle: 'Keratin Treatment in Mohanur | Frizz-Free Smooth Hair | ZHA Salon',
    seoDescription: 'Transform frizzy hair with professional Keratin Treatment in Mohanur, Namakkal. Long-lasting smooth, shiny & manageable hair. Book appointment at ZHA Salon!',
    heroImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
    tagline: 'Professional Hair Smoothing & Frizz Control in Mohanur',
    description: 'Say goodbye to unruly frizz and tedious daily blow-drying. Keratin Treatment at ZHA Aesthetic Salon infuses essential hair proteins deep into damaged hair shafts, leaving hair silky, straight, and effortlessly smooth for up to 5 months.',
    priceRange: 'Starting at ₹2,999',
    duration: '2 - 3 Hours',
    features: [
      'Eliminates 95% of Frizz & Unruly Waves',
      'Restores Natural Keratin Protein Balance',
      'Cuts Daily Styling & Drying Time in Half',
      'Adds Brilliant Mirror-Like Shine',
      'Results Last 3 to 5 Months with Proper Care'
    ],
    whyUs: [
      'Formaldehyde-free, gentle chemical formulation',
      'Expertly trained hair smoothing specialists in Mohanur',
      'Includes complimentary post-treatment wash consultation',
      'Thousands of successful smoothing transformations'
    ],
    processSteps: [
      { title: '1. Clarifying Wash', desc: 'Washing hair twice with a deep clarifying shampoo to strip residue and open cuticles.' },
      { title: '2. Precision Application', desc: 'Applying keratin formula evenly section by section, ensuring 100% saturation.' },
      { title: '3. Blow Drying', desc: 'Drying the formula into the hair structure with medium heat.' },
      { title: '4. Flat-Iron Sealing', desc: 'Sealing keratin protein using professional ceramic flat irons at precise temperature.' },
      { title: '5. Aftercare Guidance', desc: 'Providing sulphate-free shampoo advice to preserve smooth results for months.' }
    ],
    faqs: [
      { question: 'Is Keratin Treatment safe for thin or coloured hair?', answer: 'Yes! Our keratin formula is gentle, nourishing, and specifically safe for colour-treated, bleached, or fine hair.' },
      { question: 'How long does a Keratin treatment last?', answer: 'With sulphate-free shampoo and proper care, results typically last between 3 to 5 months.' }
    ],
    relatedServices: [
      { slug: 'smoothening', name: 'Hair Smoothening' },
      { slug: 'hair-spa', name: 'Hair Spa Care' },
      { slug: 'hair-colour', name: 'Global Hair Colour' }
    ]
  },
  'facials': {
    slug: 'facials',
    name: 'Luxury Facials & Skin Care',
    seoTitle: 'Facials & Skin Care in Mohanur | Gold, Diamond & Vitamin C | ZHA',
    seoDescription: 'Get glowing skin with luxury facials in Mohanur, Namakkal. Hydrating, Gold, Diamond, Vitamin C & Anti-Ageing facial treatments at ZHA Aesthetic Salon. Book now!',
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80',
    tagline: 'Radiant, Youthful Glow for All Skin Types in Mohanur',
    description: 'Rejuvenate dull, tired skin with our custom facial treatments at ZHA Aesthetic Salon Mohanur. From hydrating collagen facials to luxury 24K Gold and Vitamin C brightening treatments, our skin therapists tailor every step to address pigmentation, acne, and ageing.',
    priceRange: 'Starting at ₹799',
    duration: '60 - 75 Mins',
    features: [
      'Deep Pore Cleansing & Blackhead Extraction',
      'Custom Botanical & Collagen Face Masks',
      'Brightening Vitamin C & Anti-Pigmentation Formula',
      'Relaxing Lymphatic Drainage Face & Neck Massage',
      'Instant Glow & Skin Elasticity Boost'
    ],
    whyUs: [
      'Certified skin care therapists in Mohanur',
      'Dermatologically tested, cruelty-free facial kits',
      'Strict single-use hygiene protocols for all applicators',
      'Customized skin diagnostic before every session'
    ],
    processSteps: [
      { title: '1. Skin Analysis & Cleansing', desc: 'Identifying skin dryness, oiliness, or sensitivity and cleansing makeup and dust.' },
      { title: '2. Exfoliation & Scrubbing', desc: 'Gently buffing away dead skin cells to unblock pores and refine texture.' },
      { title: '3. Herbal Steaming & Extraction', desc: 'Warm micro-steam softens pores for easy blackhead and whitehead removal.' },
      { title: '4. Rejuvenating Facial Massage', desc: '15-minute face, neck, and shoulder massage using nourishing facial cream.' },
      { title: '5. Masking & Protection', desc: 'Applying targeted glow mask followed by toner, serum, and SPF protection.' }
    ],
    faqs: [
      { question: 'Which facial is best for glowing skin in Mohanur?', answer: 'Our Gold Glow Facial and Vitamin C Brightening Facial are the most popular treatments for instant radiance and even skin tone.' },
      { question: 'Can men get facials at ZHA Aesthetic Salon?', answer: 'Yes! We offer skin care and facial treatments tailored specifically for men\'s skin needs.' }
    ],
    relatedServices: [
      { slug: 'bridal-makeup', name: 'Bridal Glow Packages' },
      { slug: 'threading', name: 'Eyebrow Threading' },
      { slug: 'waxing', name: 'Facial Waxing' }
    ]
  },
  'hair-colour': {
    slug: 'hair-colour',
    name: 'Hair Colouring & Highlights',
    seoTitle: 'Hair Colouring & Highlights in Mohanur | Balayage & Global | ZHA',
    seoDescription: 'Upgrade your look with professional Hair Colouring in Mohanur. Ammonia-free global hair colour, balayage, ombre & highlights at ZHA Aesthetic Salon. Book now!',
    heroImage: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=1200&q=80',
    tagline: 'Vibrant Global Hair Colouring & Balayage Artistry in Mohanur',
    description: 'Express your individuality with stunning hair shades at ZHA Aesthetic Salon Mohanur. Whether you desire subtle grey coverage, rich global brown, or trendy balayage highlights, our master colourists deliver shiny, vibrant, and hair-friendly results.',
    priceRange: 'Starting at ₹1,199',
    duration: '90 - 150 Mins',
    features: [
      '100% Grey Coverage with Ammonia-Free Formulations',
      'Balayage, Ombre & Global Highlights',
      'Shine-Enhancing Bond Protection Treatments',
      'Customized Shade Matching for Indian Skin Tones',
      'Long-Lasting Vibrant Colour Retention'
    ],
    whyUs: [
      'Ammonia-free, non-damaging international hair dyes',
      'Expert colourists trained in modern balayage techniques',
      'Post-colour deep conditioning treatment included',
      'Free post-colour care advice and product guidance'
    ],
    processSteps: [
      { title: '1. Colour Consultation', desc: 'Choosing your target shade based on skin undertone, hair condition, and lifestyle.' },
      { title: '2. Sectioning & Protection', desc: 'Applying scalp barrier cream and sectioning hair for precise application.' },
      { title: '3. Precise Dye Application', desc: 'Applying premium colour cream evenly from root to tip or in foil highlights.' },
      { title: '4. Processing & Rinse', desc: 'Allowing colour to develop under controlled time, followed by colour-lock wash.' },
      { title: '5. Blow Dry & Styling', desc: 'Styling hair with blow dry and shine serum to reveal vibrant colour dimension.' }
    ],
    faqs: [
      { question: 'Will hair colouring damage my hair?', answer: 'We use premium ammonia-free and bond-protecting hair colours that preserve hair strength and prevent dryness.' },
      { question: 'How long does global hair colour last?', answer: 'Global hair colour typically lasts 6 to 8 weeks depending on hair growth, shampoo frequency, and sun exposure.' }
    ],
    relatedServices: [
      { slug: 'hair-spa', name: 'Post-Colour Hair Spa' },
      { slug: 'keratin-treatment', name: 'Keratin Smoothing' },
      { slug: 'facials', name: 'Skin Brightening' }
    ]
  },
  'smoothening': {
    slug: 'smoothening',
    name: 'Hair Smoothening & Rebonding',
    seoTitle: 'Hair Smoothening & Rebonding in Mohanur | Silky Straight Hair',
    seoDescription: 'Get permanent silky straight hair with Hair Smoothening & Rebonding in Mohanur, Namakkal. Long-lasting, shine-infused smoothing at ZHA Aesthetic Salon.',
    heroImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=1200&q=80',
    tagline: 'Permanent Hair Straightening & Rebonding in Mohanur',
    description: 'Attain pin-straight, glossy, and tangle-free hair with Hair Smoothening and Rebonding at ZHA Aesthetic Salon Mohanur. Our chemical smoothing experts reshape hair bonds cleanly while locking in vital moisture.',
    priceRange: 'Starting at ₹3,499',
    duration: '3 - 4 Hours',
    features: [
      'Permanent Straightening & Frizz Removal',
      'Silky, Touchably Soft Hair Texture',
      'Resistant to Humidity & Sweat',
      'Protective Keratin & Protein Infusion',
      'Long-Lasting Straight Hair for 6+ Months'
    ],
    whyUs: [
      'Certified straightening specialists in Mohanur',
      'Low-odour, scalp-safe smoothing products',
      'Includes complimentary 3-day post-wash checkup'
    ],
    processSteps: [
      { title: '1. Clarifying Wash', desc: 'Thorough wash to remove oil and impurities.' },
      { title: '2. Relaxer Application', desc: 'Breaking chemical hair bonds section by section.' },
      { title: '3. Precision Ironing', desc: 'Ironing hair flat to align new straight bond structure.' },
      { title: '4. Neutralizer Application', desc: 'Locking hair into permanent straight position.' },
      { title: '5. Deep Treatment Wash', desc: 'Nourishing hair with protein mask.' }
    ],
    faqs: [
      { question: 'What is the difference between Keratin and Hair Smoothening?', answer: 'Keratin is a semi-permanent protein treatment that reduces 90% frizz while keeping natural wave. Smoothening/Rebonding chemically alters bonds to give pin-straight hair.' }
    ],
    relatedServices: [
      { slug: 'keratin-treatment', name: 'Keratin Treatment' },
      { slug: 'hair-spa', name: 'Deep Conditioning Hair Spa' }
    ]
  },
  'threading': {
    slug: 'threading',
    name: 'Eyebrow Threading & Facial Hair Removal',
    seoTitle: 'Eyebrow Threading in Mohanur | Precise Shaping | ZHA Salon',
    seoDescription: 'Gentle, precise Eyebrow Threading & facial hair removal in Mohanur, Namakkal. Perfect brow arch, chin & upper lip threading at ZHA Aesthetic Salon.',
    heroImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
    tagline: 'Flawless Eyebrow Shaping & Gentle Facial Threading in Mohanur',
    description: 'Frame your eyes with perfectly arched eyebrows. Our threading artists at ZHA Aesthetic Salon Mohanur practice gentle, high-precision cotton thread removal for eyebrows, upper lip, chin, and full face.',
    priceRange: 'Starting at ₹40',
    duration: '10 - 20 Mins',
    features: [
      'High-Precision Brow Arch Alignment',
      '100% Natural Cotton Thread Hygiene',
      'Soothes Sensitive Skin with Aloe Soothing Gel',
      'Quick & Minimal Discomfort Technique'
    ],
    whyUs: [
      'Experienced threading artists in Mohanur',
      'Sanitized cotton threads & cooling post-threading care'
    ],
    processSteps: [
      { title: '1. Brow Mapping', desc: 'Measuring brow arch to complement your facial structure.' },
      { title: '2. Threading', desc: 'Removing stray hairs with swift, precise cotton thread motion.' },
      { title: '3. Soothing Gel Massage', desc: 'Applying aloe vera cooling gel to prevent redness.' }
    ],
    faqs: [
      { question: 'How long does eyebrow threading last?', answer: 'Eyebrow threading results typically last 2 to 4 weeks depending on personal hair growth.' }
    ],
    relatedServices: [
      { slug: 'facials', name: 'Glowing Facials' },
      { slug: 'waxing', name: 'Full Body Waxing' }
    ]
  },
  'waxing': {
    slug: 'waxing',
    name: 'Full Body & Rica Waxing',
    seoTitle: 'Waxing Services in Mohanur | Rica & Chocolate Waxing | ZHA Salon',
    seoDescription: 'Smooth, hair-free skin with gentle Rica & Chocolate Waxing in Mohanur, Namakkal. Full body, arms, legs & bikini waxing at ZHA Aesthetic Salon. Book now!',
    heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80',
    tagline: 'Gentle, Hygienic Full Body & Liposoluble Waxing in Mohanur',
    description: 'Enjoy silky smooth, hair-free skin with our premium waxing services at ZHA Aesthetic Salon Mohanur. We utilize hypoallergenic Rica liposoluble wax and chocolate wax designed for sensitive skin.',
    priceRange: 'Starting at ₹199',
    duration: '20 - 60 Mins',
    features: [
      'Hypoallergenic Italian Rica Liposoluble Wax',
      'Gentle Hair Removal from Roots without Skin Pulling',
      'Delays Hair Regrowth & Exfoliates Dead Skin',
      'Private & Hygienic Single-Use Strips'
    ],
    whyUs: [
      'Private air-conditioned treatment rooms in Mohanur',
      'Trained aesthetic technicians using hygienic protocols'
    ],
    processSteps: [
      { title: '1. Cleansing', desc: 'Sanitizing and dusting skin with pre-wax lotion.' },
      { title: '2. Wax Application', desc: 'Applying warm Rica wax in hair growth direction.' },
      { title: '3. Removal & Aftercare', desc: 'Swift strip removal followed by post-wax soothing oil.' }
    ],
    faqs: [
      { question: 'Why is Rica wax better than normal honey wax?', answer: 'Rica liposoluble wax adheres only to hair rather than pulling top skin layers, making it less painful and ideal for sensitive skin.' }
    ],
    relatedServices: [
      { slug: 'facials', name: 'Skin Care Facials' },
      { slug: 'threading', name: 'Eyebrow Threading' }
    ]
  },
  'manicure-pedicure': {
    slug: 'manicure-pedicure',
    name: 'Spa Manicure & Pedicure',
    seoTitle: 'Manicure & Pedicure in Mohanur | Spa Nail Care | ZHA Salon',
    seoDescription: 'Pamper your hands and feet with Spa Manicure & Pedicure in Mohanur, Namakkal. Nail shaping, heel scrub, soak & massage at ZHA Aesthetic Salon. Book now!',
    heroImage: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=1200&q=80',
    tagline: 'Luxury Hand & Foot Pampering in Mohanur',
    description: 'Treat your hands and feet to ultimate relaxation at ZHA Aesthetic Salon Mohanur. Our spa manicure and pedicure include warm aromatic soak, exfoliation scrub, nail shaping, cuticle care, and foot reflexology massage.',
    priceRange: 'Starting at ₹499',
    duration: '45 - 60 Mins',
    features: [
      'Aromatic Warm Soak & Dead Sea Salt Exfoliation',
      'Heel Crack Smoothing & Cuticle Care',
      'Relaxing Hand & Foot Reflexology Massage',
      'Precision Nail Shaping & High-Shine Polish'
    ],
    whyUs: [
      'Sterilized tools & single-use foot bath liners in Mohanur',
      'Long-lasting gel polish options available'
    ],
    processSteps: [
      { title: '1. Soak', desc: 'Soaking feet/hands in warm herbal water bath.' },
      { title: '2. Scrub & Care', desc: 'Exfoliating dead skin and cleaning cuticles.' },
      { title: '3. Massage & Polish', desc: 'Reflexology massage and gel polish application.' }
    ],
    faqs: [
      { question: 'Does pedicure help with cracked heels?', answer: 'Yes! Our spa pedicure includes heel scrubbing and callus softening creams that visibly repair cracked heels.' }
    ],
    relatedServices: [
      { slug: 'bridal-makeup', name: 'Bridal Packages' },
      { slug: 'facials', name: 'Hydrating Facials' }
    ]
  }
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? SERVICES_DATA[slug] : null;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  useSEO({
    title: service.seoTitle,
    description: service.seoDescription,
    canonical: `/services/${service.slug}`,
    breadcrumbs: [
      { name: 'Services', url: '/services' },
      { name: service.name, url: `/services/${service.slug}` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': `${service.name} in Mohanur`,
      'provider': {
        '@type': 'BeautySalon',
        'name': 'ZHA Aesthetic Salon',
        'url': 'https://www.zhaaestheticsalon.in',
        'telephone': '+918270904659',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '1st floor, MPS Traders Building, opposite to Taluka Office, Nehru Nagar',
          'addressLocality': 'Mohanur',
          'addressRegion': 'Tamil Nadu',
          'postalCode': '637015',
          'addressCountry': 'IN'
        }
      },
      'areaServed': ['Mohanur', 'Namakkal', 'Tamil Nadu'],
      'description': service.description
    }
  });

  return (
    <main className="service-detail-page">
      {/* ── Breadcrumb Bar ── */}
      <nav className="breadcrumb-bar" aria-label="Breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li><Link to="/">Home</Link></li>
            <li><span>/</span></li>
            <li><Link to="/services">Services</Link></li>
            <li><span>/</span></li>
            <li className="active">{service.name}</li>
          </ol>
        </div>
      </nav>

      {/* ── Hero Banner ── */}
      <section className="service-detail-hero">
        <div className="container">
          <div className="service-detail-hero__grid">
            <div className="service-detail-hero__content">
              <div className="service-detail__eyebrow">
                <Sparkles size={14} /> ZHA Aesthetic Salon Mohanur
              </div>
              <h1 className="service-detail__h1">{service.name} in Mohanur</h1>
              <p className="service-detail__tagline">{service.tagline}</p>
              <p className="service-detail__desc">{service.description}</p>
              
              <div className="service-detail__meta-pills">
                <span className="service-pill">{service.priceRange}</span>
                <span className="service-pill">{service.duration}</span>
              </div>

              <div className="service-detail__cta-row">
                <InteractiveHoverButton to="/book-appointment" state={{ service: service.name }}>
                  Book Appointment Now
                </InteractiveHoverButton>
                <a href="tel:+918270904659" className="btn btn-outline">
                  <Phone size={16} /> Call +91 82709 04659
                </a>
              </div>
            </div>

            <div className="service-detail-hero__media">
              <img 
                src={service.heroImage} 
                alt={`${service.name} at ZHA Aesthetic Salon in Mohanur`} 
                className="service-detail__img" 
                loading="eager" 
                width="600" 
                height="450" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Features ── */}
      <section className="section bg-card">
        <div className="container">
          <h2 className="section-title text-center">Key Features & Benefits</h2>
          <div className="features-grid">
            {service.features.map((feat, i) => (
              <div key={i} className="feature-card">
                <CheckCircle2 size={20} className="feature-card__icon" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Step by Step Process ── */}
      <section className="section">
        <div className="container">
          <div className="section__header section__header--center">
            <div className="section-label">Our Method</div>
            <h2 className="section-title">The Treatment Process at ZHA Salon</h2>
          </div>

          <div className="process-grid">
            {service.processSteps.map((step, i) => (
              <div key={i} className="process-card">
                <div className="process-card__number">{i + 1}</div>
                <h3 className="process-card__title">{step.title}</h3>
                <p className="process-card__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="section bg-card">
        <div className="container">
          <div className="why-us-box">
            <h2 className="section-title">Why Choose ZHA Aesthetic Salon for {service.name} in Mohanur?</h2>
            <ul className="why-us-list">
              {service.whyUs.map((item, i) => (
                <li key={i}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-champagne)', flexShrink: 0 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQs Section ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section__header section__header--center">
            <HelpCircle size={28} style={{ color: 'var(--color-champagne)', margin: '0 auto 12px' }} />
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div className="faqs-accordion">
            {service.faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.question}</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </button>
                {openFaq === i && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Services & Internal Links ── */}
      <section className="section bg-card">
        <div className="container">
          <h2 className="section-title text-center">Related Beauty Services in Mohanur</h2>
          <div className="related-services-grid">
            {service.relatedServices.map(rel => (
              <Link key={rel.slug} to={`/services/${rel.slug}`} className="related-service-card">
                <span>{rel.name}</span>
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="service-cta-banner">
        <div className="container text-center">
          <h2 className="service-cta__title">Ready for Your {service.name} in Mohanur?</h2>
          <p className="service-cta__desc">Experience luxury beauty treatment with our certified experts at ZHA Aesthetic Salon.</p>
          <div className="service-cta__actions">
            <InteractiveHoverButton to="/book-appointment" state={{ service: service.name }}>
              <Calendar size={16} /> Book Appointment Online
            </InteractiveHoverButton>
            <Link to="/contact" className="btn btn-outline-white">
              Contact Salon Location
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
