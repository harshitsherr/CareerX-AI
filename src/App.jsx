import "./App.css";
import ResumeUpload from "./ResumeUpload";
import SignIn from "./SignIn";
import Dashboard from "./Dashboard";
import MockInterview from "./MockInterview";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LearningRoadmap from "./LearningRoadmap";
function Home() {
  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">✦</div>
          <span>CareerX<span className="logo-ai"> AI</span></span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

       <button
  className="sign-in"
  onClick={() => (window.location.href = "/signin")}
>
  Sign In
</button>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="badge">
              <span>✦</span>
              AI-Powered Career Intelligence
            </div>

            <h1>
              Your Career.
              <br />
              <span>Your AI Copilot.</span>
            </h1>

            <p>
              Discover the right career path, identify your skill gaps,
              build a personalized learning roadmap, and prepare for your
              dream job with AI.
            </p>

            <div className="hero-buttons">
             <button
  className="primary-btn"
  onClick={() => (window.location.href = "/resume")}
>
  Analyze My Resume
  <span>→</span>
</button>

              <button className="secondary-btn">
                Explore Careers
              </button>
            </div>

            <div className="trust">
              <div className="avatars">
                <span>H</span>
                <span>A</span>
                <span>R</span>
              </div>
              <p>
                Built for students &nbsp;•&nbsp; AI-powered
                career guidance
              </p>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="dashboard-preview">
            <div className="dashboard-window">
              <div className="window-header">
                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="window-title">CareerX Dashboard</span>
              </div>

              <div className="dashboard-body">
                <div className="mini-sidebar">
                  <div className="mini-logo">✦</div>
                  <div className="side-item active">⌂</div>
                  <div className="side-item">◎</div>
                  <div className="side-item">▣</div>
                  <div className="side-item">◈</div>
                </div>

                <div className="dashboard-content">
                  <div className="welcome">
                    <div>
                      <small>GOOD MORNING 👋</small>
                      <h3>Ready to grow your career?</h3>
                    </div>
                    <div className="profile">H</div>
                  </div>

                  <div className="stats">
                    <div className="stat-card score-card">
                      <small>JOB READINESS</small>
                      <strong>74<span>/100</span></strong>
                      <div className="progress">
                        <div></div>
                      </div>
                      <p>↑ 8% this month</p>
                    </div>

                    <div className="stat-card">
                      <small>CAREER MATCH</small>
                      <strong>78%</strong>
                      <p>AI / ML Developer</p>
                    </div>

                    <div className="stat-card">
                      <small>SKILLS</small>
                      <strong>12</strong>
                      <p>8 mastered · 4 learning</p>
                    </div>
                  </div>

                  <div className="dashboard-grid">
                    <div className="roadmap-card">
                      <div className="card-heading">
                        <div>
                          <small>YOUR ROADMAP</small>
                          <h4>AI / ML Developer</h4>
                        </div>
                        <span>78% Match</span>
                      </div>

                      <div className="roadmap-line">
                        <div className="roadmap-step completed">
                          <span>✓</span>
                          <div>
                            <strong>Python Fundamentals</strong>
                            <small>Completed</small>
                          </div>
                        </div>

                        <div className="roadmap-step current">
                          <span>2</span>
                          <div>
                            <strong>Machine Learning</strong>
                            <small>In progress</small>
                          </div>
                        </div>

                        <div className="roadmap-step">
                          <span>3</span>
                          <div>
                            <strong>Deep Learning</strong>
                            <small>Upcoming</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ai-card">
                      <div className="ai-icon">✦</div>
                      <small>AI INSIGHT</small>
                      <h4>Your next best move</h4>
                      <p>
                        Strengthen your Machine Learning skills
                        to increase your career match.
                      </p>
                      <button>View Roadmap →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features" id="features">
          <div className="section-heading">
            <span>WHY CAREERX?</span>
            <h2>Everything you need to move forward.</h2>
            <p>
              One intelligent platform to understand where you are,
              where you want to go, and how to get there.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">⌁</div>
              <h3>Resume Intelligence</h3>
              <p>
                AI analyzes your resume and extracts your skills,
                projects, education and experience.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">◎</div>
              <h3>Career Matching</h3>
              <p>
                Discover career paths that match your current
                strengths and interests.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">↗</div>
              <h3>Skill Gap Roadmap</h3>
              <p>
                Get a personalized learning plan designed around
                the skills you need next.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">◉</div>
              <h3>AI Mock Interviews</h3>
              <p>
                Practice interviews with AI and receive instant
                feedback to improve your answers.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="how-it-works" id="how-it-works">
          <div className="section-heading">
            <span>HOW IT WORKS</span>
            <h2>From confused to career-ready.</h2>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <h3>Upload</h3>
              <p>Upload your resume and tell us your career goals.</p>
            </div>

            <div className="step">
              <div className="step-number">02</div>
              <h3>Analyze</h3>
              <p>AI analyzes your profile and identifies your strengths.</p>
            </div>

            <div className="step">
              <div className="step-number">03</div>
              <h3>Improve</h3>
              <p>Follow your personalized skill roadmap.</p>
            </div>

            <div className="step">
              <div className="step-number">04</div>
              <h3>Get Hired</h3>
              <p>Practice interviews and become job-ready.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="about">
        <div className="logo">
          <div className="logo-icon">✦</div>
          <span>CareerX<span className="logo-ai"> AI</span></span>
        </div>
        <p>AI-powered career guidance for the next generation.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/resume" element={<ResumeUpload />} />
  <Route path="/signin" element={<SignIn />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route
    path="/mock-interview"
    element={<MockInterview />}
  />
  <Route
    path="/learning-roadmap"
    element={<LearningRoadmap />}
  />
</Routes>
    </BrowserRouter>
  );
}

export default App;