import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginBox from "../components/LoginBox";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const isError = queryParams.has("error");

  useEffect(() => {
    if (isError) {
      alert("로그인에 실패했습니다. 다시 시도해 주세요.");
      navigate("/"); // 확인 누르면 홈("/")으로 이동
    }
  }, [isError, navigate]);

  return (
    <div>
      <LoginBox onClose={() => navigate(-1)} />
    </div>
  );
};

export default Login;
