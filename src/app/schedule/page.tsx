import ScheduleWeeks from "./ScheduleWeeks";

const weeks = [
  {
    title: "Week 1: Hello World",
    meetingDate: "Friday, January 23rd, 2026 at 4pm ET",
    meetingAgendaItems: [
      "Download IntelliJ",
      "Choose between Codex CLI, Claude Code CLI, Gemini CLI",
      "Create a public repository in your own GitHub account.",
      "Clone the repository with IntelliJ",
      "Ask your CLI to create a new NextJS project using the latest version of NextJS and React.",
      "Create a free-tier Vercel project.",
      "Connect your public GitHub repository to your Vercel project.",
      "Make sure your project successfully deploys.",
      "Make sure you can access Supabase.",
      "Make sure you can access Linear.",
      "Make sure you can access Slack.",
      "Make sure you can access Akify.",
    ],
    dueDate: "Friday, January 30th, 2026 at Noon ET",
    assignmentItems: [
      "Get a simple 'Hello World' app deployed on Vercel.",
      "Complete all humorstudy.org ratings.",
    ],
  },
  {
    title: "Week 2: Connecting the Database",
    meetingDate: "Friday, January 30th, 2026 at 4pm ET",
    meetingAgendaItems: [
      "Create a Supabase client using the anonymous key.",
      "Store Supabase URL + anon key in .env.local and wire into Next.js.",
      "Read from a provided table and render a list page.",
    ],
    dueDate: "Friday, February 6th, 2026 at Noon ET",
    assignmentItems: [
      "Update your application to read from a provided table and render a list page.  Deploy the changes to Vercel.",
      "Complete all humorstudy.org ratings.",
    ],
  },
  {
    title: "Week 3: Auth Week",
    meetingDate: "Friday, February 6th, 2026 at 4pm ET",
    meetingAgendaItems: [
      "Implement Supabase Auth (magic link or OAuth).",
      "Add login/logout UI and session handling.",
      "Protect routes and show gated UI.",
      "Understand RLS policies for user-owned data.",
    ],
    dueDate: "Friday, February 13th, 2026 at Noon ET",
    assignmentItems: [
      {
        label: "Required viewing",
        href: "https://youtu.be/996OiexHze0?si=AKZX3uSA8TgESCx2",
      },
      "Protect routes and show gated UI.",
      "Complete all humorstudy.org ratings.",
    ],
  },
  {
    title: "Week 4: Mutating Data",
    meetingDate: "Friday, February 13th, 2026 at 4pm ET",
    meetingAgendaItems: ["Add votes to the caption_votes table."],
    dueDate: "Friday, February 20th, 2026 at Noon ET",
    assignmentItems: [
      "Add votes to the caption_votes table.",
      "Complete all humorstudy.org ratings.",
    ],
  },
  {
    title: "Week 5: Making REST API Calls",
    meetingDate: "Friday, February 20th, 2026 at 4pm ET",
    meetingAgendaItems: [
      "Authenticate REST API requests with Supabase auth tokens.",
      "Request presigned URLs from the API.",
      "Upload images via the presigned URL.",
      "Create captions via the API.",
    ],
    dueDate: "Friday, February 27th, 2026 at Noon ET",
    assignmentItems: [
      "Get your app to upload images and show resulting captions.",
      "Complete all humorstudy.org ratings.",
    ],
  },
  {
    title: "Week 6: Admin Panel",
    meetingDate: "Friday, February 27th, 2026 at 4pm ET",
    meetingAgendaItems: [
      "Create admin-only routes and lock down access.",
      "List and filter captions, images, and users.",
      "Add pagination.",
    ],
    dueDate: "Friday, March 6th, 2026 at Noon ET",
    assignmentItems: ["Create admin area.", "Complete all humorstudy.org ratings."],
  },
  {
    title: "Week 7: Domain Model",
    meetingDate: "Friday, March 6th, 2026 at 4pm ET",
    meetingAgendaItems: [
      "Model humor_flavors and humor_flavor_steps tables.",
      "Create UI to add/edit flavors and steps.",
      "Render a flavor detail page.",
    ],
    dueDate: "Friday, March 13th, 2026 at Noon ET",
    assignmentItems: [
      "Create UI to add/edit flavors and steps.",
      "Complete all humorstudy.org ratings.",
    ],
  },
  {
    title: "Week 8: Prompt Chain Tool",
    meetingDate: "Friday, March 13th, 2026 at 4pm ET",
    meetingAgendaItems: ["Build a prompt chain editor UI (step-by-step prompts)."],
    dueDate: "Friday, March 20th, 2026 at Noon ET",
    assignmentItems: ["Complete all humorstudy.org ratings."],
  },
  {
    title: "Week 9: Spring Break!",
    meetingDate: "Friday, March 20th, 2026 at 4pm ET",
    meetingAgendaItems: ["No meeting this week!"],
    dueDate: "Friday, March 27th, 2026 at Noon ET",
    assignmentItems: [
      "Run at least 3 user tests for your public app.",
      "Complete all humorstudy.org ratings.",
    ],
  },
  {
    title: "Week 10: Creating Your Own Humor Flavor",
    meetingDate: "Friday, March 27th, 2026 at 4pm ET",
    meetingAgendaItems: [
      "Create humor_flavor and humor_flavor_steps.",
      "Add UI to select a flavor and generate captions.",
      "Make a REST API call to generate captions.",
    ],
    dueDate: "Friday, April 3rd, 2026 at Noon ET",
    assignmentItems: ["", "Complete all humorstudy.org ratings."],
  },
  {
    title: "Week 11: Data Collection",
    meetingDate: "Friday, April 3rd, 2026 at 4pm ET",
    meetingAgendaItems: ["Release your app and get as many people to use it as possible"],
    dueDate: "Friday, April 10th, 2026 at Noon ET",
    assignmentItems: [
      "Release your app and get as many people to use it as possible",
      "Complete all humorstudy.org ratings.",
    ],
  },
  {
    title: "Week 12: Public App Polish",
    meetingDate: "Friday, April 10th, 2026 at 4pm ET",
    meetingAgendaItems: [
      "Iterate on your app!",
      "Improve UX copy, loading states, and empty states.",
      "Add performance checks and image optimization.",
      "Accessibility pass (keyboard, contrast, aria).",
    ],
    dueDate: "Friday, April 17th, 2026 at Noon ET",
    assignmentItems: ["Collect more data!", "Complete all humorstudy.org ratings."],
  },
  {
    title: "Week 13: Admin & Prompt Tool Polish",
    meetingDate: "Friday, April 17th, 2026 at 4pm ET",
    dueDate: "Friday, April 24th, 2026 at Noon ET",
    assignmentItems: [
      "Harden admin workflows and add CSV export.",
      "Refine prompt tool UI and run comparisons.",
      "Write README setup steps (CLI, env, Supabase).",
      "Prepare a demo script.",
    ],
  },
  {
    title: "Week 14: Final Integration & QA",
    meetingDate: "Friday, April 24th, 2026 at 4pm ET",
    dueDate: "Friday, May 1st, 2026 at Noon ET",
    assignmentItems: [
      "End-to-end testing of all three apps.",
      "Prepare final presentation deck.",
    ],
  },
  {
    title: "Week 15: Last Day!",
    meetingDate: "Friday, May 1st, 2026 at 4pm ET",
    meetingAgendaItems: [
      "Final presentations and live demos.",
      "Retrospective and course wrap-up.",
    ],
    dueDate: "Friday, May 8th, 2026 at Noon ET",
    assignmentItems: ["Submit repo and deployment links."],
  },
];

export default function SchedulePage() {
  return (
    <main className="page">
      <div className="page__content">
        <section className="card schedule" aria-labelledby="schedule-title">
          <h2
            id="schedule-title"
            className="section-title reveal"
            style={{ animationDelay: "0ms" }}
          >
            Weekly Schedule
          </h2>
          <ScheduleWeeks weeks={weeks} />
        </section>
      </div>
    </main>
  );
}
