import axios from "axios";

// 백엔드 API 기본 URL
const apiBase = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:8080";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: apiBase,
  withCredentials: false,
  timeout: 180000,
});

// 요청 인터셉터: AccessToken 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: AccessToken 만료 시 RefreshToken으로 재발급
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // AccessToken 만료 (401 Unauthorized) 시
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("리프레시 토큰 없음");

        // 백엔드에 refresh API 호출
        const res = await axios.post(`${apiBase}/api/auth/refresh`, { refreshToken });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;

        // 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Authorization 헤더 갱신 후 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("토큰 재발급 실패:", refreshError);

        // RefreshToken도 만료 → 로그아웃 처리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // 전역 이벤트 발생 (Header, Home 등에서 즉시 반응)
        window.dispatchEvent(new Event("auth:logout"));

        // 홈으로 이동
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
