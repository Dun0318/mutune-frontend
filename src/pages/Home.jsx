import React, { useState, useEffect } from "react";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
/* eslint-enable no-unused-vars */
import LoginBox from "../components/LoginBox";
import AgreementModal from "../components/AgreementModalChack"; 

const Home = () => {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // 유저 정보 상태

  const handleScrollDown = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  // 로그인 성공 시 실행되는 함수
  const handleLoginSuccess = (responseData) => {
    setUser(responseData); // UserDTO 저장
    localStorage.setItem("user", JSON.stringify(responseData)); // localStorage 저장
    setIsLoggedIn(true);
    setLoginOpen(false);
  };

  // localStorage → 로그인 여부 + 유저정보 갱신 함수
  const syncLoginState = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    // 최초 실행
    syncLoginState();

    // ESC 키 누르면 모달 닫기
    const handleEsc = (e) => {
      if (e.key === "Escape") setLoginOpen(false);
    };
    window.addEventListener("keydown", handleEsc);

    // 로그인/로그아웃 이벤트 감지
    const onLogin = () => syncLoginState();
    const onLogout = () => syncLoginState();
    window.addEventListener("auth:login", onLogin);
    window.addEventListener("auth:logout", onLogout);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("auth:login", onLogin);
      window.removeEventListener("auth:logout", onLogout);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-start gap-x-20 px-10 lg:px-32 text-white overflow-hidden bg-[#08080a]">
      {/* 왼쪽 텍스트 */}
      <div className="relative flex flex-col space-y-6 text-left pl-4 lg:pl-16 w-full lg:w-1/2 h-full items-start justify-center overflow-hidden z-10">
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
          All your music tools<br />in one place.
        </h1>
        <p className="text-lg lg:text-xl text-gray-300">
          한 번에, 한 곳에서. 음악 작업의 새로운 기준
        </p>

        {/* 로그인 안 했을 때만 버튼 표시 */}
        {!isLoggedIn && (
          <button
            onClick={() => setLoginOpen(true)}
            className="mt-4 px-6 py-2 bg-white text-black rounded-lg shadow"
          >
            로그인 / 회원가입
          </button>
        )}

        {/* 로그인한 경우 환영 문구 */}
        {isLoggedIn && user && (
          <p className="mt-4 text-lg text-green-400 font-semibold">
            {user.username}님 환영합니다 🎵
          </p>
        )}
      </div>

      {/* 로그인 박스 모달 */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div
            key="login-modal"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
          >
            <LoginBox
              onClose={() => setLoginOpen(false)}
              onSuccess={handleLoginSuccess} // 로그인 성공 후 user 세팅
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 약관 동의 모달 */}
      {user && !user.termsAgreed && (
        <AgreementModal
          userId={user.id}
          onAgree={() => {
            setUser({ ...user, termsAgreed: true });
            localStorage.setItem("user", JSON.stringify({ ...user, termsAgreed: true }));
          }}
        />
      )}

      {/* Spline 3D 애니메이션 */}
      <div className="flex justify-center lg:justify-end w-full lg:w-1/2 mt-10 lg:mt-0">
        {/* 모바일용 */}
        <div className="block lg:hidden w-full max-w-xs mx-auto aspect-[4/5] rounded-xl overflow-hidden">
          <iframe
            src="https://my.spline.design/particlesmob-ABEKWyJhLvHfE89LX4DFqSyT/"
            frameBorder="0"
            allowFullScreen
            className="w-[90%] max-w-[320px] h-[320px] sm:w-[360px] sm:h-[380px] rounded-xl"
            style={{ background: "transparent" }}
          />
        </div>

        {/* 데스크탑용 */}
        <iframe
          id="spline-desktop"
          src="https://my.spline.design/particles-qpHBTzKJb5AaicebC8ka6iEg/"
          frameBorder="0"
          allowFullScreen
          className="hidden lg:block w-[600px] h-[700px] rounded-xl translate-x-0 lg:translate-x-10"
          style={{ background: "transparent" }}
        />
      </div>

      {/* 스크롤 버튼 */}
      <div
        onClick={handleScrollDown}
        className="cursor-pointer fixed bottom-[10vh] left-[46%] lg:left-1/2 transform -translate-x-1/2 animate-bounce text-gray-400 z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 lg:w-8 lg:h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* 오른쪽 dot 네비게이션 */}
      <div className="hidden lg:flex flex-col space-y-2 absolute right-6 top-1/2 transform -translate-y-1/2 z-50">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-gray-400 opacity-60"></span>
        ))}
      </div>
    </section>
  );
};

export default Home;
