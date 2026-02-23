// SheetMusic.jsx  (Step1)

import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

// -------------------------------
//  공통 컴포넌트들 (기존 그대로 유지)
// -------------------------------

const UploadGuide = () => (
  <p className="text-gray-700 mb-4 text-center text-sm">
    악보를 업로드 해주세요.<br />
    <span className="font-semibold">
      (PDF만 인식 가능하며 각종 악보 사이트에서 구매하실 수 있습니다.)
    </span>
  </p>
);

const WarningBox = () => (
  <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg border">
    <p className="text-red-500 font-semibold mb-1">주의사항</p>
    <ul className="list-disc ml-5 text-black">
      <li>손으로 직접 그린 악보나 사진 촬영본은 인식률이 낮을 수 있습니다.</li>
      <li>
        변환된 악보는 상업용으로 사용할 수 없습니다.
        <br />
        <span className="font-semibold">Mutune은 이에 대한 법적 책임을 지지 않습니다.</span>
      </li>
    </ul>
  </div>
);

const CopyrightBox = () => (
  <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg border">
    <p className="text-red-500 font-semibold mb-2">저작권 안내</p>
    <ul className="list-disc ml-5 text-black">
      <li><span className="font-semibold">Mutune은 악보의 워터마크를 제거하거나 변형하지 않습니다.</span></li>
      <li><span className="font-semibold">정당하게 구매한 악보만 업로드해야 합니다.</span></li>
      <li>변환된 악보는 개인적 이용 범위에서만 사용 가능합니다.</li>
      <li>업로드된 파일의 저작권 문제는 업로더에게 책임이 있습니다.</li>
    </ul>
  </div>
);

// -------------------------------
// 메인 컴포넌트
// -------------------------------

const SheetMusic = () => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const urls = selectedFiles.map((file) => ({
      type: "pdf",
      file: file,
    }));

    setPreviewUrls(urls);
  };

  //  Step1에서는 백엔드를 호출하지 않는다
  const goToStep2 = () => {
    navigate("/sheetMusic/step2", {
      state: { files },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex flex-col items-center justify-center p-6 pt-28">

        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 text-center">
          <h1 className="text-3xl font-bold mb-6">악보 업로드</h1>

          <UploadGuide />

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileChange({ target: { files: e.dataTransfer.files } });
            }}
            className="border-2 border-dashed border-blue-400 p-10 rounded-lg cursor-pointer hover:bg-blue-50 transition mb-6"
          >
            <label className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
              파일 선택
              <input
                type="file"
                accept="application/pdf"
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

          <WarningBox />
          <CopyrightBox />
        </div>

        {/* 업로드 확인 모달 */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-[900px] text-center relative">

              <h2 className="text-2xl font-bold mb-6">업로드 확인</h2>

              {previewUrls.length > 0 && (
                <iframe
                  src={URL.createObjectURL(previewUrls[0].file)}
                  className="w-full h-[600px] rounded-xl shadow-lg"
                />
              )}

              <div className="mt-8 flex justify-center gap-8">
                <button
                  onClick={goToStep2}
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
    </div>
  );
};

export default SheetMusic;
