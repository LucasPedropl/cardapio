export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
};

// Top single-highlight products (burgers and signature items)
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Artisan Double Smash",
    description: "Two 100% Angus beef patties, melted cheddar, caramelized onions, and our signature house sauce on a toasted brioche bun.",
    price: "$11.99",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: "p2",
    name: "Spicy Crispy Chicken",
    description: "Hand-breaded crispy chicken burger, fiery spicy mayo, fresh lettuce, and hand-cut dill pickles.",
    price: "$9.49",
    imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: "p3",
    name: "Loaded Bacon Fries",
    description: "Golden crispy fries smothered in premium cheddar cheese sauce, thick-cut crispy bacon bits, and fresh scallions.",
    price: "$5.99",
    imageUrl: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1920&q=80"
  }
];

// Curated artisan drinks (for the horizontal drinks showcase slide)
export const DRINK_PRODUCTS: Product[] = [
  {
    id: "d1",
    name: "Hibiscus Lemonade",
    description: "Squeezed lemons infused with organic cold-brewed hibiscus petals.",
    price: "$4.50",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "d2",
    name: "Classic Oreo Shake",
    description: "Creamy vanilla bean custard blended with chocolate wafers and fudge.",
    price: "$5.90",
    imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "d3",
    name: "Matcha Latte Ice",
    description: "Ceremonial grade pure green tea stone-ground with oat milk over ice.",
    price: "$4.90",
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80"
  }
];

// Selection of appetizers/sides (for the multi-items grid presentation)
export const GRID_PRODUCTS: Product[] = [
  {
    id: "g1",
    name: "Truffle Garlic Fries",
    description: "House cut fries tossed in cold-pressed white truffle oil and Parmigiano.",
    price: "$6.90",
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "g2",
    name: "Golden Onion Rings",
    description: "Craft beer-battered thick sweet onion rings with smoky aioli.",
    price: "$4.90",
    imageUrl: "https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "g3",
    name: "Flame Grilled Corn",
    description: "Sweet local corn charred with lime butter, cotija cheese, and mild chili.",
    price: "$4.50",
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "g4",
    name: "Mozzarella Basket",
    description: "Herb-crusted whole milk cheese served hot with san marzano dip.",
    price: "$5.50",
    imageUrl: "https://images.unsplash.com/photo-1531749668029-2db88e4b76ce?auto=format&fit=crop&w=600&q=80"
  }
];

// Curated Sweet Desserts
export const DESSERT_PRODUCTS: Product[] = [
  {
    id: "de1",
    name: "Lava Chocolate Cake",
    description: "Warm dark chocolate cake with a molten center, served with authentic madagascar vanilla bean gelato.",
    price: "$7.50",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "de2",
    name: "Berry Mascarpone Tart",
    description: "Crispy sweet crust filled with organic mascarpone creme and loaded with local hand-picked wild berries.",
    price: "$6.90",
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "de3",
    name: "Salted Caramel Brownie",
    description: "Fudgy triple chocolate brownie infused with fleur de sel caramel swirls.",
    price: "$5.50",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80" // Fallback standard dessert
  }
];

// Rich Fresh Salads
export const SALAD_PRODUCTS: Product[] = [
  {
    id: "sa1",
    name: "Avocado Quinoa Bowl",
    description: "Organic tricolor quinoa, sliced Hass avocado, heirloom cherry tomatoes, wild arugula, and citrus vinaigrette dressing.",
    price: "$10.50",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sa2",
    name: "Tuscan Grilled Caesar",
    description: "Lightly charred romaine hearts, shaved artisan pecorino romano cheese, herb sourdough croutons, and house garlic caesar.",
    price: "$9.00",
    imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80"
  }
];

