# CareerX Project Planning Session

## Objective
Define the scope, features, and structure of the CareerX platform using IBM Bob as an AI planning assistant.

## Key Discussion Points
- Build a single app for career guidance, skill assessment, resume analysis, and planning.
- Focus on students and early-career professionals who need actionable career direction.
- Structure the app around a dashboard plus feature-specific pages.
- Prioritize a simple but effective user journey: upload resume → AI analysis → roadmap → preparation.

## Planned Modules
1. Landing Page
   - Brand positioning
   - Product messaging
   - Call-to-action buttons

2. Resume Intelligence
   - PDF upload
   - Extract resume text
   - Send to AI service for evaluation
   - Return structured analysis

3. Dashboard
   - Career readiness score
   - Career match summary
   - Skills overview
   - Guidance cards

4. Learning Roadmap
   - Personalized phase-based learning path
   - Skill progression steps

5. Mock Interview / Career Preparation
   - Support interview readiness and role preparation

6. Authentication and Persistence
   - Firebase-based user state and saved results

## Implementation Strategy
- Set up React + Vite frontend for the UI experience.
- Use Express as the backend API layer.
- Use Google Gemini API for AI analysis.
- Use Firebase Firestore to store user analysis and progress.
- Keep deployment simple through Render-compatible configuration.

## Outcome
The project was broken into manageable modules that aligned with CareerX’s core value proposition and could be developed iteratively in Visual Studio Code with IBM Bob as an implementation partner.
