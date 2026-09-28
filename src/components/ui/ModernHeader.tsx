import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

interface NavLink {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface ModernHeaderProps {
  logo?: React.ReactNode;
  navLinks?: NavLink[];
  actions?: React.ReactNode;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  logo,
  navLinks = [],
  actions,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-slate-700/20'
          : 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {logo && <div className="flex-shrink-0">{logo}</div>}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={link.onClick}
                className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 flex items-center gap-2 font-medium"
              >
                {link.icon && link.icon}
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {actions && <div className="hidden sm:flex items-center gap-2">{actions}</div>}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  link.onClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 flex items-center gap-2 font-medium"
              >
                {link.icon && link.icon}
                {link.label}
              </button>
            ))}
            {actions && (
              <div className="px-3 py-2 flex gap-2">
                {actions}
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
