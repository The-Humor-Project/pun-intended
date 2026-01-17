export default function AssignmentWeek4Page() {
  return (
    <main className="page">
      <div className="page__content">
        <section
          className="card assignments-detail"
          aria-labelledby="assignment-title"
        >
          <h2 id="assignment-title" className="section-title">
            Week 4: Mutating Data
          </h2>
          <div className="week__content">
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Meeting Agenda</h3>
                <div className="week__meeting">
                  <span className="week__meeting-label">Meeting date</span>
                  <span className="week__meeting-value">
                    Friday, February 13th, 2026 at 4pm ET
                  </span>
                </div>
              </div>
              <ul>
                <li>Add votes to the caption_votes table.</li>
              </ul>
            </div>
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Assignments</h3>
                <div className="week__due">
                  <span className="week__due-label">Due date</span>
                  <span className="week__due-value">
                    Friday, February 20th, 2026 at Noon ET
                  </span>
                </div>
              </div>
              <ol>
                <li>Add votes to the caption_votes table.</li>
                <li>Complete all humorstudy.org ratings for the week.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
