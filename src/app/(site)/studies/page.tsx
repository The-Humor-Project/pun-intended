import type {CSSProperties} from "react";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

import {resolveTimeZone} from "@/app/lib/resolveTimeZone";
import {createSupabaseServerClient} from "@/app/lib/supabaseServerClient";

export const dynamic = "force-dynamic";

type StudySummary = {
  id: number;
  created_datetime_utc: string;
  slug: string;
  description: string | null;
  start_datetime_utc: string;
  end_datetime_utc: string;
  caption_count: number;
  rated_caption_count: number;
};

type StudyErrorResponse = {
  error: boolean;
  url: string;
  statusCode: number;
  statusMessage: string;
  message: string;
};

const revealDelay = (index: number): CSSProperties => ({
  animationDelay: `${80 + index * 60}ms`,
});

const getOrdinalSuffix = (value: number) => {
  const remainder = value % 100;
  if (remainder >= 11 && remainder <= 13) {
    return "th";
  }

  switch (value % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatStudyDate = (value: string, timeZone?: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  };

  if (timeZone) {
    options.timeZone = timeZone;
  }

  const formatter = new Intl.DateTimeFormat(undefined, options);
  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const year = parts.find((part) => part.type === "year")?.value;

  if (!weekday || !month || !day || !year) {
    return formatter.format(date);
  }

  const dayNumber = Number(day);
  if (!Number.isFinite(dayNumber)) {
    return formatter.format(date);
  }

  const dateText = `${weekday}, ${month} ${dayNumber}${getOrdinalSuffix(dayNumber)}, ${year}`;
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;
  const dayPeriod = parts.find((part) => part.type === "dayPeriod")?.value;
  const timeZoneName = parts.find((part) => part.type === "timeZoneName")?.value;

  if (!hour || !minute) {
    return dateText;
  }

  const timeText = `${hour}:${minute}${dayPeriod ? ` ${dayPeriod}` : ""}`;
  const zoneText = timeZoneName ? ` ${timeZoneName}` : "";

  return `${dateText} at ${timeText}${zoneText}`;
};

const formatCount = (value: number) =>
  Number.isFinite(value) ? value.toLocaleString() : "0";

const getProgressValue = (rated: number, total: number) => {
  if (!Number.isFinite(total) || total <= 0) {
    return 0;
  }

  if (!Number.isFinite(rated) || rated <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (rated / total) * 100));
};

const parseDateValue = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
};

const sortStudies = (studies: StudySummary[]) =>
  [...studies].sort((a, b) => {
    const aTime = parseDateValue(a.start_datetime_utc);
    const bTime = parseDateValue(b.start_datetime_utc);

    if (aTime === null && bTime === null) {
      return 0;
    }

    if (aTime === null) {
      return 1;
    }

    if (bTime === null) {
      return -1;
    }

    return aTime - bTime;
  });

const fetchStudies = async (baseUrl: string, email: string) => {
  const studiesUrl = new URL("/studies", baseUrl);
  studiesUrl.searchParams.set("email", email);

  const response = await fetch(studiesUrl.toString(), { cache: "no-store" });

  if (response.status === 404) {
    const errorPayload =
      (await response.json().catch(() => null)) as StudyErrorResponse | null;

    return {
      studies: [],
      error:
        errorPayload?.message ?? "No humor studies found for this account.",
    };
  }

  if (!response.ok) {
    const fallback = await response.text().catch(() => "");

    return {
      studies: [],
      error: fallback || `Request failed (${response.status}).`,
    };
  }

  const payload = (await response.json().catch(() => null)) as
    | StudySummary[]
    | null;

  if (!Array.isArray(payload)) {
    return {
      studies: [],
      error: "Unexpected studies response.",
    };
  }

  return { studies: payload, error: null };
};

export default async function StudiesPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const timeZone = resolveTimeZone(cookieStore.get("timezone")?.value);

  const supabase = await createSupabaseServerClient();
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    redirect("/login");
  }

  const email = sessionData.session.user.email;
  const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

  if (!restApiUrl) {
    return (
      <main className="page">
        <div className="page__content">
          <section className="card studies" aria-labelledby="studies-title">
            <h2 id="studies-title" className="section-title">
              Studies
            </h2>
            <p className="week__empty">
              NEXT_PUBLIC_REST_API_URL is not configured.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (!email) {
    return (
      <main className="page">
        <div className="page__content">
          <section className="card studies" aria-labelledby="studies-title">
            <h2 id="studies-title" className="section-title">
              Studies
            </h2>
            <p className="week__empty">
              No email address is associated with this account.
            </p>
          </section>
        </div>
      </main>
    );
  }

  const { studies, error } = await fetchStudies(restApiUrl, email).catch(
    (fetchError) => ({
      studies: [],
      error:
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load studies.",
    }),
  );
  const sortedStudies = sortStudies(studies);

  if (error) {
    return (
      <main className="page">
        <div className="page__content">
          <section className="card studies" aria-labelledby="studies-title">
            <h2 id="studies-title" className="section-title">
              Studies
            </h2>
            <p className="week__empty">{error}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page__content">
        <section className="card studies" aria-labelledby="studies-title">
          <h2
            id="studies-title"
            className="section-title reveal"
            style={{ animationDelay: "0ms" }}
          >
            Studies
          </h2>
          <p className="lead">
            Track your humor study progress and deadlines.
          </p>
          {sortedStudies.length === 0 ? (
            <p className="week__empty">No studies assigned yet.</p>
          ) : (
            <ul className="assignments-list studies-list">
              {sortedStudies.map((study, index) => {
                const progressValue = getProgressValue(
                  study.rated_caption_count,
                  study.caption_count,
                );
                const progressPercent = Math.round(progressValue);
                const progressText = `${formatCount(
                  study.rated_caption_count,
                )} of ${formatCount(study.caption_count)} rated`;
                const progressDelay = `${140 + index * 60}ms`;

                return (
                  <li
                    key={study.id}
                    className="assignments-list__item reveal"
                    style={revealDelay(index)}
                  >
                    <div className="assignments-list__card studies-card">
                      <div className="assignments-list__header">
                        <span className="assignments-list__title">
                          {study.slug}
                        </span>
                      </div>
                      <div className="studies-card__details">
                        <div className="assignments-list__meta">
                        <span className="assignments-list__meta-label">
                          Captions
                        </span>
                        <span className="assignments-list__meta-value">
                          <span className="studies-card__count">
                            {formatCount(study.caption_count)}
                          </span>
                        </span>
                      </div>
                      <div className="assignments-list__meta">
                        <span className="assignments-list__meta-label">
                          Rated
                        </span>
                        <span className="assignments-list__meta-value">
                          <span className="studies-card__count">
                            {formatCount(study.rated_caption_count)}
                          </span>
                        </span>
                      </div>
                        <div className="assignments-list__meta">
                          <span className="assignments-list__meta-label">
                            Start
                          </span>
                          <span className="assignments-list__meta-value">
                            {formatStudyDate(study.start_datetime_utc, timeZone)}
                          </span>
                        </div>
                        <div className="assignments-list__meta">
                          <span className="assignments-list__meta-label">
                            End
                          </span>
                          <span className="assignments-list__meta-value">
                            {formatStudyDate(study.end_datetime_utc, timeZone)}
                          </span>
                        </div>
                      </div>
                      <div className="studies-card__progress">
                        <div className="studies-card__progress-header">
                          <span className="assignments-list__meta-label">
                            Progress
                          </span>
                          <span className="studies-card__progress-text">
                            {progressText}
                          </span>
                        </div>
                        <div
                          className="studies-card__progress-track"
                          role="progressbar"
                          aria-valuenow={Math.round(progressValue)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuetext={progressText}
                          style={
                            {
                              "--progress": `${progressValue}%`,
                              "--progress-delay": progressDelay,
                            } as CSSProperties
                          }
                        >
                          <div
                            className="studies-card__progress-fill"
                          />
                          <span className="studies-card__progress-percent">
                            {progressPercent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
