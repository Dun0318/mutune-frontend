// 📄 components/ScoreViewer.jsx
import React, { useEffect, useRef, useState } from "react";
import verovio from "verovio";

const ScoreViewer = ({ xmlUrl }) => {
  const containerRef = useRef(null);
  const toolkitRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================================
  // 1) Verovio Toolkit 초기화 (1회)
  // ==========================================================
  useEffect(() => {
    try {
      toolkitRef.current = new verovio.toolkit();

      // 🔧 기본 렌더링 옵션 (지금은 최소만)
      toolkitRef.current.setOptions({
        scale: 40,
        pageWidth: 1200,
        pageHeight: 1600,
        adjustPageHeight: true,
      });

      setIsReady(true);
    } catch (e) {
      console.error("Verovio init error:", e);
      setError("Verovio 초기화 실패");
    }
  }, []);

  // ==========================================================
  // 2) XML 로드 → SVG 렌더링
  // ==========================================================
  useEffect(() => {
    if (!isReady || !xmlUrl || !containerRef.current) return;

    const loadAndRender = async () => {
      try {
        setError(null);

        // 1) XML fetch
        const res = await fetch(xmlUrl);
        if (!res.ok) {
          throw new Error("XML 파일을 불러오지 못했습니다.");
        }

        const xmlText = await res.text();

        // 2) Verovio 로드
        toolkitRef.current.loadData(xmlText);

        // 3) 1페이지 SVG 렌더링
        const svg = toolkitRef.current.renderToSVG(1);

        // 4) DOM 반영
        containerRef.current.innerHTML = svg;
      } catch (e) {
        console.error("Score render error:", e);
        setError("악보 렌더링 실패");
      }
    };

    loadAndRender();
  }, [isReady, xmlUrl]);

  // ==========================================================
  // 3) 렌더
  // ==========================================================
  if (error) {
    return (
      <div className="p-4 text-red-600 text-sm bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div
        ref={containerRef}
        className="verovio-score bg-white"
      />
    </div>
  );
};

export default ScoreViewer;
