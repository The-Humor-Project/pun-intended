export default function AssignmentWeek1Page() {
  return (
    <main className="page">
      <div className="page__content">
        <section
          className="card assignments-detail"
          aria-labelledby="assignment-title"
        >
          <h2 id="assignment-title" className="section-title">
            Week 1: Hello World
          </h2>
          <div className="week__content">
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Meeting Agenda</h3>
                <div className="week__meeting">
                  <span className="week__meeting-label">Meeting date</span>
                  <span className="week__meeting-value">
                    Friday, January 23rd, 2026 at 4pm ET
                  </span>
                </div>
              </div>
              <ul>
                <li>Create a new flavor using The Matrix</li>
                <li>Download IntelliJ</li>
                <li>Choose between Codex CLI, Claude Code CLI, Gemini CLI</li>
                <li>Create a public repository in your own GitHub account.</li>
                <li>Clone the repository with IntelliJ</li>
                <li>Ask your CLI to create a new NextJS project using the latest version of NextJS and React.</li>
                <li>Create a free-tier Vercel project.</li>
                <li>Connect your public GitHub repository to your Vercel project.</li>
                <li>Make sure your project successfully deploys.</li>
                <li>Make sure you can access Supabase.</li>
                <li>Make sure you can access Slack.</li>
              </ul>
            </div>
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Assignments</h3>
                <div className="week__due">
                  <span className="week__due-label">Due date</span>
                  <span className="week__due-value">
                    Friday, January 30th, 2026 at Noon ET
                  </span>
                </div>
              </div>
              <ol>
                <li>Get a simple 'Hello World' app deployed on Vercel.</li>
                <li>Complete all humorstudy.org ratings for the week.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
