import { useState } from "react";
import { supabase } from "./supabaseClient.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email"); // email | code
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const sendCode = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSending(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        // shouldCreateUser defaults to true; a 6-digit token is included in the
        // email template via {{ .Token }}. No redirect needed for OTP flow.
        shouldCreateUser: true,
      },
    });
    setSending(false);
    if (err) {
      setError(err.message || "Could not send code.");
      return;
    }
    setStep("code");
  };

  const verify = async (e) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed.length < 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setVerifying(true);
    setError("");
    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: trimmed,
      type: "email",
    });
    setVerifying(false);
    if (err) {
      setError(err.message || "Invalid or expired code.");
      return;
    }
    // App.jsx onAuthStateChange will pick up the session and swap views.
  };

  const resend = async () => {
    setError("");
    setSending(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setSending(false);
    if (err) setError(err.message || "Could not resend.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111111",
        color: "#eeeeee",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 360 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontFamily: "var(--mono)",
            fontWeight: 700,
            letterSpacing: 1.5,
            textAlign: "center",
          }}
        >
          <span style={{ color: "#c4ff36" }}>RIG</span>
          <span style={{ color: "#eeeeee" }}>MAROLE</span>
        </h1>
        <p
          style={{
            margin: "8px 0 28px",
            textAlign: "center",
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "#555555",
            letterSpacing: 1,
          }}
        >
          SCRIPT A/B TESTING
        </p>

        {step === "email" ? (
          <form onSubmit={sendCode}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "#555555",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                border: "1px solid #222222",
                borderRadius: 8,
                color: "#eeeeee",
                padding: "12px 14px",
                fontSize: 14,
                fontFamily: "var(--body)",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={sending}
              style={{
                marginTop: 12,
                width: "100%",
                background: sending ? "rgba(196,255,54,0.06)" : "rgba(196,255,54,0.1)",
                border: "1px solid rgba(196,255,54,0.25)",
                borderRadius: 8,
                color: "#c4ff36",
                padding: "12px 14px",
                fontSize: 13,
                fontFamily: "var(--mono)",
                fontWeight: 700,
                letterSpacing: 1,
                cursor: sending ? "default" : "pointer",
              }}
            >
              {sending ? "SENDING..." : "EMAIL ME A CODE"}
            </button>
            {error && (
              <p
                style={{
                  marginTop: 10,
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "#f87171",
                }}
              >
                {error}
              </p>
            )}
          </form>
        ) : (
          <form onSubmit={verify}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "#888",
                textAlign: "center",
                marginBottom: 14,
                lineHeight: 1.5,
              }}
            >
              Check your email for a 6-digit code
              <br />
              <span style={{ color: "#555" }}>sent to {email}</span>
            </div>
            <label
              htmlFor="code"
              style={{
                display: "block",
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "#555555",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              CODE
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#151515",
                border: "1px solid #222222",
                borderRadius: 8,
                color: "#eeeeee",
                padding: "12px 14px",
                fontSize: 22,
                fontFamily: "var(--mono)",
                fontWeight: 700,
                letterSpacing: 6,
                textAlign: "center",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={verifying}
              style={{
                marginTop: 12,
                width: "100%",
                background: verifying ? "rgba(196,255,54,0.06)" : "rgba(196,255,54,0.1)",
                border: "1px solid rgba(196,255,54,0.25)",
                borderRadius: 8,
                color: "#c4ff36",
                padding: "12px 14px",
                fontSize: 13,
                fontFamily: "var(--mono)",
                fontWeight: 700,
                letterSpacing: 1,
                cursor: verifying ? "default" : "pointer",
              }}
            >
              {verifying ? "VERIFYING..." : "VERIFY CODE"}
            </button>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 14,
                gap: 8,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError("");
                }}
                style={{
                  background: "transparent",
                  border: "1px solid #222222",
                  borderRadius: 6,
                  color: "#888888",
                  padding: "6px 12px",
                  fontSize: 11,
                  fontFamily: "var(--mono)",
                  cursor: "pointer",
                }}
              >
                ← Change email
              </button>
              <button
                type="button"
                onClick={resend}
                disabled={sending}
                style={{
                  background: "transparent",
                  border: "1px solid #222222",
                  borderRadius: 6,
                  color: "#888888",
                  padding: "6px 12px",
                  fontSize: 11,
                  fontFamily: "var(--mono)",
                  cursor: "pointer",
                }}
              >
                {sending ? "Sending..." : "Resend code"}
              </button>
            </div>
            {error && (
              <p
                style={{
                  marginTop: 10,
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "#f87171",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
