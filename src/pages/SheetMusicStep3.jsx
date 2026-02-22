import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ScoreViewer from "../components/ScoreViewer";

const SheetMusicStep3 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1️ 접근 검증 (quickXmlPath 기준)
  useEffect(() => {
    if (!location.state || !location.state.quickXmlPath) {
      navigate("/sheetMusic/step2", { replace: true });
    }
  }, [location, navigate]);

  // 2️ state 없으면 렌더 중단
  if (!location.state || !location.state.quickXmlPath) {
    return <div className="p-8">잘못된 접근입니다.</div>;
  }

  // 3️ 정상 접근
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">악보 미리보기</h2>

      <ScoreViewer
        xmlUrl={location.state.quickXmlPath}
      />
    </div>
  );
};

export default SheetMusicStep3;
