import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);
        setCheckingAuth(false);

        if (!currentUser) {
          setLoadingAnalysis(false);
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

          const analysisSnapshot =
            await getDoc(analysisRef);

          if (analysisSnapshot.exists()) {
            console.log(
              "CareerX Firestore analysis:",
              analysisSnapshot.data()
            );

            setAnalysis(
              analysisSnapshot.data()
            );
          } else {
            console.log(
              "No career analysis found yet."
            );

            setAnalysis(null);
          }
        } catch (error) {
          console.error(
            "Error loading career analysis:",
            error
          );

          setAnalysis(null);
        } finally {
          setLoadingAnalysis(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/signin";
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  if (checkingAuth) {
    return (
      <div className="dashboard-loading">
        Loading CareerX...
      </div>
    );
  }

  if (!user) {
    window.location.href = "/signin";
    return null;
  }

  const displayName =
    user.displayName ||
    user.email?.split("@")[0] ||
    "Career Explorer";

  const initial =
    displayName.charAt(0).toUpperCase();

  const jobReadiness =
    analysis?.jobReadiness ?? "--";

  const topCareer =
    analysis?.careerMatches?.[0];

  const careerMatch =
    topCareer?.match ?? "--";

  const careerName =
    topCareer?.career ??
    "Analyze your resume";

  const technicalSkillCount =
    analysis?.technicalSkills?.length || 0;

  const softSkillCount =
    analysis?.softSkills?.length || 0;

  const totalSkills =
    technicalSkillCount +
    softSkillCount;

  const roadmapCount =
    analysis?.roadmap?.length || 0;

  const skillGapCount =
    analysis?.skillGaps?.length || 0;

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">
            ✦
          </div>

          <span>
            CareerX<span> AI</span>
          </span>
        </div>

        <nav className="dashboard-nav">

          <a
            href="#dashboard"
            className="dashboard-nav-item active"
          >
            <span>⌂</span>
            Dashboard
          </a>

          <a
            href="/resume"
            className="dashboard-nav-item"
          >
            <span>▣</span>
            Resume Analysis
          </a>

          <a
            href="#career-paths"
            className="dashboard-nav-item"
          >
            <span>◎</span>
            Career Paths
          </a>

          <a
            href="#roadmap"
            className="dashboard-nav-item"
          >
            <span>↗</span>
            Learning Roadmap
          </a>

          <a
  href="/mock-interview"
  className="dashboard-nav-item"
>
  <span>◉</span>
  Mock Interview
</a>

        </nav>

        <div className="dashboard-sidebar-bottom">

          <button onClick={handleLogout}>
            <span>↪</span>
            Sign Out
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        {/* ================= HEADER ================= */}

        <header
          className="dashboard-header"
          id="dashboard"
        >

          <div>

            <small>
              CAREERX DASHBOARD
            </small>

            <h1>
              Welcome back, {displayName} 👋
            </h1>

            <p>
              Let's turn your skills into your
              next career opportunity.
            </p>

          </div>

          <div className="user-avatar">
            {initial}
          </div>

        </header>

        {/* ================= STATS ================= */}

        <section className="dashboard-cards">

          <div className="dashboard-card">

            <small>
              JOB READINESS
            </small>

            <strong>
              {jobReadiness}

              {jobReadiness !== "--" && (
                <span
                  style={{
                    fontSize: "14px",
                    color: "#9999a5",
                    marginLeft: "3px",
                  }}
                >
                  /100
                </span>
              )}
            </strong>

            <p>
              {analysis
                ? "Based on your resume analysis."
                : "Analyze your resume to calculate your score."}
            </p>

          </div>

          <div className="dashboard-card">

            <small>
              CAREER MATCH
            </small>

            <strong>
              {careerMatch}

              {careerMatch !== "--" && "%"}
            </strong>

            <p>
              {careerName}
            </p>

          </div>

          <div className="dashboard-card">

            <small>
              SKILLS IDENTIFIED
            </small>

            <strong>
              {totalSkills || "--"}
            </strong>

            <p>
              {analysis
                ? `${technicalSkillCount} technical + ${softSkillCount} soft`
                : "We'll discover your strongest skills."}
            </p>

          </div>

        </section>

        {/* ================= AI ACTION ================= */}

        <section className="dashboard-action">

          <div>

            <span className="dashboard-action-badge">
              ✦ AI ANALYSIS
            </span>

            <h2>
              {analysis
                ? "Your career intelligence is ready"
                : "Start with your resume"}
            </h2>

            <p>
              {analysis
                ? `Your current top match is ${careerName} with a ${careerMatch}% compatibility score. Explore your personalized roadmap and skill gaps.`
                : "Upload your resume and let CareerX AI identify your skills, career opportunities, skill gaps and learning path."}
            </p>

            <button
              onClick={() =>
                (window.location.href = "/resume")
              }
            >
              {analysis
                ? "Analyze Another Resume →"
                : "Analyze My Resume →"}
            </button>

          </div>

          <div className="dashboard-illustration">

            <div className="illustration-ring ring-one"></div>

            <div className="illustration-ring ring-two"></div>

            <div className="illustration-center">
              ✦
            </div>

          </div>

        </section>

        {/* ================= CAREER PATHS ================= */}

        <section
          className="dashboard-panel career-paths-section"
          id="career-paths"
        >

          <div className="panel-title">

            <div>
              <small>
                CAREER DISCOVERY
              </small>

              <h3>
                Career Paths
              </h3>
            </div>

            <span>
              {analysis?.careerMatches?.length || 0} matches
            </span>

          </div>

          {!analysis ? (

            <div className="empty-state">
              <div className="empty-state-icon">
                ✦
              </div>

              <h4>
                Discover your career paths
              </h4>

              <p>
                Analyze your resume to receive
                personalized career recommendations.
              </p>

              <button
                onClick={() =>
                  (window.location.href = "/resume")
                }
              >
                Analyze My Resume →
              </button>
            </div>

          ) : (

            <div className="career-path-list">

              {analysis.careerMatches?.map(
                (career, index) => (

                  <div
                    className={`career-path-card ${
                      index === 0
                        ? "top-career"
                        : ""
                    }`}
                    key={index}
                  >

                    <div className="career-path-number">
                      {index + 1}
                    </div>

                    <div className="career-path-content">

                      <div className="career-path-heading">

                        <div>
                          <small>
                            {index === 0
                              ? "BEST MATCH"
                              : `MATCH ${index + 1}`}
                          </small>

                          <h4>
                            {career.career}
                          </h4>
                        </div>

                        <strong>
                          {career.match}%
                        </strong>

                      </div>

                      <p>
                        {career.reason}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* ================= SKILL GAP ================= */}

        <section
          className="dashboard-panel"
          id="skill-gaps"
          style={{ marginTop: "18px" }}
        >

          <div className="panel-title">

            <div>
              <small>
                SKILL DEVELOPMENT
              </small>

              <h3>
                Skills to Strengthen
              </h3>
            </div>

            <span>
              {skillGapCount} gaps
            </span>

          </div>

          {analysis?.skillGaps?.length ? (

            <div className="skill-gap-list">

              {analysis.skillGaps.map(
                (gap, index) => (

                  <div
                    className="skill-gap-item"
                    key={index}
                  >

                    <div>

                      <strong>
                        {gap.skill}
                      </strong>

                      <p>
                        {gap.reason}
                      </p>

                    </div>

                    <span>
                      {gap.priority}
                    </span>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="empty-inline">
              Analyze your resume to identify
              your most important skill gaps.
            </div>

          )}

        </section>

        {/* ================= ROADMAP ================= */}

        <section
          className="dashboard-panel"
          id="roadmap"
          style={{ marginTop: "18px" }}
        >

          <div className="panel-title">

            <div>
              <small>
                PERSONALIZED PLAN
              </small>

              <h3>
                Learning Roadmap
              </h3>
            </div>

            <span>
              {roadmapCount} phases
            </span>

          </div>

          {analysis?.roadmap?.length ? (

            <div className="full-roadmap">

              {analysis.roadmap.map(
                (phase, index) => (

                  <div
                    className="roadmap-card"
                    key={index}
                  >

                    <div className="roadmap-number">
                      {index + 1}
                    </div>

                    <div className="roadmap-content">

                      <small>
                        {phase.phase}
                      </small>

                      <h4>
                        {phase.title}
                      </h4>

                      <p>
                        {phase.duration}
                      </p>

                      <div className="roadmap-skills">

                        {phase.skills?.map(
                          (skill, skillIndex) => (
                            <span
                              key={skillIndex}
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="empty-inline">
              Your personalized learning roadmap
              will appear after resume analysis.
            </div>

          )}

        </section>

        {/* ================= STRENGTHS ================= */}

        {analysis && (
          <section
            className="dashboard-two-column"
            style={{ marginTop: "18px" }}
          >

            <div className="dashboard-panel">

              <div className="panel-title">

                <div>
                  <small>
                    YOUR ADVANTAGE
                  </small>

                  <h3>
                    Strengths
                  </h3>
                </div>

                <span>
                  {analysis.strengths?.length || 0}
                </span>

              </div>

              <ul className="dashboard-list">

                {analysis.strengths?.map(
                  (strength, index) => (
                    <li key={index}>
                      <span>✓</span>
                      {strength}
                    </li>
                  )
                )}

              </ul>

            </div>

            <div className="dashboard-panel">

              <div className="panel-title">

                <div>
                  <small>
                    NEXT STEPS
                  </small>

                  <h3>
                    Improvements
                  </h3>
                </div>

                <span>
                  {analysis.improvements?.length || 0}
                </span>

              </div>

              <ul className="dashboard-list">

                {analysis.improvements?.map(
                  (item, index) => (
                    <li key={index}>
                      <span>→</span>
                      {item}
                    </li>
                  )
                )}

              </ul>

            </div>

          </section>
        )}

        {/* ================= MOCK INTERVIEW ================= */}

        <section
          className="dashboard-panel mock-interview-section"
          id="mock-interview"
          style={{ marginTop: "18px" }}
        >

          <div className="panel-title">

            <div>
              <small>
                INTERVIEW PREPARATION
              </small>

              <h3>
                Mock Interview
              </h3>
            </div>

            <span>
              AI Ready
            </span>

          </div>

          <div className="mock-interview-content">

            <div>
              <h4>
                Ready to test your skills?
              </h4>

              <p>
                Practice interview questions tailored
                to your target career:
                <strong>
                  {" "}
                  {careerName}
                </strong>.
              </p>
<button
  type="button"
  onClick={() =>
    (window.location.href = "/mock-interview")
  }
>
  Start Mock Interview →
</button>
            </div>

            <div className="mock-interview-icon">
              ✦
            </div>

          </div>

        </section>

        {/* ================= JOURNEY ================= */}

        <section
          className="dashboard-panel"
          style={{ marginTop: "18px" }}
        >

          <div className="panel-title">

            <div>

              <small>
                YOUR JOURNEY
              </small>

              <h3>
                Career Progress
              </h3>

            </div>

            <span>
              {analysis
                ? "Analysis complete"
                : "Just getting started"}
            </span>

          </div>

          <div className="journey-steps">

            <div className="journey-step current">
              <div>1</div>
              <span>
                Upload Resume
              </span>
            </div>

            <div className="journey-line"></div>

            <div
              className={`journey-step ${
                analysis
                  ? "current"
                  : ""
              }`}
            >
              <div>2</div>
              <span>
                AI Analysis
              </span>
            </div>

            <div className="journey-line"></div>

            <div
              className={`journey-step ${
                roadmapCount > 0
                  ? "current"
                  : ""
              }`}
            >
              <div>3</div>
              <span>
                Career Roadmap
              </span>
            </div>

            <div className="journey-line"></div>

            <div className="journey-step">
              <div>4</div>
              <span>
                Mock Interview
              </span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;