/*
  products.js
  ------------------------------------------------------------------
  Sample product catalogue for the Alberto Clocks academic project.

  NOTE ON DATA SOURCE:
  The folder structure also contains /data/products.json with the
  same records in pure JSON form, kept as a reference data file per
  the project specification. The website itself reads product data
  from the ALBERTO_PRODUCTS array below rather than fetching the
  JSON file, because browsers block fetch() of local files opened
  directly from disk (file://) without a local server. Loading the
  data as a script keeps the project runnable by simply opening
  index.html, with no server, build step, or installation required.

  All prices are fictional sample prices for a class project and do
  not represent real market values. Rolex, Michael Kors, Citizen
  Eco-Drive and Bulova are used only as illustrative brand names, as
  permitted by the project brief. Alberto Clocks is not an
  authorized dealer of any real brand.
*/

const ALBERTO_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80";

const ALBERTO_PRODUCTS = [
  {
    id: 1,
    name: "Meridian Automatic",
    brand: "Alberto Heritage",
    category: "luxury",
    price: 9200,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80",
    shortDescription:
      "A refined automatic dress watch with a hand-finished charcoal dial.",
    fullDescription:
      "The Meridian Automatic is the signature piece of the Alberto Heritage line, built around a self-winding movement and a hand-finished sunburst dial. Its slim profile and polished lugs make it equally suited to formal occasions and everyday wear.",
    technology: "Automatic Movement",
    features: [
      "Self-winding automatic movement",
      "Sapphire crystal glass",
      "Genuine leather strap",
      "38-hour power reserve",
    ],
    availability: "In Stock",
  },
  {
    id: 2,
    name: "Oyster Classic 41",
    brand: "Rolex",
    category: "luxury",
    price: 14500,
    image:
      "https://images.unsplash.com/photo-1639006570490-79c0c53f1080?auto=format&fit=crop&w=900&q=80",
    shortDescription:
      "A timeless steel and gold automatic watch with iconic proportions.",
    fullDescription:
      "The Oyster Classic 41 pairs a robust stainless steel case with warm gold accents on the bezel and bracelet. Its automatic movement and classic proportions make it a benchmark of understated luxury watchmaking.",
    technology: "Automatic Movement",
    features: [
      "Stainless steel and gold-tone bracelet",
      "Automatic movement",
      "Scratch-resistant sapphire crystal",
      "Water resistant to 100m",
    ],
    availability: "In Stock",
  },
  {
    id: 3,
    name: "Lexington Chronograph",
    brand: "Michael Kors",
    category: "premium",
    price: 325,
    image:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=900&q=80",
    shortDescription:
      "A bold chronograph with a sunburst dial and stainless bracelet.",
    fullDescription:
      "The Lexington Chronograph brings a fashion-forward silhouette to the everyday chronograph, with a layered dial, quartz precision, and a comfortable stainless steel bracelet designed for daily wear.",
    technology: "Chronograph",
    features: [
      "Quartz chronograph movement",
      "Stainless steel bracelet",
      "Luminous hands and markers",
      "Water resistant to 50m",
    ],
    availability: "In Stock",
  },
  {
    id: 4,
    name: "Precision Eco Diver",
    brand: "Citizen Eco-Drive",
    category: "sports",
    price: 520,
    image:
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A light-powered dive watch that never needs a battery change.",
    fullDescription:
      "The Precision Eco Diver converts light of any kind into energy, powering the movement without a traditional battery. Built for the water and the wrist, it combines a rotating dive bezel with dependable Eco-Drive technology.",
    technology: "Eco-Drive Technology",
    features: [
      "Light-powered Eco-Drive movement",
      "Unidirectional rotating bezel",
      "Water resistant to 200m",
      "No battery replacement required",
    ],
    availability: "In Stock",
  },
  {
    id: 5,
    name: "Marine Star Diver",
    brand: "Bulova",
    category: "sports",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A rugged quartz diver with a high-visibility dial.",
    fullDescription:
      "The Marine Star Diver is engineered for activity, featuring a high-visibility dial, a durable stainless case, and dependable quartz accuracy for everything from the pool to the weekend hike.",
    technology: "Quartz Movement",
    features: [
      "High-accuracy quartz movement",
      "Unidirectional dive bezel",
      "Water resistant to 200m",
      "Screw-down crown",
    ],
    availability: "In Stock",
  },
  {
    id: 6,
    name: "Heritage 1920 Vintage",
    brand: "Alberto Heritage",
    category: "vintage",
    price: 4200,
    image:
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A hand-wound piece inspired by early twentieth-century design.",
    fullDescription:
      "The Heritage 1920 Vintage revives the slender case shapes and railway-style dials of early wristwatches, powered by a hand-wound mechanical movement finished with visible bridge decoration.",
    technology: "Mechanical Movement",
    features: [
      "Hand-wound mechanical movement",
      "Domed mineral crystal",
      "Aged leather strap",
      "Small seconds sub-dial",
    ],
    availability: "Limited Stock",
  },
  {
    id: 7,
    name: "Continental Vintage Dress",
    brand: "Bulova",
    category: "vintage",
    price: 980,
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A slim mechanical dress watch with an ivory dial.",
    fullDescription:
      "The Continental Vintage Dress pairs a classic ivory dial with slender gold-tone hands, echoing the restrained elegance of mid-century dress watches, all powered by a traditional mechanical movement.",
    technology: "Mechanical Movement",
    features: [
      "Mechanical hand-wound movement",
      "Gold-tone case accents",
      "Genuine calfskin strap",
      "Exhibition case back",
    ],
    availability: "In Stock",
  },
  {
    id: 8,
    name: "Alberto Connect Pro",
    brand: "Alberto Tech",
    category: "smart",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A connected smartwatch with health tracking and notifications.",
    fullDescription:
      "Alberto Connect Pro brings modern connected features into a refined case shape, including heart-rate sensing, smartphone notifications, and multi-day battery life for continuous wear.",
    technology: "Smart Watch Technology",
    features: [
      "Heart-rate and activity sensors",
      "Smartphone notifications",
      "Customizable digital watch faces",
      "Up to 5-day battery life",
    ],
    availability: "In Stock",
  },
  {
    id: 9,
    name: "Runway Chronograph",
    brand: "Michael Kors",
    category: "classic",
    price: 295,
    image:
      "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A polished chronograph with a classic three-eye layout.",
    fullDescription:
      "The Runway Chronograph offers a traditional three-eye chronograph layout in a polished stainless case, balancing everyday versatility with a refined dress-casual look.",
    technology: "Chronograph",
    features: [
      "Quartz chronograph movement",
      "Stainless steel case and bracelet",
      "Date display window",
      "Water resistant to 50m",
    ],
    availability: "In Stock",
  },
  {
    id: 10,
    name: "Datejust Tradition",
    brand: "Rolex",
    category: "classic",
    price: 11800,
    image:
      "https://images.unsplash.com/photo-1582150264904-e0bea5ef0ad1?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A classic dated dress watch with a fluted bezel.",
    fullDescription:
      "The Datejust Tradition carries forward a familiar and much-loved silhouette, complete with a fluted bezel, magnified date window, and jubilee-style bracelet built around a precise automatic movement.",
    technology: "Automatic Movement",
    features: [
      "Automatic movement with date function",
      "Fluted bezel design",
      "Jubilee-style bracelet",
      "Water resistant to 100m",
    ],
    availability: "In Stock",
  },
  {
    id: 11,
    name: "Alberto Centennial Limited",
    brand: "Alberto Heritage",
    category: "limited",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1619946928632-abefa12506e2?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A limited-run anniversary piece with skeletonized dial.",
    fullDescription:
      "Produced in a restricted numbered run, the Alberto Centennial Limited reveals its mechanical heart through a fully skeletonized dial, finished by hand and cased in a warm rose-gold-toned housing.",
    technology: "Mechanical Movement",
    features: [
      "Skeletonized mechanical movement",
      "Individually numbered case back",
      "Sapphire crystal front and back",
      "Limited to 200 pieces",
    ],
    availability: "Limited Stock",
  },
  {
    id: 12,
    name: "Skyline Pilot Chronograph",
    brand: "Bulova",
    category: "sports",
    price: 710,
    image:
      "https://images.unsplash.com/photo-1557531365-e8b22d93dbd0?auto=format&fit=crop&w=900&q=80",
    shortDescription: "An aviation-inspired chronograph with a large, legible dial.",
    fullDescription:
      "Inspired by classic pilot instruments, the Skyline Pilot Chronograph features an oversized crown, high-contrast dial, and precise quartz chronograph functions for reliable timing at a glance.",
    technology: "Chronograph",
    features: [
      "Quartz chronograph movement",
      "Oversized crown for gloved use",
      "High-contrast luminous dial",
      "Water resistant to 100m",
    ],
    availability: "In Stock",
  },
  {
    id: 13,
    name: "Alberto Ivory Classic",
    brand: "Alberto Heritage",
    category: "classic",
    price: 2650,
    image:
      "https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?auto=format&fit=crop&w=900&q=80",
    shortDescription: "An understated automatic watch with an ivory sunburst dial.",
    fullDescription:
      "The Alberto Ivory Classic is designed for everyday elegance, with a warm ivory sunburst dial, slim polished case, and dependable automatic movement suited to office and evening wear alike.",
    technology: "Automatic Movement",
    features: [
      "Automatic movement",
      "Ivory sunburst dial",
      "Interchangeable leather strap",
      "Water resistant to 30m",
    ],
    availability: "In Stock",
  },
  {
    id: 14,
    name: "Parkside Slim",
    brand: "Michael Kors",
    category: "classic",
    price: 210,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A minimalist slim-case watch for everyday styling.",
    fullDescription:
      "The Parkside Slim strips the dial down to the essentials, pairing a slender case with a clean two-hand layout, ideal for anyone who prefers a quiet, minimal accessory.",
    technology: "Quartz Movement",
    features: [
      "Slim quartz movement",
      "Minimalist two-hand dial",
      "Interchangeable leather or mesh strap",
      "Water resistant to 30m",
    ],
    availability: "In Stock",
  },
  {
    id: 15,
    name: "Alberto Nightwatch Diver",
    brand: "Alberto Heritage",
    category: "sports",
    price: 3100,
    image:
      "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?auto=format&fit=crop&w=900&q=80",
    shortDescription: "An automatic dive watch built for low-light legibility.",
    fullDescription:
      "The Alberto Nightwatch Diver combines a robust automatic movement with a heavily lumed dial and bezel, designed for confident reading in low light both above and below the surface.",
    technology: "Automatic Movement",
    features: [
      "Automatic diving movement",
      "Unidirectional lumed bezel",
      "Water resistant to 300m",
      "Rubber and steel strap options",
    ],
    availability: "In Stock",
  },
  {
    id: 16,
    name: "Vintage Gold Reserve",
    brand: "Alberto Heritage",
    category: "vintage",
    price: 6700,
    image:
      "https://images.unsplash.com/photo-1637160151663-a410315e4e75?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A gold-cased mechanical watch with a power reserve indicator.",
    fullDescription:
      "The Vintage Gold Reserve revives an era of elaborate dial complications, featuring a mechanical movement with a visible power reserve indicator housed in a warm gold-toned case.",
    technology: "Mechanical Movement",
    features: [
      "Mechanical movement with power reserve display",
      "Gold-toned case",
      "Hand-guilloched dial pattern",
      "Exhibition case back",
    ],
    availability: "Limited Stock",
  },
  {
    id: 17,
    name: "Alberto Aurora Smart",
    brand: "Alberto Tech",
    category: "smart",
    price: 459,
    image:
      "https://images.unsplash.com/photo-1617043983671-adaadcaa2460?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A refined smartwatch designed for both office and gym.",
    fullDescription:
      "Alberto Aurora Smart blends a metal case and interchangeable straps with a bright always-on display, sleep tracking, and guided workout modes for a smartwatch that dresses up or down.",
    technology: "Smart Watch Technology",
    features: [
      "Always-on color display",
      "Sleep and workout tracking",
      "Interchangeable strap system",
      "Water resistant to 50m",
    ],
    availability: "In Stock",
  },
  {
    id: 18,
    name: "Submariner Legacy Style",
    brand: "Rolex",
    category: "luxury",
    price: 16200,
    image:
      "https://images.unsplash.com/photo-1461141346587-763ab02bced9?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A legendary dive watch silhouette in a modern automatic build.",
    fullDescription:
      "The Submariner Legacy Style carries forward one of watchmaking's most recognized dive-watch silhouettes, with a rotating bezel, luminous markers, and a robust automatic movement.",
    technology: "Automatic Movement",
    features: [
      "Automatic diving movement",
      "Unidirectional rotating bezel",
      "Water resistant to 300m",
      "Solid stainless steel bracelet",
    ],
    availability: "In Stock",
  },
  {
    id: 19,
    name: "Alberto Limited Ember",
    brand: "Alberto Heritage",
    category: "limited",
    price: 18900,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A limited-edition piece with a hand-lacquered ember dial.",
    fullDescription:
      "A limited numbered release, the Alberto Limited Ember features a hand-lacquered burnt-amber dial and a warm gold-toned case, produced in a single small batch for collectors.",
    technology: "Mechanical Movement",
    features: [
      "Mechanical movement",
      "Hand-lacquered dial finish",
      "Individually numbered edition",
      "Presentation box included",
    ],
    availability: "Limited Stock",
  },
  {
    id: 20,
    name: "Alberto Trailblazer Sport",
    brand: "Alberto Heritage",
    category: "sports",
    price: 1450,
    image:
      "https://images.unsplash.com/photo-1624096104992-9b4fa3a279dd?auto=format&fit=crop&w=900&q=80",
    shortDescription: "A durable everyday sports watch with a shock-resistant case.",
    fullDescription:
      "Built for daily activity, the Alberto Trailblazer Sport combines a shock-resistant case, a grippy silicone strap, and quartz precision for a dependable companion from the office to the outdoors.",
    technology: "Quartz Movement",
    features: [
      "Shock-resistant quartz movement",
      "Silicone sport strap",
      "Water resistant to 100m",
      "Screw-down case back",
    ],
    availability: "Out of Stock",
  },
];
