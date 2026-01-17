import ScheduleWeeks from "./ScheduleWeeks";
import { weeks } from "./weeks";

export default function SchedulePage() {
  return (
    <main className="page">
      <div className="page__content">
        <section className="card schedule" aria-labelledby="schedule-title">
          <h2
            id="schedule-title"
            className="section-title reveal"
            style={{ animationDelay: "0ms" }}
          >
            Weekly Schedule
          </h2>
          <ScheduleWeeks weeks={weeks} />
        </section>
      </div>
    </main>
  );
}
