export interface CreateServiceInput {
  clinicId: string;
  categoryId: string;
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  durationMinutes: number;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  price: number;
  depositAmount?: number | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateServiceInput {
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  durationMinutes?: number;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  price?: number;
  depositAmount?: number | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface ServiceOutput {
  id: string;
  clinicId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  totalOccupiedMinutes: number;
  price: number;
  depositAmount: number | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
