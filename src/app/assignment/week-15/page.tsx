export default function AssignmentWeek15Page() {
  return (
    <main className="page">
      <div className="page__content">
        <section
          className="card assignments-detail"
          aria-labelledby="assignment-title"
        >
          <h2 id="assignment-title" className="section-title">
            Week 15: Last Day!
          </h2>
          <div className="week__content">
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Meeting Agenda</h3>
                <div className="week__meeting">
                  <span className="week__meeting-label">Meeting date</span>
                  <span className="week__meeting-value">
                    Friday, May 1st, 2026 at 4pm ET
                  </span>
                </div>
              </div>
              <ul>
                <li>Final presentations and live demos.</li>
                <li>Retrospective and course wrap-up.</li>
              </ul>
            </div>
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Assignments</h3>
                <div className="week__due">
                  <span className="week__due-label">Due date</span>
                  <span className="week__due-value">
                    Friday, May 8th, 2026 at Noon ET
                  </span>
                </div>
              </div>
              <ol>
                <li>Submit repo and deployment links.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
