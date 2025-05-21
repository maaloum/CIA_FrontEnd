import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  GridIcon,
  ListIcon,
  DollarLineIcon,
  DocsIcon,
  UserIcon,
  ChatIcon,
  PieChartIcon,
  PlugInIcon,
  BoxIcon,
} from "../../icons";

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

interface SidebarProps {
  navItems: NavItem[];
}

export default function Sidebar({ navItems }: SidebarProps) {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "HomeIcon":
        return <GridIcon className="h-5 w-5" />;
      case "ListIcon":
        return <ListIcon className="h-5 w-5" />;
      case "DollarLineIcon":
        return <DollarLineIcon className="h-5 w-5" />;
      case "DocsIcon":
        return <DocsIcon className="h-5 w-5" />;
      case "UserIcon":
        return <UserIcon className="h-5 w-5" />;
      case "ChatIcon":
        return <ChatIcon className="h-5 w-5" />;
      case "PieChartIcon":
        return <PieChartIcon className="h-5 w-5" />;
      case "PlugInIcon":
        return <PlugInIcon className="h-5 w-5" />;
      case "RefreshIcon":
        return <BoxIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* User Info */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900">
            <UserIcon className="h-full w-full p-2 text-brand-500 dark:text-brand-400" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
            >
              {getIcon(item.icon)}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <Link
          to="/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <UserIcon className="h-5 w-5" />
          Logout
        </Link>
      </div>
    </div>
  );
}
