---
Task ID: 1
Agent: Main Agent
Task: Build comprehensive P-ShareHub v2.0 with Vietnam Map, Study Tool, Chat Habibi, P-logo sync, and feedback auto-copy

Work Log:
- Analyzed all uploaded reference images using VLM (Chat Habibi UI, Vietnam map, P-logo)
- Created project structure with components/chat, components/vietnam, components/study
- Built Chat Habibi component with Gemini-style UI: left sidebar with 4 modes (Chat, Build Web, Học tập, Sáng tạo), AI thinking progress display, suggestion chips, streaming SSE support, copy message, mode-constrained AI prompts
- Built Vietnam Interactive Map with 12 clickable regions (SVG-based), each with detail pages showing History, Heroes, Landmarks, Foods tabs
- Built Study Tool with 3-step flow: Input → Configure (difficulty, question count, study modes) → Generate → Result with 5 study modes (Flashcard, Fill Blank, Quiz, Summary, Match)
- Created /api/chat-habibi route with mode-based system prompts, streaming SSE + non-streaming fallback
- Created /api/study-tool route with AI-powered study material generation
- Updated main page.tsx with client-side routing between Home, Vietnam, Study, Chat views
- Added P-logo to navbar, sidebar, and all relevant locations
- Added feedback auto-copy email (giangocquoc@gmail.com) to footer
- Added "From Vietnam to the world 🇻🇳" clickable button that navigates to Vietnam map
- Added mobile menu with hamburger navigation
- Fixed streaming API: handled SDK's char-code indexed chunk format with proper parsing and non-streaming JSON fallback
- Added rate limit error handling with Vietnamese messages

Stage Summary:
- P-ShareHub v2.0 fully functional with 4 main views: Home, Vietnam Map, Study Tool, Chat Habibi
- Chat Habibi has 4 AI modes with constrained system prompts per mode
- Vietnam Map has 12 regions with interactive SVG map and detail pages
- Study Tool supports 5 study modes with 3 difficulty levels
- P-logo synced across navbar, sidebar, chat interface
- Feedback auto-copy works in footer
- API rate limiting handled gracefully with Vietnamese error messages
