// npm run build
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
} from "date-fns";
import React, {useState } from "react";

export const domain = "http://cocohairsignature.com",
  apiM = domain + "/159742f243a05f0733d5d6497fd3f947/app/apim.php",
  todayDate = new Date(),
  WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

 
export async function httpPost(params: { [key: string]: string }) {
  var formData = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    formData.append(key, value);
  }

  const httpResponse = await fetch(apiM, {
    redirect: "follow",
    method: "post",
    headers: {
      //'Content-Type': 'application/json',
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });
  if (httpResponse.ok) {
    return httpResponse;
  } else {
    return null;
  }
}

interface EventCalendarProps {
  events: number[];
  onclicked;
  activeCalendarButtonPass;
  blockedDates;
}
export const EventCalendar = ({
  events,
  onclicked,
  activeCalendarButtonPass,
  blockedDates = ["20240101"],
}: EventCalendarProps) => {
  const [firstDayOfMonth, setfirstDayOfMonth] = useState(
    startOfMonth(todayDate)
  );
  const [lastDayOfMonth, setlastDayOfMonth] = useState(endOfMonth(todayDate));

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const getNextorPreviousMonthDate = (r: number) => {
    const nextMonth = new Date(firstDayOfMonth);
    nextMonth.setMonth(firstDayOfMonth.getMonth() + r);
    nextMonth.setDate(1);

    // If adding one month results in a day that's out of range (e.g., from Jan 31 to Feb), adjust the date
    // if (nextMonth.getDate() < now.getDate()) {
    //   nextMonth.setDate(0); // Go to the last day of the previous month
    // }

    return nextMonth;
  };

  return (
    <div className="mx-auto rounded p-2 pb-3 eventcalendar-parent">
      <div className="mb-4 d-flex flex-row justify-content-between">
        <button
          className="btn p-1"
          onClick={() => {
            setfirstDayOfMonth(startOfMonth(getNextorPreviousMonthDate(-1)));
            setlastDayOfMonth(endOfMonth(getNextorPreviousMonthDate(-1)));
            activeCalendarButtonPass.set(null);
          }}
        >
          <i className="bi bi-caret-left"></i>
        </button>
        <span className="fw-bold">{format(firstDayOfMonth, "MMMM yyyy")}</span>
        <button
          className="btn p-1"
          onClick={() => {
            setfirstDayOfMonth(startOfMonth(getNextorPreviousMonthDate(1)));
            setlastDayOfMonth(endOfMonth(getNextorPreviousMonthDate(1)));
            activeCalendarButtonPass.set(null);
          }}
        >
          <i className="bi bi-caret-right"></i>
        </button>
      </div>

      <div className="eventcalendar-grid">
        {WEEKDAYS.map((day) => {
          //name of week
          return (
            <div key={day}>
              <b>{day.substring(0, 3)}</b>
            </div>
          );
        })}
        {Array.from({ length: getDay(firstDayOfMonth) }).map((_, index) => {
          //space not day of week in month
          return (
            <div key={`empty-${index}`}><div className="border rounded-circle p-2 notactive eventcalendar-numdays"></div></div>
          );
        })}
        {daysInMonth.map((day, index) => {
          //day of week in month
          const dateKey = format(day, "yyyyMMdd");
          const isEventy = events.includes(Number(dateKey));
          function formatBlockedDates(dateComapre) {
            const formattedDate = dateComapre.toString(); // Ensure date is in string format
            if (blockedDates.includes(formattedDate)) {
              return true;
            }
            // Check if the date is within any of the blocked ranges
            for (const range of blockedDates) {
              if (range.includes("-")) {
                // Check if the range contains a dash
                const [start, end] = range.split("-");
                if (formattedDate >= start && formattedDate <= end) {
                  return true;
                }
              }
            }
          }
          const isNotActive = !isEventy
            ? formatBlockedDates(dateKey) ||
              parseInt(dateKey) < parseInt(format(todayDate, "yyyyMMdd"))
            : false;
          return (
            <div
              key={index}
              onClick={() =>
                isNotActive
                  ? ()=>{return;}
                  : onclicked(index, Number(dateKey))
                       

                       
              }
            >
              <div
                className={`border rounded-circle p-2 ${
                  isToday(day) ? "bg-warning text-light " : ""
                }${isNotActive ? "notactive " : ""}eventcalendar-numdays${
                  activeCalendarButtonPass.get === index ? " active" : ""
                }`}
              >
                {format(day, "d")}
              </div>
              {isEventy ? (
                <div key={index} className="eventcalendar-eventn"></div>
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
