import { useState } from "react";
import { ListIcon, PencilIcon, TrashBinIcon, PlusIcon } from "../../../icons";
import Input from "../../form/input/InputField";
import Button from "../../ui/Button";

interface Product {
  id: string;
  name: string;
  type: "home" | "car" | "life";
  description: string;
  requirements: string[];
  partnerCompanies: string[];
  status: "active" | "inactive";
  price: {
    min: number;
    max: number;
  };
}

export default function ProductsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Mock data - replace with actual API call
  const products: Product[] = [
    {
      id: "1",
      name: "Basic Home Insurance",
      type: "home",
      description: "Comprehensive coverage for your home and belongings",
      requirements: ["Property ownership", "Valid ID", "Property inspection"],
      partnerCompanies: ["Insurance Co A", "Insurance Co B"],
      status: "active",
      price: {
        min: 500,
        max: 2000,
      },
    },
    {
      id: "2",
      name: "Premium Car Insurance",
      type: "car",
      description: "Full coverage for your vehicle with roadside assistance",
      requirements: [
        "Valid driver's license",
        "Vehicle registration",
        "No claims history",
      ],
      partnerCompanies: ["Insurance Co C", "Insurance Co D"],
      status: "active",
      price: {
        min: 300,
        max: 1500,
      },
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || product.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <ListIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
            aria-label="Filter by product type"
          >
            <option value="all">All Types</option>
            <option value="home">Home Insurance</option>
            <option value="car">Car Insurance</option>
            <option value="life">Life Insurance</option>
          </select>
          <Button variant="primary" className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <span
                  className={`mt-1 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    product.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                  aria-label="Edit product"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  aria-label="Delete product"
                >
                  <TrashBinIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {product.description}
            </p>
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Requirements:
                </h4>
                <ul className="mt-1 list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
                  {product.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Partner Companies:
                </h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {product.partnerCompanies.map((company, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Price Range:
                </h4>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  ${product.price.min} - ${product.price.max}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
