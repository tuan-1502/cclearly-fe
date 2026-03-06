import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLogin, useLoginWithGoogle } from '@/hooks/useAuth'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()
  const loginWithGoogle = useLoginWithGoogle()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login.mutateAsync(formData)
      navigate(from, { replace: true })
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle.mutateAsync('mock-google-token')
      navigate(from, { replace: true })
    } catch (error) {
      // Error handled by hook
    }
  }

  return (
    <div>
      {/* Logo - Desktop */}
      <Link to="/" className="hidden lg:flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
        <svg viewBox="0 0 120 40" className="h-10 w-24" fill="none" stroke="#222" strokeWidth="2">
          <circle cx="34" cy="20" r="12" />
          <circle cx="66" cy="20" r="12" />
          <path d="M46 20h8" strokeLinecap="round" />
        </svg>
      </Link>

      <h2 className="text-3xl font-bold text-[#222] mb-2">Đăng nhập</h2>
      <p className="text-[#4f5562] mb-8">Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#222] mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0f5dd9] bg-[#f9f9f9]"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#222] mb-2">Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0f5dd9] bg-[#f9f9f9]"
            placeholder="••••••••"
          />
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-[#0f5dd9] hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full bg-[#141f36] text-white py-4 rounded-full font-medium hover:bg-[#0d1322] disabled:bg-gray-300 transition"
        >
          {login.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <div className="my-8 relative flex items-center">
        <div className="flex-1 h-px bg-[#e0e0e0]"></div>
        <span className="px-4 text-sm text-[#4f5562]">hoặc</span>
        <div className="flex-1 h-px bg-[#e0e0e0]"></div>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loginWithGoogle.isPending}
        className="w-full flex items-center justify-center gap-3 border-2 border-[#e0e0e0] py-3.5 rounded-full hover:bg-[#f9f9f9] transition"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span className="text-[#222] font-medium">Tiếp tục với Google</span>
      </button>

      <p className="mt-8 text-center text-[#4f5562]">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-[#0f5dd9] hover:underline font-medium">
          Đăng ký ngay
        </Link>
      </p>

      {/* Demo accounts info */}
      <div className="mt-8 p-5 bg-[#ececec] rounded-2xl">
        <p className="text-sm font-semibold text-[#222] mb-3">Tài khoản demo:</p>
        <div className="text-xs text-[#4f5562] space-y-1.5">
          <p><span className="font-medium">Customer:</span> customer@gmail.com / customer123</p>
          <p><span className="font-medium">Sales/Staff:</span> sales@cclearly.com / sales123</p>
          <p><span className="font-medium">Manager:</span> manager@cclearly.com / manager123</p>
          <p><span className="font-medium">Admin:</span> admin@cclearly.com / admin123</p>
          <p><span className="font-medium">Operations:</span>ops@cclearly.com / ops123</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
