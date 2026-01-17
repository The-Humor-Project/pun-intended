"use client";

import type { CSSProperties } from "react";

import { renderTextWithLineBreaks } from "./lib/renderTextWithLineBreaks";

const summary =
  "This semester you'll build web applications with NextJS, TailwindCSS, " +
    "and Supabase using your favorite AI CLI tool.  You will deploy them and " +
    "get feedback from real human people.  Rinse and repeat.  Always repeat.";

const prerequisites =
  "Comfortability with an IDE and GIT/GitHub is the only real requirement for this course. " +
    "The ideal student has taken Intro to Java, Data Structures, Advanced Programming, and Databases. " +
    "Students who have not taken the aforementioned courses will still learn a lot and " +
    "will be able to complete all the work.";

const courseSchedule =
  "This class meets once per week on Fridays at 4pm ET.  \n" +
    "Use the following link to join the virtual meetings on Google Meet: \n\n" +
    "https://tinyurl.com/columbia-university \n\n" +
    "Use the 'Weekly Schedule' page on this site for meeting agendas and assignments";

const exams =
  "There are no exams in this course.  Checkout the 'Grading breakdown' and 'Grading policy' sections for more info.";

const credits =
  "This is a three (3) credit class.  Use the following Vergil links to sign-up: \n\n" +
    "COMS3998 section 60: https://vergil.columbia.edu/vergil/course/20261/73468/15161 \n" +
    "COMS4901 section 60: https://vergil.columbia.edu/vergil/course/20261/73471/15217 \n" +
    "COMS6901 section 60: https://vergil.columbia.edu/vergil/course/20261/20365/15259 \n\n" +
    "Join 3998 if you have never done research before.  Join COMS4901 if you have already taken " +
    "one section of 3998.  Join 6901 if you are a Masters student or want master's " +
    "level credit on your undergrad transcript. \n\n" +
    "Everyone who joins the waitlist will get in the class.  Feel free to drop from " +
    "the waitlist if you need the waitlist spot for another class.  We will absolutely " +
    "let you in to the class, even if you are not on the waitlist.  Don't worry.";

const deliverables = [
  "A public-facing application for obtaining votes/rankings for image captions.",
  "An admin area for looking at all the data you collect.",
  "A prompt testing application to develop your own humor model.",
];

const humorStudy =
  "Complete the weekly Humor Study on HumorStudy.org to record your votes. " +
  "Humor Study completion accounts for 50% of your final grade.";

const grading = [
  "Humor Study completion: 50%",
  "Public-facing ranking application: 10%",
  "Admin area application: 15%",
  "Prompt testing application: 25%",
];

const learningGoals = [
  "Get first-hand experience with AI CLI tools",
  "Become familiar with the most popular database-as-a-service offering for start-ups: Supabase",
  "Learn how data is modeled well in a production-grade database",
  "Understand how authentication and authorization work",
  "Deploy continuously to Vercel and run user tests to iterate on a product.",
  "Use a CSS framework: TailwindCSS",
  "Learn how to use the most popular JavaScript framework currently in-use in the industry: NextJS",
];

const gradingPolicy = [
  "We'll use the 'Submissions' section of thehumorproject.org to track your progress on deliverables.",
  "HumorStudy.org will be used to record your votes for each week's humor study.",
  "Late submissions on your project deliverables are not accepted.",
  "Each weekly humor study missed results in a 10% reduction in final course grade.",
  "Late submissions to the Humor Study are not accepted.",
  "It is very possible to get an 'A' in this class.  There is no curve and we do not use norm-referenced grading.  Note: Professor Chilton almost never gives out A+ grades.  The last A+ she gave out went to Barack Obama when he took UI Design.",
];

const tools = [
  "IntelliJ IDE (free with .edu e-mail address)",
  "Google Gemini CLI (free for one year for students) or OpenAI Codex ($20 per month for \"Plus\" plan) or Claude Code CLI ($20 per month for \"Pro\" plan)",
  "Vercel (free)",
  "Slack (free)",
  "Linear (free)",
  "Akify (free)",
];

const lectureRecordings =
  "Lectures are not recorded, but the transcripts are made available to Akify.  You can " +
    "ask Akify to explain or summarize the lecture content for you.";

const communication =
  "We use Slack for all communication in this course.  Use the following link to join our Slack: \n\n" +
    "https://tinyurl.com/the-humor-project-slack";

const revealStyle = (delay: number): CSSProperties => ({
  animationDelay: `${delay}ms`,
});

export default function Home() {
  return (
    <main className="page">
      <div className="page__content">
        <header className="hero reveal" style={revealStyle(0)}>
          <p className="eyebrow">Spring 2026 - Columbia University</p>
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
          aria-labelledby="deliverables-title"
        >
          <h2 id="deliverables-title">Deliverables</h2>
          <ol className="list list--numbered">
            {deliverables.map((deliverable) => (
              <li key={deliverable}>{renderTextWithLineBreaks(deliverable)}</li>
            ))}
          </ol>
        </section>

        <section
          className="card reveal"
          style={revealStyle(360)}
          aria-labelledby="humor-study-title"
        >
          <h2 id="humor-study-title">Humor study</h2>
          <p className="lead">{renderTextWithLineBreaks(humorStudy)}</p>
        </section>

        <section
          className="card reveal"
          style={revealStyle(480)}
          aria-labelledby="learning-goals-title"
        >
          <h2 id="learning-goals-title">Learning goals</h2>
          <ol className="list list--numbered">
            {learningGoals.map((goal) => (
              <li key={goal}>{renderTextWithLineBreaks(goal)}</li>
            ))}
          </ol>
        </section>

        <section
          className="card reveal"
          style={revealStyle(600)}
          aria-labelledby="prerequisites-title"
        >
          <h2 id="prerequisites-title">Prerequisites</h2>
          <p className="lead">{renderTextWithLineBreaks(prerequisites)}</p>
        </section>

        <section
          className="card reveal"
          style={revealStyle(720)}
          aria-labelledby="course-schedule-title"
        >
          <h2 id="course-schedule-title">Course schedule</h2>
          <p className="lead">{renderTextWithLineBreaks(courseSchedule)}</p>
        </section>

        <section
          className="card reveal"
          style={revealStyle(840)}
          aria-labelledby="exams-title"
        >
          <h2 id="exams-title">Exams</h2>
          <p className="lead">{renderTextWithLineBreaks(exams)}</p>
        </section>

        <section
          className="card reveal"
          style={revealStyle(960)}
          aria-labelledby="credits-title"
        >
          <h2 id="credits-title">Credits</h2>
          <p className="lead">{renderTextWithLineBreaks(credits)}</p>
        </section>

        <section
          className="card reveal"
          style={revealStyle(1080)}
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
          style={revealStyle(1200)}
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
          style={revealStyle(1320)}
          aria-labelledby="tools-title"
        >
          <h2 id="tools-title">Tools required</h2>
          <ul className="list">
            {tools.map((tool) => (
              <li key={tool}>{renderTextWithLineBreaks(tool)}</li>
            ))}
          </ul>
        </section>

        <section
          className="card reveal"
          style={revealStyle(1440)}
          aria-labelledby="lecture-recordings-title"
        >
          <h2 id="lecture-recordings-title">Lecture recordings</h2>
          <p className="lead">{renderTextWithLineBreaks(lectureRecordings)}</p>
        </section>

        <section
          className="card reveal"
          style={revealStyle(1560)}
          aria-labelledby="communication-title"
        >
          <h2 id="communication-title">Communication</h2>
          <p className="lead">{renderTextWithLineBreaks(communication)}</p>
        </section>
      </div>
    </main>
  );
}
