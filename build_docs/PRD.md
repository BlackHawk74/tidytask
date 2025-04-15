# Product Requirement Document (PRD)

## Product Name: TidyTask

TidyTask is a family-oriented task management web application that allows household members to collaboratively manage and complete tasks. The application is designed to be fast, functional, beautiful, and responsive with a delightful user experience for both mobile and desktop.

---

## 1. Target Audience
- Families or small groups managing shared tasks
- Users of all ages; hence, intuitive UI and accessibility are a priority

---

## 2. Tech Stack
- **Frontend**: React 18 versions, Next.js, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **State Management**: Zustand (or useContext + useReducer for lightweight)
- **Animations**: Framer Motion, Lottie
- **Drag-and-Drop**: `@dnd-kit` or `react-beautiful-dnd`
- **Mobile UX Enhancements**: `react-swipeable`, media queries
- **Deployment**: Vercel
- **Optional (AI)**: AI subtask suggestion (minimal, API triggered only as needed)

---

## 3. Core Features
### ✅ Task Management
- Create, edit, delete tasks
- Assign tasks to family members
- Set deadlines and priorities (Low, Medium, High)
- Add notes or comments to tasks
- Add and manage subtasks
- View progress via progress rings

### 🧠 AI-Powered (Optional)
- Suggest subtasks based on task name (via OpenAI API call only when user opts in)

### 📆 Task Scheduling
- One-time or recurring tasks (daily, weekly, custom)

### 🛎 Notifications
- Deadline reminders
- Task assignment alerts
- Completion success animations

### 👨‍👩‍👧‍👦 User & Roles
- Create a "family group"
- Each member has a name, color theme, and avatar (optional)
- Role-based permission (Admin, Member)

### 🧩 Task History
- Log when tasks are created, assigned, completed

### 📊 Dashboard
- Task overview per member
- Visual breakdown of tasks by status/priority
- Weekly calendar/task view

---

## 4. UX/UI Features
### 🧭 Navigation
- Mobile bottom nav: Home, Tasks, Calendar, Profile
- Web top nav with same options
- Floating Action Button (FAB) for quick task creation

### 🎨 Design Language
- Minimalist, clean UI
- Color-coded tasks by user
- Shadcn UI components for consistency

### 📱 Mobile Optimizations
- Bottom drawer for viewing task details
- Swipe gestures to complete/delete tasks
- Responsive grid/list rendering

### ✨ Animations & Microinteractions
- Framer Motion page transitions
- Motion on task cards (hover, press)
- Sliding drawer for mobile task view
- Animated progress bars and completion rings
- Confetti/lottie animation on task completion
- Toast notifications with transitions

### 📂 Empty States
- Lottie animations for zero tasks, zero calendar events, etc.

---

## 5. Pages & Components
### 🏠 Home Page
- Overview of today’s tasks, upcoming tasks, quick add

### ✅ Tasks Page
- List of all tasks grouped by status
- Task filter by member, priority, due date
- Task card with progress, status, deadline
- Add/Edit Modal with full form

### 🗓 Calendar View
- Weekly calendar view
- Task previews on hover/click

### 👤 Profile Page
- Member info, assigned tasks, completed tasks history

### 🔔 Notifications (Toastify / Custom)
- Appear on top right or bottom depending on platform

---

## 6. Functional Requirements
- App must work fully on mobile and desktop
- All CRUD operations must be performant
- All animations must be smooth and non-janky
- No backend — mock or local data only

---

## 7. Non-functional Requirements
- Deployed on Vercel with custom domain (if desired)
- Must include public GitHub repo link (clean code)
- Code quality, readability, and modularity
- Light/dark theme toggle

---

## 8. Deliverables
- Hosted URL (Vercel)
- GitHub repo with MIT license
- README with screenshots and feature list

---

## 9. Timeline (Recommended)
- Day 1-2: Layout + Components
- Day 3: Task CRUD + UI polish
- Day 4: Animations + Calendar + Notifications
- Day 5: Final QA, responsiveness, and deployment

---

## 10. Bonus
- Add accessibility features (keyboard navigation, aria tags)
- SEO-optimized landing page with app overview
- Shareable family invite code (if time allows)

