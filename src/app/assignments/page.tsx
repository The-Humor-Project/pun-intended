import Link from "next/link";

export default function AssignmentsPage() {
  return (
    <main className="page">
      <div className="page__content">
        <section className="card assignments" aria-labelledby="assignments-title">
          <h2
            id="assignments-title"
            className="section-title"
          >
            Assignments
          </h2>
          <ul className="assignments-list">
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-1">
                <span className="assignments-list__title">
                  Week 1: Hello World
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, January 30th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-2">
                <span className="assignments-list__title">
                  Week 2: Connecting the Database
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, February 6th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-3">
                <span className="assignments-list__title">Week 3: Auth Week</span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, February 13th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-4">
                <span className="assignments-list__title">
                  Week 4: Mutating Data
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, February 20th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-5">
                <span className="assignments-list__title">
                  Week 5: Making REST API Calls
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, February 27th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-6">
                <span className="assignments-list__title">
                  Week 6: Admin Panel
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, March 6th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-7">
                <span className="assignments-list__title">
                  Week 7: Domain Model
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, March 13th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-8">
                <span className="assignments-list__title">
                  Week 8: Prompt Chain Tool
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, March 20th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-9">
                <span className="assignments-list__title">
                  Week 9: Spring Break!
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, March 27th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-10">
                <span className="assignments-list__title">
                  Week 10: Creating Your Own Humor Flavor
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, April 3rd, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-11">
                <span className="assignments-list__title">
                  Week 11: Data Collection
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, April 10th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-12">
                <span className="assignments-list__title">
                  Week 12: Public App Polish
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, April 17th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-13">
                <span className="assignments-list__title">
                  Week 13: Admin & Prompt Tool Polish
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, April 24th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-14">
                <span className="assignments-list__title">
                  Week 14: Final Integration & QA
                </span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, May 1st, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
            <li className="assignments-list__item">
              <Link className="assignments-list__link" href="/assignment/week-15">
                <span className="assignments-list__title">Week 15: Last Day!</span>
                <span className="assignments-list__meta">
                  <span className="assignments-list__meta-label">Due date</span>
                  <span className="assignments-list__meta-value">
                    Friday, May 8th, 2026 at Noon ET
                  </span>
                </span>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
