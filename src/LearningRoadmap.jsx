import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import "./LearningRoadmap.css";

// Learning resource map for skill-to-URL mapping
const learningResources = {
  "Data Structures": "https://www.geeksforgeeks.org/data-structures/",
  "Algorithms": "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
  "Time & Space Complexity": "https://www.geeksforgeeks.org/understanding-time-complexity-simple-examples/",
  "SQL": "https://www.w3schools.com/sql/",
  "React": "https://react.dev/learn",
  "Node.js": "https://nodejs.org/en/learn",
  "Express.js": "https://expressjs.com/en/starter/installing.html",
  "JavaScript": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  "HTML": "https://developer.mozilla.org/en-US/docs/Web/HTML",
  "CSS": "https://developer.mozilla.org/en-US/docs/Web/CSS",
  "Python": "https://docs.python.org/3/tutorial/",
  "Kotlin": "https://kotlinlang.org/docs/home.html",
  "Java": "https://dev.java/learn/",
  "Git": "https://git-scm.com/doc",
  "GitHub": "https://docs.github.com/en/get-started",
  "Docker": "https://docs.docker.com/get-started/",
  "MongoDB": "https://www.mongodb.com/docs/manual/",
  "Firebase": "https://firebase.google.com/docs",
  "Redis": "https://redis.io/docs/latest/",
  "System Design": "https://github.com/donnemartin/system-design-primer",
  "REST APIs": "https://restfulapi.net/",
  "GraphQL": "https://graphql.org/learn/",
  "TypeScript": "https://www.typescriptlang.org/docs/",
};

// Helper function to get learning resource URL from skill name
function getLearningResource(skill) {
  if (!skill) {
    return "https://skillsbuild.org/learning-catalog";
  }

  const normalized = skill
    .toLowerCase()
    .trim();

  // Direct match
  const directKey = Object.keys(learningResources).find(
    (key) => key.toLowerCase() === normalized
  );
  if (directKey) {
    return learningResources[directKey];
  }

  // Fuzzy matching for common variations
  // Data Structures & Algorithms / DSA variations
  if (normalized.includes("data structures") || normalized === "dsa") {
    return learningResources["Data Structures"];
  }

  // JavaScript / JS
  if (normalized === "js" || normalized.startsWith("javascript")) {
    return learningResources["JavaScript"];
  }

  // React variations: React.js, React
  if (normalized === "react.js" || normalized === "react" || normalized.startsWith("react")) {
    return learningResources["React"];
  }

  // Node variations: Node.js, Node
  if (normalized === "node" || normalized === "node.js" || normalized.startsWith("node")) {
    return learningResources["Node.js"];
  }

  // MongoDB / Mongo DB
  if (normalized.includes("mongodb") || normalized.includes("mongo db") || normalized === "mongo") {
    return learningResources["MongoDB"];
  }

  // SQL variations
  if (normalized.includes("sql") && !normalized.includes("nosql")) {
    return learningResources["SQL"];
  }

  // Git & GitHub
  if (normalized.includes("git") || normalized.includes("github")) {
    return learningResources["Git"];
  }

  // Docker variations
  if (normalized.includes("docker")) {
    return learningResources["Docker"];
  }

  // Express / Express.js
  if (normalized.includes("express")) {
    return learningResources["Express.js"];
  }

  // Python
  if (normalized.includes("python")) {
    return learningResources["Python"];
  }

  // Kotlin
  if (normalized.includes("kotlin")) {
    return learningResources["Kotlin"];
  }

  // Java
  if (normalized.includes("java") && !normalized.includes("javascript")) {
    return learningResources["Java"];
  }

  // HTML
  if (normalized.includes("html")) {
    return learningResources["HTML"];
  }

  // CSS
  if (normalized.includes("css")) {
    return learningResources["CSS"];
  }

  // Firebase
  if (normalized.includes("firebase")) {
    return learningResources["Firebase"];
  }

  // Redis
  if (normalized.includes("redis")) {
    return learningResources["Redis"];
  }

  // TypeScript / TS
  if (normalized.includes("typescript") || normalized === "ts") {
    return learningResources["TypeScript"];
  }

  // REST / RESTful API
  if (normalized.includes("rest") || normalized.includes("api")) {
    return learningResources["REST APIs"];
  }

  // GraphQL
  if (normalized.includes("graphql")) {
    return learningResources["GraphQL"];
  }

  // System Design
  if (normalized.includes("system design") || normalized.includes("architecture")) {
    return learningResources["System Design"];
  }

  // Default fallback for unknown skills
  return "https://skillsbuild.org/learning-catalog";
}

function LearningRoadmap() {
  const [analysis, setAnalysis] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
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

          const snapshot = await getDoc(analysisRef);

          if (snapshot.exists()) {
            const data = snapshot.data();

            setAnalysis(data);
            setProgress(
              data.roadmapProgress || {}
            );
          }
        } catch (error) {
          console.error(
            "Failed to load roadmap:",
            error
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  const roadmap = analysis?.roadmap || [];

  const getSkillKey = (phaseIndex, skillIndex) =>
    `phase-${phaseIndex}-skill-${skillIndex}`;

  const isSkillComplete = (
    phaseIndex,
    skillIndex
  ) => {
    const key = getSkillKey(
      phaseIndex,
      skillIndex
    );

    return progress[key] === true;
  };

  const getPhaseProgress = (phase, phaseIndex) => {
    const skills = phase?.skills || [];

    if (!skills.length) {
      return 100;
    }

    const completed = skills.filter(
      (_, skillIndex) =>
        isSkillComplete(
          phaseIndex,
          skillIndex
        )
    ).length;

    return Math.round(
      (completed / skills.length) * 100
    );
  };

  const overallProgress = useMemo(() => {
    const allSkills = roadmap.flatMap(
      (phase, phaseIndex) =>
        (phase.skills || []).map(
          (_, skillIndex) => ({
            phaseIndex,
            skillIndex,
          })
        )
    );

    if (!allSkills.length) {
      return 0;
    }

    const completed = allSkills.filter(
      ({ phaseIndex, skillIndex }) =>
        isSkillComplete(
          phaseIndex,
          skillIndex
        )
    ).length;

    return Math.round(
      (completed / allSkills.length) * 100
    );
  }, [roadmap, progress]);

  const completedSkillCount = Object.values(
    progress
  ).filter(Boolean).length;

  const totalSkillCount = roadmap.reduce(
    (total, phase) =>
      total + (phase.skills?.length || 0),
    0
  );

  const toggleSkill = async (
    phaseIndex,
    skillIndex
  ) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please sign in first.");
      return;
    }

    const key = getSkillKey(
      phaseIndex,
      skillIndex
    );

    const nextValue = !isSkillComplete(
      phaseIndex,
      skillIndex
    );

    const nextProgress = {
      ...progress,
      [key]: nextValue,
    };

    setProgress(nextProgress);

    try {
      setSaving(true);

      const analysisRef = doc(
        db,
        "users",
        user.uid,
        "careerAnalysis",
        "latest"
      );

      await setDoc(
        analysisRef,
        {
          roadmapProgress: nextProgress,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );
    } catch (error) {
      console.error(
        "Failed to save roadmap progress:",
        error
      );

      setProgress(progress);

      alert(
        "Could not save your progress. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const resetProgress = async () => {
    const user = auth.currentUser;

    if (!user) return;

    const confirmed = window.confirm(
      "Reset all roadmap progress?"
    );

    if (!confirmed) return;

    const emptyProgress = {};

    setProgress(emptyProgress);

    try {
      setSaving(true);

      const analysisRef = doc(
        db,
        "users",
        user.uid,
        "careerAnalysis",
        "latest"
      );

      await setDoc(
        analysisRef,
        {
          roadmapProgress: {},
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );
    } catch (error) {
      console.error(
        "Failed to reset roadmap:",
        error
      );

      alert(
        "Could not reset your progress."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="roadmap-loading">
        Loading your learning roadmap...
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="roadmap-page">
        <div className="roadmap-empty">
          <div className="roadmap-empty-icon">
            ✦
          </div>

          <h1>
            Your roadmap is not ready yet
          </h1>

          <p>
            Analyze your resume first to generate
            your personalized learning roadmap.
          </p>

          <button
            onClick={() =>
              (window.location.href = "/resume")
            }
          >
            Analyze My Resume →
          </button>
        </div>
      </div>
    );
  }

  const career =
    analysis.careerMatches?.[0]?.career ||
    "Your Target Career";

  return (
    <div className="roadmap-page">

      {/* NAVBAR */}

      <nav className="roadmap-navbar">

        <div
          className="roadmap-logo"
          onClick={() =>
            (window.location.href = "/dashboard")
          }
        >
          <div className="roadmap-logo-icon">
            ✦
          </div>

          <span>
            CareerX<span> AI</span>
          </span>
        </div>

        <button
          className="roadmap-back"
          onClick={() =>
            (window.location.href = "/dashboard")
          }
        >
          ← Dashboard
        </button>

      </nav>

      <main className="roadmap-main">

        {/* HEADER */}

        <header className="roadmap-header">

          <span className="roadmap-badge">
            ✦ PERSONALIZED LEARNING
          </span>

          <h1>
            Your path to
            <br />
            <span>{career}</span>
          </h1>

          <p>
            CareerX AI created this roadmap from your
            resume, current skills, career matches,
            and identified skill gaps.
          </p>

        </header>

        {/* OVERALL PROGRESS */}

        <section className="progress-card">

          <div className="progress-top">

            <div>
              <small>
                YOUR PROGRESS
              </small>

              <h2>
                {overallProgress}% Complete
              </h2>
            </div>

            <div className="progress-count">
              {completedSkillCount} /{" "}
              {totalSkillCount} skills
            </div>

          </div>

          <div className="progress-track">

            <div
              className="progress-fill"
              style={{
                width: `${overallProgress}%`,
              }}
            />

          </div>

          <div className="progress-footer">

            <span>
              {overallProgress === 100
                ? "🎉 Roadmap completed!"
                : overallProgress === 0
                ? "Start your first skill."
                : "Keep going — you're making progress."}
            </span>

            <button
              type="button"
              onClick={resetProgress}
              disabled={
                saving || completedSkillCount === 0
              }
            >
              Reset Progress
            </button>

          </div>

        </section>

        {/* ROADMAP */}

        <section className="roadmap-section">

          <div className="roadmap-section-heading">

            <div>
              <small>
                YOUR LEARNING JOURNEY
              </small>

              <h2>
                Step-by-step roadmap
              </h2>
            </div>

            <span>
              {roadmap.length} phases
            </span>

          </div>

          <div className="roadmap-list">

            {roadmap.map(
              (phase, phaseIndex) => {

                const phaseProgress =
                  getPhaseProgress(
                    phase,
                    phaseIndex
                  );

                const skills =
                  phase.skills || [];

                return (
                  <div
                    className={`roadmap-phase ${
                      phaseProgress === 100
                        ? "phase-complete"
                        : ""
                    }`}
                    key={phaseIndex}
                  >

                    <div className="phase-number">
                      {phaseProgress === 100
                        ? "✓"
                        : phaseIndex + 1}
                    </div>

                    <div className="phase-content">

                      <div className="phase-top">

                        <div>
                          <small>
                            {phase.phase}
                          </small>

                          <h3>
                            {phase.title}
                          </h3>
                        </div>

                        <span className="phase-duration">
                          {phase.duration}
                        </span>

                      </div>

                      {/* PHASE PROGRESS */}

                      <div className="phase-progress-area">

                        <div className="phase-progress-label">

                          <span>
                            Phase progress
                          </span>

                          <strong>
                            {phaseProgress}%
                          </strong>

                        </div>

                        <div className="phase-progress-track">

                          <div
                            className="phase-progress-fill"
                            style={{
                              width: `${phaseProgress}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* SKILLS */}

                      <div className="phase-skill-list">

                        {skills.map(
                          (
                            skill,
                            skillIndex
                          ) => {

                            const completed =
                              isSkillComplete(
                                phaseIndex,
                                skillIndex
                              );

                            return (
                              <div
                                className={`skill-task ${
                                  completed
                                    ? "completed"
                                    : ""
                                }`}
                                key={skillIndex}
                              >

                                <button
                                  type="button"
                                  className="skill-checkbox"
                                  onClick={() =>
                                    toggleSkill(
                                      phaseIndex,
                                      skillIndex
                                    )
                                  }
                                  disabled={saving}
                                  aria-label={
                                    completed
                                      ? `Mark ${skill} incomplete`
                                      : `Mark ${skill} complete`
                                  }
                                >
                                  {completed
                                    ? "✓"
                                    : ""}
                                </button>

                                <div className="skill-task-content">

                                  <strong>
                                    {skill}
                                  </strong>

                                  <span>
                                    {completed
                                      ? "Completed"
                                      : "Not started"}
                                  </span>

                                </div>

                                <button
                                  type="button"
                                  className="learn-skill-button"
                                  title={`Explore learning resources for ${skill}`}
                                  onClick={() => {
                                    const resource = getLearningResource(skill);
                                    window.open(
                                      resource,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  }}
                                >
                                  Explore →
                                </button>

                              </div>
                            );
                          }
                        )}

                      </div>

                      {/* PHASE STATUS */}

                      <div className="phase-status">

                        {phaseProgress ===
                        100 ? (
                          <span className="completed-label">
                            ✓ Phase Complete
                          </span>
                        ) : (
                          <span>
                            {skills.length -
                              skills.filter(
                                (_, skillIndex) =>
                                  isSkillComplete(
                                    phaseIndex,
                                    skillIndex
                                  )
                              ).length}{" "}
                            skills remaining
                          </span>
                        )}

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* SKILL GAPS */}

        <section className="roadmap-section">

          <div className="roadmap-section-heading">

            <div>
              <small>
                FOCUS AREAS
              </small>

              <h2>
                Skills you should strengthen
              </h2>
            </div>

            <span>
              {analysis.skillGaps?.length || 0} gaps
            </span>

          </div>

          <div className="skill-focus-list">

            {analysis.skillGaps?.map(
              (gap, index) => (
                <div
                  className="skill-focus"
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

        </section>

        {/* SKILLSBUILD */}

        <section className="skillsbuild-section">

          <div className="skillsbuild-content">

            <span className="skillsbuild-label">
              IBM SKILLSBUILD
            </span>

            <h2>
              Turn your skill gaps into progress.
            </h2>

            <p>
              Use your CareerX skill gaps and roadmap
              as a guide while choosing learning resources
              on IBM SkillsBuild.
            </p>

            <button
              type="button"
              onClick={() =>
                window.open(
                  "https://skillsbuild.org/",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Explore IBM SkillsBuild →
            </button>

          </div>

          <div className="skillsbuild-icon">
            ✦
          </div>

        </section>

      </main>

    </div>
  );
}

export default LearningRoadmap;
