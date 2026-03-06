import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { authRequest } from '@/api/auth';
import { useSessionStore } from '@/stores/sessionStore';
import { toast } from 'react-toastify';
import { QUERY_KEYS } from '@/utils/endpoints';

// Hook chính để sử dụng auth context
export const useAuth = () => {
  return useAuthContext();
};

// Login mutation
export const useLogin = () => {
  const login = useAuthContext().login;

  return useMutation({
    mutationFn: async (credentials) => {
      const data = await authRequest.login(credentials);
      return data;
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data;
      login(accessToken, refreshToken);
      toast.success('Đăng nhập thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Đăng nhập thất bại');
    },
  });
};

// Register mutation
export const useRegister = () => {
  const login = useAuthContext().login;

  return useMutation({
    mutationFn: async (data) => {
      const res = await authRequest.register(data);
      return res;
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data;
      if (accessToken && refreshToken) {
        login(accessToken, refreshToken);
      }
      toast.success('Đăng ký thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Đăng ký thất bại');
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const logout = useAuthContext().logout;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authRequest.logout();
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('Đăng xuất thành công');
    },
    onError: () => {
      // Still logout even if API fails
      logout();
      queryClient.clear();
    },
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email) => {
      const res = await authRequest.forgotPassword(email);
      return res;
    },
    onSuccess: () => {
      toast.success('Email khôi phục mật khẩu đã được gửi!');
    },
    onError: (error) => {
      toast.error(error.message || 'Gửi email thất bại');
    },
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await authRequest.resetPassword(data);
      return res;
    },
    onSuccess: () => {
      toast.success('Đặt lại mật khẩu thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Đặt lại mật khẩu thất bại');
    },
  });
};

// Login with Google mutation
export const useLoginWithGoogle = () => {
  const login = useAuthContext().login;

  return useMutation({
    mutationFn: async (idToken) => {
      const data = await authRequest.loginWithGoogle(idToken);
      return data;
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data;
      login(accessToken, refreshToken);
      toast.success('Đăng nhập thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Đăng nhập Google thất bại');
    },
  });
};

// Get user profile query
export const useProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: async () => {
      const data = await authRequest.getProfile();
      return data;
    },
    enabled: false, // Only fetch when explicitly called
  });
};

// Resend verification email mutation
export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (email) => {
      const res = await authRequest.resendVerificationEmail(email);
      return res;
    },
    onSuccess: () => {
      toast.success('Email xác thực đã được gửi lại!');
    },
    onError: (error) => {
      toast.error(error.message || 'Gửi email thất bại');
    },
  });
};
