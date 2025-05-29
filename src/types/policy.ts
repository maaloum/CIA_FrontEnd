export interface Policy {
  id: string;
  policyNumber: string;
  productName: string;
  startDate: string;
  endDate: string;
  premium: number;
  coverage: string;
  renewalStatus: "ACTIVE" | "INACTIVE" | "PENDING";
  application: {
    id: string;
    product: {
      id: string;
      name: string;
      description: string;
      type: string;
    };
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}
