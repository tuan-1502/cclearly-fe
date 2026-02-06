import { Link } from 'react-router-dom';

/**
 * 404 Not Found page component
 */
const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <h2>Trang không tìm thấy</h2>
      <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/" className="btn btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
