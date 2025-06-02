import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import { githubLogin } from "../../store/slices/authSlice";
import { AppDispatch } from "../../store";

export default function GithubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      const handleGithubCallback = async () => {
        try {
          const result = await dispatch(githubLogin(code));
          if (githubLogin.fulfilled.match(result)) {
            navigate("/");
          }
        } catch (err) {
          console.error("GitHub callback failed:", err);
          navigate("/signin");
        }
      };
      handleGithubCallback();
    } else {
      navigate("/signin");
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Processing GitHub login...
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  );
}
