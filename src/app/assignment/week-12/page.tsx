export default function AssignmentWeek12Page() {
  return (
    <main className="page">
      <div className="page__content">
        <section
          className="card assignments-detail"
          aria-labelledby="assignment-title"
        >
          <h2 id="assignment-title" className="section-title">
            Week 12: Public App Polish
          </h2>
          <div className="week__content">
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Meeting Agenda</h3>
                <div className="week__meeting">
                  <span className="week__meeting-label">Meeting date</span>
                  <span className="week__meeting-value">
                    Friday, April 10th, 2026 at 4pm ET
                  </span>
                </div>
              </div>
              <ul>
                <li>Iterate on your app!</li>
                <li>Improve UX copy, loading states, and empty states.</li>
                <li>Add performance checks and image optimization.</li>
                <li>Accessibility pass (keyboard, contrast, aria).</li>
              </ul>
            </div>
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Assignments</h3>
                <div className="week__due">
                  <span className="week__due-label">Due date</span>
                  <span className="week__due-value">
                    Friday, April 17th, 2026 at Noon ET
                  </span>
                </div>
              </div>
              <ol>
                <li>Collect more data!</li>
                <li>Complete all humorstudy.org ratings for the week.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
