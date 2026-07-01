import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Search, 
  Settings, 
  Bell, 
  Shield, 
  BarChart2 
} from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Publications', path: '/publication', icon: FileText },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Admin', path: '/admin', icon: Shield },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 }
  ];

  return (
    <aside className="w-64 bg-bg-card border-r border-border min-h-screen hidden md:block">
      <div className="p-6">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-page'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
