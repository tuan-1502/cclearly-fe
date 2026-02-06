import { Link } from 'react-router-dom';

/**
 * Home page component
 */
const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Chào mừng đến với CClearly</h1>
        <p>Hệ thống quản lý kính mắt thông minh</p>
        <div className="hero-actions">
          <Link to="/login" className="btn btn-primary">
            Đăng nhập
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Đăng ký
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
