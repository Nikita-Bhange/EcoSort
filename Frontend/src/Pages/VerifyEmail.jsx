import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../Components/AuthLayout";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const email = params.get("email");
  const role = params.get("role") || "user";

  useEffect(() => {
    if (!token) {
      setStatus("pending");
      setMessage(
        "Your account was created. Check your inbox and click the verification link before signing in."
      );
      return;
    }

    const verify = async () => {
      setStatus("loading");

      try {
        const res = await axios.get(
          `http://localhost:8000/api/auth/verify-email?token=${encodeURIComponent(token)}`
        );
        setStatus("success");
        setMessage(res.data?.message || "Email verified successfully");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Verification failed"
        );
      }
    };

    verify();
  }, [token]);

  return (
    <AuthLayout
      eyebrow="Email verification"
      title="Verify your inbox"
      subtitle="One last security step before the account becomes active."
      sideTitle="Keep account access intentional."
      sideText="Verification confirms ownership of the email address before any JWT-based session can start."
    >
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-base font-medium text-slate-800">
            {status === "loading" ? "Verifying your email..." : message}
          </p>
          {email ? (
            <p className="mt-2 text-sm text-slate-500">
              Verification address: <span className="font-medium">{email}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          {(status === "success" || status === "pending") && (
            <button
              type="button"
              onClick={() => navigate(role === "admin" ? "/login/admin" : "/login")}
              className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              Go to sign in
            </button>
          )}
          <Link
            to={role === "admin" ? "/register/admin" : "/register"}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
          >
            Back to register
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
