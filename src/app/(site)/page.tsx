export default function Home() {
  return (
    <main className="page">
      <div className="page__content">
        <header className="hero reveal" style={{ animationDelay: "0ms" }}>
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
          <p className="lead">
            This semester you'll build web applications with NextJS, TailwindCSS,
            and Supabase using your favorite AI CLI tool. You will deploy them and
            get feedback from real human people. Rinse and repeat. Always repeat.
          </p>
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
            Humor Study completion accounts for 50% of your final grade.
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
            Use the 'Weekly Schedule' page on this site for meeting agendas and
            assignments
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
            This is a three (3) credit class. Use the following Vergil links to
            sign-up:
            <br />
            <br />
            COMS3998 section 60: <br/>
            <a href="https://vergil.columbia.edu/vergil/course/20261/73468/15161">
              https://vergil.columbia.edu/vergil/course/20261/73468/15161
            </a>
            <br />
            <br />
            COMS4901 section 60:<br />
            <a href="https://vergil.columbia.edu/vergil/course/20261/73471/15217">
              https://vergil.columbia.edu/vergil/course/20261/73471/15217
            </a>
            <br />
            <br />
            COMS6901 section 60:<br/>
            <a href="https://vergil.columbia.edu/vergil/course/20261/20365/15259">
              https://vergil.columbia.edu/vergil/course/20261/20365/15259
            </a>
            <br />
            <br />
            Join 3998 if you have never done research before. Join COMS4901 if
            you have already taken one section of 3998. Join 6901 if you are a
            Masters student or want master's level credit on your undergrad
            transcript.
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
          aria-labelledby="lecture-recordings-title"
        >
          <h2 id="lecture-recordings-title">Lecture recordings</h2>
          <p className="lead">
            Lectures are not recorded, but meeting notes will be provided.
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
