export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
};

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
    description: "Hand-breaded crispy chicken breast, fiery spicy mayo, fresh lettuce, and dill pickles.",
    price: "$9.49",
    imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: "p3",
    name: "Loaded Bacon Fries",
    description: "Golden crispy fries smothered in premium cheddar cheese sauce, thick-cut bacon bites, and fresh scallions.",
    price: "$5.99",
    imageUrl: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1920&q=80"
  }
];
