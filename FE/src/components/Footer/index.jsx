import { Link } from 'react-router-dom';

/**
 * Footer component
 */
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-background-dark py-16 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Contact */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-6">
            LIÊN HỆ
          </h4>
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <p className="flex items-start">
              <span className="material-icons text-primary text-sm mr-3 mt-1">
                location_on
              </span>
              Số 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
            </p>
            <p className="flex items-center">
              <span className="material-icons text-primary text-sm mr-3">
                phone
              </span>
              0123 456 789
            </p>
            <p className="flex items-center">
              <span className="material-icons text-primary text-sm mr-3">
                email
              </span>
              contact@cclearly.com
            </p>
            <div className="pt-4 flex space-x-4">
              <a
                className="text-slate-400 hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-icons">facebook</span>
              </a>
              <a
                className="text-slate-400 hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-icons">camera_alt</span>
              </a>
              <a
                className="text-slate-400 hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-icons">video_library</span>
              </a>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-6">
            Chính sách
          </h4>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link
                className="hover:text-primary transition-colors"
                to="/eye-exam"
              >
                Khám mắt miễn phí
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary transition-colors"
                to="/warranty"
              >
                Bảo hành
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary transition-colors"
                to="/returns"
              >
                Đổi trả
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary transition-colors"
                to="/shipping"
              >
                Vận chuyển
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary transition-colors"
                to="/privacy"
              >
                Chính sách bảo mật
              </Link>
            </li>
          </ul>
        </div>

        {/* Products */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-6">
            Sản phẩm
          </h4>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link
                className="hover:text-primary transition-colors"
                to="/products/optical"
              >
                Gọng kính cận
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary transition-colors"
                to="/products/sunglasses"
              >
                Gọng kính râm
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary transition-colors"
                to="/products/lenses"
              >
                Tròng kính
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary transition-colors"
                to="/accessories"
              >
                Phụ kiện
              </Link>
            </li>
          </ul>
        </div>

        {/* Store Locator */}
        <div className="relative group overflow-hidden rounded-lg shadow-sm h-48">
          <img
            alt="Store Locator"
            className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-110 transition-transform duration-700"
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
            <Link
              to="/stores"
              className="bg-primary text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg"
            >
              Tìm cửa hàng →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-slate-400">
        <p>© 2026 CCLEARLY. ALL RIGHTS RESERVED.</p>
        <div className="mt-4 md:mt-0 flex space-x-6">
          <Link className="hover:text-primary transition-colors" to="/blog">
            Kiến thức
          </Link>
          <Link className="hover:text-primary transition-colors" to="/health">
            Sức khỏe
          </Link>
          <Link className="hover:text-primary transition-colors" to="/dealers">
            Hệ thống đại lý
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
