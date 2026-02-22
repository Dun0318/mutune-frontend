// 악보 변환 page
import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import api from "../api/axios.js";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

// 타이핑 애니메이션 훅
const useTypingEffect = (text = "", speed = 40) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!text || text.length === 0) {
      setDisplayText("");
      return;
    }

    let index = 0;
    let timeoutId;
    setDisplayText("");

    const typeChar = () => {
      setDisplayText((prev) => prev + text.charAt(index));
      index++;
      if (index < text.length) {
        timeoutId = setTimeout(typeChar, speed);
      }
    };

    timeoutId = setTimeout(typeChar, speed);
    return () => clearTimeout(timeoutId);
  }, [text, speed]);

  return displayText;
};

const SheetMusicUpload = () => {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [dots, setDots] = useState(".");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const [convertedUrl, setConvertedUrl] = useState(null);
  const [quickXmlUrl, setQuickXmlUrl] = useState(null);

  // ⭐ overlay 관련 상태
  const [overlayImages, setOverlayImages] = useState([]); // 모든 페이지 PNG
  const [currentOverlayIndex, setCurrentOverlayIndex] = useState(0); // 현재 페이지
  const [overlayImageUrl, setOverlayImageUrl] = useState(null); // 현재 페이지 PNG

  const [osmd, setOsmd] = useState(null);

  // 변환중 애니메이션 (점 ...)
  useEffect(() => {
    if (step === 2 && isConverting) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 4 ? prev + "." : "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [step, isConverting]);

  // Step5 – OSMD 렌더링
  useEffect(() => {
    if (step !== 5 || !quickXmlUrl) return;

    let osmdInstance = osmd;

    if (!osmdInstance) {
      osmdInstance = new OpenSheetMusicDisplay("sheet-preview", {
        backend: "svg",
        autoResize: false,

        // 🔹 원본 PDF에 이미 제목, 작곡자, 파트명(Voice)이 있으므로
        // OSMD에서는 전부 숨긴다 (겹치는 텍스트 제거)
        drawTitle: false,
        drawSubtitle: false,
        drawComposer: false,
        drawLyricist: false,
        drawPartNames: false,
        drawPartAbbreviations: false
      });
      setOsmd(osmdInstance);
    }

    osmdInstance
      .load(quickXmlUrl)
      .then(() => osmdInstance.render())
      .catch((err) => console.error("OSMD 렌더링 오류:", err));
  }, [step, quickXmlUrl, osmd]);

  // Step5 – overlay PNG 렌더링 (현재 페이지 기준)
  useEffect(() => {
    if (step !== 5 || !overlayImageUrl) return;

    const drawOverlay = () => {
      const svg = document.querySelector("#sheet-preview svg");
      const canvas = document.getElementById("sheet-overlay");
      const wrapper = document.getElementById("sheet-preview-wrapper");
      if (!canvas || !wrapper || !svg) return;

      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // SVG 실제 화면 크기 기준으로 캔버스 맞추기
        const svgRect = svg.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        const width = svgRect.width;
        const height = svgRect.height;

        canvas.width = width;
        canvas.height = height;

        // CSS 사이즈/위치도 SVG에 정확히 맞춘다
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.style.left = `${svgRect.left - wrapperRect.left}px`;
        canvas.style.top = `${svgRect.top - wrapperRect.top}px`;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      img.src = overlayImageUrl;
    };

    // OSMD 렌더가 끝난 뒤를 고려해서 약간 딜레이
    setTimeout(drawOverlay, 150);
  }, [step, overlayImageUrl]);

  // 파일 선택
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 20) {
      alert("악보는 최대 20장까지만 업로드할 수 있습니다.");
      return;
    }

    setFiles(selectedFiles);

    // 변환 결과/상태 초기화
    setQuickXmlUrl(null);
    setOverlayImages([]);
    setOverlayImageUrl(null);
    setConvertedUrl(null);
    setOsmd(null);
    setCurrentOverlayIndex(0);

    const urls = [];
    selectedFiles.forEach((f) => {
      if (f.type === "application/pdf") {
        urls.push({ type: "pdf", file: f });
      } else if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          urls.push({ type: "image", src: reader.result });
          if (urls.length === selectedFiles.length) {
            setPreviewUrls(urls);
            setCurrentPreviewIndex(0);
          }
        };
        reader.readAsDataURL(f);
      } else if (f.type === "audio/midi" || f.type === "audio/x-midi") {
        urls.push({ type: "midi", file: f });
      }
    });

    if (urls.length > 0) {
      setPreviewUrls(urls);
      setCurrentPreviewIndex(0);
    }
  };

  const stepMessages = {
    1: " 먼저 악보 파일을 업로드해주세요 (PDF 지원)",
    2: " AI가 악보를 변환 중입니다. 잠시만 기다려주세요.",
    3: " 원본과 변환된 악보를 비교하는 단계입니다.",
    4: " 악보의 키/템포를 조절할 수 있습니다.",
    5: " 변환이 완료되었습니다. 악보를 확인하세요."
  };

  const typingMessage = useTypingEffect(stepMessages[step] || "");

  // 업로드 + 변환
  const handleUploadAndConvert = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.id;

    if (!userId) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    formData.append("userId", userId);

    try {
      setShowConfirmModal(false);
      setStep(2);
      setIsConverting(true);

      const uploadRes = await api.post("/api/sheetmusic/before", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const beforeId = uploadRes.data[0]?.id;
      if (!beforeId) {
        alert("업로드 실패");
        setIsConverting(false);
        setStep(1);
        return;
      }

      const convertRes = await api.post(
        `/api/sheetmusic/convert/${beforeId}?userId=${userId}`,
        null,
        { timeout: 120000 }
      );

      setQuickXmlUrl(convertRes.data.quickXmlPath);
      setConvertedUrl(convertRes.data.convertedFilePath);

      // 🔹 overlayImagePath 전체를 배열로 저장
      const overlayData = convertRes.data.overlayImagePath;
      let overlays = [];

      if (Array.isArray(overlayData)) {
        overlays = overlayData;
      } else if (overlayData) {
        overlays = [overlayData];
      }

      setOverlayImages(overlays);
      setCurrentOverlayIndex(0);
      setOverlayImageUrl(overlays[0] || null);

      setIsConverting(false);
      setStep(5);
    } catch (err) {
      console.error(err);
      alert("업로드 또는 변환 실패");
      setIsConverting(false);
      setStep(1);
    }
  };

  //  overlay 페이지 이동
  const goToOverlayPage = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= overlayImages.length) return;
    setCurrentOverlayIndex(nextIndex);
    setOverlayImageUrl(overlayImages[nextIndex]);
  };

  const handleOverlayPrev = () => {
    goToOverlayPage(currentOverlayIndex - 1);
  };

  const handleOverlayNext = () => {
    goToOverlayPage(currentOverlayIndex + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex flex-col items-center justify-center p-6 pt-28">
        {step === 1 && (
          <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 text-center">
            <h1 className="text-3xl font-bold mb-6">악보 업로드</h1>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileChange({ target: { files: e.dataTransfer.files } });
              }}
              className="border-2 border-dashed border-blue-400 p-10 rounded-lg cursor-pointer hover:bg-blue-50 transition mb-6"
            >
              <p className="text-gray-600 mb-4">
                파일을 이곳에 드래그하거나 버튼을 눌러 업로드하세요
              </p>

              <label className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                파일 선택
                <input
                  type="file"
                  accept="application/pdf, image/png, image/jpeg, audio/midi, audio/x-midi"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {files.length > 0 && (
              <>
                <div className="mt-4 text-gray-700 text-sm bg-gray-100 rounded-lg p-4 shadow-inner text-left">
                  {files.map((f, idx) => (
                    <p key={idx}>{f.name}</p>
                  ))}
                </div>

                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  다음
                </button>
              </>
            )}

            <div className="mt-6 text-sm leading-6 text-left bg-gray-50 p-4 rounded-lg border">
              <p className="text-red-500 font-semibold mb-1">주의사항</p>
              <ul className="list-disc ml-5 text-black">
                <li>손으로 직접 그린 악보나 사진 촬영본은 인식률이 낮을 수 있습니다.</li>
                <li>
                  변환된 악보는 상업용으로 사용할 수 없습니다.
                  <br />
                  <span className="font-semibold">
                    Mutune은 이에 대한 법적 책임을 지지 않습니다.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg border">
              <p className="text-red-500 font-semibold mb-2">저작권 안내</p>
              <ul className="list-disc ml-5 text-black">
                <li>
                  <span className="font-semibold">
                    Mutune은 악보의 워터마크를 제거하거나 변형하지 않습니다.
                  </span>
                </li>
                <li>
                  <span className="font-semibold">
                    정당하게 구매하거나 이용 권한이 있는 악보만 업로드해야 합니다.
                  </span>
                </li>
                <li>변환된 악보는 개인적 이용 목적에 한해서만 사용 가능합니다.</li>
                <li>
                  <span className="font-semibold">
                    변환된 악보의 외부 공유·재배포는 저작권법 위반입니다.
                  </span>
                </li>
                <li>Mutune은 업로드된 파일의 저작권을 판단할 수 없습니다.</li>
                <li>
                  <span className="font-semibold">
                    업로드된 파일이 제3자의 저작권을 침해할 경우 책임은 업로더에게
                    있습니다.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* 변환 중 로딩 단계 */}
        {step === 2 && (
          <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-4">
              AI가 악보를 변환 중입니다{dots}
            </h2>
            <p className="text-gray-600 mb-6">
              악보의 난이도와 페이지 수에 따라 시간이 조금 걸릴 수 있습니다.
            </p>
            <div className="flex justify-center">
              <div className="w-14 h-14 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-10 mt-10">
            <h2 className="text-2xl font-bold mb-6">변환된 악보 미리보기</h2>

            <div
              id="sheet-preview-wrapper"
              className="relative w-full bg-gray-50 border p-4 rounded-xl shadow-inner overflow-auto"
              style={{ minHeight: "600px" }}
            >
              <div id="sheet-preview" className="w-full" />

              <canvas
                id="sheet-overlay"
                className="pointer-events-none absolute"
              />
            </div>

            {/*  overlay 페이지 네비게이션 */}
            {overlayImages.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  onClick={handleOverlayPrev}
                  disabled={currentOverlayIndex === 0}
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
                >
                  ◀ 이전 페이지
                </button>
                <span className="text-sm text-gray-700">
                  {currentOverlayIndex + 1} / {overlayImages.length} 페이지
                </span>
                <button
                  onClick={handleOverlayNext}
                  disabled={
                    currentOverlayIndex === overlayImages.length - 1
                  }
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
                >
                  다음 페이지 ▶
                </button>
              </div>
            )}
          </div>
        )}

        {stepMessages[step] && (
          <div className="mt-10 w-full max-w-4xl">
            <div className="bg-white shadow-md rounded-2xl p-6 relative">
              <p className="text-gray-800 text-lg whitespace-pre-wrap">
                {typingMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[900px] text-center relative">
            <h2 className="text-2xl font-bold mb-6">업로드 확인</h2>

            {previewUrls.length > 0 && (
              <div className="relative flex items-center justify-center mb-6">
                <button
                  onClick={() =>
                    setCurrentPreviewIndex((prev) =>
                      prev > 0 ? prev - 1 : prev
                    )
                  }
                  disabled={currentPreviewIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-3 
                       bg-gray-200 rounded-full text-xl font-bold 
                       hover:bg-gray-300 disabled:opacity-40"
                >
                  ◀
                </button>

                {previewUrls[currentPreviewIndex]?.type === "image" ? (
                  <img
                    src={previewUrls[currentPreviewIndex].src}
                    className="max-h-[600px] mx-auto rounded-xl shadow-lg"
                  />
                ) : previewUrls[currentPreviewIndex]?.type === "pdf" ? (
                  <iframe
                    src={URL.createObjectURL(
                      previewUrls[currentPreviewIndex].file
                    )}
                    className="w-full h-[600px] rounded-xl shadow-lg"
                  />
                ) : previewUrls[currentPreviewIndex]?.type === "midi" ? (
                  <audio
                    controls
                    src={URL.createObjectURL(
                      previewUrls[currentPreviewIndex].file
                    )}
                    className="w-full mt-4"
                  />
                ) : null}

                <button
                  onClick={() =>
                    setCurrentPreviewIndex((prev) =>
                      prev < previewUrls.length - 1 ? prev + 1 : prev
                    )
                  }
                  disabled={
                    currentPreviewIndex === previewUrls.length - 1
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-3 
                       bg-gray-200 rounded-full text-xl font-bold 
                       hover:bg-gray-300 disabled:opacity-40"
                >
                  ▶
                </button>
              </div>
            )}

            <div className="mt-8 flex justify-center gap-8">
              <button
                onClick={handleUploadAndConvert}
                className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700"
              >
                확인
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-8 py-3 bg-gray-500 text-white text-lg rounded-lg hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SheetMusicUpload;
