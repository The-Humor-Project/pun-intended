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
    items: ["Using the Supabase SDK and the anonymous Supabase key."],
  },
  {
    title: "Week 3: Auth Week",
    items: [
      {
        label: "Required viewing",
        href: "https://youtu.be/996OiexHze0?si=AKZX3uSA8TgESCx2",
      },
    ],
  },
  {
    title: "Week 4: Mutating Data",
    items: ["Can't mutate data without auth."],
  },
  {
    title: "Week 5: Making REST API Calls",
    items: [
      "Can't make REST calls without auth.",
      "Getting presigned URLs",
      "Uploading images",
      "Creating captions",
    ],
  },
  {
    title: "Week 6: Admin Panel",
    items: ["Lock down access", "Captions", "Images", "Users"],
  },
  {
    title: "Week 7: Domain Model",
    items: ["Humor flavors", "Humor flavor steps"],
  },
  {
    title: "Week 8: Prompt Chain Tool",
  },
  {
    title: "Week 9: Spring Break!",
    items: ["User studies for your public app."],
  },
  {
    title: "Week 10: Creating Your Own Humor Flavor",
    items: [
      "Create humor_flavor and humor_flavor_steps.",
      "Then make a REST API call to our API to generate captions.",
    ],
  },
  {
    title: "Week 11: Data Collection",
  },
  {
    title: "Week 12: XXX",
  },
  {
    title: "Week 13: XXX",
  },
  {
    title: "Week 14: XXX",
  },
  {
    title: "Week 15: Last Day!",
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
              <article
                key={week.title}
                className="week reveal"
                style={revealStyle(560 + index * 60)}
              >
                <h3>{week.title}</h3>
                {week.items && week.items.length > 0 ? (
                  <ul>
                    {week.items.map((item, itemIndex) => {
                      if (typeof item === "string") {
                        return <li key={`${week.title}-${itemIndex}`}>{item}</li>;
                      }

                      return (
                        <li key={`${week.title}-${item.href}`}>
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
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
