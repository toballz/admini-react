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
apiM=domain+"/159742f243a05f0733d5d6497fd3f947/app/apim.php";


export const todayDate= new Date();
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

 


 
  


export async function httpPost(params:{[key: string]: string  }){
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
    if (httpResponse.ok) {
        return httpResponse;
    }else{
        return null;
    }
}


interface EventCalendarProps {
  events: number[];
}

export const EventCalendar = ({ events }: EventCalendarProps) => {
  const firstDayOfMonth = startOfMonth(todayDate);
  const lastDayOfMonth = endOfMonth(todayDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);
  const [scedulesBookedList, setBookedList] = useState([]);
  const [activeCalendarButton, setActiveCalendarButton] = useState(null);

  const getthisDayAppointmentList =  async (buttonId,datetoget: number) => {
    setActiveCalendarButton(buttonId);
    const httpResponse = await httpPost({'cros':"getterCross", 'getDatesAppointmentsSpecDate': "2", 'dateFrom': ""+datetoget});
     //alert(input);
     if(httpResponse !== null){ 
        setBookedList(await httpResponse.json()); 
     }
    
  };
   
  return (
    <div className="container mx-auto p-4 eventcalendar-parent">
      <div className="mb-4">
        <h2>{format(todayDate, "MMMM yyyy")}</h2>
      </div>
      
      
      <div className="eventcalendar-grid">
        {WEEKDAYS.map((day) => {
          //name of week
          return (<div key={day}><b>{day.substring(0,3)}</b></div>);
        })}
        {Array.from({ length: startingDayIndex }).map((_, index) => {
          //space not day of week in month
          return ( <div key={`empty-${index}`} className="border rounded-md p-2" /> );
        })}
        {daysInMonth.map((day, index) => {
          //day of week in month
          const dateKey = format(day, "yyyyMMdd");
          const isEventy=events.includes(Number(dateKey));
          return (<div key={index}> 
                    <div onClick={() => isEventy?getthisDayAppointmentList(index,Number(dateKey)):()=>{}}>
                        <div className={`border rounded-circle p-2 ${isToday(day)?"bg-warning text-light ":""}${!isEventy?"notactive ":""}eventcalendar-numdays${activeCalendarButton === index ? ' active' : ''}`}>{format(day, "d")}</div>
                        {isEventy?<div key={index} className="eventcalendar-eventn"></div>:""}
                    </div> 
                </div>);
        })}
      </div>


        <div className="mt-5"> {scedulesBookedList.map((appointment, index) => {
          //day of week in month  
          return (<div key={index}>
                    <div className="container d-flex flex-row align-items-center mb-4">
                        <div style={{flex:'2',maxWidth:'120px'}}> <img src={appointment['imageUrl']} alt="Hair Style" /></div> 
                        
                        <div className="mx-3 appointmentbookedlist">: {appointment['hairname']}</div>
                        
                        <div style={{flex:'1'}}><i className="bi bi-eye"></i></div>
                    </div>
                </div >);
        })}
        </div>
      
    </div>
  );
};

   