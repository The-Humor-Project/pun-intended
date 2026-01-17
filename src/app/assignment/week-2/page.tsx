export default function AssignmentWeek2Page() {
  return (
    <main className="page">
      <div className="page__content">
        <section
          className="card assignments-detail"
          aria-labelledby="assignment-title"
        >
          <h2 id="assignment-title" className="section-title">
            Week 2: Connecting the Database
          </h2>
          <div className="week__content">
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Meeting Agenda</h3>
                <div className="week__meeting">
                  <span className="week__meeting-label">Meeting date</span>
                  <span className="week__meeting-value">
                    Friday, January 30th, 2026 at 4pm ET
                  </span>
                </div>
              </div>
              <ul>
                <li>Create a Supabase client using the anonymous key.</li>
                <li>Store Supabase URL + anon key in .env.local and wire into Next.js.</li>
                <li>Read from a provided table and render a list page.</li>
              </ul>
            </div>
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Assignments</h3>
                <div className="week__due">
                  <span className="week__due-label">Due date</span>
                  <span className="week__due-value">
                    Friday, February 6th, 2026 at Noon ET
                  </span>
                </div>
              </div>
              <ol>
                <li>Update your application to read from a provided table and render a list page. Deploy the changes to Vercel.</li>
                <li>Complete all humorstudy.org ratings for the week.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
