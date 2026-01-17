export default function AssignmentWeek3Page() {
  return (
    <main className="page">
      <div className="page__content">
        <section
          className="card assignments-detail"
          aria-labelledby="assignment-title"
        >
          <h2 id="assignment-title" className="section-title">
            Week 3: Auth Week
          </h2>
          <div className="week__content">
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Meeting Agenda</h3>
                <div className="week__meeting">
                  <span className="week__meeting-label">Meeting date</span>
                  <span className="week__meeting-value">
                    Friday, February 6th, 2026 at 4pm ET
                  </span>
                </div>
              </div>
              <ul>
                <li>Implement Supabase Auth (magic link or OAuth).</li>
                <li>Add login/logout UI and session handling.</li>
                <li>Protect routes and show gated UI.</li>
                <li>Understand RLS policies for user-owned data.</li>
              </ul>
            </div>
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Assignments</h3>
                <div className="week__due">
                  <span className="week__due-label">Due date</span>
                  <span className="week__due-value">
                    Friday, February 13th, 2026 at Noon ET
                  </span>
                </div>
              </div>
              <ol>
                <li>Required viewing: <a href="https://youtu.be/996OiexHze0?si=AKZX3uSA8TgESCx2" target="_blank" rel="noopener noreferrer">https://youtu.be/996OiexHze0?si=AKZX3uSA8TgESCx2</a></li>
                <li>Protect routes and show gated UI.</li>
                <li>Complete all humorstudy.org ratings for the week.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
