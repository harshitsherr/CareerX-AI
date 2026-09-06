import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import "./SignIn.css";

function SignIn() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (isCreatingAccount) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

    window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);

      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("Incorrect email or password.");
          break;

        case "auth/email-already-in-use":
          setError("An account with this email already exists.");
          break;

        case "auth/weak-password":
          setError("Password must be at least 6 characters.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        default:
          setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <div className="signin-logo">
          <div className="signin-logo-icon">✦</div>

          <span>
            CareerX<span> AI</span>
          </span>
        </div>

        <div className="signin-heading">
          <h1>
            {isCreatingAccount ? "Create your account" : "Welcome back"}
          </h1>

          <p>
            {isCreatingAccount
              ? "Start your personalized career journey."
              : "Sign in to continue your career journey."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />

          {!isCreatingAccount && (
            <div className="signin-options">
              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="forgot"
                onClick={() =>
                  setError("Password reset will be added next.")
                }
              >
                Forgot password?
              </button>
            </div>
          )}

          {error && <div className="signin-error">{error}</div>}

          <button
            type="submit"
            className="signin-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isCreatingAccount
              ? "Create Account →"
              : "Sign In →"}
          </button>
        </form>

        <div className="signup-text">
          {isCreatingAccount
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsCreatingAccount(!isCreatingAccount);
              setError("");
            }}
          >
            {isCreatingAccount ? " Sign In" : " Create one"}
          </button>
        </div>

        <button
          className="back-home"
          onClick={() => (window.location.href = "/Dashboard")}
        >
          ← Back to CareerX
        </button>
      </div>
    </div>
  );
}

export default SignIn;