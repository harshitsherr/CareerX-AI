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
  onClick={() => {
    const searchQuery = encodeURIComponent(skill);

    window.open(
      `https://skillsbuild.org/search?search=${searchQuery}`,
      "_blank",
      "noopener,noreferrer"
    );
  }}
>
  Learn →
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