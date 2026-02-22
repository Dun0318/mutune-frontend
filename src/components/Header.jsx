import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import LoginBox from "./LoginBox";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const syncFromStorage = useCallback(() => {
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
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user" || e.key === "accessToken" || e.key === "refreshToken") {
        syncFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);

    const onAuthLogin = () => syncFromStorage();
    const onAuthLogout = () => syncFromStorage();
    window.addEventListener("auth:login", onAuthLogin);
    window.addEventListener("auth:logout", onAuthLogout);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:login", onAuthLogin);
      window.removeEventListener("auth:logout", onAuthLogout);
    };
  }, [syncFromStorage]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("auth:logout"));
    navigate("/", { replace: true });
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-16 bg-white text-black z-50 shadow px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* 로고 */}
        <Link to="/" className="flex items-center space-x-0" onClick={() => setMenuOpen(false)}>
          <img src={Logo} alt="로고" className="w-[146px] h-[146px] lg:w-[212px] lg:h-[212px]" />
        </Link>

        {/* ▣ 1) 데스크탑 메뉴 (1024px ↑) */}
        <nav className="hidden lg:flex items-center text-sm font-medium select-none">
          
          {/* 도구 드롭다운 */}
          <div
            className="relative group"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setTimeout(() => setDropdownOpen(false), 1000)}
          >
            <div className="px-2 py-1 rounded cursor-pointer">
              <span>도구</span>
            </div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  key="desktop-dropdown"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 top-full mt-1 bg-white text-black shadow rounded py-2 w-32 z-50"
                >
                  <Link to="/sheetMusic" className="block px-4 py-2 hover:bg-gray-200">
                    악보 조절
                  </Link>
                  <Link to="/mr" className="block px-4 py-2 hover:bg-gray-200">
                    MR 조절
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="text-gray-400 px-4">/</span>
          <Link to="/upgrade" className="hover:underline">업그레이드</Link>
          <span className="text-gray-400 px-4">/</span>
          <Link to="/contact" className="hover:underline">문의하기</Link>
          <span className="text-gray-400 px-4">/</span>

          {!isLoggedIn ? (
            <>
              <button onClick={() => { setShowLoginBox(true); }} className="hover:underline">로그인</button>
              <span className="text-gray-400 px-4">/</span>
              <button onClick={() => { setShowLoginBox(true); }} className="hover:underline">회원가입</button>
            </>
          ) : (
            <div className="flex items-center space-x-3 bg-gray-200 px-3 py-1 rounded-full text-sm">
              <span className="font-semibold ml-1">{user?.username}님</span>
              <button onClick={handleLogout} className="ml-2 rounded-full px-2 py-1 bg-gray-300 hover:bg-gray-400">
                로그아웃
              </button>
            </div>
          )}
        </nav>

        {/* ▣ 2) 모바일 메뉴 버튼 (md 이하) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden focus:outline-none"
          aria-label="모바일 메뉴 토글"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

      </header>

      {/* ▣ 3) PC 최소화 메뉴 (768~1024px) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="tablet-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute top-16 left-0 w-full bg-white text-black flex-col px-6 py-4 space-y-6 z-40 shadow hidden md:flex lg:hidden"
          >
            <div>
              <p className="text-lg font-semibold mb-1">도구</p>
              <div className="flex flex-col pl-4 text-base space-y-2">
                <Link to="/sheetMusic" onClick={() => setMenuOpen(false)}>악보 조절</Link>
                <Link to="/mr" onClick={() => setMenuOpen(false)}>MR 조절</Link>
              </div>
            </div>

            <Link to="/upgrade" onClick={() => setMenuOpen(false)}>업그레이드</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>문의하기</Link>

            {!isLoggedIn ? (
              <>
                <button onClick={() => { setShowLoginBox(true); setMenuOpen(false); }}>로그인</button>
                <button onClick={() => { setShowLoginBox(true); setMenuOpen(false); }}>회원가입</button>
              </>
            ) : (
              <div className="flex items-center space-x-3 bg-gray-200 px-3 py-1 rounded-full text-sm">
                <span className="font-semibold">{user?.username}님</span>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="ml-2 rounded-full px-2 py-1 bg-gray-300 hover:bg-gray-400"
                >
                  로그아웃
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ▣ 4) 모바일 메뉴 (768px 이하) — 원래 구조 그대로 유지 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute top-16 left-0 w-full bg-white text-black flex flex-col items-start px-6 py-4 space-y-4 md:hidden z-40 shadow"
          >
            <details className="w-full">
              <summary className="cursor-pointer py-2 text-lg">도구</summary>
              <div className="flex flex-col pl-4 space-y-2 mt-2">
                <Link to="/sheetMusic" onClick={() => setMenuOpen(false)}>악보 조절</Link>
                <Link to="/mr" onClick={() => setMenuOpen(false)}>MR 조절</Link>
              </div>
            </details>

            <Link to="/upgrade" onClick={() => setMenuOpen(false)}>업그레이드</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>문의하기</Link>

            {!isLoggedIn ? (
              <>
                <button onClick={() => { setShowLoginBox(true); setMenuOpen(false); }}>로그인</button>
                <button onClick={() => { setShowLoginBox(true); setMenuOpen(false); }}>회원가입</button>
              </>
            ) : (
              <div className="flex items-center space-x-3 bg-gray-200 px-3 py-1 rounded-full text-sm">
                <span className="font-semibold">{user?.username}님</span>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="ml-2 rounded-full px-2 py-1 bg-gray-300 hover:bg-gray-400"
                >
                  로그아웃
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 로그인 모달 */}
      <AnimatePresence>
        {showLoginBox && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            onClick={() => setShowLoginBox(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <LoginBox onClose={() => setShowLoginBox(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
