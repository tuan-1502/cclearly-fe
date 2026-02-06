import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '@pages/router';
import '@styles/globals.css';

/**
 * Loading fallback component
 */
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner" />
    <p>Đang tải...</p>
  </div>
);

/**
 * Main App component
 */
function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
