import type {CSSProperties} from "react";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

import type {Tables} from "@/types/supabase";

import {hasMarkdownContent, renderMarkdown} from "@/app/lib/markdown";
import {resolveTimeZone} from "@/app/lib/resolveTimeZone";
import {createSupabaseServerClient} from "@/app/lib/supabaseServerClient";

export const dynamic = "force-dynamic";

type MeetingAgendaSummary = Pick<
  Tables<"meeting_agendas">,
  "id" | "title" | "meeting_datetime_utc" | "content" | "location"
>;

const revealDelay = (index: number): CSSProperties => ({
  animationDelay: `${80 + index * 60}ms`,
});

const formatMeetingDate = (value: string, timeZone?: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const weekdayOptions: Intl.DateTimeFormatOptions = { weekday: "long" };
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    timeZoneName: "short",
  };

  if (timeZone) {
    weekdayOptions.timeZone = timeZone;
    dateTimeOptions.timeZone = timeZone;
  }

  const weekday = date.toLocaleDateString(undefined, weekdayOptions);
  return `${weekday}, ${date.toLocaleString(undefined, dateTimeOptions)}`;
};


export default async function MeetingAgendasPage() {
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

  const { data, error } = await supabase
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
                              {formatMeetingDate(
                                agenda.meeting_datetime_utc,
                                timeZone,
                              )}
                            </span>
                          </div>
                        </div>
                        {hasMarkdownContent(agenda.content) ? (
                          <div
                            className="assignment-body"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(agenda.content),
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
