import { useState, useEffect } from "react";
import { Card } from "../ui/card/Card";
import { CardHeader } from "../ui/card/CardHeader";
import { CardBody } from "../ui/card/CardBody";
import { Button } from "../ui/button/Button";
import { Input } from "../ui/input/Input";
import { Select } from "../ui/select/Select";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/slices/authSlice";
import { RootState, AppDispatch } from "../../store";
import { toast } from "react-hot-toast";
import { customerService, Customer } from "../../services/customerService";
import { useHeader } from "../../context/HeaderContext";
import { policyService } from "../../services/policyService";
import { documentService, DocumentType } from "../../services/documentService";
import { Policy } from "../../types/policy";
import { CustomerManagement } from "../ui/customer/CustomerManagement";
import ConfirmationPopup from "../ui/popup/ConfirmationPopup";
import { AddCustomer, CustomerFormData } from "../ui/customer/AddCustomer";
import { EditCustomer } from "../ui/customer/EditCustomer";

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
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);
  const [documents, setDocuments] = useState<{ [key: string]: DocumentType[] }>(
    {}
  );
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
    hideHeader();
  };

  const handleCloseModal = () => {
    closeModal();
    showHeader();
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    showHeader();
  };

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

  const handleSubmit = async (formData: CustomerFormData) => {
    try {
      const registrationData = {
        ...formData,
        role: "CUSTOMER",
      };

      const result = await dispatch(register(registrationData));
      if (register.fulfilled.match(result)) {
        toast.success("Customer registered successfully!");
        handleCloseModal();
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
    setShowProfileModal(false);
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

  const handleCloseDeletePopup = () => {
    setShowDeletePopup(false);
    setCustomerToDelete(null);
    showHeader();
  };
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

  const handleEditCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
    hideHeader();
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    // Don't reset selectedCustomer or show header since we want to stay in the profile view
  };

  const handleUpdateCustomer = async (updatedData: Partial<Customer>) => {
    if (!token || !selectedCustomer) return;

    try {
      setIsEditing(true);
      const updatedCustomer = await customerService.updateCustomer(
        selectedCustomer.id,
        updatedData,
        token
      );

      // Update the customer in the local state
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === selectedCustomer.id ? updatedCustomer : customer
        )
      );

      // Update the selected customer if it's currently being viewed
      if (showProfileModal) {
        setSelectedCustomer(updatedCustomer);
      }

      toast.success("Customer updated successfully");
      setShowEditModal(false); // Just close the edit modal
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer");
    } finally {
      setIsEditing(false);
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
        onClose={handleCloseModal}
        className="max-w-[700px] m-4 z-[9999]"
      >
        <AddCustomer
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          loading={loading}
        />
      </Modal>

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
            onEditCustomer={handleEditCustomer}
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

      {/* Edit Customer Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        className="max-w-[700px] m-4 z-[9999]"
      >
        {selectedCustomer && (
          <EditCustomer
            customer={selectedCustomer}
            onSubmit={handleUpdateCustomer}
            onClose={handleCloseEditModal}
            loading={isEditing}
          />
        )}
      </Modal>

      <ConfirmationPopup
        isOpen={showDeletePopup}
        onClose={handleCloseDeletePopup}
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
