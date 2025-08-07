export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: 'freelancer' | 'client';
  memberSince: string;
  location: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  imageUrl: string;
  images: string[];
  freelancer: User;
  rating: number;
  totalReviews: number;
  reviews: Review[];
  tags: string[];
}

export interface Review {
  id: string;
  author: User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  gig: Gig;
  client: User;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  orderDate: string;
  deliveryDate?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage: { text: string; timestamp: string };
  unreadCount: number;
} 