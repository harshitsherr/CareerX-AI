# IBM Bob Usage & Development Report

CareerX – AI-Powered Career Development Platform

## Development Environment

- Primary IDE: Visual Studio Code (VS Code)
- AI Development Assistant: IBM Bob
- Version Control: Git and GitHub
- Frontend: React + Vite
- Backend: Express.js
- AI/LLM: Google Gemini API
- Database: Firebase Firestore
- Deployment: Render

---

## 1. Project Overview

CareerX is an AI-powered career development platform built to help students and job seekers improve their career readiness through personalized guidance and intelligent analysis.

The application brings several career-oriented workflows into one platform, instead of requiring users to move between separate tools for resume review, skill planning, career alignment, and mock preparation.

Core capabilities include:

- Career guidance
- Skill assessment
- Resume improvement
- ATS-oriented resume analysis
- Personalized career matching
- AI-powered support
- Learning roadmap generation
- Interview preparation

The goal of CareerX is to act as a digital career companion that helps users understand their strengths, identify gaps, and map a realistic route toward their target job roles.

---

## 2. Role of IBM Bob

IBM Bob was used as an AI-powered software development assistant during the creation of CareerX. The project itself was primarily developed in VS Code, while IBM Bob supported planning, implementation, debugging, refactoring, and documentation tasks.

IBM Bob was used for:

- Project planning
- Feature breakdown and architecture discussion
- Code generation and editing support
- UI improvements and component logic
- Debugging and issue analysis
- Performance and reliability improvements
- Backend and API integration support
- Documentation support
- Testing and troubleshooting

The development team remained responsible for reviewing, validating, and integrating the generated work into the final application.

---

## 3. Development Workflow

The project workflow followed this cycle:

Idea → Planning → Development → AI Assistance → Testing → Debugging → Integration → Deployment

### Workflow Summary

1. A feature need was identified.
2. The requirement was discussed with IBM Bob when AI assistance was useful.
3. The existing app structure was reviewed and suggestions were generated.
4. The proposed implementation was validated in VS Code.
5. The code was integrated into the project.
6. The feature was tested locally.
7. Errors or logic issues were identified.
8. IBM Bob was used to help diagnose and improve the fix.
9. The corrected implementation was re-tested.
10. The validated change was kept in the project and pushed to GitHub.

---

## 4. Use of IBM Bob with Visual Studio Code

Visual Studio Code served as the main development environment. IBM Bob complemented the workflow by helping accelerate implementation and troubleshooting.

The general development loop was:

```text
IBM Bob
   ↓
Planning / coding support
   ↓
Visual Studio Code
   ↓
Implementation
   ↓
Testing
   ↓
Debugging
   ↓
Final code
   ↓
GitHub
```

IBM Bob was therefore not treated as a replacement for the real development process. It was used as an AI-assisted partner alongside human review, testing, and decision-making.

---

## 5. Project Planning

IBM Bob supported the team in shaping the CareerX concept into a workable product structure.

Tasks included:

- Breaking the platform into smaller modules
- Mapping core user journeys
- Defining frontend and backend responsibilities
- Identifying AI workflow requirements
- Planning data flows between React pages and Express routes
- Discussing Firebase persistence and authentication requirements

This helped convert the initial concept into a structured engineering plan.

---

## 6. Frontend Development

IBM Bob assisted with the frontend application development, including UI design and page-level logic.

Examples of support included:

- Creating landing page sections and navigation
- Structuring route-based screens for dashboard, resume analysis, mock interview, and learning roadmap
- Improving visual hierarchy and responsive layouts
- Connecting UI actions to application workflows
- Debugging render issues and state errors
- Refining user experience and section polish

The frontend is built with React, Vite, and routed screens to support a smooth user experience.

---

## 7. Backend Development

IBM Bob was also used to assist with backend implementation where the app needed an API layer.

This work included:

- Creating the Express server
- Structuring API endpoints for resume analysis
- Integrating the Gemini AI model
- Validating request data and error responses
- Supporting AI-powered resume analysis workflows
- Improving server reliability and robustness

The backend handles analysis requests and interacts with the Gemini API to produce structured career insights.

---

## 8. AI-Powered Features

A major component of CareerX is the AI-powered analysis layer.

IBM Bob supported the development of:

- Resume text extraction and analysis prompts
- AI-powered reasoning for skills, gaps, career fit, and roadmap suggestions
- Structured JSON output generation
- Error handling for AI failures
- Prompt refinement for realistic, evidence-based recommendations

This was implemented using the Google Gemini API and validated against the actual resume content submitted by the user.

---

## 9. Resume and ATS Features

CareerX includes a resume-driven analysis workflow designed to help users understand their strengths and weaknesses.

IBM Bob helped support this by assisting with:

- Structuring the resume analysis process
- Building PDF parsing logic
- Extracting meaningful resume text
- Designing AI prompt instructions for ATS-relevant insights
- Creating structured output fields such as skills, projects, experience, education, and career matches
- Improving handling of invalid or empty resume input

The resulting feature helps the user review job readiness and identify improvements aligned with their profile.

---

## 10. Debugging and Error Resolution

IBM Bob was particularly helpful in debugging difficult issues during development.

A typical debugging flow looked like:

```text
Error occurs
   ↓
Identify the root cause
   ↓
Review code and logs
   ↓
Provide issue details to IBM Bob
   ↓
Receive likely fix directions
   ↓
Apply change in VS Code
   ↓
Test again
   ↓
Validate the fix
```

This was especially useful for issues such as API integration problems, state handling, PDF parsing behavior, and AI response validation.

---

## 11. Code Improvement and Refactoring

IBM Bob was used to improve code quality in several areas, including:

- Simplifying repeated logic
- Improving maintainability
- Clarifying component structure
- Strengthening validation and error cases
- Identifying missing defensive checks
- Improving readability and organization

The goal was to keep the application clean, understandable, and easier to extend as features grew.

---

## 12. Documentation Assistance

IBM Bob helped produce and improve technical documentation, including project explanations and feature summaries.

Assistance included:

- Explaining the app architecture
- Structuring setup and usage notes
- Summarizing the project workflow
- Drafting project documentation and evidence reports
- Clarifying the role of AI-assisted development inside the project

This documentation was reviewed and adapted to match the final implementation.

---

## 13. Testing and Validation

After implementation, features were validated in the development environment.

The testing process included:

- Running the frontend locally
- Testing the backend API
- Validating AI responses
- Checking resume upload behavior
- Reviewing user flows across pages
- Confirming Firebase writes and user logic
- Testing failure cases and recovery behavior

Only features that were successfully reviewed and tested were kept in the final version.

---

## 14. Human Review and Responsibility

IBM Bob was used as a development assistant, not as a replacement for human judgment.

The project team remained responsible for:

- Defining project requirements
- Reviewing code quality
- Making final technical decisions
- Testing application behavior
- Fixing integration issues
- Validating deployed functionality
- Preparing the final submission and repository state

This ensured that the final product remained under human control and accountability.

---

## 15. Git and GitHub Workflow

Git and GitHub were used for version control and project tracking.

The project flow was:

```text
Development in VS Code
    ↓
AI assistance from IBM Bob
    ↓
Code review
    ↓
Testing
    ↓
Git commit
    ↓
GitHub repository
```

This allowed the team to track milestones, review modifications, and manage the final delivery process.

---

## 16. IBM Bob Session Evidence

The relevant AI-assistance evidence is organized in the bob_sessions directory.

Included examples:

```text
bob_sessions/
├── IBM_Bob_Usage_Report.md
├── careerx_project_planning.md
├── careerx_frontend_development.md
├── careerx_ai_development.md
├── careerx_debugging.md
└── screenshots/
```

These session notes document the development work performed with IBM Bob and serve as evidence of the assisted engineering process.

---

## 17. Security and Privacy

Before publishing repository materials, sensitive information was reviewed and removed.

The project should not contain:

- API keys
- Firebase credentials
- Private tokens
- Passwords
- Secret environment variables
- Personal access tokens

The repository uses environment variables and .gitignore to prevent secret material from being committed.

---

## 18. Benefits of Using IBM Bob

Using IBM Bob accelerated development in several meaningful ways.

### Faster Development

AI support reduced time spent on repetitive implementation and troubleshooting tasks.

### Faster Debugging

IBM Bob helped identify likely root causes and possible fixes for issues in the app.

### Better Workflow Planning

Large project features could be broken down into smaller actionable tasks.

### Code Assistance

IBM Bob helped generate, explain, and refine code in real time.

### Documentation Support

It also assisted with writing technical documentation and product explanation.

### Learning Support

The AI workflow helped the team understand unfamiliar code patterns and work through implementation challenges more clearly.

---

## 19. Limitations

IBM Bob was used as an assistant and its suggestions required human verification.

AI-generated output can include:

- Incorrect assumptions
- Incomplete logic
- Integration issues
- Security concerns
- Code quality issues

Because of this, all important implementation decisions were reviewed, tested, and adjusted by the human development team before final integration.

---

## 20. Final Development Process

The overall CareerX development process was:

```text
CareerX idea
   ↓
Feature planning
   ↓
Project setup in VS Code
   ↓
IBM Bob AI assistance
   ↓
Frontend and backend development
   ↓
Code review
   ↓
Testing
   ↓
Debugging with IBM Bob
   ↓
Final integration
   ↓
Git commit
   ↓
GitHub upload
   ↓
Deployment
```

---

## 21. Conclusion

IBM Bob served as an important support tool in the development of CareerX by assisting with planning, implementation, debugging, optimization, AI integration, and documentation.

Visual Studio Code remained the main workspace, while IBM Bob acted as an AI-driven development assistant to accelerate the process. The combination of human review, technical validation, Git and GitHub version control, and AI assistance enabled a practical and efficient development workflow.

The bob_sessions folder contains the evidence of the work performed with IBM Bob throughout the project.

---

## Repository Evidence

The final repository contains:

- CareerX source code
- Project documentation
- IBM Bob session reports
- Development evidence
- Configuration required to run the project
- Environment protection through .gitignore

This gives a transparent view of both the application and the AI-assisted development process that supported it.
