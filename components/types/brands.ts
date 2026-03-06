export interface Brand {
  _id: string;
  name: string;
  description?: string;
  slug?: string;
  logo?: string;
  website?: string;
  country?: string;
  isActive: boolean;
  productCount?: number;
}