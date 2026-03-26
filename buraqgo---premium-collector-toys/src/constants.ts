import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "LE MANS '66 PROTOTYPE",
    description: "A precision-engineered 1:18 scale model of the legendary Le Mans winner. Features opening doors and detailed engine bay.",
    price: 1250,
    category: "cars",
    type: "Ecurie Series",
    ageGroup: "13+",
    scale: "1:18 SCALE",
    images: ["https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=800"],
    stock: 10,
    featured: true
  },
  {
    id: "2",
    name: "DARK MATTER EDITION",
    description: "Limited edition aerodynamic supercar model. 1:8 scale with working suspension and steering.",
    price: 3800,
    category: "cars",
    type: "Aero Dynamics",
    ageGroup: "18+",
    scale: "1:8 SCALE",
    images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"],
    stock: 5,
    featured: true
  },
  {
    id: "3",
    name: "V12 COMPONENT BLOCK",
    description: "Detailed mechanical model of a V12 engine. Perfect for collectors and engineering enthusiasts.",
    price: 850,
    category: "collector",
    type: "Mechanicals",
    ageGroup: "13+",
    images: ["https://images.unsplash.com/photo-1517420812314-8549b17939df?auto=format&fit=crop&q=80&w=800"],
    stock: 15,
    featured: true
  },
  {
    id: "4",
    name: "BLUE HORIZON GT",
    description: "Sleek grand tourer model with a stunning metallic blue finish. New arrival for the L'Artiste collection.",
    price: 1950,
    category: "cars",
    type: "L'Artiste Collection",
    ageGroup: "13+",
    images: ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800"],
    stock: 8,
    featured: true,
    newArrival: true
  }
];
