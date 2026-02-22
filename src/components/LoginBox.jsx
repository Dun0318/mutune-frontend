import React from "react";
import GoogleIcon from "../assets/googleIcon.png";
import KakaoIcon from "../assets/kakaoIcon.png";
import NaverIcon from "../assets/naverIcon.png";
import { Link } from "react-router-dom";

const LoginBox = ({ onClose }) => {
  // 백엔드 OAuth 요청 함수
  const handleOAuthLogin = (provider) => {
    // 백엔드 서버 URL + Spring Security OAuth 시작 경로
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white text-black px-6 py-10 sm:px-10 sm:py-12 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 상단 문구 */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
          MuTune에 가입하여 모든 기능을 사용하세요
        </h2>

        {/* 약관/개인정보 처리방침 안내 */}
        <p className="text-center text-sm sm:text-base text-gray-500 mb-6">
          계속하려면{" "}
          <Link
            to="/terms"
            className="underline hover:text-black transition-colors"
          >
            서비스 이용약관 및 개인정보 처리방침
          </Link>
          에 동의해야 합니다.
        </p>

        {/* 소셜 로그인 버튼 */}
        <div className="flex flex-col space-y-3">
          {/* Google 로그인 */}
          <button
            onClick={() => handleOAuthLogin("google")}
            className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <img src={GoogleIcon} alt="Google 로그인" className="w-5 h-5" />
            <span className="text-sm font-medium">Google로 계속하기</span>
          </button>

          {/* Kakao 로그인 */}
          <button
            onClick={() => handleOAuthLogin("kakao")}
            className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <img src={KakaoIcon} alt="Kakao 로그인" className="w-5 h-5" />
            <span className="text-sm font-medium">카카오로 계속하기</span>
          </button>

          {/* Naver 로그인 */}
          <button
            onClick={() => handleOAuthLogin("naver")}
            className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <img src={NaverIcon} alt="Naver 로그인" className="w-5 h-5" />
            <span className="text-sm font-medium">네이버로 계속하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginBox;
