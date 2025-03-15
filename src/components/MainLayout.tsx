import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import FloatingChatbot from './FloatingChatbot';
import { Home, CreditCard, Calculator, Info, Phone, Menu, X } from 'lucide-react';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/loans', label: 'Loan Products', icon: <CreditCard size={18} /> },
    { path: '/calculator', label: 'Loan Calculator', icon: <Calculator size={18} /> },
    { path: '/about', label: 'About Us', icon: <Info size={18} /> },
    { path: '/contact', label: 'Contact', icon: <Phone size={18} /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      theme === 'dark' ? "bg-gray-900 text-gray-100" : "bg-loan-gray-50 text-loan-gray-800"
    )}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-40 border-b",
        theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center mr-2",
              theme === 'dark' ? "bg-blue-600" : "bg-loan-blue"
            )}>
              <CreditCard size={20} className="text-white" />
            </div>
            <span className={cn(
              "text-xl font-bold",
              theme === 'dark' ? "text-white" : "text-loan-gray-800"
            )}>
              {translate('app.name') || "Loan Advisor"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                  isActive(item.path)
                    ? theme === 'dark'
                      ? "bg-gray-700 text-white"
                      : "bg-loan-blue/10 text-loan-blue"
                    : theme === 'dark'
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-loan-gray-600 hover:bg-loan-gray-100"
                )}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block">
              <LanguageSelector />
            </div>
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md"
            >
              {mobileMenuOpen ? (
                <X size={24} className={theme === 'dark' ? "text-white" : "text-loan-gray-800"} />
              ) : (
                <Menu size={24} className={theme === 'dark' ? "text-white" : "text-loan-gray-800"} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={cn(
            "md:hidden border-t",
            theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          )}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                    isActive(item.path)
                      ? theme === 'dark'
                        ? "bg-gray-700 text-white"
                        : "bg-loan-blue/10 text-loan-blue"
                      : theme === 'dark'
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-loan-gray-600 hover:bg-loan-gray-100"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-3">
                <LanguageSelector />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className={cn(
        "border-t py-6",
        theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={cn(
                "text-lg font-semibold mb-3",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                {translate('app.name') || "Loan Advisor"}
              </h3>
              <p className={cn(
                "text-sm",
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                Your trusted partner for all loan-related information and services.
              </p>
            </div>
            <div>
              <h3 className={cn(
                "text-lg font-semibold mb-3",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                Quick Links
              </h3>
              <ul className={cn(
                "space-y-2 text-sm",
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path}
                      className="hover:underline flex items-center"
                    >
                      <span className="mr-1.5">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={cn(
                "text-lg font-semibold mb-3",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                Contact Us
              </h3>
              <address className={cn(
                "not-italic text-sm",
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                <p>123 Financial Street</p>
                <p>Mumbai, Maharashtra 400001</p>
                <p className="mt-2">Email: info@loanadvisor.com</p>
                <p>Phone: +91 1234567890</p>
              </address>
            </div>
          </div>
          <div className={cn(
            "mt-8 pt-4 border-t text-center text-sm",
            theme === 'dark' ? "border-gray-700 text-gray-400" : "border-gray-200 text-loan-gray-500"
          )}>
            &copy; {new Date().getFullYear()} Loan Advisor. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
};

export default MainLayout; 