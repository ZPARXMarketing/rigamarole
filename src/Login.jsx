import { useState } from "react";
import { supabase } from "./supabaseClient.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus("sending");
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (err) {
      setStatus("error");
      setError(err.message || "Could not send magic link.");
      return;
    }
    setStatus("sent");
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

        {status === "sent" ? (
          <div
            style={{
              background: "#151515",
              border: "1px solid #1e1e1e",
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                color: "#c4ff36",
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              CHECK YOUR EMAIL
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--body)",
                fontSize: 14,
                color: "#888888",
                lineHeight: 1.6,
              }}
            >
              We sent a magic link to
              <br />
              <span style={{ color: "#eeeeee" }}>{email}</span>
            </p>
            <button
              onClick={() => {
                setStatus("idle");
                setEmail("");
              }}
              style={{
                marginTop: 16,
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
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
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
              disabled={status === "sending"}
              style={{
                marginTop: 12,
                width: "100%",
                background:
                  status === "sending"
                    ? "rgba(196,255,54,0.06)"
                    : "rgba(196,255,54,0.1)",
                border: "1px solid rgba(196,255,54,0.25)",
                borderRadius: 8,
                color: "#c4ff36",
                padding: "12px 14px",
                fontSize: 13,
                fontFamily: "var(--mono)",
                fontWeight: 700,
                letterSpacing: 1,
                cursor: status === "sending" ? "default" : "pointer",
              }}
            >
              {status === "sending" ? "SENDING..." : "SEND MAGIC LINK"}
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
        )}
      </div>
    </div>
  );
}
