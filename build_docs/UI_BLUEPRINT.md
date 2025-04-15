# 🧩 Windsurf UI Blueprint for TidyTask

## 🏠 App Name: `TidyTask`

### 🎯 Description:

A beautifully animated, family-focused to-do list app. Users can assign tasks, manage subtasks, set priorities & deadlines, and view all task flows in a responsive and aesthetic dashboard.

---

## 🔧 Tech Stack (for Windsurf Setup)

- **Next.js**
- **TailwindCSS**
- **shadcn/ui**
- **Framer Motion** (for animations)
- **Vercel** (deployment)
- **TypeScript**

---

## 🧱 Component Layout & Naming

### 📌 1. `HeaderBar`

- Family dropdown
- User avatar
- "Add Task" button
- Animated greeting (optional)

### 📌 2. `TaskBoard`

- Kanban-style layout (or List view toggle)
- Sections: `Today`, `Upcoming`, `Completed`, `Overdue`
- Sort & Filter by:
  - `Assignee`
  - `Priority`
  - `Deadline`

### 📌 3. `TaskCard`

- Title
- Assigned to (Avatar + Name)
- Due Date (Color-coded)
- Priority chip (Low, Med, High)
- Expand button → reveals `Subtasks` & `Comments`
- Framer animation: scale-in on hover, drag-drop support

### 📌 4. `SubtaskList`

- Add/Delete subtasks
- Checkbox for completion
- AI-generated flow suggestion (optional)
- Auto-sort based on logical flow

### 📌 5. `TaskModal`

- For creating/editing tasks
- Fields:
  - Title
  - Description
  - Assignee dropdown (family members)
  - Deadline picker
  - Priority selector
  - Subtask builder
- Auto-close on submit with animation

### 📌 6. `FamilyMemberManager`

- Avatar + name + color badge
- Role: Admin / Member
- Add or remove family members

### 📌 7. `NotificationCenter`

- Simple dropdown popover
- Shows upcoming tasks, overdue alerts
- Animated bell icon

### 📌 8. `MobileNavBar`

- Bottom dock: Home / Add / Notifications / Profile
- Tap-friendly, subtle shadows and haptics mimic

### 📌 9. `OnboardingPage` *(Optional)*

- 2–3 screens carousel for new users
- Animated intro (Lottie or Framer)

---

## 🎨 Animations (Framer Motion Suggestions)

| Element            | Animation                            |
| ------------------ | ------------------------------------ |
| `TaskCard`         | Fade + scale on mount, hover lift    |
| `TaskModal`        | Slide-up, backdrop fade              |
| `SubtaskList`      | Collapse/expand with staggered entry |
| `NotificationBell` | Pulse on new alert                   |
| Page transitions   | Slide + fade for mobile views        |

---

## 📱 Responsive & Platform Notes

- **Mobile-first** design
- Use `max-w-screen-md` for content width
- Sticky header/footer on mobile
- Task creation and modal UIs should work well one-handed

---

## Recommended Color palette

- Primary: `#4F46E5` (Indigo 600)
- Secondary: `#6B7280` (Gray 500)
- Accent: `#F59E0B` (Amber 500)
- Background: `#F9FAFB` (Gray 50)
- Surface/Card: `#FFFFFF` (White)
- Text Primary: `#111827` (Gray 900)
- Text Secondary: `#6B7280` (Gray 500)
- Success: `#10B981` (Green 500)
- Warning: `#F97316` (Orange 500)
- Error: `#EF4444` (Red 500)
- Muted: `#F3F4F6` (Gray 100)

## 🧪 Mock Data Structure

```ts
type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

type Task = {
  id: string;
  title: string;
  description: string;
  assignee: string; // familyMemberId
  priority: "Low" | "Medium" | "High";
  deadline: string;
  subtasks: Subtask[];
  completed: boolean;
};

type FamilyMember = {
  id: string;
  name: string;
  avatarUrl: string;
  role: "Admin" | "Member";
};

type Notification = {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
};
```

---

## 🔮 Optional AI Feature (Minimal) *(Not Required)*

- Use OpenAI API to suggest optimal subtask flow based on title & description.
- Simple call from `TaskModal` on button press: "Generate Flow".

