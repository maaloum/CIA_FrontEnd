import { apiService } from "./api";

export interface Customer {
  numberOfPolicies: number;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  insuranceCount: number;
  address: string;
  customer: {
    dateOfBirth: string;
    communicationPref: string;
  };
  gender: "male" | "female" | "other" | "prefer_not_to_say";
}

export const customerService = {
  async getCustomers(token: string) {
    const response = await apiService.get<Customer[]>(
      "/admin/customers",
      token
    );
    return response.data;
  },

  async getCustomerById(id: string, token: string) {
    const response = await apiService.get<Customer>(
      `/admin/customers/${id}`,
      token
    );
    return response.data;
  },

  async createCustomer(customer: Omit<Customer, "id">, token: string) {
    const response = await apiService.post<Customer>(
      "/admin/customers",
      customer,
      token
    );
    return response.data;
  },

  async updateCustomer(id: string, customer: Partial<Customer>, token: string) {
    const response = await apiService.put<Customer>(
      `/admin/customers/${id}`,
      customer,
      token
    );
    return response.data;
  },

  async deleteCustomer(id: string, token: string) {
    const response = await apiService.delete<{ message: string }>(
      `/admin/customers/${id}`,
      token
    );
    return {
      message: response.message || "Customer deleted successfully",
    };
  },
};
