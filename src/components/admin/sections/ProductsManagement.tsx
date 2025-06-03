import { useState, useEffect } from "react";
import { ListIcon, PencilIcon, TrashBinIcon, PlusIcon } from "../../../icons";
import Input from "../../form/input/InputField";
import Button from "../../ui/Button";
import { Product } from "../../../types/product";
import { productService } from "../../../services/productService";
import AddProductModal from "../../ui/products/AddProductModal";

export default function ProductsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const handleAddProduct = async (productData: {
    name: string;
    type: "HOME" | "CAR" | "LIFE";
    description: string;
    requirements: string[];
    partners: string[];
    isActive: boolean;
    minPrice: number;
    maxPrice: number;
    actualPrice: number;
  }) => {
    try {
      const newProduct = await productService.createProduct(productData);
      setProducts([...products, newProduct]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" || product.type.toLowerCase() === selectedType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/50">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  console.log({ filteredProducts });
  return (
    <div className="space-y-6">
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
        <div className="flex gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            aria-label="Filter by product type"
          >
            <option value="all">All Types</option>
            <option value="home">Home Insurance</option>
            <option value="car">Car Insurance</option>
            <option value="life">Life Insurance</option>
          </select>
          <Button
            variant="primary"
            className="flex items-center gap-2 px-4 py-2"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusIcon className="h-5 w-5" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-gray-700/50"></div>
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                    {product.name}
                  </h3>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 ${
                      product.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-brand-400"
                    aria-label="Edit product"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                    aria-label="Delete product"
                  >
                    <TrashBinIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Requirements
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {product.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Price Information
                  </h4>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Price Range
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${Number(product.minPrice).toLocaleString()} - $
                        {Number(product.maxPrice).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Actual Price
                      </span>
                      <span className="font-medium text-brand-600 dark:text-brand-400">
                        ${Number(product.actualPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
}
