import { ApiService } from "./api";
import { Policy } from "../types/policy";
class PolicyService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService("http://localhost:8080/api/v1");
  }

  async getPolicies(token: string): Promise<Policy[]> {
    const response = await this.apiService.get<Policy[]>("/policies", token);
    return response.data;
  }

  async getPolicyById(id: string, token: string): Promise<Policy[]> {
    const response = await this.apiService.get<Policy[]>(
      `/admin/customers/${id}/policies`,
      token
    );
    return response.data;
  }

  async getCustomerPolicies(token: string): Promise<Policy> {
    const response = await this.apiService.get<Policy>(
      `/customer/policies`,
      token
    );
    return response.data;
  }

  async createPolicy(
    policy: Omit<Policy, "id">,
    token: string
  ): Promise<Policy> {
    const response = await this.apiService.post<Policy>(
      "/policies",
      policy,
      token
    );
    return response.data;
  }

  async updatePolicy(
    id: string,
    policy: Partial<Policy>,
    token: string
  ): Promise<Policy> {
    const response = await this.apiService.put<Policy>(
      `/policies/${id}`,
      policy,
      token
    );
    return response.data;
  }

  async deletePolicy(id: string, token: string): Promise<void> {
    await this.apiService.delete<void>(`/policies/${id}`, token);
  }
}

export const policyService = new PolicyService();
