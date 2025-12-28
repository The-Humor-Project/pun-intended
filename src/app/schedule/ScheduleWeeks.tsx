"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

import { renderTextWithLineBreaks } from "../lib/renderTextWithLineBreaks";

type WeekItem = string | { label: string; href: string };
type Week = {
  title: string;
  dueDate: string;
  meetingDate: string;
  meetingAgendaItems?: WeekItem[];
  assignmentItems?: WeekItem[];
};

type ScheduleWeeksProps = {
  weeks: Week[];
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const parseMeetingDate = (meetingDate: string) => {
  const match = meetingDate.match(
    /,\s*([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,\s+(\d{4})/,
  );

  if (!match) {
    return null;
  }

  const [, monthName, dayValue, yearValue] = match;
  const monthIndex = monthNames.indexOf(monthName);

  if (monthIndex === -1) {
    return null;
  }

  const day = Number.parseInt(dayValue, 10);
  const year = Number.parseInt(yearValue, 10);

  if (Number.isNaN(day) || Number.isNaN(year)) {
    return null;
  }

  return new Date(year, monthIndex, day);
};

const normalizeDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getCurrentWeekIndex = (weeks: Week[], today: Date) => {
  const normalizedToday = normalizeDate(today);
  let firstValidIndex: number | null = null;
  let lastOnOrBefore: number | null = null;

  weeks.forEach((week, index) => {
    const meetingDate = parseMeetingDate(week.meetingDate);

    if (!meetingDate) {
      return;
    }

    const normalizedMeetingDate = normalizeDate(meetingDate);

    if (firstValidIndex === null) {
      firstValidIndex = index;
    }

    if (normalizedMeetingDate <= normalizedToday) {
      lastOnOrBefore = index;
    }
  });

  if (lastOnOrBefore !== null) {
    return lastOnOrBefore;
  }

  return firstValidIndex;
};

const revealStyle = (delay: number): CSSProperties => ({
  animationDelay: `${delay}ms`,
});

const renderWeekItems = (
  weekTitle: string,
  items: WeekItem[],
  keyPrefix: string,
  listType: "ul" | "ol",
) => {
  const ListTag = listType;

  return (
    <ListTag>
      {items.map((item, itemIndex) => {
        const itemStyle = {
          "--stagger": `${itemIndex}`,
        } as CSSProperties;

        if (typeof item === "string") {
          return (
            <li key={`${keyPrefix}-${weekTitle}-${itemIndex}`} style={itemStyle}>
              {renderTextWithLineBreaks(item)}
            </li>
          );
        }

        return (
          <li key={`${keyPrefix}-${weekTitle}-${item.href}`} style={itemStyle}>
            {renderTextWithLineBreaks(item.label)}:{" "}
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              {renderTextWithLineBreaks(item.href)}
            </a>
          </li>
        );
      })}
    </ListTag>
  );
};

export default function ScheduleWeeks({ weeks }: ScheduleWeeksProps) {
  const detailsRefs = useRef<Array<HTMLDetailsElement | null>>([]);

  useEffect(() => {
    const currentWeekIndex = getCurrentWeekIndex(weeks, new Date());

    if (currentWeekIndex === null) {
      return;
    }

    const details = detailsRefs.current[currentWeekIndex];

    if (details) {
      details.open = true;
    }
  }, [weeks]);

  return (
    <div className="weeks">
      {weeks.map((week, index) => {
        const meetingAgendaItems = week.meetingAgendaItems ?? [];
        const assignmentItems = week.assignmentItems ?? [];

        return (
          <details
            key={week.title}
            className="week reveal"
            style={revealStyle(80 + index * 60)}
            ref={(node) => {
              detailsRefs.current[index] = node;
            }}
          >
            <summary>{week.title}</summary>
            <div className="week__content">
              <div className="week__section">
                <div className="week__section-header">
                  <h3 className="week__section-title">Meeting Agenda</h3>
                  <div className="week__meeting">
                    <span className="week__meeting-label">Meeting date</span>
                    <span className="week__meeting-value">
                      {renderTextWithLineBreaks(week.meetingDate)}
                    </span>
                  </div>
                </div>
                {meetingAgendaItems.length > 0 ? (
                  renderWeekItems(week.title, meetingAgendaItems, "agenda", "ul")
                ) : (
                  <p className="week__empty">No meeting agenda yet.</p>
                )}
              </div>
              <div className="week__section">
                <div className="week__section-header">
                  <h3 className="week__section-title">Assignments</h3>
                  <div className="week__due">
                    <span className="week__due-label">Due date</span>
                    <span className="week__due-value">
                      {renderTextWithLineBreaks(week.dueDate)}
                    </span>
                  </div>
                </div>
                {assignmentItems.length > 0 ? (
                  renderWeekItems(
                    week.title,
                    assignmentItems,
                    "assignment",
                    "ol",
                  )
                ) : (
                  <p className="week__empty">No assignments yet.</p>
                )}
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
