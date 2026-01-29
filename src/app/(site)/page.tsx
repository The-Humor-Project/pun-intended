import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <div className="page__content">
        <header className="hero reveal" style={{ animationDelay: "0ms" }}>
          <Link className="hero__brand" href="/" aria-label="Columbia University home">
            <span className="logo-swap logo-swap--light">
              <Image
                className="hero__brand-mark"
                src="/columbia-crown-light.svg"
                alt=""
                width={80}
                height={80}
                priority
              />
            </span>
            <span className="logo-swap logo-swap--dark">
              <Image
                className="hero__brand-mark"
                src="/columbia-crown-dark.svg"
                alt=""
                width={80}
                height={80}
                priority
              />
            </span>
          </Link>
          <p className="eyebrow">Spring 2026 - Columbia University</p>
          <h1>
            The Humor Project<span className="tm">™</span>
          </h1>
        </header>

        <section
          className="card reveal"
          style={{ animationDelay: "120ms" }}
          aria-labelledby="summary-title"
        >
          <h2 id="summary-title">Summary</h2>
          <div className="summary__stack">
            <p className="lead">
              This semester you'll build web applications with NextJS,
              TailwindCSS, and Supabase using your favorite AI CLI tool. You
              will deploy them and get feedback from real human people. Rinse
              and repeat. Always repeat.
            </p>
            <div className="summary__section">
              <h3>Class History</h3>
              <p>
                In past semesters, students worked in pods on shared Crackd
                applications. This semester is different. Instead of
                contributing to one internal codebase, you will individually
                build your own applications using Crackd&apos;s data model and the
                same kinds of AI tooling that we use in our development. The
                goal is to learn how to build an end-to-end, data-backed system
                that can (1) collect structured feedback from users, (2) support
                admin inspection and interaction, and (3) enable rapid
                prompt/pipeline experimentation for an LLM-driven content
                generator.
              </p>
            </div>
            <div className="summary__section">
              <h3>What is Crackd and What Are Humor Studies?</h3>
              <p>
                Crackd.ai is our web and mobile application that auto-generates
                captions for user-uploaded images using large language models.
                Crackd is also a research platform. We study what people
                actually find funny by collecting large quantities of votes on
                AI-generated captions. Our system is designed to leverage
                specific community context and &quot;insider lore,&quot; especially
                Columbia student culture, because humor is contextual and
                audience-dependent.
              </p>
              <p>
                That research component happens through humor studies. A humor
                study is a structured experiment that presents batches of
                captions to voters and records reactions (upvotes/downvotes) at
                scale. Each week, the class will run a study tied to a specific
                humor flavor, meaning a specific caption-generation strategy and
                prompt/pipeline configuration. On Fridays, a humor flavor will
                be triggered to generate captions. Those captions will be
                published to humorstudy.org, and students will vote on the
                results. Those votes do two things: they power our research
                analysis and they influence which captions feed into
                Crackd&apos;s &quot;Top 100&quot; feed for our real users.
              </p>
            </div>
            <div className="summary__section">
              <h3>How This Class Works</h3>
              <p>
                The fastest way to learn modern applied AI product engineering
                is to build real systems: frontends that read and write
                structured records, admin tools that support internal
                operations, and experimentation environments that turn
                subjective creative output into measurable signals. You will
                build three applications that mirror the three pillars of
                Crackd&apos;s internal workflow: public data collection, admin
                inspection, and pipeline experimentation.
              </p>
              <p>
                Your work will use our existing Supabase database as the source
                of truth for shared entities (images, captions, votes, studies,
                and pipeline metadata). You will be given read-only access to
                the Crackd database so you can query it, learn the data model,
                and use it as the foundation for your products. For data you
                personally collect (such as votes captured through your version
                of a study site), you will write to a Supabase destination we
                provide for student-generated records. You are building on top
                of the same domain model that powers our platform.
              </p>
            </div>
            <div className="summary__section">
              <h3>Project Deliverables</h3>
              <p>
                In this class, you will be developing three separate
                applications. Each application is intentionally scoped to teach
                a different layer of the system and to reinforce how the pieces
                fit together.
              </p>
              <p>
                The first application is a public-facing voting site for
                captions. This is your own version of humorstudy.org. It should
                load a study, display images and their candidate captions, and
                collect votes that represent &quot;this caption is funny for this
                image.&quot; Your interface should make voting fast and intuitive.
                Your votes will be stored in the Supabase domain we provide so
                they become part of the shared research dataset.
              </p>
              <p>
                The second application is an admin dashboard. An admin dashboard
                is essentially a frontend to the data in your database. For
                example, Crackd has a large internal Admin product because our
                AI systems require constant iteration, auditing, and debugging.
                You need to see what was generated, what prompts were used, how
                users reacted, and where your pipeline failed. Your admin
                dashboard will be a smaller version of this idea. It should
                allow you to browse and filter studies, captions, images, votes,
                etc. and support the types of questions you would ask while
                trying to improve a humor flavor. A good admin app is an
                interface that makes the dataset understandable. There is a lot
                of flexibility in design choice when it comes to your Admin
                area.
              </p>
              <p>
                The third application is a prompt and pipeline testing
                environment for building your own humor model. This is your own
                version of matrix.almostcrackd.ai. Humor flavors are created
                through experimentation: you write prompt steps, run
                generations, inspect failures, adjust constraints, and repeat.
                This app should let you modify prompt steps and run test
                generations against known image sets to improve the flavor.
                Your goal is to make iteration easy.
              </p>
            </div>
            <div className="summary__section">
              <h3>Supabase</h3>
              <p>
                Supabase is our database platform. It provides a hosted Postgres
                database and additional services we use in development,
                including authentication, RLS, and an API layer. In this course,
                Supabase is the system of record. Every application you build
                will either read from it, write to it, or both. There is
                documentation on our website describing Crackd&apos;s domain model
                and the important tables you need to understand. You should
                treat the database schema as the contract between your
                applications and the Crackd ecosystem.
              </p>
            </div>
            <div className="summary__section">
              <h3>Development Environment</h3>
              <p>
                An IDE (Integrated Development Environment) is the primary tool
                developers use to write, navigate, and debug code. For this
                course, IntelliJ is the recommended IDE because it has strong
                tooling for backend and full-stack development, but it is not
                required. VS Code is also a strong option. What matters is that
                you pick an environment that allows YOU to move quickly and
                debug effectively. We do not recommend Vim for this course.
              </p>
              <p>
                GitHub is a version control platform that developers use to
                store and manage code. A repo (repository) is a versioned
                project folder that contains your entire applications. You will
                commit changes as you build features so that you can track
                progress, revert mistakes, and collaborate easily when you need
                to share your code. You are expected to push code regularly and
                keep your repo in a working state.
              </p>
              <p>
                Vercel is the hosting and development platform you will use to
                publish your applications. Deployment means taking your code and
                running it on an internet-accessible server so other people can
                use it through a URL. In practice, you will connect your repo
                to Vercel, and every push to a configured branch can trigger a
                new deployment. This makes it easy to test changes, share your
                work, and iterate without needing to manage servers manually.
              </p>
            </div>
            <div className="summary__section">
              <h3>AI CLI Tools</h3>
              <p>
                A CLI (Command Line Interface) is a text-based way to run
                commands and tools on your computer. In this course, you will
                use AI-powered CLI tools to accelerate development because that
                is the way our future is heading. These tools can generate
                boilerplate code, write components, and help debug errors. You
                may choose OpenAI CodeX, Google Gemini CLI, or Claude Code CLI.
              </p>
              <p>
                The expectation is not that AI writes your entire project while
                you simply watch. The expectation is that you learn how to
                operate AI as a development partner. You should break work into
                small tasks, write precise instructions, validate outputs, and
                integrate changes. You are responsible for what you ship. AI is
                powerful, but it can also confidently make mistakes if you do
                not supervise it. You should still know how to read and debug
                code. A major learning outcome of this course is building the
                judgement to use AI tools effectively without losing
                correctness, clarity, or control.
              </p>
            </div>
            <div className="summary__section">
              <h3>What &quot;Success&quot; Looks Like In This Course</h3>
              <p>
                A strong project in this class is one where applications feel
                like real products, not just throwaway class projects. Your
                public voting app should make it easy to vote and should
                reliably record data. Your admin app should support
                investigation and analysis rather than dumping raw tables. Your
                prompt testing environment should make iteration fast and easy
                while keeping pipeline outputs traceable and comparable over
                time. Across all three, you should demonstrate that you
                understand the Crackd domain mode, that you can design
                interfaces that match the structure of the data, and that you
                can build systems that support experimentation. Additionally, a
                huge focus of the course should be completing weekly humor
                studies to provide us with high-quality data to contribute
                toward our humor research.
              </p>
            </div>
          </div>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "240ms" }}
          aria-labelledby="deliverables-title"
        >
          <h2 id="deliverables-title">Deliverables</h2>
          <ol className="list list--numbered">
            <li>
              A public-facing application for obtaining votes/rankings for image
              captions.
            </li>
            <li>An admin area for looking at all the data you collect.</li>
            <li>
              A prompt testing application to develop your own humor model.
            </li>
          </ol>
          <br/>
          <p className="lead">
            Project deliverables account for 50% of your final grade.
          </p>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "360ms" }}
          aria-labelledby="humor-study-title"
        >
          <h2 id="humor-study-title">Humor study</h2>
          <p className="lead">
            Complete the weekly Humor Study on HumorStudy.org to record your
            votes. <br/>
            Humor Study completion accounts for 50% of your final grade. <br/>
            Voting opens at 5pm ET each Friday. <br/>
            Votes are due by 11:59pm ET on Sunday. Late submissions are not accepted.
          </p>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "480ms" }}
          aria-labelledby="learning-goals-title"
        >
          <h2 id="learning-goals-title">Learning goals</h2>
          <ol className="list list--numbered">
            <li>Get first-hand experience with AI CLI tools</li>
            <li>
              Become familiar with the most popular database-as-a-service
              offering for start-ups: Supabase
            </li>
            <li>Learn how data is modeled well in a production-grade database</li>
            <li>Understand how authentication and authorization work</li>
            <li>
              Deploy continuously to Vercel and run user tests to iterate on a
              product.
            </li>
            <li>Use a CSS framework: TailwindCSS</li>
            <li>
              Learn how to use the most popular JavaScript framework currently
              in-use in the industry: NextJS
            </li>
          </ol>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "600ms" }}
          aria-labelledby="prerequisites-title"
        >
          <h2 id="prerequisites-title">Prerequisites</h2>
          <p className="lead">
            Comfortability with an IDE and GIT/GitHub is the only real
            requirement for this course. The ideal student has taken Intro to
            Java, Data Structures, Advanced Programming, and Databases. Students
            who have not taken the aforementioned courses will still learn a lot
            and will be able to complete all the work.
          </p>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "720ms" }}
          aria-labelledby="course-schedule-title"
        >
          <h2 id="course-schedule-title">Course schedule</h2>
          <p className="lead">
            This class meets once per week on Fridays at 4pm ET.
            <br />
            <br />
            Use the following link to join the virtual meetings on Google Meet:
            <br />
            <br />
            <a href={"https://www.tinyurl.com/columbia-university"}>
              https://tinyurl.com/columbia-university
            </a>
            <br />
            <br />
            Use the 'Meeting Agendas' and 'Assignments' pages on
            this site for meeting agendas and assignments
          </p>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "780ms" }}
          aria-labelledby="office-hours-title"
        >
          <h2 id="office-hours-title">Office Hours</h2>
          <p className="lead">
            Drop in to office hours using the following calendar:
            <br />
            <br />
            <a
              href="https://calendar.google.com/calendar/u/0?cid=Y19iMGNhZDNmMjVmMjNmYmNhMzVjNmM3ZmZhOTMwYTUyMTdlNzRiNWIwM2EwZWYxM2Q0MGI5YTRhMDZhYmE3MjU1QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20"
              target="_blank"
              rel="noreferrer"
            >
              Office Hours Calendar
            </a>
          </p>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "840ms" }}
          aria-labelledby="exams-title"
        >
          <h2 id="exams-title">Exams</h2>
          <p className="lead">
            There are no exams in this course. Checkout the 'Grading breakdown'
            and 'Grading policy' sections for more info.
          </p>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "960ms" }}
          aria-labelledby="credits-title"
        >
          <h2 id="credits-title">Credits</h2>
          <p className="lead">
            This is a three (3) credit class. Use the following Vergil link to
            sign-up:
            <br />
            <br />
            COMS4995W: <br/>
            <a href="https://vergil.columbia.edu/vergil/course/20261/73060/20388">
              https://vergil.columbia.edu/vergil/course/20261/73060/20388
            </a>
            <br />
            <br />
            Please disregard time in Vergil.  It says 2pm to 5pm.<br/>
            We will continue to meet from 4pm to 5pm on Fridays.
            <br />
            <br />
            Everyone who joins the waitlist will get in the class. Feel free to
            drop from the waitlist if you need the waitlist spot for another
            class. We will absolutely let you in to the class, even if you are
            not on the waitlist. Don't worry.
          </p>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "1080ms" }}
          aria-labelledby="grading-title"
        >
          <h2 id="grading-title">Grading breakdown</h2>
          <ul className="list">
            <li>Humor Study completion: 50%</li>
            <li>Public-facing ranking application: 10%</li>
            <li>Admin area application: 15%</li>
            <li>Prompt testing application: 25%</li>
          </ul>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "1200ms" }}
          aria-labelledby="late-policy-title"
        >
          <h2 id="late-policy-title">Grading policy</h2>
          <ul className="list">
            <li>
              We'll use the 'Submissions' section of thehumorproject.org to track
              your progress on deliverables.
            </li>
            <li>
              HumorStudy.org will be used to record your votes for each week's
              humor study.
            </li>
            <li>Late submissions on your project deliverables are not accepted.</li>
            <li>
              Each weekly humor study missed results in a 10% reduction in final
              course grade.
            </li>
            <li>Late submissions to the weekly Humor Study are not accepted.</li>
            <li>
              It is very possible to get an 'A' in this class. There is no curve
              and we do not use norm-referenced grading. Note: Professor Chilton
              almost never gives out A+ grades. The last A+ she gave out went to
              Barack Obama when he took UI Design.
            </li>
          </ul>
        </section>

        <section
            className="card reveal"
            style={{ animationDelay: "1560ms" }}
            aria-labelledby="collaboration-title"
        >
          <h2 id="collaboration-title">Collaboration</h2>
          <p className="lead">
            The assignments in this class are designed to be done individually.
            <br />
            <br />
            Feel free to collaborate with others, but you are responsible for
            your own deliverables.
          </p>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "1320ms" }}
          aria-labelledby="tools-title"
        >
          <h2 id="tools-title">Tools required</h2>
          <ul className="list">
            <li>IntelliJ IDE (free with .edu e-mail address)</li>
            <li>
              Google Gemini CLI (free for one year for students) or OpenAI Codex
              ($20 per month for &quot;Plus&quot; plan) or Claude Code CLI ($20 per
              month for &quot;Pro&quot; plan)
            </li>
            <li>Vercel (free)</li>
            <li>Slack (free)</li>
            <li>Supabase (provided)</li>
          </ul>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "1440ms" }}
          aria-labelledby="meeting-recordings-title"
        >
          <h2 id="meeting-recordings-title">Meeting recordings</h2>
          <p className="lead">
            Meetings are not recorded, but meeting notes will be provided.
          </p>
        </section>

        <section
          className="card reveal"
          style={{ animationDelay: "1560ms" }}
          aria-labelledby="communication-title"
        >
          <h2 id="communication-title">Communication</h2>
          <p className="lead">
            We use Slack for all communication in this course. Use the following
            link to join our Slack:
            <br />
            <br />
            <a href="https://www.tinyurl.com/the-humor-project-slack">
              https://www.tinyurl.com/the-humor-project-slack
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
