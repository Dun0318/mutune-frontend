// src/pages/Terms.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          {/* 로고 클릭 → 홈으로 */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="MuTune 로고" className="w-10 h-10" />
            <span className="font-bold text-lg text-gray-900">MuTune</span>
          </div>

          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← 뒤로가기
          </button>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">
          서비스 이용 약관 및 개인정보 처리방침
        </h1>

        {/* 약관 전문 (스크롤 박스) */}
        <div className="border rounded-lg bg-white p-4 h-[70vh] overflow-y-auto text-sm leading-6 space-y-4 shadow">
          <h2 className="font-semibold">[서비스 이용약관]</h2>
          <p>
            제1조 (목적) 이 약관은 MuTune(이하 “서비스”)가 제공하는 온라인
            악보/음원 편집 관련 기능의 이용 조건과 책임을 정합니다.
          </p>
          <p>
            제2조 (정의) ① “회원”은 소셜 로그인을 통해 가입한 자를 말합니다.
            ② “콘텐츠”는 회원이 업로드·처리·다운로드하는 모든 파일 및
            결과물을 말합니다.
          </p>
          <p>
            제5조 (금지행위 및 상업적 이용 제한) 서비스 및 결과물의{" "}
            <b>상업적 이용(재판매·유료배포·영리 공연/방송 등)</b>은 금지되며,
            개인적·비상업적 용도에 한해 사용할 수 있습니다.
          </p>
          <p>
            제6조 (권리 및 라이선스) 업로드한 콘텐츠의 권리는 원저작권자에게
            귀속되며, 회원은 적법한 권리를 보유해야 합니다. MuTune은 서비스
            제공을 위해 필요한 범위에서만 임시 처리·저장합니다.
          </p>
          <p>
            제7조 (파일 보관/자동 삭제) 업로드 파일은 서비스 제공을 위한{" "}
            <b>임시 저장</b>만 하며, 처리 완료 후 <b>48시간 이내 자동 삭제</b>
            됩니다.
          </p>
          <p>
            제10조 (책임의 한계) 회원이 업로드한 불법 콘텐츠로 발생한 법적
            분쟁의 책임은 전적으로 회원에게 있으며, MuTune은 책임을 지지
            않습니다.
          </p>
          <p>
            제12조 (준거법/관할) 본 약관은 대한민국 법률에 따르며, 분쟁은
            서울중앙지방법원을 전속 관할로 합니다.
          </p>

          <h2 className="font-semibold pt-4">[개인정보 처리방침]</h2>
          <p>
            <b>수집항목:</b> 이메일, 소셜 ID, 닉네임, 프로필 이미지(필수) /
            웹사이트, 한 줄 소개(선택)
          </p>
          <p>
            <b>이용목적:</b> 회원 식별, 서비스 제공(파일 처리), 보안, 품질 개선
          </p>
          <p>
            <b>보관기간:</b> 회원 탈퇴 시 즉시 삭제, 업로드 파일은 48시간 내
            자동 삭제
          </p>
          <p>
            <b>제3자 제공:</b> 원칙적으로 없음. 법령에 따른 요청 시만 예외
          </p>
          <p>
            <b>보안:</b> 암호화·접근통제 등 합리적 보호조치를 적용하나, 완전한
            보안은 보장하지 않음
          </p>
          <p>
            <b>연락처:</b> 개인정보 문의 privacy@mutune.example
          </p>
        </div>
      </main>
    </div>
  );
};

export default Terms;
