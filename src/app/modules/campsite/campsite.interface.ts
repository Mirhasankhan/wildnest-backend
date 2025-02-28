export type Category = "cabin" | "trailer" | "tent";

export interface TCampsite {
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  category: Category;    capacity: number;
  available: boolean;
  pricePerNight: number;
  amenities: string[];  
}


export interface TUpdateCampsite {
  name?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  available?: boolean;
  pricePerNight?: number;
  amenities?: string[];
}

