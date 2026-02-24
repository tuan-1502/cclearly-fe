import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * AuthLayout - Split layout for authentication pages
 * Left side: Hero image with text
 * Right side: Form content
 */
const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  heroTitle, 
  heroSubtitle,
  showStep,
  stepText 
}) => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">
              eyeglasses
            </span>
            <span className="text-xl font-black tracking-widest text-primary uppercase">
              Lily Eyewear
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase">
            <Link to="/frames" className="hover:text-primary transition-colors">
              Gọng kính
            </Link>
            <Link to="/lenses" className="hover:text-primary transition-colors">
              Tròng kính
            </Link>
            <Link to="/accessories" className="hover:text-primary transition-colors">
              Phụ kiện
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              Hỗ trợ
            </Link>
          </nav>
          <div className="flex items-center gap-5">
            <button className="material-symbols-outlined text-neutral-700 hover:text-primary transition-colors">
              search
            </button>
            <button className="material-symbols-outlined text-neutral-700 hover:text-primary transition-colors">
              shopping_bag
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-6xl bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden flex flex-col md:flex-row border border-neutral-100">
          {/* Hero Image Side */}
          <div className="hidden md:block w-1/2 relative min-h-[600px]">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2000&auto=format&fit=crop')` 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10 text-white">
              <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-white/80">
                {heroSubtitle || 'Tham gia cùng chúng tôi'}
              </p>
              <h2 className="text-4xl font-bold leading-tight drop-shadow-md">
                {heroTitle || (
                  <>
                    Định nghĩa Nghệ thuật <br/>
                    Tầm nhìn Hiện đại.
                  </>
                )}
              </h2>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full md:w-1/2 flex flex-col bg-white relative">
            {/* Step indicator */}
            {showStep && (
              <div className="absolute top-8 right-8 text-xs font-bold tracking-widest text-neutral-400 uppercase">
                {stepText}
              </div>
            )}

            <div className="flex-1 flex flex-col justify-center p-8 lg:p-16">
              {/* Title */}
              {title && (
                <div className="mb-10 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-neutral-500 mt-2">{subtitle}</p>
                  )}
                </div>
              )}

              {/* Form content */}
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full bg-white border-t border-neutral-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-400">© 2024 Lily Eyewear. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6 text-xs text-neutral-400">
            <Link to="#" className="hover:text-primary transition-colors">
              Điều khoản
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              Bảo mật
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  heroTitle: PropTypes.node,
  heroSubtitle: PropTypes.string,
  showStep: PropTypes.bool,
  stepText: PropTypes.string,
};

export default AuthLayout;
