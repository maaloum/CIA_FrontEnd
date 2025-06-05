import { useState, useEffect } from "react";
import { ListIcon } from "../../../icons";
import Input from "../../form/input/InputField";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { customerService, Customer } from "../../../services/customerService";
import Button from "../../ui/Button";
import { Modal } from "../../ui/modal";
import { useHeader } from "../../../context/HeaderContext";
import { policyService } from "../../../services/policyService";
import toast from "react-hot-toast";
import {
  documentService,
  DocumentType,
} from "../../../services/documentService";
import { CustomerManagement } from "../../ui/customer/CustomerManagement";
import { Policy } from "../../../types/policy";

type CustomerStatus = "ACTIVE" | "INACTIVE" | "PENDING";

// interface Policy {
//   id: string;
//   type: "home" | "car" | "life";
//   policyNumber: string;
//   startDate: string;
//   endDate: string;
//   price: number;
//   coverage: string;
//   status: "active" | "pending" | "expired";
//   premium: number;
//   paymentFrequency: "monthly" | "quarterly" | "annually";
//   nextPaymentDate: string;
//   documents: {
//     id: string;
//     name: string;
//     type: string;
//     url: string;
//   }[];
// }

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
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);
  const [documents, setDocuments] = useState<{ [key: string]: DocumentType[] }>(
    {}
  );
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
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
    if (!token) {
      toast.error("Authentication token is missing");
      return;
    }

    setSelectedCustomer(customer);
    setShowProfileModal(true);
    hideHeader();
    setIsLoadingPolicies(true);
    setIsLoadingDocuments(true);
    try {
      const policyData = await policyService.getPolicyById(customer.id, token);

      const documentsDataArray = await Promise.all(
        policyData.map((policy) =>
          documentService.getPolicyDocuments(policy.id, token)
        )
      );

      // Create a flat map of documents by policyId
      const documentsByPolicyId: { [key: string]: DocumentType[] } = {};
      policyData.forEach((policy, index) => {
        documentsByPolicyId[policy.id] = Array.isArray(
          documentsDataArray[index]
        )
          ? documentsDataArray[index].flat()
          : [];
      });

      setPolicies(policyData);
      setDocuments(documentsByPolicyId);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load policy details");
      setPolicies([]);
      setDocuments({});
    } finally {
      setIsLoadingPolicies(false);
      setIsLoadingDocuments(false);
    }
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    showHeader();
  };

  const handleUploadDocument = async (policy: Policy, files: File[]) => {
    if (!token) {
      toast.error("Authentication token is missing");
      return;
    }

    try {
      const uploadedDocuments = await documentService.uploadDocuments(
        files,
        policy.id,
        policy.application.id,
        token
      );

      setDocuments((prev) => ({
        ...prev,
        [policy.id]: [...(prev[policy.id] || []), ...uploadedDocuments],
      }));

      toast.success("Documents uploaded successfully");
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("Failed to upload documents");
    }
  };

  const handleDeleteClick = () => {
    // setCustomerToDelete(customer);
    // setShowDeletePopup(true);
    hideHeader();
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

  const handleDownloadDocument = async (doc: DocumentType) => {
    try {
      const response = await fetch(doc.URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

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
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
        isFullscreen={true}
      >
        {selectedCustomer && (
          <CustomerManagement
            customer={selectedCustomer}
            policies={policies}
            documents={documents}
            isLoadingPolicies={isLoadingPolicies}
            isLoadingDocuments={isLoadingDocuments}
            onClose={handleCloseProfileModal}
            onDeleteCustomer={handleDeleteClick}
            onEditCustomer={(customer) => {
              console.log("Edit customer:", customer.id);
            }}
            onEditPolicy={(policy) => {
              console.log("Edit policy:", policy.id);
            }}
            onDeletePolicy={(policy) => {
              console.log("Delete policy:", policy.id);
            }}
            onDownloadDocument={handleDownloadDocument}
            onDeleteDocument={(policy) => {
              console.log("Delete document for policy:", policy.id);
            }}
            onUploadDocument={handleUploadDocument}
          />
        )}
      </Modal>
    </div>
  );
}
