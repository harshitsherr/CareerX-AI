# CareerX Debugging Session

## Objective
Resolve issues in the local app workflow, especially around resume extraction, API calls, and consistency of AI output.

## Issues Addressed
- Validate the AI API key and backend configuration.
- Handle missing or invalid resume text.
- Prevent crashes when PDF text extraction returns empty results.
- Manage multiple Gemini model fallback attempts.
- Clean responses that include markdown fences around JSON.
- Handle malformed JSON safely and provide descriptive errors.
- Validate backend responses before updating the React UI state.

## Debugging Method
- Read the error from the backend logs.
- Narrow the issue to a specific request or component flow.
- Provide the error and context to IBM Bob for solution iteration.
- Apply the fix in VS Code.
- Re-test the flow end-to-end.

## Result
The app is more resilient to real-world edge cases, and the resume analysis process behaves consistently even when the input or API response is imperfect.
