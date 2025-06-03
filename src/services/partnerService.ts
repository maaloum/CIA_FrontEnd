import { apiService } from "./api";

export interface Partner {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export const partnerService = {
  getPartners: async (): Promise<Partner[]> => {
    const token = localStorage.getItem("token") || undefined;
    const response = await apiService.get<Partner[]>("/partners", token);
    return response.data;
  },
};
