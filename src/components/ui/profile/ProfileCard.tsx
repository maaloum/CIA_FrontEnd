import { Customer } from "../../../services/customerService";
import { Button } from "../button/Button";
import Label from "../../form/Label";

interface ProfileCardProps {
  customer: Customer;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProfileCard = ({
  customer,
  onEdit,
  onDelete,
}: ProfileCardProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label>First Name</Label>
          <div className="mt-1 text-sm text-gray-900 dark:text-white">
            {customer.firstName}
          </div>
        </div>
        <div>
          <Label>Last Name</Label>
          <div className="mt-1 text-sm text-gray-900 dark:text-white">
            {customer.lastName}
          </div>
        </div>
        <div>
          <Label>Email</Label>
          <div className="mt-1 text-sm text-gray-900 dark:text-white">
            {customer.email}
          </div>
        </div>
        <div>
          <Label>Phone</Label>
          <div className="mt-1 text-sm text-gray-900 dark:text-white">
            {customer.phone}
          </div>
        </div>
        <div>
          <Label>Status</Label>
          <div className="mt-1">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                customer.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {customer.status}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={onEdit}
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
          onClick={onDelete}
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
    </div>
  );
};
