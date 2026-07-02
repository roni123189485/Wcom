export interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  packageType: string;
  quantity: number;
  deliveryArea: 'inside_dhaka' | 'outside_dhaka';
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'Pending' | 'Approved' | 'Shipped' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  ml: number;
  price: number;
  originalPrice: number;
  description: string;
  badge?: string;
  image?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  englishName: string;
  imageUrl: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
}

