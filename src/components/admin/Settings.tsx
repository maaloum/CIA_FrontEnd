import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Button from "../ui/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Switch from "../form/switch/Switch";

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  policyUpdates: boolean;
  paymentReminders: boolean;
  marketingEmails: boolean;
  systemAlerts: boolean;
  securityAlerts: boolean;
}

interface Preferences {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

interface AdminSettings {
  maxLoginAttempts: number;
  sessionTimeout: number;
  enableAuditLog: boolean;
  enableTwoFactor: boolean;
  enableIpRestriction: boolean;
}

export default function Settings() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    policyUpdates: true,
    paymentReminders: true,
    marketingEmails: false,
    systemAlerts: true,
    securityAlerts: true,
  });

  const [preferences, setPreferences] = useState<Preferences>({
    language: "English",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    enableAuditLog: true,
    enableTwoFactor: true,
    enableIpRestriction: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (name: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdminSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAdminSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings update logic
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={true}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={true}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={true}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={true}
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          disabled={true}
        />
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Switch
          label="Email Notifications"
          defaultChecked={notifications.emailNotifications}
          onChange={() => handleNotificationChange("emailNotifications")}
        />
        <Switch
          label="SMS Notifications"
          defaultChecked={notifications.smsNotifications}
          onChange={() => handleNotificationChange("smsNotifications")}
        />
        <Switch
          label="Policy Updates"
          defaultChecked={notifications.policyUpdates}
          onChange={() => handleNotificationChange("policyUpdates")}
        />
        <Switch
          label="Payment Reminders"
          defaultChecked={notifications.paymentReminders}
          onChange={() => handleNotificationChange("paymentReminders")}
        />
        <Switch
          label="Marketing Emails"
          defaultChecked={notifications.marketingEmails}
          onChange={() => handleNotificationChange("marketingEmails")}
        />
        <Switch
          label="System Alerts"
          defaultChecked={notifications.systemAlerts}
          onChange={() => handleNotificationChange("systemAlerts")}
        />
        <Switch
          label="Security Alerts"
          defaultChecked={notifications.securityAlerts}
          onChange={() => handleNotificationChange("securityAlerts")}
        />
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="language">Language</Label>
        <select
          id="language"
          name="language"
          value={preferences.language}
          onChange={handlePreferenceChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
          aria-label="Select language"
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
        </select>
      </div>

      <div>
        <Label htmlFor="timezone">Timezone</Label>
        <select
          id="timezone"
          name="timezone"
          value={preferences.timezone}
          onChange={handlePreferenceChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
          aria-label="Select timezone"
        >
          <option value="UTC-5">Eastern Time (UTC-5)</option>
          <option value="UTC-6">Central Time (UTC-6)</option>
          <option value="UTC-7">Mountain Time (UTC-7)</option>
          <option value="UTC-8">Pacific Time (UTC-8)</option>
        </select>
      </div>

      <div>
        <Label htmlFor="dateFormat">Date Format</Label>
        <select
          id="dateFormat"
          name="dateFormat"
          value={preferences.dateFormat}
          onChange={handlePreferenceChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
          aria-label="Select date format"
        >
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>

      <div>
        <Label htmlFor="currency">Currency</Label>
        <select
          id="currency"
          name="currency"
          value={preferences.currency}
          onChange={handlePreferenceChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
          aria-label="Select currency"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
        </select>
      </div>
    </div>
  );

  const renderAdminSection = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="maxLoginAttempts">Maximum Login Attempts</Label>
        <Input
          id="maxLoginAttempts"
          name="maxLoginAttempts"
          type="number"
          min="1"
          max="10"
          value={adminSettings.maxLoginAttempts}
          onChange={handleAdminSettingChange}
        />
      </div>

      <div>
        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
        <Input
          id="sessionTimeout"
          name="sessionTimeout"
          type="number"
          min="5"
          max="120"
          value={adminSettings.sessionTimeout}
          onChange={handleAdminSettingChange}
        />
      </div>

      <div className="space-y-4">
        <Switch
          label="Enable Audit Log"
          defaultChecked={adminSettings.enableAuditLog}
          onChange={() =>
            handleAdminSettingChange({
              target: {
                name: "enableAuditLog",
                type: "checkbox",
                checked: !adminSettings.enableAuditLog,
              },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />
        <Switch
          label="Enable Two-Factor Authentication"
          defaultChecked={adminSettings.enableTwoFactor}
          onChange={() =>
            handleAdminSettingChange({
              target: {
                name: "enableTwoFactor",
                type: "checkbox",
                checked: !adminSettings.enableTwoFactor,
              },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />
        <Switch
          label="Enable IP Restriction"
          defaultChecked={adminSettings.enableIpRestriction}
          onChange={() =>
            handleAdminSettingChange({
              target: {
                name: "enableIpRestriction",
                type: "checkbox",
                checked: !adminSettings.enableIpRestriction,
              },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "notifications"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "preferences"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "admin"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Admin Settings
          </button>
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === "profile" && renderProfileSection()}
        {activeTab === "notifications" && renderNotificationsSection()}
        {activeTab === "preferences" && renderPreferencesSection()}
        {activeTab === "admin" && renderAdminSection()}

        <div className="mt-8 flex justify-end">
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
