// Mock reviews API - structured for easy replacement with real API calls

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  text: string;
}

// In-memory store for mock data
const mockReviewsStore: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user-1',
    userName: 'Alex Johnson',
    rating: 5,
    text: 'Absolutely love these headphones! The noise cancellation is top-notch and the battery life is amazing. Worth every penny.',
    createdAt: '2024-12-10T10:30:00Z',
  },
  {
    id: '2',
    productId: '1',
    userId: 'user-2',
    userName: 'Sarah Miller',
    rating: 4,
    text: 'Great sound quality and very comfortable for long listening sessions. Only minor issue is the app could be better.',
    createdAt: '2024-12-08T14:20:00Z',
  },
  {
    id: '3',
    productId: '1',
    userId: 'user-3',
    userName: 'Mike Chen',
    rating: 5,
    text: 'Best headphones I\'ve ever owned. The build quality is excellent and they look premium.',
    createdAt: '2024-12-05T09:15:00Z',
  },
  {
    id: '4',
    productId: '2',
    userId: 'user-1',
    userName: 'Alex Johnson',
    rating: 4,
    text: 'Solid smartwatch with great fitness tracking features. Battery could be better though.',
    createdAt: '2024-12-09T16:45:00Z',
  },
  {
    id: '5',
    productId: '3',
    userId: 'user-4',
    userName: 'Emily Davis',
    rating: 5,
    text: 'This laptop is a beast! Handles everything I throw at it with ease.',
    createdAt: '2024-12-07T11:00:00Z',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewsApi = {
  // GET /api/reviews?productId={id}
  async getReviews(productId: string): Promise<ReviewsResponse> {
    await delay(300); // Simulate network delay
    
    const reviews = mockReviewsStore.filter(r => r.productId === productId);
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2))
      : 0;
    
    return {
      reviews: reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      averageRating,
      totalReviews,
    };
  },

  // POST /api/reviews
  async createReview(payload: CreateReviewPayload): Promise<Review> {
    await delay(500); // Simulate network delay
    
    // Validation
    if (payload.rating < 1 || payload.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (!payload.text.trim()) {
      throw new Error('Review text is required');
    }
    if (payload.text.length > 1000) {
      throw new Error('Review text must be less than 1000 characters');
    }
    
    const newReview: Review = {
      id: crypto.randomUUID(),
      productId: payload.productId,
      userId: 'current-user', // In real app, this would come from auth
      userName: 'You', // In real app, this would come from user profile
      rating: payload.rating,
      text: payload.text.trim(),
      createdAt: new Date().toISOString(),
    };
    
    mockReviewsStore.push(newReview);
    return newReview;
  },
};
