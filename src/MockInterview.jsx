import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import "./MockInterview.css";

function MockInterview() {
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [feedback, setFeedback] = useState(null);

  const [questionNumber, setQuestionNumber] = useState(1);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (currentUser) => {
        setUser(currentUser);

        if (!currentUser) {
          window.location.href = "/signin";
          return;
        }

        try {
          const analysisRef = doc(
            db,
            "users",
            currentUser.uid,
            "careerAnalysis",
            "latest"
          );

          const snapshot = await getDoc(
            analysisRef
          );

          if (snapshot.exists()) {
            setAnalysis(snapshot.data());
          }
        } catch (error) {
          console.error(
            "Failed to load career analysis:",
            error
          );
        }
      }
    );

    return unsubscribe;
  }, []);

  const career =
    analysis?.careerMatches?.[0]?.career ||
    "Software Developer";

  const generateQuestion = async () => {
    try {
      setLoading(true);
      setFeedback(null);
      setAnswer("");

      const response = await fetch(
        "https://careerx-ai-yp5x.onrender.com/api/mock-interview/question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            career,
            skills:
              analysis?.technicalSkills || [],
            questionNumber,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Could not generate interview question."
        );
      }

      setQuestion(result.question);
    } catch (error) {
      console.error(
        "Question generation error:",
        error
      );

      alert(
        error.message ||
          "Failed to generate interview question."
      );
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    setInterviewStarted(true);
    setQuestionNumber(1);
    await generateQuestion();
  };

  const evaluateAnswer = async () => {
    if (!answer.trim()) {
      alert("Please enter your answer first.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://careerx-ai-yp5x.onrender.com/api/mock-interview/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            career,
            question,
            answer,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Could not evaluate your answer."
        );
      }

      setFeedback(result.feedback);
    } catch (error) {
      console.error(
        "Answer evaluation error:",
        error
      );

      alert(
        error.message ||
          "Failed to evaluate your answer."
      );
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    const nextNumber = questionNumber + 1;

    setQuestionNumber(nextNumber);

    await generateQuestion();
  };

  if (!user) {
    return (
      <div className="mock-loading">
        Loading interview...
      </div>
    );
  }

  return (
    <div className="mock-page">

      {/* NAVBAR */}

      <nav className="mock-navbar">

        <div
          className="mock-logo"
          onClick={() =>
            (window.location.href = "/dashboard")
          }
        >
          <div className="mock-logo-icon">
            ✦
          </div>

          <span>
            CareerX<span> AI</span>
          </span>
        </div>

        <button
          className="mock-back"
          onClick={() =>
            (window.location.href = "/dashboard")
          }
        >
          ← Dashboard
        </button>

      </nav>

      {/* CONTENT */}

      <main className="mock-main">

        {!interviewStarted ? (

          <section className="mock-intro">

            <span className="mock-badge">
              ✦ AI INTERVIEW COACH
            </span>

            <h1>
              Practice for your
              <br />
              <span>dream interview.</span>
            </h1>

            <p>
              CareerX AI will generate personalized
              interview questions based on your
              target career and resume.
            </p>

            <div className="mock-career-card">

              <small>
                YOUR TARGET CAREER
              </small>

              <h3>
                {career}
              </h3>

              <p>
                Questions will be tailored to your
                skills and career profile.
              </p>

            </div>

            <button
              className="start-interview-button"
              onClick={startInterview}
              disabled={loading}
            >
              {loading
                ? "Preparing Interview..."
                : "Start Mock Interview →"}
            </button>

          </section>

        ) : (

          <section className="interview-session">

            <div className="interview-top">

              <div>

                <span className="mock-badge">
                  ✦ MOCK INTERVIEW
                </span>

                <h2>
                  {career}
                </h2>

              </div>

              <div className="question-counter">
                Question{" "}
                <strong>
                  {questionNumber}
                </strong>
              </div>

            </div>

            <div className="question-card">

              <small>
                INTERVIEW QUESTION
              </small>

              <h3>
                {loading && !question
                  ? "Generating question..."
                  : question}
              </h3>

            </div>

            <div className="answer-card">

              <label htmlFor="answer">
                Your Answer
              </label>

              <textarea
                id="answer"
                value={answer}
                onChange={(event) =>
                  setAnswer(event.target.value)
                }
                placeholder="Type your answer here..."
                disabled={
                  loading || !!feedback
                }
              />

              {!feedback && (
                <button
                  className="evaluate-button"
                  onClick={evaluateAnswer}
                  disabled={loading}
                >
                  {loading
                    ? "Evaluating..."
                    : "Submit Answer →"}
                </button>
              )}

            </div>

            {feedback && (

              <div className="feedback-card">

                <div className="feedback-header">

                  <div>

                    <small>
                      AI FEEDBACK
                    </small>

                    <h3>
                      Your Interview Evaluation
                    </h3>

                  </div>

                  <div className="feedback-score">
                    {feedback.score}
                    <span>/100</span>
                  </div>

                </div>

                <div className="feedback-grid">

                  <div>
                    <small>
                      STRENGTHS
                    </small>

                    <ul>
                      {feedback.strengths?.map(
                        (item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <small>
                      IMPROVEMENTS
                    </small>

                    <ul>
                      {feedback.improvements?.map(
                        (item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                </div>

                <div className="model-answer">

                  <small>
                    BETTER ANSWER
                  </small>

                  <p>
                    {feedback.modelAnswer}
                  </p>

                </div>

                <button
                  className="next-question-button"
                  onClick={nextQuestion}
                >
                  Next Question →
                </button>

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default MockInterview;
