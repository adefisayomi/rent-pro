export const _properties = [
    { image: 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/link1' },
    { image: 'https://plus.unsplash.com/premium_photo-1676321046449-5fc72b124490?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvcGVydGllc3xlbnwwfHwwfHx8MA%3D%3D', link: '/link2' },
    { image: 'https://plus.unsplash.com/premium_photo-1675615949585-36aaf4cb778d?q=80&w=1906&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/link3' },
    { image: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvcGVydGllc3xlbnwwfHwwfHx8MA%3D%3D', link: '/link4' },
    { image: 'https://plus.unsplash.com/premium_photo-1661883964999-c1bcb57a7357?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvcGVydGllc3xlbnwwfHwwfHx8MA%3D%3D', link: '/link5' }
  ];

  export const _propertyTypes = [
    "all type",
    "Apartment",
    "House",
    "Condo",
    "Townhouse",
    "Villa",
    "Duplex",
    "Penthouse",
    "Studio",
    "Cottage",
    "Bungalow",
    "Loft",
    "Cabin",
    "Mansion",
    "Farmhouse",
    "Chalet"
  ];

  export const _securities = [
    "alerm", 'access gate', 'electric fence', 'security post'
  ]
  export const _amenities = [
    "pool", 'furnished', 'patio / balcony', 'pet friendly', 'water included', 'electricy included'
  ]

  export const _rentalTaglines = [
    "Your Reliable Home Rental Partner",
    "Your Go-To Home Rental Solution",
    "The Trusted Name in Home Rentals",
    "Find Your Perfect Home with Us",
    "Rent with Confidence, Live with Ease",
    "Seamless Home Rentals, Just for You",
    "Your Hassle-Free Home Rental Partner",
    "Where Trust Meets Home Rentals",
    "Secure, Simple, and Trusted Home Rentals",
    "Helping You Find a Home You Love",
    "Your Partner in Stress-Free Renting",
    "Making Home Rentals Easy and Reliable",
    "Your Trusted Guide to the Perfect Rental",
    "Find. Rent. Relax. We’ve Got You Covered.",
    "A Better Way to Rent a Home",
  ];
  export const _getTagline = () => {
    const randomIndex = Math.floor(Math.random() * _rentalTaglines.length);
    return _rentalTaglines[randomIndex];
  }

  
export const _experienceOptions = [
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "6-10 years",
  "10+ years",
] as const;

export const _specializationOptions = [
  "Residential Real Estate",
  "Commercial Real Estate",
  "Luxury Real Estate",
  "Property Management",
  "Real Estate Investment",
  "Real Estate Appraisal",
  "Industrial Real Estate",
  "Vacation and Resort Real Estate",
  "Real Estate Development",
  "Foreclosure and Short Sales",
] as const;

export const _listedIn = [
  "all",
  "rent",
  "buy",
  "short-let",
]

export const _status = [
  "active",
  "hot offer",
  "new offer",
  "not active",
  "sold"
]

export const _africanCountries = {
  nigeria: [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", 
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", 
    "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", 
    "FCT (Federal Capital Territory)"
  ],
  southAfrica: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga"],
  egypt: ["Cairo", "Giza", "Alexandria", "Aswan", "Luxor", "Suez", "Ismailia", "Port Said"],
  kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi"],
  ghana: ["Greater Accra", "Ashanti", "Western", "Eastern", "Northern", "Volta", "Central", "Upper East", "Upper West"],
  ethiopia: ["Addis Ababa", "Oromia", "Amhara", "Sidama", "Tigray", "Gambela", "Somali"],
  morocco: ["Casablanca-Settat", "Rabat-Salé-Kénitra", "Marrakech-Safi", "Fès-Meknès", "Tangier-Tetouan-Al Hoceima"],
  tanzania: ["Dar es Salaam", "Dodoma", "Mwanza", "Arusha", "Mbeya", "Morogoro", "Tanga"],
  algeria: ["Algiers", "Oran", "Constantine", "Annaba", "Blida", "Tlemcen", "Batna"],
  uganda: ["Kampala", "Wakiso", "Gulu", "Mbarara", "Jinja", "Mbale", "Fort Portal"],
};


export const _generalAmenities = {
  general: {
    label: 'general amenities',
    list: [
      "Air Conditioning",
      "Wi-Fi",
      "Parking",
      "Swimming Pool",
      "Refrigerator",
      "Laundry",
      "TV Cable",
      "Barbeque",
      "Fireplace",
      "Microwave",
    ]
  },
  indoor: {
    label: 'indoor features',
    list: [
      "Indoor Features",
      "Ensuite",
      "Study",
      "Rumpus Room",
      "Built-in Robes",
      "Dishwasher",
      "Alarm System",
      "Floorboards",
      "Gym",
      "Broadband",
      "Projector Room",
      "Elevator",
      "Ceiling Height",
    ]
  },
 outdoor: {
  label: 'outdoor features',
  list: [
    "Balcony",
    "Backyard",
    "Front Yard",
    "Garden",
    "Outdoor Area",
    "Outdoor Shower",
    "Outdoor Spa",
    "Fully Fenced",
    "Shed",
    "Tennis Court",
 ]
 },
 climate: {
  label: 'climate control & energy',
  list: [
    "Heating",
    "Water Tank",
    "Solar Panels",
    "Solar Hot Water",
    "Dust Filter",
    "Electric Stove System",
 ]
 },
 special: {
  label: 'special features',
  list: [
    "Special Features",
    "Pet Friendly",
    "Disabled Access",
    "Lake View",
    "School",
    "Transportation Hub",
    "Supermarket",
    "Clinic"
 ]
 }
}

export const _favouriteSort = [
  "newest",
  "best seller",
  "best match",
  "price low",
  "price high",
]

export const _dummyData = [
  {
    id: "1",
    title: "Luxury Beachfront Villa",
    description: "A luxurious beachfront villa with stunning ocean views, private pool, and modern amenities.",
    type: "Villa",
    listedIn: "For Sale",
    status: "Available",
    price: "₦500,000,000",
    taxRate: "10",
    bedrooms: "5",
    bathrooms: "6",
    kitchens: "2",
    parking: "3",
    country: "Nigeria",
    state: "Lagos",
    city: "Ikoyi",
    zip: "101233",
    address: "123 Ocean Drive, Ikoyi",
    coordinates: "6.5244° N, 3.3792° E",
    videoFrom: "YouTube",
    videoLink: "https://www.youtube.com/watch?v=example1",
    images: [
      "https://tse3.mm.bing.net/th?id=OIP.vCtxuRUWmhSmnSbennt3bwHaEK&pid=Api",
      "https://tse3.mm.bing.net/th?id=OIP.g14VXuvI8TOktCWLnkVPvwHaJ3&pid=Api",
      "https://tse3.mm.bing.net/th?id=OIP.u_g9bk33pjmfmHpPaLlAxgHaJ3&pid=Api",
      "https://tse3.mm.bing.net/th?id=OIP.2NjfafNxqqZAt4fxp1tpfwHaKr&pid=Api"
    ],
    general: ["Swimming Pool", "Gym", "24/7 Security"],
    indoor: ["Air Conditioning", "Furnished"],
    outdoor: ["Garden", "Garage"],
    climate: ["Tropical"],
    special: ["Ocean View"],
    published: true,
    createdAt: "2024-08-10",
    views: 124
  },
  {
    id: "2",
    title: "Modern Apartment in VI",
    description: "A fully furnished modern apartment in the heart of Victoria Island, suitable for business professionals.",
    type: "Apartment",
    listedIn: "For Rent",
    status: "Available",
    price: "₦10,000,000/year",
    taxRate: "8",
    bedrooms: "3",
    bathrooms: "3",
    kitchens: "1",
    parking: "2",
    country: "Nigeria",
    state: "Lagos",
    city: "Victoria Island",
    zip: "101241",
    address: "45 Akin Adesola Street",
    coordinates: "6.4281° N, 3.4219° E",
    videoFrom: "Vimeo",
    videoLink: "https://vimeo.com/example1",
    images: [
      "https://tse3.mm.bing.net/th?id=OIP.u_g9bk33pjmfmHpPaLlAxgHaJ3&pid=Api",
      "https://tse3.mm.bing.net/th?id=OIP.g14VXuvI8TOktCWLnkVPvwHaJ3&pid=Api"
    ],
    general: ["Backup Power Supply", "Concierge Service"],
    indoor: ["Fully Furnished", "Smart Home System"],
    outdoor: ["Balcony", "Parking Space"],
    climate: ["Urban"],
    special: ["Central Location"],
    published: false,
    createdAt: "2024-09-01",
    views: 98
  },
  {
    id: "3",
    title: "Cozy Suburban House",
    description: "A family-friendly house in a peaceful suburban neighborhood with great schools and parks nearby.",
    type: "House",
    listedIn: "For Sale",
    status: "Available",
    price: "₦120,000,000",
    taxRate: "7",
    bedrooms: "4",
    bathrooms: "3",
    kitchens: "1",
    parking: "2",
    country: "Nigeria",
    state: "Ogun",
    city: "Abeokuta",
    zip: "110001",
    address: "12 Peace Avenue, Abeokuta",
    coordinates: "7.1557° N, 3.3451° E",
    videoFrom: "YouTube",
    videoLink: "https://www.youtube.com/watch?v=example2",
    images: [
      "https://tse3.mm.bing.net/th?id=OIP.f1X5wPoCICeKMb5z1UBTXgHaFj&pid=Api",
      "https://tse3.mm.bing.net/th?id=OIP.RxwLXsKuYvwXv8uA6u4VgAHaE7&pid=Api"
    ],
    general: ["Quiet Neighborhood", "Close to Schools"],
    indoor: ["Fireplace", "Laundry Room"],
    outdoor: ["Patio", "Backyard"],
    climate: ["Temperate"],
    special: ["Family-Friendly"],
    published: true,
    createdAt: "2024-09-05",
    views: 76
  },
  {
    id: "4",
    title: "Luxury Beachfront Villa",
    description: "A luxurious beachfront villa with stunning ocean views, private pool, and modern amenities.",
    type: "Villa",
    listedIn: "For Sale",
    status: "Available",
    price: "₦500,000,000",
    taxRate: "10",
    bedrooms: "5",
    bathrooms: "6",
    kitchens: "2",
    parking: "3",
    country: "Nigeria",
    state: "Lagos",
    city: "Ikoyi",
    zip: "101233",
    address: "123 Ocean Drive, Ikoyi",
    coordinates: "6.5244° N, 3.3792° E",
    videoFrom: "YouTube",
    videoLink: "https://www.youtube.com/watch?v=example1",
    images: [
      "https://tse3.mm.bing.net/th?id=OIP.vCtxuRUWmhSmnSbennt3bwHaEK&pid=Api",
      "https://tse3.mm.bing.net/th?id=OIP.g14VXuvI8TOktCWLnkVPvwHaJ3&pid=Api",
      "https://tse3.mm.bing.net/th?id=OIP.u_g9bk33pjmfmHpPaLlAxgHaJ3&pid=Api",
      "https://tse3.mm.bing.net/th?id=OIP.2NjfafNxqqZAt4fxp1tpfwHaKr&pid=Api"
    ],
    general: ["Swimming Pool", "Gym", "24/7 Security"],
    indoor: ["Air Conditioning", "Furnished"],
    outdoor: ["Garden", "Garage"],
    climate: ["Tropical"],
    special: ["Ocean View"],
    published: false,
    createdAt: "2024-08-10",
    views: 124
  },
  {
    id: "5",
    title: "Modern Apartment in VI",
    description: "A fully furnished modern apartment in the heart of Victoria Island, suitable for business professionals.",
    type: "Apartment",
    listedIn: "For Rent",
    status: "Available",
    price: "₦10,000,000/year",
    taxRate: "8",
    bedrooms: "3",
    bathrooms: "3",
    kitchens: "1",
    parking: "2",
    country: "Nigeria",
    state: "Lagos",
    city: "Victoria Island",
    zip: "101241",
    address: "45 Akin Adesola Street",
    coordinates: "6.4281° N, 3.4219° E",
    videoFrom: "Vimeo",
    videoLink: "https://vimeo.com/example1",
    images: [
      "https://tse3.mm.bing.net/th?id=OIP.u_g9bk33pjmfmHpPaLlAxgHaJ3&pid=Api",
      "https://tse3.mm.bing.net/th?id=OIP.g14VXuvI8TOktCWLnkVPvwHaJ3&pid=Api"
    ],
    general: ["Backup Power Supply", "Concierge Service"],
    indoor: ["Fully Furnished", "Smart Home System"],
    outdoor: ["Balcony", "Parking Space"],
    climate: ["Urban"],
    special: ["Central Location"],
    published: false,
    createdAt: "2024-09-01",
    views: 98
  },
  {
    id: "6",
    title: "Cozy Suburban House",
    description: "A family-friendly house in a peaceful suburban neighborhood with great schools and parks nearby.",
    type: "House",
    listedIn: "For Sale",
    status: "Available",
    price: "₦120,000,000",
    taxRate: "7",
    bedrooms: "4",
    bathrooms: "3",
    kitchens: "1",
    parking: "2",
    country: "Nigeria",
    state: "Ogun",
    city: "Abeokuta",
    zip: "110001",
    address: "12 Peace Avenue, Abeokuta",
    coordinates: "7.1557° N, 3.3451° E",
    videoFrom: "YouTube",
    videoLink: "https://www.youtube.com/watch?v=example2",
    images: [
      "https://tse3.mm.bing.net/th?id=OIP.f1X5wPoCICeKMb5z1UBTXgHaFj&pid=Api",
      "https://tse3.mm.bing.net/th?id=OIP.RxwLXsKuYvwXv8uA6u4VgAHaE7&pid=Api"
    ],
    general: ["Quiet Neighborhood", "Close to Schools"],
    indoor: ["Fireplace", "Laundry Room"],
    outdoor: ["Patio", "Backyard"],
    climate: ["Temperate"],
    special: ["Family-Friendly"],
    published: true,
    createdAt: "2024-09-05",
    views: 76
  }
];
