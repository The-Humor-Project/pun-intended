"use client";

import type { CSSProperties } from "react";

import { renderTextWithLineBreaks } from "./lib/renderTextWithLineBreaks";

const summary =
  "This semester you'll build three web applications using NextJS, TailwindCSS, and Supabase: \n\n" +
    "1. A public facing application for obtaining votes/rankings of image captions \n" +
    "2. An admin area for looking at all the data \n" +
    "3. A prompt testing application to develop your own humor model.";

const grading = [
  "Linear Card completion: 60%",
  "On-time Akify Standup completion: 40%",
];

const learningGoals = [
  "Get first-hand experience with AI CLI tools",
  "Become familiar with the most popular database-as-a-service offering for start-ups: Supabase",
  "Learn how data is modeled well in a production-grade database",
  "Understand how authentication and authorization work",
  "Deploy continuously to Vercel and run user tests to iterate on a product.",
  "Use a project management tool to track your progress: Linear",
  "Learn how to use the most popular JavaScript framework currently in-use in the industry: NextJS",
];

const gradingPolicy = [
  "We're using the project management software 'Linear' to track your work.",
  "Each assignment will be written in a detailed Linear card and assigned to you.",
  "Linear cards must be completed by the due date stated in the card.",
  "We will use a service called Akify to monitor your progress on your Linear cards.",
  "Akify will check in with you on Tuesday and Friday mornings to get a status update on your Linear cards.  This is called a 'stand-up'.",
  "Your Akify standups will be due twice per week.  The deadline to complete your Akify standup will be Tuesday at 3:59pm and Friday at 3:59pm",
  "All Linear cards must be completed by the end of the semester.",
  "Late Akify standups are not accepted.",
];

const tools = [
  "IntelliJ IDE (free with .edu e-mail address)",
  "Google Gemini CLI (free for one year for students) or OpenAI Codex ($20 per month for \"Plus\" plan) or Claude Code CLI ($20 per month for \"Pro\" plan)",
  "Vercel (free)",
  "Slack (free)",
  "Linear (free)",
  "Akify (free)",
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
          <p className="lead">{renderTextWithLineBreaks(summary)}</p>
        </section>

        <section
          className="card reveal"
          style={revealStyle(240)}
          aria-labelledby="learning-goals-title"
        >
          <h2 id="learning-goals-title">Learning goals</h2>
          <ul className="list">
            {learningGoals.map((goal) => (
              <li key={goal}>{renderTextWithLineBreaks(goal)}</li>
            ))}
          </ul>
        </section>

        <section
          className="card reveal"
          style={revealStyle(360)}
          aria-labelledby="grading-title"
        >
          <h2 id="grading-title">Grading breakdown</h2>
          <ul className="list">
            {grading.map((item) => (
              <li key={item}>{renderTextWithLineBreaks(item)}</li>
            ))}
          </ul>
        </section>

        <section
          className="card reveal"
          style={revealStyle(480)}
          aria-labelledby="late-policy-title"
        >
          <h2 id="late-policy-title">Grading policy</h2>
          <ul className="list">
            {gradingPolicy.map((item) => (
              <li key={item}>{renderTextWithLineBreaks(item)}</li>
            ))}
          </ul>
        </section>

        <section
          className="card reveal"
          style={revealStyle(600)}
          aria-labelledby="tools-title"
        >
          <h2 id="tools-title">Tools required</h2>
          <ul className="list">
            {tools.map((tool) => (
              <li key={tool}>{renderTextWithLineBreaks(tool)}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
