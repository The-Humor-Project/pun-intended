import type {CSSProperties} from "react";

import type {Tables} from "@/types/supabase";

import {decodeHtmlEntities} from "@/app/lib/decodeHtmlEntities";
import {supabaseServer} from "@/app/lib/supabaseServer";

export const dynamic = "force-dynamic";

type MeetingAgendaSummary = Pick<
  Tables<"meeting_agendas">,
  "id" | "title" | "meeting_datetime_utc" | "content" | "location"
>;

const revealDelay = (index: number): CSSProperties => ({
  animationDelay: `${80 + index * 60}ms`,
});

const formatMeetingDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
  return `${weekday}, ${date.toLocaleString()}`;
};

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();

const hasRichTextContent = (value: string) => stripHtml(value).length > 0;

export default async function MeetingAgendasPage() {
  if (!supabaseServer) {
    return (
      <main className="page">
        <div className="page__content">
          <section className="card meeting-agendas" aria-labelledby="agendas-title">
            <h2 id="agendas-title" className="section-title">
              Meeting Agendas
            </h2>
            <p className="week__empty">Meeting agendas are not available yet.</p>
          </section>
        </div>
      </main>
    );
  }

  const { data, error } = await supabaseServer
    .from("meeting_agendas")
    .select("id, title, meeting_datetime_utc, content, location")
    .order("meeting_datetime_utc", { ascending: true });

  if (error) {
    return (
      <main className="page">
        <div className="page__content">
          <section className="card meeting-agendas" aria-labelledby="agendas-title">
            <h2 id="agendas-title" className="section-title">
              Meeting Agendas
            </h2>
            <p className="week__empty">{error.message}</p>
          </section>
        </div>
      </main>
    );
  }

  const agendas = (data ?? []) as MeetingAgendaSummary[];

  return (
    <main className="page">
      <div className="page__content">
        <section className="card meeting-agendas" aria-labelledby="agendas-title">
          <h2
            id="agendas-title"
            className="section-title reveal"
            style={{ animationDelay: "0ms" }}
          >
            Meeting Agendas
          </h2>
          {agendas.length === 0 ? (
            <p className="week__empty">No meeting agendas yet.</p>
          ) : (
            <div className="weeks">
              {agendas.map((agenda, index) => {
                const title = agenda.title.trim() || "Untitled agenda";
                const location = agenda.location.trim() || "TBA";

                return (
                  <details
                    key={agenda.id}
                    className="week reveal"
                    style={revealDelay(index)}
                  >
                    <summary>{title}</summary>
                    <div className="week__content">
                      <div className="week__section">
                        <div className="week__section-header">
                          <h3 className="week__section-title">Meeting agenda</h3>
                          <div className="week__meeting">
                            <span className="week__meeting-label">
                              Meeting date
                            </span>
                            <span className="week__meeting-value">
                              {formatMeetingDate(agenda.meeting_datetime_utc)}
                            </span>
                          </div>
                        </div>
                        {hasRichTextContent(agenda.content) ? (
                          <div
                            className="assignment-body"
                            dangerouslySetInnerHTML={{
                              __html: decodeHtmlEntities(agenda.content),
                            }}
                          />
                        ) : (
                          <p className="week__empty">No agenda details yet.</p>
                        )}
                        <div className="week__meeting">
                          <span className="week__meeting-label">Location</span>
                          <span className="week__meeting-value">
                            {location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
