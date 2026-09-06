import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { auth, db } from "./firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import "./ResumeUpload.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return;
    }

    setFile(selectedFile);
    setResumeText("");
    setAnalysis(null);
  };

  const handleInputChange = (event) => {
    handleFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleFile(event.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }

    try {
      setIsAnalyzing(true);

      // Only PDF extraction is currently implemented.
      if (file.type !== "application/pdf") {
        throw new Error(
          "DOCX upload is accepted by the interface, but PDF analysis is currently supported. Please upload a PDF."
        );
      }

      // ---------------------------------------
      // 1. READ PDF
      // ---------------------------------------
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

      let fullText = "";

      // Extract text from every page
      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item) => item.str)
          .join(" ");

        fullText += pageText + "\n";
      }

      // ---------------------------------------
      // 2. VALIDATE EXTRACTED TEXT
      // ---------------------------------------
      if (!fullText.trim()) {
        throw new Error(
          "We couldn't extract text from this PDF. Please try a text-based PDF."
        );
      }

      setResumeText(fullText);

      console.log("===== RESUME TEXT =====");
      console.log(fullText);
      console.log("=======================");

      // ---------------------------------------
      // 3. SEND RESUME TO CAREERX BACKEND
      // ---------------------------------------
     const response = await fetch(
  "https://careerx-ai-yp5x.onrender.com/api/analyze-resume",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeText: fullText,
          }),
        }
      );

      const result = await response.json();

      console.log("===== CAREERX AI ANALYSIS =====");
      console.log(result);
      console.log("===============================");

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Resume analysis failed."
        );
      }

      // ---------------------------------------
      // 4. STORE AI ANALYSIS IN REACT STATE
      // ---------------------------------------
      setAnalysis(result.analysis);

      // ---------------------------------------
      // 5. SAVE ANALYSIS TO FIRESTORE
      // ---------------------------------------
      const user = auth.currentUser;

      if (!user) {
        throw new Error(
          "You must be signed in to save your career analysis."
        );
      }

      await setDoc(
        doc(
          db,
          "users",
          user.uid,
          "careerAnalysis",
          "latest"
        ),
        {
          ...result.analysis,
          resumeName: file.name,
          userId: user.uid,
          updatedAt: serverTimestamp(),
        }
      );

      console.log(
        "Career analysis saved to Firestore successfully."
      );

      alert("Resume analyzed and saved successfully!");

    } catch (error) {
      console.error("CareerX analysis error:", error);

      alert(
        error.message ||
          "Something went wrong while analyzing your resume."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="upload-page">
      <nav className="upload-navbar">
        <div className="upload-logo">
          <div className="upload-logo-icon">✦</div>

          <span>
            CareerX<span> AI</span>
          </span>
        </div>

        <button
          className="back-button"
          onClick={() =>
            (window.location.href = "/dashboard")
          }
        >
          ← Back to Dashboard
        </button>
      </nav>

      <main className="upload-main">
        <div className="upload-heading">
          <div className="upload-badge">
            <span>✦</span>
            Resume Intelligence
          </div>

          <h1>
            Let's understand
            <br />
            <span>your career.</span>
          </h1>

          <p>
            Upload your resume and CareerX AI will analyze your
            skills, projects, education and experience.
          </p>
        </div>

        <div
          className={`drop-zone ${
            dragActive ? "drag-active" : ""
          } ${file ? "has-file" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="resume-file"
            accept=".pdf,.docx"
            onChange={handleInputChange}
          />

          {!file ? (
            <label
              htmlFor="resume-file"
              className="upload-label"
            >
              <div className="upload-icon">↑</div>

              <h2>Drop your resume here</h2>

              <p>
                or{" "}
                <span>browse from your computer</span>
              </p>

              <small>
                PDF or DOCX • Maximum 10MB
              </small>
            </label>
          ) : (
            <div className="selected-file">
              <div className="file-icon">📄</div>

              <div className="file-info">
                <h3>{file.name}</h3>

                <p>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                className="remove-file"
                type="button"
                onClick={() => {
                  setFile(null);
                  setResumeText("");
                  setAnalysis(null);
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>

        <button
          className="analyze-button"
          type="button"
          onClick={handleSubmit}
          disabled={isAnalyzing}
        >
          {isAnalyzing
            ? "Analyzing your career..."
            : "Analyze My Resume"}

          {!isAnalyzing && <span>→</span>}
        </button>

        <div className="privacy-note">
          <span>🔒</span>
          Your resume is used only for your career analysis.
        </div>

        <div className="analysis-preview">
          <div className="preview-item">
            <span>01</span>

            <div>
              <strong>Extract Skills</strong>
              <small>
                AI identifies your technical & soft skills
              </small>
            </div>
          </div>

          <div className="preview-item">
            <span>02</span>

            <div>
              <strong>Find Career Matches</strong>
              <small>
                Discover roles that fit your profile
              </small>
            </div>
          </div>

          <div className="preview-item">
            <span>03</span>

            <div>
              <strong>Build Your Roadmap</strong>
              <small>
                Get a personalized skill-gap plan
              </small>
            </div>
          </div>
        </div>

        {resumeText && (
          <div
            style={{
              marginTop: "30px",
              background: "white",
              border: "1px solid #e8e8ef",
              borderRadius: "14px",
              padding: "24px",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "12px" }}>
              Resume successfully read
            </h3>

            <p
              style={{
                fontSize: "13px",
                color: "#777783",
                lineHeight: "1.7",
                maxHeight: "220px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {resumeText}
            </p>
          </div>
        )}

        {analysis && (
          <section className="analysis-results">
            <div className="results-header">
              <span>
                ✦ CAREERX AI ANALYSIS
              </span>

              <h2>
                Your Career Intelligence Report
              </h2>

              <p>
                Your resume has been analyzed. Here is your
                personalized career profile.
              </p>
            </div>

            <div className="results-stats">
              <div className="result-stat">
                <small>JOB READINESS</small>

                <strong>
                  {analysis.jobReadiness}
                  <span>/100</span>
                </strong>

                <p>
                  Overall career readiness
                </p>
              </div>

              <div className="result-stat">
                <small>TOP CAREER MATCH</small>

                <strong>
                  {analysis.careerMatches?.[0]?.match ??
                    "--"}%
                </strong>

                <p>
                  {analysis.careerMatches?.[0]?.career ??
                    "Not available"}
                </p>
              </div>

              <div className="result-stat">
                <small>SKILLS IDENTIFIED</small>

                <strong>
                  {(analysis.technicalSkills?.length || 0) +
                    (analysis.softSkills?.length || 0)}
                </strong>

                <p>
                  Technical + soft skills
                </p>
              </div>
            </div>

            <div className="analysis-section">
              <div className="section-title">
                <span>01</span>

                <div>
                  <small>PROFILE</small>
                  <h3>
                    Professional Summary
                  </h3>
                </div>
              </div>

              <p className="summary-text">
                {analysis.profileSummary}
              </p>
            </div>

            <div className="analysis-two-column">
              <div className="analysis-section">
                <div className="section-title">
                  <span>02</span>

                  <div>
                    <small>
                      TECHNICAL PROFILE
                    </small>

                    <h3>
                      Technical Skills
                    </h3>
                  </div>
                </div>

                <div className="skill-list">
                  {analysis.technicalSkills?.map(
                    (skill, index) => (
                      <span key={index}>
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="analysis-section">
                <div className="section-title">
                  <span>03</span>

                  <div>
                    <small>
                      PROFESSIONAL PROFILE
                    </small>

                    <h3>
                      Soft Skills
                    </h3>
                  </div>
                </div>

                <div className="skill-list">
                  {analysis.softSkills?.map(
                    (skill, index) => (
                      <span key={index}>
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="analysis-section">
              <div className="section-title">
                <span>04</span>

                <div>
                  <small>
                    CAREER OPTIONS
                  </small>

                  <h3>
                    Career Matches
                  </h3>
                </div>
              </div>

              <div className="career-match-list">
                {analysis.careerMatches?.map(
                  (career, index) => (
                    <div
                      className="career-match"
                      key={index}
                    >
                      <div>
                        <strong>
                          {career.career}
                        </strong>

                        <p>
                          {career.reason}
                        </p>
                      </div>

                      <div className="match-score">
                        {career.match}%
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="analysis-section">
              <div className="section-title">
                <span>05</span>

                <div>
                  <small>SKILL GAPS</small>

                  <h3>
                    What You Should Learn
                  </h3>
                </div>
              </div>

              <div className="gap-list">
                {analysis.skillGaps?.map(
                  (gap, index) => (
                    <div
                      className="gap-card"
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
            </div>

            <div className="analysis-section">
              <div className="section-title">
                <span>06</span>

                <div>
                  <small>
                    PERSONALIZED PLAN
                  </small>

                  <h3>
                    Learning Roadmap
                  </h3>
                </div>
              </div>

              <div className="roadmap-results">
                {analysis.roadmap?.map(
                  (phase, index) => (
                    <div
                      className="roadmap-result"
                      key={index}
                    >
                      <div className="roadmap-number">
                        {index + 1}
                      </div>

                      <div>
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
                            (
                              skill,
                              skillIndex
                            ) => (
                              <span
                                key={
                                  skillIndex
                                }
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
            </div>

            <div className="analysis-two-column">
              <div className="analysis-section">
                <div className="section-title">
                  <span>07</span>

                  <div>
                    <small>
                      YOUR ADVANTAGE
                    </small>

                    <h3>
                      Strengths
                    </h3>
                  </div>
                </div>

                <ul>
                  {analysis.strengths?.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="analysis-section">
                <div className="section-title">
                  <span>08</span>

                  <div>
                    <small>
                      IMPROVEMENT AREAS
                    </small>

                    <h3>
                      Next Steps
                    </h3>
                  </div>
                </div>

                <ul>
                  {analysis.improvements?.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ResumeUpload;