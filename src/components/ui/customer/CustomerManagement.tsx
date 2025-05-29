import { Tab } from "@headlessui/react";
import { Customer } from "../../../services/customerService";
import { Policy } from "../../../services/policyService";
import { ProfileCard } from "../profile/ProfileCard";
import { PolicyCard } from "../policy/PolicyCard";
import { DocumentCard } from "../document/DocumentCard";

interface CustomerPanelProps {
  customer: Customer;
  policies: Policy[];
  isLoadingPolicies: boolean;
  onClose: () => void;
  onDeleteCustomer: (customer: Customer) => void;
  onEditCustomer?: (customer: Customer) => void;
  onEditPolicy?: (policy: Policy) => void;
  onDeletePolicy?: (policy: Policy) => void;
  onDownloadDocument?: (policy: Policy) => void;
  onDeleteDocument?: (policy: Policy) => void;
  onUploadDocument?: (policy: Policy) => void;
}

export const CustomerManagement = ({
  customer,
  policies,
  isLoadingPolicies,
  onClose,
  onDeleteCustomer,
  onEditCustomer,
  onEditPolicy,
  onDeletePolicy,
  onDownloadDocument,
  onDeleteDocument,
  onUploadDocument,
}: CustomerPanelProps) => {
  console.log("passed props", policies);
  return (
    <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
      <button
        onClick={onClose}
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
            <ProfileCard
              customer={customer}
              onEdit={() => onEditCustomer?.(customer)}
              onDelete={() => onDeleteCustomer(customer)}
            />
          </Tab.Panel>
          <Tab.Panel>
            <div className="space-y-6">
              {isLoadingPolicies ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Loading policies...
                  </p>
                </div>
              ) : policies.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    No policies found for this customer.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {policies[0].map((policy) => (
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
            <div className="space-y-4">
              {isLoadingPolicies ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Loading documents...
                  </p>
                </div>
              ) : policies.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    No documents found for this customer.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <DocumentCard
                      key={policy.id}
                      policy={policy}
                      onDownload={() => onDownloadDocument?.(policy)}
                      onDelete={() => onDeleteDocument?.(policy)}
                      onUpload={() => onUploadDocument?.(policy)}
                    />
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
