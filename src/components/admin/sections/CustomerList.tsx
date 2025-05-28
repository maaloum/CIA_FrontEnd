import { useState, useEffect } from "react";
import { ListIcon } from "../../../icons";
import Input from "../../form/input/InputField";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { customerService, Customer } from "../../../services/customerService";
import Button from "../../ui/Button";
import { Modal } from "../../ui/modal";
import { Tab } from "@headlessui/react";
import Label from "../../form/Label";
import { useHeader } from "../../../context/HeaderContext";

type CustomerStatus = "ACTIVE" | "INACTIVE" | "PENDING";

interface Policy {
  id: string;
  type: "home" | "car" | "life";
  policyNumber: string;
  startDate: string;
  endDate: string;
  price: number;
  coverage: string;
  status: "active" | "pending" | "expired";
  premium: number;
  paymentFrequency: "monthly" | "quarterly" | "annually";
  nextPaymentDate: string;
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

export default function CustomerList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<CustomerStatus | "all">(
    "all"
  );
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSelector((state: RootState) => state.auth);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerPolicies, setCustomerPolicies] = useState<Policy[]>([]);
  const { hideHeader, showHeader } = useHeader();

  const fetchCustomers = async () => {
    if (!token) {
      setError("No authentication token available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await customerService.getCustomers(token);
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewProfile = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowProfileModal(true);
    hideHeader();
    // TODO: Fetch customer policies and documents
    // For now using mock data
    setCustomerPolicies([
      {
        id: "1",
        type: "car",
        policyNumber: "POL-2024-001",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        price: 850.0,
        coverage: "Comprehensive",
        status: "active",
        premium: 850.0,
        paymentFrequency: "monthly",
        nextPaymentDate: "2024-04-01",
        documents: [
          {
            id: "1",
            name: "Policy Document",
            type: "pdf",
            url: "/documents/policy-1.pdf",
          },
          {
            id: "2",
            name: "Vehicle Registration",
            type: "pdf",
            url: "/documents/vehicle-reg.pdf",
          },
        ],
      },
      {
        id: "2",
        type: "home",
        policyNumber: "POL-2024-002",
        startDate: "2024-02-01",
        endDate: "2025-01-31",
        price: 1200.0,
        coverage: "Full Coverage",
        status: "active",
        premium: 1200.0,
        paymentFrequency: "quarterly",
        nextPaymentDate: "2024-04-01",
        documents: [
          {
            id: "3",
            name: "Policy Document",
            type: "pdf",
            url: "/documents/policy-2.pdf",
          },
          {
            id: "4",
            name: "Property Documents",
            type: "pdf",
            url: "/documents/property-docs.pdf",
          },
        ],
      },
    ]);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    showHeader();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPolicyTypeColor = (type: string) => {
    switch (type) {
      case "home":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "car":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "life":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "INACTIVE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500 dark:text-gray-400">
          Loading customers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <ListIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as CustomerStatus | "all")
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </select>
          {/* <Button variant="primary">Add Customer</Button> */}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Insurance
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {customer.firstName} {customer.lastName}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {customer.email}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {customer.phone}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                      customer.status
                    )}`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {customer.numberOfPolicies} policies
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProfile(customer)}
                    >
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={handleCloseProfileModal}
        className="max-w-[900px] m-4 z-[9999]"
        showCloseButton={false}
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <button
            onClick={handleCloseProfileModal}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div className="px-2 pr-14">
         
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              View customer details, policies, and documents
            </p>
          </div>

          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${
                    selected
                      ? "bg-white text-brand-600 shadow dark:bg-gray-700 dark:text-brand-400"
                      : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                  }`
                }
              >
                Profile
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${
                    selected
                      ? "bg-white text-brand-600 shadow dark:bg-gray-700 dark:text-brand-400"
                      : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                  }`
                }
              >
                Policies
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${
                    selected
                      ? "bg-white text-brand-600 shadow dark:bg-gray-700 dark:text-brand-400"
                      : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                  }`
                }
              >
                Documents
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-6">
              <Tab.Panel>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label>First Name</Label>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedCustomer?.firstName}
                    </div>
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedCustomer?.lastName}
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedCustomer?.email}
                    </div>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedCustomer?.phone}
                    </div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedCustomer?.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedCustomer?.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="space-y-4">
                  {customerPolicies.map((policy) => (
                    <div
                      key={policy.id}
                      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPolicyTypeColor(
                              policy.type
                            )}`}
                          >
                            {policy.type}
                          </span>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              Policy #{policy.policyNumber}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {policy.startDate} - {policy.endDate}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                            policy.status
                          )}`}
                        >
                          {policy.status}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Coverage</Label>
                          <div className="mt-1 text-sm text-gray-900 dark:text-white">
                            {policy.coverage}
                          </div>
                        </div>
                        <div>
                          <Label>Premium</Label>
                          <div className="mt-1 text-sm text-gray-900 dark:text-white">
                            {formatCurrency(policy.premium)}
                          </div>
                        </div>
                        <div>
                          <Label>Payment Frequency</Label>
                          <div className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                            {policy.paymentFrequency}
                          </div>
                        </div>
                        <div>
                          <Label>Next Payment</Label>
                          <div className="mt-1 text-sm text-gray-900 dark:text-white">
                            {policy.nextPaymentDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="space-y-4">
                  {customerPolicies.map((policy) => (
                    <div
                      key={policy.id}
                      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                        Policy #{policy.policyNumber} Documents
                      </h3>
                      <div className="space-y-2">
                        {policy.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                          >
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {doc.name}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(doc.url, "_blank")}
                            >
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </Modal>
    </div>
  );
}
