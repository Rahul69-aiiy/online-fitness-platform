import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  Settings,
  LogOut,
  CreditCard,
  Menu,
  X,
  Home,
} from "lucide-react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import useAuthStore from "@/store/useAuthStore";

export default function DashboardLayout({ children, role = "student" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // for mobile sidebar
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const studentNav = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Discover Trainers", icon: Search, href: "/trainers" },
    { name: "Payment History", icon: CreditCard, href: "/payment-history" },
    { name: "Messages", icon: MessageSquare, href: "/messages" },
  ];

  const trainerNav = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Dashboard", icon: LayoutDashboard, href: "/trainer/dashboard" },
    { name: "Manage Plans", icon: CreditCard, href: "/trainer/manage-plans" },
    { name: "Messages", icon: MessageSquare, href: "/trainer/messages" },
  ];

  const navItems = role === "trainer" ? trainerNav : studentNav;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar(Desktop)*/}
      <aside className="hidden lg:flex w-64 border-r border-border flex-col bg-card">
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
              <img src="/favicon.svg" alt="physiq logo" className="w-10 h-10 object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight">PhysiQ</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border space-y-1">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8">
          
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 hover:bg-secondary rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-secondary border border-border overflow-hidden">
              <img src={authUser?.avatar || "/user.jpg"} alt={authUser?.name || "User"} className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="w-64 h-full bg-card border-r border-border flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <img src="/favicon.svg" alt="physiq logo" className="w-10 h-10 object-cover" />
                </div>
                <span className="text-xl font-bold">PhysiQ</span>
              </Link>

              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </motion.aside>
        </div>
      )}
    </div>
  );
}