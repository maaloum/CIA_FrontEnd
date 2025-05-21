import { useState } from "react";
import { Tab } from "@headlessui/react";
import CustomerList from "./sections/CustomerList";
import AgentManagement from "./sections/AgentManagement";
import ProductsManagement from "./sections/ProductsManagement";
import InsuranceIntegrations from "./sections/InsuranceIntegrations";
import PaymentsBilling from "./sections/PaymentsBilling";
import CommunicationCenter from "./sections/CommunicationCenter";
import RenewalsDashboard from "./sections/RenewalsDashboard";
import ReportsAnalytics from "./sections/ReportsAnalytics";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminDashboard() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabs = [
    { name: "Customer List", component: CustomerList },
    { name: "Agent Management", component: AgentManagement },
    { name: "Products", component: ProductsManagement },
    { name: "Insurance Companies", component: InsuranceIntegrations },
    { name: "Payments & Billing", component: PaymentsBilling },
    { name: "Communication", component: CommunicationCenter },
    { name: "Renewals", component: RenewalsDashboard },
    { name: "Reports", component: ReportsAnalytics },
  ];

  return (
    <div className="w-full px-2 py-4 sm:px-0">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-brand-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-brand-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-brand-700 shadow dark:bg-gray-800 dark:text-white"
                    : "text-brand-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl bg-white p-3 dark:bg-gray-800",
                "ring-white/60 ring-offset-2 ring-offset-brand-400 focus:outline-none focus:ring-2"
              )}
            >
              <tab.component />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
