import { Tab } from "@headlessui/react";
import { Customer } from "../../../services/customerService";
import { ProfileCard } from "../profile/ProfileCard";
import { PolicyCard } from "../policy/PolicyCard";
import { DocumentCard } from "../document/DocumentCard";
import { Policy } from "../../../types/policy";
import { Document } from "../../../services/documentService";
import { Button } from "../..//ui/button/Button";

interface CustomerPanelProps {
  customer: Customer;
  policies: Policy[];
  documents: { [key: string]: Document[] };
  isLoadingPolicies: boolean;
  isLoadingDocuments: boolean;
  onClose: () => void;
  onDeleteCustomer: (customer: Customer) => void;
  onEditCustomer?: (customer: Customer) => void;
  onEditPolicy?: (policy: Policy) => void;
  onDeletePolicy?: (policy: Policy) => void;
  onDownloadDocument: (document: Document) => void;
  onDeleteDocument?: (policy: Policy) => void;
  onUploadDocument: (policy: Policy, files: File[]) => void;
}

export const CustomerManagement = ({
  customer,
  policies,
  documents,
  isLoadingPolicies,
  isLoadingDocuments,
  onClose,
  onDeleteCustomer,
  onEditCustomer,
  onEditPolicy,
  onDeletePolicy,
  onDownloadDocument,
  onDeleteDocument,
  onUploadDocument,
}: CustomerPanelProps) => {
  const handleFileUpload = (
    policy: Policy,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUploadDocument(policy, Array.from(files));
    }
  };

  console.log(documents[0]);
  return (
    <div className="relative w-full p-6 overflow-y-auto bg-white no-scrollbar rounded-3xl shadow-lg dark:bg-gray-900 lg:p-12">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
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
            d="M6.22 7.28a.75.75 0 0 1 1.06 0L12 11.94l4.72-4.72a.75.75 0 0 1 1.06 1.06L13.06 13l4.72 4.72a.75.75 0 0 1-1.06 1.06L12 14.06l-4.72 4.72a.75.75 0 1 1-1.06-1.06L10.94 13 6.22 8.28a.75.75 0 0 1 0-1.06z"
            fill="currentColor"
          />
        </svg>
      </button>

      <div className="px-4 pr-14">
        <h4 className="mb-3 text-3xl font-bold text-gray-800 dark:text-white/90">
          Customer Profile
        </h4>
        <p className="mb-6 text-base text-gray-500 dark:text-gray-400">
          View customer details, policies, and documents
        </p>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-gray-100 p-2 dark:bg-gray-800">
          {["Profile", "Policies", "Documents"].map((label) => (
            <Tab
              key={label}
              className={({ selected }) =>
                `w-full rounded-xl py-3 text-sm font-medium transition
            ${
              selected
                ? "bg-white text-brand-600 shadow dark:bg-gray-700 dark:text-brand-400"
                : "text-gray-600 hover:bg-white/20 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
            }`
              }
            >
              {label}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <ProfileCard
              customer={customer}
              onEdit={() => onEditCustomer?.(customer)}
              onDelete={() => onDeleteCustomer(customer)}
            />
          </Tab.Panel>

          <Tab.Panel>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p></p>
                <Button variant="primary">Add New Policy</Button>
              </div>
              {isLoadingPolicies ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600 mx-auto" />
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Loading policies...
                  </p>
                </div>
              ) : policies.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    No policies found for this customer.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {policies.map((policy: Policy) => (
                    <PolicyCard
                      key={policy.id}
                      policy={policy}
                      onEdit={() => onEditPolicy?.(policy)}
                      onDelete={() => onDeletePolicy?.(policy)}
                    />
                  ))}
                </div>
              )}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="space-y-6">
              {isLoadingDocuments ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600 mx-auto" />
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Loading documents...
                  </p>
                </div>
              ) : Object.keys(documents).length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    No policies found for this customer.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {policies.map((policy: Policy) => (
                    <div
                      key={policy.id}
                      className="space-y-5 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Policy Documents - {policy.policyNumber}
                        </h3>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(policy, e)}
                          />
                          <span className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition">
                            Upload Documents
                          </span>
                        </label>
                      </div>

                      {!documents[policy.id] ||
                      documents[policy.id].length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">
                          No documents uploaded for this policy.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {documents[policy.id].map((document) => (
                            <div
                              key={document.id}
                              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-shadow"
                            >
                              <DocumentCard
                                document={document}
                                onDownload={() => onDownloadDocument(document)}
                                onDelete={() => onDeleteDocument?.(policy)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
