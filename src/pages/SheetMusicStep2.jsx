// 📄 SheetMusicStep2.jsx
import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const SheetMusicStep2 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Step1에서 넘겨준 파일들
  const { files } = location.state || {};

  // 🔒 StrictMode / 재마운트 대비 중복 실행 차단
  const hasRunRef = useRef(false);

  const [dots, setDots] = useState(".");
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // 점점점 애니메이션
  // -------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 4 ? prev + "." : "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // -------------------------------
  // Step2: 화면 진입 시 자동 변환 (1회만 실행)
  // -------------------------------
  useEffect(() => {
    // ✅ 핵심: 두 번째 실행 차단
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    if (!files || files.length === 0) {
      alert("잘못된 접근입니다. 파일이 없습니다.");
      navigate("/sheetMusic");
      return;
    }

    const runConvert = async () => {
      try {
        // 로그인 유저 정보
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const userId = user?.id;

        if (!userId) {
          alert("로그인 후 이용해주세요.");
          navigate("/login");
          return;
        }

        // -----------------------
        // 1) 원본 업로드 API
        // -----------------------
        const formData = new FormData();
        files.forEach((file) => formData.append("file", file));
        formData.append("userId", userId);

        const beforeRes = await api.post(
          "/api/sheetmusic/before",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const beforeId = beforeRes.data[0]?.id;
        if (!beforeId) throw new Error("beforeId 없음");

        // -----------------------
        // 2) AI 변환 API 호출
        // -----------------------
        const convertRes = await api.post(
          `/api/sheetmusic/convert/${beforeId}?userId=${userId}`
        );

        // -----------------------
        // 3) Step3로 이동
        // -----------------------
        navigate("/sheetMusic/step3", {
          state: {
            afterId: convertRes.data.afterId,
            overlayImagePaths: convertRes.data.overlayImagePaths,
            quickXmlPath: convertRes.data.quickXmlPath,
            convertedFilePath: convertRes.data.convertedFilePath,
          },
        });
      } catch (err) {
        console.error(err);
        alert("변환 중 오류가 발생했습니다.");
        navigate("/sheetMusic");
      }
    };

    runConvert();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex flex-col items-center justify-center pt-40 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-10 text-center w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">
            AI가 악보를 변환 중입니다{dots}
          </h2>

          <p className="text-gray-600 mb-6">
            악보의 난이도와 페이지 수에 따라 시간이 조금 걸릴 수 있습니다.
          </p>

          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>

          <p className="text-gray-500 text-sm">잠시만 기다려주세요…</p>
        </div>
      </div>
    </div>
  );
};

export default SheetMusicStep2;
