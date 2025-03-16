import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import FloatingChatbot from './FloatingChatbot';
import { Home, CreditCard, Calculator, Info, Phone, Menu, X } from 'lucide-react';
import { TranslatableText } from './TranslatableText';

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
    { path: '/loans', label: 'Loans', icon: <CreditCard size={18} /> },
    { path: '/calculator', label: 'Calculator', icon: <Calculator size={18} /> },
    { path: '/about', label: 'About Us', icon: <Info size={18} /> },
    { path: '/contact', label: 'Contact Us', icon: <Phone size={18} /> },
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
              <TranslatableText text={translate('app.name') || "Loan Advisor"} />
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
                <TranslatableText text={item.label} />
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
            "md:hidden fixed inset-0 z-30 pt-16",
            theme === 'dark' ? "bg-gray-800/95" : "bg-white/95"
          )}>
            <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-md text-base font-medium flex items-center",
                    isActive(item.path)
                      ? theme === 'dark'
                        ? "bg-gray-700 text-white"
                        : "bg-loan-blue/10 text-loan-blue"
                      : theme === 'dark'
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-loan-gray-600 hover:bg-loan-gray-100"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  <TranslatableText text={item.label} />
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <LanguageSelector />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6 mt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className={cn(
        "border-t py-8",
        theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={cn(
                "text-lg font-semibold mb-4",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                <TranslatableText text="Loan Advisor" />
              </h3>
              <p className={theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"}>
                <TranslatableText text="Get instant answers to all your personal loan queries in your preferred language." />
              </p>
            </div>
            <div>
              <h3 className={cn(
                "text-lg font-semibold mb-4",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                <TranslatableText text="Quick Links" />
              </h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "hover:underline",
                        theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                      )}
                    >
                      <TranslatableText text={item.label} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={cn(
                "text-lg font-semibold mb-4",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                <TranslatableText text="Contact" />
              </h3>
              <address className={theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"}>
                <p>Email: info@loanadvisor.com</p>
                <p>Phone: +91 1234567890</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm">
            <p className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>
              © {new Date().getFullYear()} Loan Advisor. <TranslatableText text="All rights reserved." />
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
};

export default MainLayout; 