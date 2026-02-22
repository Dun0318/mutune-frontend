// src/components/AgreementModalChack.jsx
import React, { useState } from "react";

const AgreementModal = ({ userId, onAgree }) => {
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  /** 약관/개인정보 동의 처리 */
  const handleAgree = async () => {
    if (!termsChecked || !privacyChecked) {
      alert("서비스 이용약관과 개인정보 처리방침 모두 동의해야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${userId}/agree-terms`,
        { method: "PATCH" }
      );

      if (!res.ok) throw new Error("약관 동의 처리 실패");

      const updatedUser = await res.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (typeof onAgree === "function") onAgree(updatedUser);
    } catch (e) {
      console.error(e);
      alert("약관 동의 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  /** 취소 처리 → DB에서 삭제 + 로그아웃 */
  const handleCancel = async () => {
    if (!window.confirm("약관에 동의하지 않으면 회원가입이 취소됩니다. 진행할까요?")) {
      return;
    }

    try {
      await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "DELETE",
      });

      // localStorage 초기화
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // 로그아웃 이벤트 전파
      window.dispatchEvent(new Event("auth:logout"));

      // 로그인 페이지로 이동
      window.location.href = "/";
    } catch (err) {
      console.error("회원 삭제 실패:", err);
      alert("회원 삭제 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white w-[92%] max-w-[480px] rounded-2xl shadow-2xl p-6">
        {/* 제목 */}
        <h2 className="text-xl font-bold mb-3 text-gray-900">약관 동의</h2>

        {/* 안내 문구 */}
        <p className="text-sm text-gray-700 mb-3">
          MuTune 서비스를 이용하시려면 아래{" "}
          <span className="font-semibold text-blue-600">서비스 이용 약관</span>과{" "}
          <span className="font-semibold text-blue-600">개인정보 처리방침</span>에
          모두 동의해 주셔야 합니다.
        </p>

        {/* 약관 전문 (스크롤 박스) */}
        <div className="border rounded-lg bg-gray-50 p-3 h-56 overflow-y-auto text-[12px] leading-5 text-gray-700 space-y-3 mb-3">
          <h3 className="font-semibold text-gray-900">[서비스 이용약관]</h3>

          <p>
            <b>제1조 (목적)</b> 이 약관은 MuTune(이하 “서비스”)가 제공하는
            온라인 악보/음원 편집 관련 기능의 이용 조건과 책임을 정합니다.
          </p>

          <p>
            <b>제2조 (정의)</b> ① “회원”은 소셜 로그인을 통해 가입한 자를 말합니다.
            ② “콘텐츠”는 회원이 업로드·처리·다운로드하는 모든 파일 및 결과물을 말합니다.
          </p>

          <p>
            <b>제5조 (금지행위 및 상업적 이용 제한)</b> 서비스 및 결과물의{" "}
            <b>상업적 이용(재판매·유료배포·영리 공연/방송 등)</b>은 금지되며,
            개인적·비상업적 용도에 한해 사용할 수 있습니다.
          </p>

          <p>
            <b>제6조 (권리 및 라이선스)</b> 업로드한 콘텐츠의 권리는 원저작권자에게 귀속되며,
            회원은 적법한 권리를 보유해야 합니다. MuTune은 서비스 제공을 위해 필요한 범위에서만
            임시 처리·저장합니다.
          </p>

          <p>
            <b>제7조 (파일 보관/자동 삭제)</b> 업로드 파일은 서비스 제공을 위한{" "}
            <b>임시 저장</b>만 하며, 처리 완료 후 <b>48시간 이내 자동 삭제</b>됩니다.
          </p>

          <p>
            <b>제10조 (책임의 한계)</b> 회원이 업로드한 불법 콘텐츠로 발생한 법적 분쟁의 책임은
            전적으로 회원에게 있으며, MuTune은 책임을 지지 않습니다.
          </p>

          <p>
            <b>제12조 (준거법/관할)</b> 본 약관은 대한민국 법률에 따르며,
            분쟁은 서울중앙지방법원을 전속 관할로 합니다.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">[개인정보 처리방침]</h3>

          <p>
            <b>수집항목:</b> 이메일, 소셜 ID, 닉네임, 프로필 이미지(필수) /
            웹사이트, 한 줄 소개(선택)
          </p>

          <p>
            <b>이용목적:</b> 회원 식별, 서비스 제공(파일 처리), 보안, 품질 개선
          </p>

          <p>
            <b>보관기간:</b> 회원 탈퇴 시 즉시 삭제, 업로드 파일은{" "}
            <b>48시간 내 자동 삭제</b>
          </p>

          <p>
            <b>제3자 제공:</b> 원칙적으로 없음. 법령에 따른 요청 시만 예외
          </p>

          <p>
            <b>보안:</b> 암호화·접근통제 등 합리적 보호조치를 적용하나,
            완전한 보안은 보장하지 않음
          </p>

          <p>
            <b>연락처:</b> 개인정보 문의 privacy@mutune.example
          </p>
        </div>

        {/* 동의 체크박스 2개 */}
        <div className="flex flex-col gap-2 text-sm text-gray-800 mb-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={() => setTermsChecked((v) => !v)}
            />
            <span>서비스 이용약관에 동의합니다</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={privacyChecked}
              onChange={() => setPrivacyChecked((v) => !v)}
            />
            <span>개인정보 처리방침에 동의합니다</span>
          </label>
        </div>

        {/* 버튼 2개 (확인 / 취소) */}
        <div className="flex gap-3">
          <button
            onClick={handleAgree}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "처리 중..." : "확인"}
          </button>

          <button
            onClick={handleCancel}
            className="flex-1 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
