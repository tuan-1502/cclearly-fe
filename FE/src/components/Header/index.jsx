import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Header/Navbar component
 */
const Header = () => {
  const [cartCount] = useState(3);

  const navLinks = [
    { to: '/products', label: 'Sản phẩm' },
    { to: '/best-seller', label: 'Best seller' },
    { to: '/blog', label: 'Góc CClearly' },
    { to: '/accessories', label: 'Phụ kiện' },
    { to: '/stores', label: 'Hệ thống cửa hàng' },
  ];

  return (
    <header className="border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md z-50">
      {/* Top bar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xs text-slate-500 hidden md:block">
          Lần đầu tiên ghé CClearly? Tìm kính phù hợp ngay →
        </div>

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-widest text-primary"
        >
          CCLEARLY
        </Link>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <button className="hover:text-primary transition-colors">
            <span className="material-icons">search</span>
          </button>
          <Link to="/cart" className="relative group cursor-pointer">
            <span className="material-icons">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-slate-50 dark:border-slate-800">
        <div className="container mx-auto flex justify-center space-x-8 py-3 text-sm font-medium uppercase tracking-tight">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-primary border-b-2 border-primary'
                  : 'hover:text-primary transition-colors'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
