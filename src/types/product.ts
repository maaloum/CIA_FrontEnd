export interface Product {
  id: string;
  name: string;
  type: "HOME" | "CAR" | "LIFE";
  description: string;
  requirements: string[];
  partners: string[];
  isActive: boolean;
  minPrice: number;
  maxPrice: number;
  actualPrice: number;
}
