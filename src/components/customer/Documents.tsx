import { useState } from "react";
import {
  ListIcon,
  DownloadIcon,
  PlusIcon,
  DocsIcon,
  UserIcon,
  BoxIcon,
  FileIcon,
} from "../../icons";
import Button from "../../components/ui/Button";
import Input from "../../components/form/input/InputField";

interface Document {
  id: string;
  name: string;
  type: "policy" | "id" | "vehicle" | "property" | "other" | "personal";
  policyNumber?: string;
  uploadDate: string;
  expiryDate?: string;
  status: "valid" | "expired" | "pending";
  fileUrl: string;
}

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock data - replace with actual API call
  const documents: Document[] = [
    {
      id: "1",
      name: "Auto Insurance Policy",
      type: "policy",
      policyNumber: "POL-2024-001",
      uploadDate: "2024-01-01",
      expiryDate: "2024-12-31",
      status: "valid",
      fileUrl: "/documents/auto-policy.pdf",
    },
    {
      id: "2",
      name: "Driver's License",
      type: "id",
      uploadDate: "2024-01-01",
      expiryDate: "2025-01-01",
      status: "valid",
      fileUrl: "/documents/drivers-license.pdf",
    },
    {
      id: "3",
      name: "Vehicle Registration",
      type: "vehicle",
      uploadDate: "2024-01-01",
      expiryDate: "2024-12-31",
      status: "valid",
      fileUrl: "/documents/vehicle-reg.pdf",
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || doc.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || doc.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "vehicle":
        return <BoxIcon className="h-6 w-6" />;
      case "property":
        return <FileIcon className="h-6 w-6" />;
      case "personal":
        return <UserIcon className="h-6 w-6" />;
      case "policy":
        return <DocsIcon className="h-6 w-6" />;
      default:
        return <ListIcon className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <ListIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
            aria-label="Filter by document type"
          >
            <option value="all">All Types</option>
            <option value="policy">Policies</option>
            <option value="id">ID Documents</option>
            <option value="vehicle">Vehicle Documents</option>
            <option value="property">Property Documents</option>
            <option value="other">Other</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
            aria-label="Filter by document status"
          >
            <option value="all">All Status</option>
            <option value="valid">Valid</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>
          <Button variant="primary" className="w-full sm:w-auto">
            <PlusIcon className="mr-2 h-5 w-5" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getDocumentIcon(doc.type)}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {doc.name}
                  </h3>
                  {doc.policyNumber && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Policy #{doc.policyNumber}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                  doc.status
                )}`}
              >
                {doc.status}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Upload Date
                </span>
                <span className="text-gray-900 dark:text-white">
                  {doc.uploadDate}
                </span>
              </div>
              {doc.expiryDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Expiry Date
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {doc.expiryDate}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
              >
                <DownloadIcon className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Instructions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Document Upload Instructions
        </h3>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <li>Accepted file formats: PDF, JPG, PNG</li>
          <li>Maximum file size: 10MB</li>
          <li>Make sure documents are clear and legible</li>
          <li>All documents must be current and valid</li>
          <li>Keep your documents up to date to avoid policy issues</li>
        </ul>
      </div>
    </div>
  );
}
