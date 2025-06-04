import { useState, useEffect } from "react";
import { CloseIcon } from "../../../icons";
import Input from "../../form/input/InputField";
import Button from "../Button";
import { partnerService, Partner } from "../../../services/partnerService";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: NewProductForm) => void;
}

interface NewProductForm {
  name: string;
  type: "HOME" | "CAR" | "LIFE";
  description: string;
  requirements: string[];
  partners: string[];
  isActive: boolean;
  minPrice: number;
  maxPrice: number;
  actualPrice: number;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onSubmit,
}: AddProductModalProps) {
  const [newProduct, setNewProduct] = useState<NewProductForm>({
    name: "",
    type: "HOME",
    description: "",
    requirements: [],
    partners: [],
    isActive: true,
    minPrice: 0,
    maxPrice: 0,
    actualPrice: 0,
  });

  const [availablePartners, setAvailablePartners] = useState<Partner[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);
  const [partnerError, setPartnerError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchPartners();
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const fetchPartners = async () => {
    try {
      setIsLoadingPartners(true);
      setPartnerError(null);
      const partners = await partnerService.getPartners();
      setAvailablePartners(partners);
    } catch (err) {
      setPartnerError(
        err instanceof Error ? err.message : "Failed to fetch partners"
      );
    } finally {
      setIsLoadingPartners(false);
    }
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...newProduct.requirements];
    updatedRequirements[index] = value;
    setNewProduct((prev) => ({ ...prev, requirements: updatedRequirements }));
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = newProduct.requirements.filter(
      (_, i) => i !== index
    );
    setNewProduct((prev) => ({ ...prev, requirements: updatedRequirements }));
  };

  const handleAddRequirement = () => {
    setNewProduct((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const handlePartnerChange = (index: number, partnerId: string) => {
    const updatedPartners = [...newProduct.partners];
    updatedPartners[index] = partnerId;
    setNewProduct((prev) => ({ ...prev, partners: updatedPartners }));
  };

  const handleRemovePartner = (index: number) => {
    const updatedPartners = newProduct.partners.filter((_, i) => i !== index);
    setNewProduct((prev) => ({ ...prev, partners: updatedPartners }));
  };

  const handleAddPartner = () => {
    setNewProduct((prev) => ({ ...prev, partners: [...prev.partners, ""] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newProduct);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-[1000000] w-full max-w-2xl rounded-xl bg-white shadow-lg dark:bg-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Product
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Name
              </label>
              <Input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Type
              </label>
              <select
                value={newProduct.type}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    type: e.target.value as "HOME" | "CAR" | "LIFE",
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="HOME">Home Insurance</option>
                <option value="CAR">Car Insurance</option>
                <option value="LIFE">Life Insurance</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter product description"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                rows={3}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Requirements
              </label>
              <div className="space-y-2">
                {newProduct.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                      placeholder="Enter requirement"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(index)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
                      >
                        <CloseIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  + Add Requirement
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Partner Companies
              </label>
              <div className="space-y-2">
                {isLoadingPartners ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Loading partners...
                  </div>
                ) : partnerError ? (
                  <div className="text-sm text-red-500 dark:text-red-400">
                    {partnerError}
                  </div>
                ) : (
                  <>
                    {newProduct.partners.map((partnerId, index) => (
                      <div key={index} className="flex gap-2">
                        <select
                          value={partnerId}
                          onChange={(e) =>
                            handlePartnerChange(index, e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        >
                          <option value="">Select a partner</option>
                          {availablePartners.map((partner) => (
                            <option key={partner.id} value={partner.id}>
                              {partner.name}
                            </option>
                          ))}
                        </select>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePartner(index)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
                          >
                            <CloseIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddPartner}
                      className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      + Add Partner
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minimum Price
                </label>
                <Input
                  type="number"
                  value={newProduct.minPrice}
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      minPrice: Number(e.target.value) || 0,
                    }))
                  }
                  min="0"
                  step={0.01}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maximum Price
                </label>
                <Input
                  type="number"
                  value={newProduct.maxPrice}
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      maxPrice: Number(e.target.value) || 0,
                    }))
                  }
                  min="0"
                  step={0.01}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Actual Price
                </label>
                <Input
                  type="number"
                  value={newProduct.actualPrice}
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      actualPrice: Number(e.target.value) || 0,
                    }))
                  }
                  min="0"
                  step={0.01}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Product
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
