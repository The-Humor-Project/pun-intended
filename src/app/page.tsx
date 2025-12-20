"use client";

import type { CSSProperties } from "react";

type WeekItem = string | { label: string; href: string };

const summary =
  "This semester you'll build three applications: a public facing application for obtaining votes/rankings of image captions, an admin area for looking at all the data, and a prompt testing application to develop your own humor model.";

const grading = [
  "Card completion: 70%",
  "Public-facing app final review: 10%",
  "Admin app final review: 10%",
  "Prompt testing application final review: 10%",
];

const tools = [
  "IntelliJ IDE (free with .edu e-mail address)",
  "Google Gemini CLI (free for one year for students) or OpenAI Codex ($20 per month for \"Plus\" plan) or Claude Code CLI ($20 per month for \"Pro\" plan)",
  "Vercel (free)",
  "Slack (free)",
  "Linear (free)",
  "Akify (free)",
];

const weeks: { title: string; items?: WeekItem[] }[] = [
  {
    title: "Week 1: Hello World",
    items: [
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
  },
  {
    title: "Week 2: Connecting the Database",
    items: [
      "Use your CLI to scaffold a Supabase data access helper.",
      "Create a Supabase client (browser + server) using the anonymous key.",
      "Store Supabase URL + anon key in .env.local and wire into Next.js.",
      "Read from a provided table and render a list page.",
    ],
  },
  {
    title: "Week 3: Auth Week",
    items: [
      {
        label: "Required viewing",
        href: "https://youtu.be/996OiexHze0?si=AKZX3uSA8TgESCx2",
      },
      "Implement Supabase Auth (magic link or OAuth).",
      "Add login/logout UI and session handling.",
      "Protect routes and show gated UI.",
      "Understand RLS policies for user-owned data.",
    ],
  },
  {
    title: "Week 4: Mutating Data",
    items: [
      "Add votes to the caption_votes table.",
      "Validate input and handle errors.",
      "Update and delete a record from the UI.",
    ],
  },
  {
    title: "Week 5: Making REST API Calls",
    items: [
      "Authenticate REST API requests with Supabase auth tokens.",
      "Request presigned URLs from the API.",
      "Upload images via the presigned URL.",
      "Create captions via the API.",
      "Display status and errors in the UI.",
    ],
  },
  {
    title: "Week 6: Admin Panel",
    items: [
      "Create admin-only routes and lock down access.",
      "List and filter captions, images, and users.",
      "Add pagination and empty/error states.",
    ],
  },
  {
    title: "Week 7: Domain Model",
    items: [
      "Model humor_flavors and humor_flavor_steps tables.",
      "Create UI to add/edit flavors and steps.",
      "Enforce foreign keys and ordering.",
      "Render a flavor detail page.",
    ],
  },
  {
    title: "Week 8: Prompt Chain Tool",
    items: [
      "Build a prompt chain editor UI (step-by-step prompts).",
      "Run the chain against the REST API.",
      "Store runs and results in Supabase.",
      "Compare outputs and add a favorite flag.",
    ],
  },
  {
    title: "Week 9: Spring Break!",
    items: [
      "Run at least 3 user tests for your public app.",
      "Capture feedback and convert it into tickets.",
    ],
  },
  {
    title: "Week 10: Creating Your Own Humor Flavor",
    items: [
      "Create humor_flavor and humor_flavor_steps.",
      "Add UI to select a flavor and generate captions.",
      "Make a REST API call to generate captions.",
      "Store generated captions and metadata in Supabase.",
    ],
  },
  {
    title: "Week 11: Data Collection",
    items: [
      "Launch the public app beta.",
      "Collect votes/ratings and store them in Supabase.",
      "Build a simple analytics view (top captions, vote counts).",
      "Audit data quality and remove test data.",
    ],
  },
  {
    title: "Week 12: Public App Polish",
    items: [
      "Improve UX copy, loading states, and empty states.",
      "Add performance checks and image optimization.",
      "Accessibility pass (keyboard, contrast, aria).",
      "Deploy and test on Vercel preview + production.",
    ],
  },
  {
    title: "Week 13: Admin & Prompt Tool Polish",
    items: [
      "Harden admin workflows and add CSV export.",
      "Refine prompt tool UI and run comparisons.",
      "Write README setup steps (CLI, env, Supabase).",
      "Prepare a demo script.",
    ],
  },
  {
    title: "Week 14: Final Integration & QA",
    items: [
      "End-to-end testing of all three apps.",
      "Prepare final presentation deck.",
    ],
  },
  {
    title: "Week 15: Last Day!",
    items: [
      "Final presentations and live demos.",
      "Submit repo and deployment links.",
      "Retrospective and course wrap-up.",
    ],
  },
];

const revealStyle = (delay: number): CSSProperties => ({
  animationDelay: `${delay}ms`,
});

export default function Home() {
  return (
    <main className="page">
      <div className="page__content">
        <header className="hero reveal" style={revealStyle(0)}>
          <p className="eyebrow">Spring 2026 - Assignments</p>
          <h1>
            The Humor Project<span className="tm">™</span>
          </h1>
        </header>

        <section
          className="card reveal"
          style={revealStyle(120)}
          aria-labelledby="summary-title"
        >
          <h2 id="summary-title">Summary</h2>
          <p className="lead">{summary}</p>
        </section>

        <section
          className="card reveal"
          style={revealStyle(240)}
          aria-labelledby="grading-title"
        >
          <h2 id="grading-title">Grading breakdown</h2>
          <ul className="list">
            {grading.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section
          className="card reveal"
          style={revealStyle(360)}
          aria-labelledby="tools-title"
        >
          <h2 id="tools-title">Tools required</h2>
          <ul className="list">
            {tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </section>

        <section className="card schedule" aria-labelledby="schedule-title">
          <h2
            id="schedule-title"
            className="section-title reveal"
            style={revealStyle(480)}
          >
            Weekly Schedule
          </h2>
          <div className="weeks">
            {weeks.map((week, index) => (
              <details
                key={week.title}
                className="week reveal"
                style={revealStyle(560 + index * 60)}
              >
                <summary>{week.title}</summary>
                {week.items && week.items.length > 0 ? (
                  <div className="week__content">
                    <ul>
                    {week.items.map((item, itemIndex) => {
                      const itemStyle = {
                        "--stagger": `${itemIndex}`,
                      } as CSSProperties;

                      if (typeof item === "string") {
                        return (
                          <li key={`${week.title}-${itemIndex}`} style={itemStyle}>
                            {item}
                          </li>
                        );
                      }

                      return (
                        <li key={`${week.title}-${item.href}`} style={itemStyle}>
                          {item.label}:{" "}
                          <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.href}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <div className="week__content">
                    <p className="week__empty">No assignments yet.</p>
                  </div>
                )}
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
