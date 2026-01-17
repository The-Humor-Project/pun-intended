export default function AssignmentWeek10Page() {
  return (
    <main className="page">
      <div className="page__content">
        <section
          className="card assignments-detail"
          aria-labelledby="assignment-title"
        >
          <h2 id="assignment-title" className="section-title">
            Week 10: Creating Your Own Humor Flavor
          </h2>
          <div className="week__content">
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Meeting Agenda</h3>
                <div className="week__meeting">
                  <span className="week__meeting-label">Meeting date</span>
                  <span className="week__meeting-value">
                    Friday, March 27th, 2026 at 4pm ET
                  </span>
                </div>
              </div>
              <ul>
                <li>Create humor_flavor and humor_flavor_steps.</li>
                <li>Add UI to select a flavor and generate captions.</li>
                <li>Make a REST API call to generate captions.</li>
              </ul>
            </div>
            <div className="week__section">
              <div className="week__section-header">
                <h3 className="week__section-title">Assignments</h3>
                <div className="week__due">
                  <span className="week__due-label">Due date</span>
                  <span className="week__due-value">
                    Friday, April 3rd, 2026 at Noon ET
                  </span>
                </div>
              </div>
              <ol>
                <li>Details coming soon.</li>
                <li>Complete all humorstudy.org ratings for the week.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
