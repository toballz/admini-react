import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
} from "date-fns";
import React, { useState } from "react"; 

const domain="http://cocohairsignature.com",
apiM=domain+"/159742f243a05f0733d5d6497fd3f947/app/apim.php"


export const WEEKDAYS = ["Sundat", "Mondat", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export async function httpPost(params:string|number){
    var formData = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        formData.append(key,  value );
    }

    const httpResponse = await fetch(apiM, {
      redirect: "follow",
      method: 'post',
      headers: {
        //'Content-Type': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
    return httpResponse;
}


interface EventCalendarProps {
  events: number[];
}

export const EventCalendar = ({ events }: EventCalendarProps) => {
  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);
  const [activeButton, setActiveButton] = useState(null);

  const getthisDayAppointmentList = (buttonId,input: number) => {
    setActiveButton(buttonId);
    
     //alert(input);
  };
   
  return (
    <div className="container mx-auto p-4 eventcalendar-parent">
      <div className="mb-4">
        <h2>{format(currentDate, "MMMM yyyy")}</h2>
      </div>
      <div className="eventcalendar-grid">
        {WEEKDAYS.map((day) => {
          //name of week
          return (<div key={day}><b>{day}</b></div>);
        })}
        {Array.from({ length: startingDayIndex }).map((_, index) => {
          //space not day of week in month
          return (
            <div key={`empty-${index}`}
              className="border rounded-md p-2" />
          );
        })}
        {daysInMonth.map((day, index) => {
          //day of week in month
          const dateKey = format(day, "yyyyMMdd");
          const isEventy=events.includes(Number(dateKey));
          return (<div key={index}> 
                    <div onClick={() => isEventy?getthisDayAppointmentList(index,Number(dateKey)):()=>{}}>
                        <div className={`border rounded-circle p-2 ${isToday(day)?"bg-warning text-light ":""}${!isEventy?"notactive ":""}eventcalendar-numdays${activeButton === index ? ' active' : ''}`}>{format(day, "d")}</div>
                        {isEventy?<div key={index} className="eventcalendar-eventn"></div>:""}
                    </div>
                </div>);
        })}
      </div>
    </div>
  );
};

   