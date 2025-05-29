import { useState } from "react";
import { Button } from "../button/Button";
import { Input } from "../input/Input";
import { Select } from "../select/Select";
import Label from "../../form/Label";

interface AddCustomerProps {
  onSubmit: (formData: CustomerFormData) => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  communicationPref: string;
  password: string;
  gender: string;
  status: string;
}

export const AddCustomer = ({
  onSubmit,
  onClose,
  loading,
}: AddCustomerProps) => {
  const [formData, setFormData] = useState<CustomerFormData>({
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
    await onSubmit(formData);
  };

  return (
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
            onClick={onClose}
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
  );
};
