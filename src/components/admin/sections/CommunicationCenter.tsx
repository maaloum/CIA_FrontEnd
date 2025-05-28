import { useState } from "react";
import {
  ListIcon,
  PaperPlaneIcon,
  MailIcon,
  UserIcon,
  ChatIcon,
} from "../../../icons";
import Input from "../../form/input/InputField";
import Button from "../../ui/Button";

interface Communication {
  id: string;
  type: "email" | "sms" | "chat";
  recipient: string;
  subject: string;
  content: string;
  status: "sent" | "pending" | "failed";
  date: string;
  priority: "high" | "medium" | "low";
}

export default function CommunicationCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  // Mock data - replace with actual API call
  const communications: Communication[] = [
    {
      id: "1",
      type: "email",
      recipient: "john@example.com",
      subject: "Policy Renewal Reminder",
      content: "Your insurance policy is due for renewal...",
      status: "sent",
      date: "2024-02-20 14:30:00",
      priority: "high",
    },
    {
      id: "2",
      type: "sms",
      recipient: "+1234567890",
      subject: "Payment Confirmation",
      content: "Your payment of $500 has been received...",
      status: "pending",
      date: "2024-02-20 15:00:00",
      priority: "medium",
    },
  ];

  const filteredCommunications = communications.filter((comm) => {
    const matchesSearch =
      comm.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || comm.type === selectedType;
    const matchesPriority =
      selectedPriority === "all" || comm.priority === selectedPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <MailIcon className="h-5 w-5" />;
      case "sms":
        return <UserIcon className="h-5 w-5" />;
      case "chat":
        return <ChatIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <ListIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search communications..."
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
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="chat">Chat</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <Button variant="primary" className="flex items-center gap-2">
            <PaperPlaneIcon className="h-5 w-5" />
            New Message
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Recipient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {filteredCommunications.map((comm) => (
              <tr key={comm.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    {getTypeIcon(comm.type)}
                    <span className="ml-2 capitalize">{comm.type}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {comm.recipient}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {comm.subject}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {comm.content.substring(0, 50)}...
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPriorityColor(
                      comm.priority
                    )}`}
                  >
                    {comm.priority}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                      comm.status
                    )}`}
                  >
                    {comm.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {comm.date}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
