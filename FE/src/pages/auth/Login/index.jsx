import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '@services/authService';
import { useAuthStore } from '@stores/authStore';

/**
 * Login page component - Modern split layout design
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      if (response.success) {
        const user = response.data.user;
        const token = response.data.token;
        login(user, token);
        
        // Redirect based on user role
        const role = user?.role?.name || user?.role;
        if (role === 'ADMIN') {
          navigate('/admin');
        } else if (role === 'MANAGER') {
          navigate('/manager');
        } else if (role === 'SALES_STAFF') {
          navigate('/sales');
        } else if (role === 'OPERATION_STAFF') {
          navigate('/operation');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.loginWithGoogle(credentialResponse.credential);
      if (response.success) {
        const user = response.data.user;
        const token = response.data.token;
        login(user, token);

        // Redirect based on user role
        const role = user?.role?.name || user?.role;
        if (role === 'ADMIN') {
          navigate('/admin');
        } else if (role === 'MANAGER') {
          navigate('/manager');
        } else if (role === 'SALES_STAFF') {
          navigate('/sales');
        } else if (role === 'OPERATION_STAFF') {
          navigate('/operation');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.message || 'Đăng nhập Google thất bại');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập Google thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-neutral-100 bg-white sticky top-0 z-50">
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
                backgroundImage: `url('https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2000&auto=format&fit=crop')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-10 left-10 text-white">
              <p className="text-sm font-semibold uppercase tracking-widest mb-2">
                Tầm nhìn mới
              </p>
              <h2 className="text-4xl font-bold leading-tight">
                Định nghĩa nghệ thuật <br />
                Nhìn hiện đại.
              </h2>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full md:w-1/2 flex flex-col bg-white p-8 lg:p-16 overflow-y-auto">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                Đăng nhập
              </h1>
              <p className="text-neutral-500 mt-2">
                Chào mừng bạn quay trở lại với Lily Eyewear.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-neutral-300"
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Mật khẩu
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-neutral-300"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-orange hover:bg-[#E65C00] text-white font-bold py-4 rounded-lg shadow-lg shadow-accent-orange/20 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">
                      progress_activity
                    </span>
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <span>Đăng nhập</span>
                )}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative flex items-center mb-6">
                <div className="flex-grow border-t border-neutral-100"></div>
                <span className="flex-shrink mx-4 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                  Hoặc đăng nhập bằng
                </span>
                <div className="flex-grow border-t border-neutral-100"></div>
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  size="large"
                  width="100%"
                  text="continue_with"
                  shape="rectangular"
                  locale="vi"
                />
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-auto pt-10 text-center">
              <p className="text-sm text-neutral-500">
                Chưa có tài khoản?
                <Link
                  to="/register"
                  className="text-primary hover:underline font-bold ml-1 transition-all"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-neutral-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-400">
            © 2024 Lily Eyewear. Bảo lưu mọi quyền.
          </p>
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

export default LoginPage;
