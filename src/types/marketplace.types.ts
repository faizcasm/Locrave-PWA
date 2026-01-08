import { User } from './user.types';
import { Location, MarketplaceStatus } from './global.types';

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  seller: User;
  title: string;
  description: string;
  price: number;
  images?: string[];
  category?: string;
  location: Location;
  radius: number;
  status: MarketplaceStatus;
  viewsCount: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  price: number;
  images?: File[];
  category?: string;
  location: Location;
  radius?: number;
  expiresAt?: string;
}

export interface UpdateListingRequest {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  status?: MarketplaceStatus;
}
