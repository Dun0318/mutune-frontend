/*
 *
 * API 로그인 시 토큰 발급 파일
 *
 * 백엔드 redirect:
 * http://localhost:3000/auth/callback?accessToken=xxx&refreshToken=yyy
 *
 * 로그인 후 /api/auth/me 호출 → 사용자 정보(localStorage.user)에 저장
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1️⃣ 쿼리 파라미터에서 토큰 추출
    const params = new URLSearchParams(window.location.search);

    // 해시(#) 형식으로 전달된 경우까지 대비
    if (!params.get("accessToken") && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      hashParams.forEach((v, k) => {
        if (!params.get(k)) params.set(k, v);
      });
    }

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    // 2️⃣ 토큰 없으면 실패 처리
    if (!accessToken || !refreshToken) {
      navigate("/login", {
        replace: true,
        state: { error: "로그인이 올바르게 처리되지 않았습니다. 다시 로그인해주세요." },
      });
      return;
    }

    // 3️⃣ URL 정리 (보안용)
    try {
      const cleanUrl = window.location.origin + "/auth/callback";
      window.history.replaceState({}, document.title, cleanUrl);
    } catch {
      // ignore
    }

    // 4️⃣ 토큰 저장
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // 5️⃣ axios 인스턴스 준비
    const apiBase = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:8080";
    const client = axios.create({
      baseURL: apiBase,
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: false,
      timeout: 10000,
    });

    // 6️⃣ 사용자 정보 요청
    client
      .get("/api/auth/me")
      .then((res) => {
        const user = res.data;

        // 🧩 [추가] termsAgreed 값이 서버에서 누락되거나 undefined일 때 안전하게 처리
        const fixedUser = {
          ...user,
          termsAgreed: user.termsAgreed === true || user.termsAgreed === 1,
        };

        // 🧩 [추가] 콘솔로 실제 서버 응답 확인 (개발용)
        console.log("✅ /api/auth/me 응답:", fixedUser);

        // 🧩 [수정] 항상 서버값 기준으로 저장
        localStorage.setItem("user", JSON.stringify(fixedUser));

        // 🧩 [추가] 다른 탭/컴포넌트에 알림
        window.dispatchEvent(new Event("auth:login"));

        // 7️⃣ 메인 페이지 이동
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error("유저 정보 불러오기 실패:", err);
        // 실패 시 초기화
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth:logout"));
        navigate("/login", {
          replace: true,
          state: { error: "로그인 세션이 만료되었거나 잘못되었습니다. 다시 로그인해주세요." },
        });
      });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-lg text-gray-600">로그인 처리 중입니다...</p>
    </div>
  );
};

export default AuthCallback;
