import { useState, useEffect } from "react";
import { Card } from "../ui/card/Card";
import { CardHeader } from "../ui/card/CardHeader";
import { CardBody } from "../ui/card/CardBody";
import { Button } from "../ui/button/Button";
import { Input } from "../ui/input/Input";
import { Select } from "../ui/select/Select";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import Label from "../form/Label";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/slices/authSlice";
import { RootState, AppDispatch } from "../../store";
import { toast } from "react-hot-toast";
import { customerService, Customer } from "../../services/customerService";
import { Tab } from "@headlessui/react";
import ConfirmationPopup from "../ui/popup/ConfirmationPopup";
import { useHeader } from "../../context/HeaderContext";

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

export default function Customers() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, token } = useSelector((state: RootState) => state.auth);
  const { hideHeader, showHeader } = useHeader();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { isOpen, openModal, closeModal } = useModal();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [customerPolicies, setCustomerPolicies] = useState<Policy[]>([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    communicationPref: "",
    password: "",
    gender: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const data = await customerService.getCustomers(token);
      setCustomers(data);
    } catch (error) {
      toast.error("Failed to fetch customers");
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomer = () => {
    openModal();
  };

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const registrationData = {
        ...formData,
        role: "CUSTOMER",
      };

      const result = await dispatch(register(registrationData));
      if (register.fulfilled.match(result)) {
        toast.success("Customer registered successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          dateOfBirth: "",
          communicationPref: "",
          password: "",
          gender: "",
          status: "ACTIVE",
        });
        closeModal();
        fetchCustomers();
      } else if (register.rejected.match(result)) {
        toast.error(result.payload || "Registration failed");
      }
    } catch (err) {
      toast.error("An error occurred during registration");
      console.error("Registration failed:", err);
    }
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeletePopup(true);
    hideHeader();
  };

  const handleDeleteConfirm = async () => {
    if (!token || !customerToDelete) return;

    try {
      setDeletingId(customerToDelete.id);
      await customerService.deleteCustomer(customerToDelete.id, token);
      toast.success("Customer deleted successfully");
      // Remove the deleted customer from the local state
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== customerToDelete.id)
      );
    } catch (error) {
      toast.error("Failed to delete customer");
      console.error("Error deleting customer:", error);
    } finally {
      setDeletingId(null);
      setCustomerToDelete(null);
      setShowDeletePopup(false);
      showHeader();
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Customer Management
        </h1>
        <Button variant="primary" onClick={handleAddCustomer}>
          Add New Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-40"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {customer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {`${customer.firstName} ${customer.lastName}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            customer.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProfile(customer)}
                          >
                            Manage
                          </Button>
                          {/* <Button variant="outline" size="sm">
                            Edit
                          </Button> */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDeleteClick(customer)}
                            disabled={deletingId === customer.id}
                          >
                            {deletingId === customer.id
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] m-4 z-[9999]"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add New Customer
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Fill in the customer details below to add them to the system.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>
                    First Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter customer's first name"
                    required
                  />
                </div>

                <div>
                  <Label>
                    Last Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter customer's last name"
                    required
                  />
                </div>

                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter customer's email"
                    required
                  />
                </div>

                <div>
                  <Label>
                    Phone<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter customer's phone number"
                    required
                  />
                </div>

                <div>
                  <Label>
                    Address<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter customer's address"
                    required
                  />
                </div>

                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter customer's password"
                    required
                  />
                </div>

                <div>
                  <Label>
                    Date of Birth<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label>
                    Gender<span className="text-error-500">*</span>
                  </Label>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </Select>
                </div>

                <div>
                  <Label>
                    Communication Preference
                    <span className="text-error-500">*</span>
                  </Label>
                  <Select
                    name="communicationPref"
                    value={formData.communicationPref}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select preference</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="phone">Phone</option>
                  </Select>
                </div>

                <div>
                  <Label>
                    Status<span className="text-error-500">*</span>
                  </Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? "Registering..." : "Register Customer"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

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
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Customer Profile
            </h4>
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
                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleDeleteClick(selectedCustomer!)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 6H5H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 11V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 11V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
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
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                              policy.status
                            )}`}
                          >
                            {policy.status}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 6H5H21"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10 11V17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M14 11V17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Button>
                        </div>
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
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                onClick={() => window.open(doc.url, "_blank")}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M7 10L12 15L17 10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M12 15V3"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3 6H5H21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M10 11V17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M14 11V17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2"
                          >
                            <path
                              d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M17 8L12 3L7 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 3V15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Upload New Document
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationPopup
        isOpen={showDeletePopup}
        onClose={() => {
          setShowDeletePopup(false);
          setCustomerToDelete(null);
          showHeader();
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customerToDelete?.firstName} ${customerToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
