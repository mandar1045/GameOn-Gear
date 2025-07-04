import { Product, Category } from '../types/Product';

export const categories: Category[] = [
  {
    id: 'football',
    name: 'Football',
    sport: 'American Football',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=400&q=80',
    description: 'Professional football equipment and gear',
    productCount: 200
  },
  {
    id: 'basketball',
    name: 'Basketball',
    sport: 'Basketball',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80',
    description: 'Premium basketball shoes, balls, and accessories',
    productCount: 200
  },
  {
    id: 'tennis',
    name: 'Tennis',
    sport: 'Tennis',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=400&q=80',
    description: 'Professional tennis rackets, balls, and apparel',
    productCount: 200
  },
  {
    id: 'swimming',
    name: 'Swimming',
    sport: 'Swimming',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=400&q=80',
    description: 'Swimming gear, goggles, and swimwear',
    productCount: 200
  },
  {
    id: 'running',
    name: 'Running',
    sport: 'Running',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    description: 'Running shoes, apparel, and accessories',
    productCount: 200
  },
  {
    id: 'fitness',
    name: 'Fitness',
    sport: 'Fitness',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
    description: 'Gym equipment, weights, and fitness accessories',
    productCount: 200
  },
  {
    id: 'soccer',
    name: 'Soccer',
    sport: 'Soccer',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=400&q=80',
    description: 'Soccer cleats, balls, and training equipment',
    productCount: 200
  },
  {
    id: 'baseball',
    name: 'Baseball',
    sport: 'Baseball',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=400&q=80',
    description: 'Baseball bats, gloves, and protective gear',
    productCount: 200
  },
  {
    id: 'cricket',
    name: 'Cricket',
    sport: 'Cricket',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80',
    description: 'Cricket bats, balls, pads, and equipment',
    productCount: 200
  },
  {
    id: 'golf',
    name: 'Golf',
    sport: 'Golf',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=400&q=80',
    description: 'Golf clubs, balls, bags, and accessories',
    productCount: 200
  },
  {
    id: 'hockey',
    name: 'Hockey',
    sport: 'Hockey',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
    description: 'Hockey sticks, pucks, skates, and protective gear',
    productCount: 200
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    sport: 'Volleyball',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=400&q=80',
    description: 'Volleyball equipment, nets, and training gear',
    productCount: 200
  },
  {
    id: 'badminton',
    name: 'Badminton',
    sport: 'Badminton',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=400&q=80',
    description: 'Badminton rackets, shuttlecocks, and court equipment',
    productCount: 200
  },
  {
    id: 'boxing',
    name: 'Boxing',
    sport: 'Boxing',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=400&q=80',
    description: 'Boxing gloves, punching bags, and training equipment',
    productCount: 200
  },
  {
    id: 'cycling',
    name: 'Cycling',
    sport: 'Cycling',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
    description: 'Bicycles, helmets, and cycling accessories',
    productCount: 200
  },
  {
    id: 'martial-arts',
    name: 'Martial Arts',
    sport: 'Martial Arts',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=400&q=80',
    description: 'Traditional martial arts uniforms and equipment',
    productCount: 200
  }
];

// Helper function to generate realistic Indian market prices
const generateRealisticPrice = (category: string, productType: string): number => {
  const priceRanges: Record<string, Record<string, [number, number]>> = {
    football: {
      'Cleats': [2500, 15000],
      'Helmet': [3000, 25000],
      'Shoulder Pads': [4000, 18000],
      'Jersey': [800, 3500],
      'Pants': [1200, 4000],
      'Gloves': [600, 2500],
      'Football': [800, 3000],
      'Equipment Bag': [1500, 6000],
      'Training Cone': [200, 800],
      'Agility Ladder': [1000, 3500]
    },
    basketball: {
      'Basketball Shoes': [2000, 18000],
      'Basketball': [800, 4500],
      'Jersey': [600, 3000],
      'Shorts': [500, 2500],
      'Compression Tights': [800, 3500],
      'Knee Pad': [400, 1500],
      'Headband': [200, 800],
      'Wristband': [150, 600],
      'Basketball Hoop': [8000, 45000],
      'Equipment Bag': [1200, 5000]
    },
    tennis: {
      'Tennis Racket': [1500, 25000],
      'Tennis Balls': [300, 1200],
      'Tennis Shoes': [2000, 15000],
      'Polo Shirt': [800, 4000],
      'Shorts': [600, 3000],
      'Skirt': [700, 3500],
      'Visor': [400, 1500],
      'Wristband': [200, 800],
      'String': [500, 2000],
      'Racket Bag': [1500, 8000]
    },
    swimming: {
      'Goggles': [500, 3500],
      'Swimsuit': [800, 6000],
      'Swim Cap': [200, 1000],
      'Kickboard': [600, 2500],
      'Fins': [800, 4000],
      'Snorkel': [600, 3000],
      'Towel': [400, 2000],
      'Swim Bag': [800, 3500],
      'Stopwatch': [1000, 8000],
      'Pool Noodle': [300, 1200]
    },
    running: {
      'Running Shoes': [2500, 20000],
      'Running Shorts': [600, 3000],
      'Running Tights': [800, 4500],
      'Tank Top': [500, 2500],
      'T-Shirt': [600, 3500],
      'Long Sleeve': [800, 4000],
      'Jacket': [1500, 8000],
      'Cap': [400, 1500],
      'Socks': [300, 1200],
      'GPS Watch': [8000, 60000]
    },
    fitness: {
      'Dumbbells': [800, 8000],
      'Kettlebell': [1200, 6000],
      'Resistance Bands': [400, 2500],
      'Yoga Mat': [600, 4000],
      'Foam Roller': [800, 3500],
      'Medicine Ball': [1000, 5000],
      'Treadmill': [25000, 200000],
      'Exercise Bike': [15000, 150000],
      'Barbell': [2000, 15000],
      'Weight Plates': [1500, 8000]
    },
    soccer: {
      'Soccer Cleats': [1500, 12000],
      'Soccer Ball': [500, 3500],
      'Jersey': [600, 4000],
      'Shorts': [400, 2000],
      'Shin Guards': [300, 1500],
      'Goalkeeper Gloves': [800, 5000],
      'Training Cone': [150, 600],
      'Goal': [5000, 35000],
      'Net': [800, 4000],
      'Equipment Bag': [1000, 4500]
    },
    baseball: {
      'Baseball Bat': [1500, 15000],
      'Baseball Glove': [2000, 12000],
      'Baseball': [300, 1500],
      'Helmet': [1500, 8000],
      'Cleats': [2000, 12000],
      'Jersey': [800, 3500],
      'Pants': [800, 3000],
      'Cap': [400, 1500],
      'Catcher Gear': [8000, 35000],
      'Equipment Bag': [1500, 6000]
    },
    cricket: {
      'Cricket Bat': [1000, 25000],
      'Cricket Ball': [200, 1500],
      'Batting Pads': [1500, 8000],
      'Wicket Keeping Gloves': [1200, 6000],
      'Batting Gloves': [500, 3000],
      'Helmet': [2000, 12000],
      'Cricket Shoes': [1500, 8000],
      'Jersey': [600, 3000],
      'Stumps': [800, 3500],
      'Kit Bag': [2000, 10000]
    },
    golf: {
      'Driver': [8000, 50000],
      'Iron Set': [15000, 80000],
      'Putter': [3000, 25000],
      'Golf Balls': [800, 4000],
      'Golf Bag': [5000, 35000],
      'Golf Shoes': [3000, 20000],
      'Golf Glove': [500, 2500],
      'Tees': [100, 500],
      'Golf Cart': [80000, 400000],
      'Range Finder': [8000, 40000]
    },
    hockey: {
      'Hockey Stick': [1500, 12000],
      'Hockey Skates': [5000, 35000],
      'Helmet': [3000, 15000],
      'Shoulder Pads': [4000, 20000],
      'Gloves': [2000, 12000],
      'Shin Pads': [1500, 8000],
      'Hockey Pants': [3000, 15000],
      'Puck': [200, 800],
      'Goal': [15000, 80000],
      'Equipment Bag': [2500, 12000]
    },
    volleyball: {
      'Volleyball': [600, 4000],
      'Volleyball Shoes': [2000, 12000],
      'Knee Pads': [400, 2000],
      'Jersey': [500, 2500],
      'Shorts': [400, 2000],
      'Net': [1500, 8000],
      'Ball Cart': [3000, 15000],
      'Training Aids': [800, 4000],
      'Equipment Bag': [1000, 4500],
      'Whistle': [200, 800]
    },
    badminton: {
      'Badminton Racket': [800, 15000],
      'Shuttlecocks': [300, 1500],
      'Badminton Shoes': [1500, 10000],
      'Grip Tape': [100, 500],
      'String': [300, 1500],
      'Net': [1000, 5000],
      'Court Mat': [5000, 25000],
      'Racket Bag': [800, 4000],
      'Kit Bag': [1200, 6000],
      'Stringing Machine': [8000, 40000]
    },
    boxing: {
      'Boxing Gloves': [800, 8000],
      'Heavy Bag': [3000, 20000],
      'Speed Bag': [1000, 6000],
      'Focus Mitts': [800, 4000],
      'Hand Wraps': [200, 1000],
      'Mouthguard': [300, 1500],
      'Headgear': [1500, 8000],
      'Boxing Shoes': [2000, 12000],
      'Shorts': [600, 3000],
      'Equipment Bag': [1200, 6000]
    },
    cycling: {
      'Road Bike': [25000, 300000],
      'Mountain Bike': [20000, 250000],
      'Hybrid Bike': [15000, 80000],
      'Electric Bike': [40000, 200000],
      'Helmet': [800, 8000],
      'Cycling Shoes': [2000, 15000],
      'Jersey': [800, 4000],
      'Shorts': [600, 3500],
      'Gloves': [400, 2000],
      'Bike Computer': [3000, 25000]
    },
    'martial-arts': {
      'Gi': [1500, 8000],
      'Belt': [300, 2000],
      'Gloves': [800, 5000],
      'Shin Guards': [600, 3000],
      'Headgear': [1000, 6000],
      'Mouthguard': [200, 1000],
      'Focus Mitts': [800, 4000],
      'Heavy Bag': [3000, 20000],
      'Training Dummy': [8000, 40000],
      'Equipment Bag': [1200, 6000]
    }
  };

  const categoryRanges = priceRanges[category];
  if (!categoryRanges) {
    return Math.floor(Math.random() * 5000) + 500; // Default range
  }

  const productRange = categoryRanges[productType];
  if (!productRange) {
    // Use a default range for the category
    const allRanges = Object.values(categoryRanges);
    const avgMin = allRanges.reduce((sum, range) => sum + range[0], 0) / allRanges.length;
    const avgMax = allRanges.reduce((sum, range) => sum + range[1], 0) / allRanges.length;
    return Math.floor(Math.random() * (avgMax - avgMin)) + avgMin;
  }

  const [min, max] = productRange;
  const price = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Round to nearest 50 for realistic pricing
  return Math.round(price / 50) * 50;
};

// Helper function to generate random ratings
const generateRating = () => {
  return Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0
};

// Helper function to generate random review count
const generateReviews = () => {
  return Math.floor(Math.random() * 500) + 10;
};

// Real product images for different categories
const footballImages = [
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
];

const basketballImages = [
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80',
];

const tennisImages = [
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=400&q=80',
];

const swimmingImages = [
  'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=400&q=80',
];

const runningImages = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
];

const fitnessImages = [
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
];

const soccerImages = [
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
];

const baseballImages = [
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
];

const cricketImages = [
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
];

const golfImages = [
  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
];

const hockeyImages = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
];

const volleyballImages = [
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
];

const badmintonImages = [
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
];

const boxingImages = [
  'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
];

const cyclingImages = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
];

const martialArtsImages = [
  'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
];

// Function to generate products for each category with realistic Indian prices
const generateCategoryProducts = (
  category: string,
  sport: string,
  images: string[],
  productTypes: string[],
  brands: string[]
): Product[] => {
  return Array.from({ length: 200 }, (_, index) => {
    const type = productTypes[index % productTypes.length];
    const brand = brands[index % brands.length];
    const price = generateRealisticPrice(category, type);
    const originalPrice = Math.random() > 0.7 ? price + Math.floor(price * (0.2 + Math.random() * 0.3)) : undefined;
    
    return {
      id: `${category}-${index + 1}`,
      name: `${brand} ${type} Pro ${index + 1}`,
      price,
      originalPrice,
      category: category as any,
      sport,
      image: images[index % images.length],
      description: `Professional ${type.toLowerCase()} designed for optimal performance and ${sport.toLowerCase()} excellence.`,
      features: [
        'Professional grade construction',
        'Enhanced durability',
        'Comfortable fit',
        'Superior performance'
      ],
      inStock: Math.random() > 0.1,
      rating: generateRating(),
      reviews: generateReviews(),
      brand,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'White', 'Red', 'Blue', 'Green'],
      specifications: {
        'Material': 'Premium synthetic',
        'Weight': `${Math.floor(Math.random() * 600) + 200} grams`,
        'Warranty': '1 year'
      }
    };
  });
};

// Football Products (200 items)
const footballProducts = generateCategoryProducts(
  'football',
  'American Football',
  footballImages,
  [
    'Cleats', 'Helmet', 'Shoulder Pads', 'Jersey', 'Pants', 'Gloves', 'Football', 'Kicking Tee',
    'Mouth Guard', 'Compression Shirt', 'Training Cone', 'Agility Ladder', 'Blocking Dummy',
    'Tackle Bag', 'End Zone Marker', 'Yard Marker', 'Whistle', 'Playbook', 'Water Bottle',
    'Equipment Bag', 'Chin Strap', 'Visor', 'Arm Sleeve', 'Knee Pad', 'Thigh Pad'
  ],
  ['Nike', 'Adidas', 'Under Armour', 'Riddell', 'Schutt', 'Wilson', 'Spalding', 'Rawlings']
);

// Basketball Products (200 items)
const basketballProducts = generateCategoryProducts(
  'basketball',
  'Basketball',
  basketballImages,
  [
    'Basketball Shoes', 'Basketball', 'Jersey', 'Shorts', 'Compression Tights', 'Shooting Sleeve',
    'Knee Pad', 'Ankle Brace', 'Headband', 'Wristband', 'Socks', 'Warm-up Jacket', 'Tank Top',
    'Training Cone', 'Agility Ladder', 'Resistance Band', 'Jump Rope', 'Medicine Ball',
    'Basketball Hoop', 'Backboard', 'Net', 'Ball Pump', 'Equipment Bag', 'Water Bottle', 'Towel'
  ],
  ['Nike', 'Adidas', 'Jordan', 'Under Armour', 'Puma', 'Spalding', 'Wilson', 'Champion']
);

// Tennis Products (200 items)
const tennisProducts = generateCategoryProducts(
  'tennis',
  'Tennis',
  tennisImages,
  [
    'Tennis Racket', 'Tennis Balls', 'Tennis Shoes', 'Polo Shirt', 'Shorts', 'Skirt', 'Dress',
    'Visor', 'Cap', 'Wristband', 'Headband', 'Socks', 'Warm-up Jacket', 'Training Top',
    'Compression Shorts', 'String', 'Grip Tape', 'Dampener', 'Ball Machine', 'Net',
    'Court Marker', 'Ball Hopper', 'Racket Bag', 'Equipment Bag', 'Water Bottle'
  ],
  ['Wilson', 'Babolat', 'Head', 'Yonex', 'Prince', 'Tecnifibre', 'Nike', 'Adidas']
);

// Swimming Products (200 items)
const swimmingProducts = generateCategoryProducts(
  'swimming',
  'Swimming',
  swimmingImages,
  [
    'Goggles', 'Swimsuit', 'Swim Cap', 'Kickboard', 'Pull Buoy', 'Fins', 'Snorkel', 'Paddles',
    'Nose Clip', 'Ear Plugs', 'Towel', 'Swim Bag', 'Water Bottle', 'Stopwatch', 'Pace Clock',
    'Lane Rope', 'Starting Block', 'Pool Noodle', 'Diving Brick', 'Rescue Tube', 'Whistle',
    'Swim Parka', 'Deck Shoes', 'Mesh Bag', 'Chlorine Remover'
  ],
  ['Speedo', 'TYR', 'Arena', 'Nike', 'Adidas', 'Aqua Sphere', 'Finis', 'Zoggs']
);

// Running Products (200 items)
const runningProducts = generateCategoryProducts(
  'running',
  'Running',
  runningImages,
  [
    'Running Shoes', 'Running Shorts', 'Running Tights', 'Tank Top', 'T-Shirt', 'Long Sleeve',
    'Jacket', 'Vest', 'Cap', 'Visor', 'Socks', 'Compression Sleeves', 'GPS Watch', 'Heart Rate Monitor',
    'Hydration Belt', 'Water Bottle', 'Energy Gels', 'Reflective Vest', 'Headlamp', 'Armband',
    'Running Belt', 'Foam Roller', 'Massage Ball', 'Recovery Boots', 'Insoles'
  ],
  ['Nike', 'Adidas', 'Brooks', 'Asics', 'New Balance', 'Saucony', 'Hoka', 'Mizuno']
);

// Fitness Products (200 items)
const fitnessProducts = generateCategoryProducts(
  'fitness',
  'Fitness',
  fitnessImages,
  [
    'Dumbbells', 'Kettlebell', 'Resistance Bands', 'Yoga Mat', 'Foam Roller', 'Medicine Ball',
    'Battle Rope', 'Pull-up Bar', 'Push-up Handles', 'Ab Wheel', 'Jump Rope', 'Suspension Trainer',
    'Weight Plates', 'Barbell', 'Bench', 'Squat Rack', 'Treadmill', 'Exercise Bike', 'Elliptical',
    'Rowing Machine', 'Protein Shaker', 'Gym Bag', 'Workout Gloves', 'Lifting Belt', 'Knee Sleeves'
  ],
  ['Bowflex', 'NordicTrack', 'Peloton', 'TRX', 'Rogue', 'CAP', 'Yes4All', 'Gaiam']
);

// Soccer Products (200 items)
const soccerProducts = generateCategoryProducts(
  'soccer',
  'Soccer',
  soccerImages,
  [
    'Soccer Cleats', 'Soccer Ball', 'Jersey', 'Shorts', 'Socks', 'Shin Guards', 'Goalkeeper Gloves',
    'Training Cone', 'Agility Ladder', 'Speed Hurdle', 'Goal', 'Net', 'Corner Flag', 'Whistle',
    'Captain Armband', 'Compression Shirt', 'Training Vest', 'Warm-up Jacket', 'Track Pants',
    'Headband', 'Wristband', 'Equipment Bag', 'Ball Pump', 'Water Bottle', 'Coaching Board'
  ],
  ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Umbro', 'Joma', 'Kappa', 'New Balance']
);

// Baseball Products (200 items)
const baseballProducts = generateCategoryProducts(
  'baseball',
  'Baseball',
  baseballImages,
  [
    'Baseball Bat', 'Baseball Glove', 'Baseball', 'Helmet', 'Cleats', 'Jersey', 'Pants', 'Cap',
    'Catcher Gear', 'Chest Protector', 'Shin Guards', 'Mask', 'Batting Gloves', 'Pine Tar',
    'Rosin Bag', 'Equipment Bag', 'Bat Bag', 'Pitching Machine', 'Tee', 'Net', 'Base Set',
    'Pitching Rubber', 'Home Plate', 'Umpire Gear', 'Scorebook'
  ],
  ['Louisville Slugger', 'Rawlings', 'Wilson', 'Easton', 'DeMarini', 'Marucci', 'Mizuno', 'Nike']
);

// Cricket Products (200 items)
const cricketProducts = generateCategoryProducts(
  'cricket',
  'Cricket',
  cricketImages,
  [
    'Cricket Bat', 'Cricket Ball', 'Batting Pads', 'Wicket Keeping Gloves', 'Batting Gloves', 'Helmet',
    'Thigh Guard', 'Arm Guard', 'Chest Guard', 'Abdominal Guard', 'Cricket Shoes', 'Jersey',
    'Trousers', 'Sweater', 'Cap', 'Stumps', 'Bails', 'Boundary Rope', 'Sight Screen',
    'Bowling Machine', 'Practice Net', 'Kit Bag', 'Bat Cover', 'Ball Polish', 'Grip Tape'
  ],
  ['Gray-Nicolls', 'Kookaburra', 'Gunn & Moore', 'SS', 'SG', 'MRF', 'New Balance', 'Adidas']
);

// Golf Products (200 items)
const golfProducts = generateCategoryProducts(
  'golf',
  'Golf',
  golfImages,
  [
    'Driver', 'Iron Set', 'Putter', 'Wedge', 'Golf Balls', 'Golf Bag', 'Golf Shoes', 'Golf Glove',
    'Tees', 'Ball Markers', 'Divot Tool', 'Golf Cart', 'Range Finder', 'GPS Watch', 'Umbrella',
    'Towel', 'Headcover', 'Golf Shirt', 'Golf Pants', 'Golf Shorts', 'Visor', 'Cap',
    'Rain Gear', 'Golf Socks', 'Practice Net'
  ],
  ['Titleist', 'Callaway', 'TaylorMade', 'Ping', 'Mizuno', 'Wilson', 'Cobra', 'Cleveland']
);

// Hockey Products (200 items)
const hockeyProducts = generateCategoryProducts(
  'hockey',
  'Hockey',
  hockeyImages,
  [
    'Hockey Stick', 'Hockey Skates', 'Helmet', 'Shoulder Pads', 'Elbow Pads', 'Gloves', 'Shin Pads',
    'Hockey Pants', 'Protective Cup', 'Jersey', 'Socks', 'Puck', 'Goal', 'Net', 'Goalie Mask',
    'Goalie Pads', 'Goalie Stick', 'Chest Protector', 'Blocker', 'Catcher', 'Skate Guards',
    'Stick Tape', 'Equipment Bag', 'Water Bottle', 'Mouthguard'
  ],
  ['Bauer', 'CCM', 'Warrior', 'Easton', 'Reebok', 'Sherwood', 'True', 'Graf']
);

// Volleyball Products (200 items)
const volleyballProducts = generateCategoryProducts(
  'volleyball',
  'Volleyball',
  volleyballImages,
  [
    'Volleyball', 'Volleyball Shoes', 'Knee Pads', 'Jersey', 'Shorts', 'Socks', 'Net', 'Antenna',
    'Referee Stand', 'Ball Cart', 'Serving Machine', 'Training Aids', 'Blocking Trainer',
    'Spike Trainer', 'Setting Target', 'Court Lines', 'Scoreboard', 'Whistle', 'Equipment Bag',
    'Water Bottle', 'Towel', 'Headband', 'Wristband', 'Compression Sleeve', 'Athletic Tape'
  ],
  ['Mikasa', 'Molten', 'Wilson', 'Spalding', 'Nike', 'Adidas', 'Mizuno', 'Asics']
);

// Badminton Products (200 items)
const badmintonProducts = generateCategoryProducts(
  'badminton',
  'Badminton',
  badmintonImages,
  [
    'Badminton Racket', 'Shuttlecocks', 'Badminton Shoes', 'Grip Tape', 'String', 'Net', 'Posts',
    'Court Mat', 'Training Aids', 'Racket Bag', 'Kit Bag', 'Wristband', 'Headband', 'Socks',
    'Shorts', 'T-Shirt', 'Jersey', 'Tracksuit', 'Towel', 'Water Bottle', 'Feeder Machine',
    'Stringing Machine', 'Tension Meter', 'Overgrip', 'Vibration Dampener'
  ],
  ['Yonex', 'Victor', 'Li-Ning', 'Carlton', 'Wilson', 'Babolat', 'Head', 'Dunlop']
);

// Boxing Products (200 items)
const boxingProducts = generateCategoryProducts(
  'boxing',
  'Boxing',
  boxingImages,
  [
    'Boxing Gloves', 'Heavy Bag', 'Speed Bag', 'Double End Bag', 'Focus Mitts', 'Thai Pads',
    'Hand Wraps', 'Mouthguard', 'Headgear', 'Groin Protector', 'Boxing Shoes', 'Shorts',
    'Tank Top', 'Robe', 'Jump Rope', 'Timer', 'Ring', 'Corner Pads', 'Equipment Bag',
    'Water Bottle', 'Towel', 'Liniment', 'Athletic Tape', 'Reflex Ball', 'Makiwara Board'
  ],
  ['Everlast', 'Title', 'Winning', 'Cleto Reyes', 'Grant', 'Rival', 'Hayabusa', 'Venum']
);

// Cycling Products (200 items)
const cyclingProducts = generateCategoryProducts(
  'cycling',
  'Cycling',
  cyclingImages,
  [
    'Road Bike', 'Mountain Bike', 'Hybrid Bike', 'Electric Bike', 'Helmet', 'Cycling Shoes',
    'Jersey', 'Shorts', 'Gloves', 'Sunglasses', 'Water Bottle', 'Bike Computer', 'Lights',
    'Lock', 'Pump', 'Repair Kit', 'Chain Lube', 'Saddle', 'Pedals', 'Handlebars',
    'Wheels', 'Tires', 'Tubes', 'Bike Bag', 'Trainer'
  ],
  ['Trek', 'Specialized', 'Giant', 'Cannondale', 'Scott', 'Merida', 'Bianchi', 'Cervelo']
);

// Martial Arts Products (200 items)
const martialArtsProducts = generateCategoryProducts(
  'martial-arts',
  'Martial Arts',
  martialArtsImages,
  [
    'Gi', 'Belt', 'Gloves', 'Shin Guards', 'Headgear', 'Mouthguard', 'Groin Protector',
    'Chest Protector', 'Foot Guards', 'Hand Wraps', 'Focus Mitts', 'Kicking Pads',
    'Heavy Bag', 'Speed Bag', 'Makiwara Board', 'Training Dummy', 'Weapons', 'Uniform',
    'Patches', 'Equipment Bag', 'Water Bottle', 'Towel', 'Meditation Mat', 'Books', 'DVDs'
  ],
  ['Century', 'Hayabusa', 'Venum', 'Fairtex', 'Twins Special', 'Top King', 'Windy', 'Raja']
);

// Combine all products
export const products: Product[] = [
  ...footballProducts,
  ...basketballProducts,
  ...tennisProducts,
  ...swimmingProducts,
  ...runningProducts,
  ...fitnessProducts,
  ...soccerProducts,
  ...baseballProducts,
  ...cricketProducts,
  ...golfProducts,
  ...hockeyProducts,
  ...volleyballProducts,
  ...badmintonProducts,
  ...boxingProducts,
  ...cyclingProducts,
  ...martialArtsProducts
];