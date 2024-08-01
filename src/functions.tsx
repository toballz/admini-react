import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  parse,
  startOfMonth,
} from "date-fns";
import React, { useState } from "react";


const domain = "http://cocohairsignature.com",
  apiM = domain + "/159742f243a05f0733d5d6497fd3f947/app/apim.php";

export const todayDate = new Date();
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

 




export async function httpPost(params: { [key: string]: string }) {
  var formData = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    formData.append(key, value);
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
  } else {
    return null;
  }
}


interface EventCalendarProps {
  events: number[];
  setShowModalPassArg;
}

function copyPhoneEmail(phoneEmail, type){
  try{
    navigator.clipboard.writeText(phoneEmail);
    window.location.href=`${(type==="phone")?'tel':'mailto'}:${phoneEmail}`
  }catch(e){
    navigator.clipboard.writeText(phoneEmail);
  } 
}
export const EventCalendar = ({ events, setShowModalPassArg }: EventCalendarProps) => {
  const [firstDayOfMonth, setfirstDayOfMonth] = useState(startOfMonth(todayDate)); 
  const [lastDayOfMonth, setlastDayOfMonth] = useState(endOfMonth(todayDate));  

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });
 
  const [scedulesBookedList, setBookedList] = useState([]);
  const [activeCalendarButton, setActiveCalendarButton] = useState(null);
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
  const getthisDayAppointmentList = async (buttonId, datetoget: number) => {
    setActiveCalendarButton(buttonId);
    const httpResponse = await httpPost({ 'cros': "getterCross", 'getDatesAppointmentsSpecDate': "2", 'dateFrom': "" + datetoget });
    //alert(input);
    if (httpResponse !== null) {
      setBookedList(await httpResponse.json());
    }

  };

  return (
    <div className="container mx-auto rounded p-4 eventcalendar-parent">
      <div className="mb-4 d-flex flex-row justify-content-between">
        <button className="btn" onClick={
          ()=>{ 
            setfirstDayOfMonth(startOfMonth(getNextorPreviousMonthDate(-1)));
            setlastDayOfMonth(endOfMonth(getNextorPreviousMonthDate(-1)));
            setActiveCalendarButton(null);
          }
        }><i className="bi bi-caret-left"></i></button>
        <span className="fw-bold">{format(firstDayOfMonth, "MMMM yyyy")}</span>
        <button className="btn" onClick={
          ()=>{
            setfirstDayOfMonth(startOfMonth(getNextorPreviousMonthDate(1)));
            setlastDayOfMonth(endOfMonth(getNextorPreviousMonthDate(1)));
            setActiveCalendarButton(null);
          }
        }><i className="bi bi-caret-right"></i></button>
      </div>


      <div className="eventcalendar-grid">
        {WEEKDAYS.map((day) => {
          //name of week
          return (<div key={day}><b>{day.substring(0, 3)}</b></div>);
        })}
        {Array.from({ length: getDay(firstDayOfMonth) }).map((_, index) => {
          //space not day of week in month
          return (<div key={`empty-${index}`} className="border rounded-md p-2" />);
        })}
        {daysInMonth.map((day, index) => {
          //day of week in month
          const dateKey = format(day, "yyyyMMdd");
          const isEventy = events.includes(Number(dateKey));
          return (<div key={index} onClick={() => isEventy ? getthisDayAppointmentList(index, Number(dateKey)) : () => { }}>
            <div className={`border rounded-circle p-2 ${isToday(day) ? "bg-warning text-light " : ""}${!isEventy ? "notactive " : ""}eventcalendar-numdays${activeCalendarButton === index ? ' active' : ''}`}>{format(day, "d")}</div>
            {isEventy ? <div key={index} className="eventcalendar-eventn"></div> : ""}
          </div>);
        })}
      </div>


      <div className="mt-5"> {scedulesBookedList.map((appointment, index) => {
        //day of week in month  
        return (<div key={index} className="mb-4" style={(index !== 0) ? { borderTop: '1px solid #ccc' } : {}}
          onClick={async () => {
            const receiptHttpResopnse =await httpPost({ cros: "getterCross", receiptIIinfo: appointment['orderId'], j: "1" });
            if(receiptHttpResopnse !== null){
              const receiptHttp=(await receiptHttpResopnse.json());
              setShowModalPassArg({
                visible:true,
                title: "Receipt",
                body: <>
                      <div className="modal-body">
                        <div className="w-100"><img className="w-100" style={{paddingLeft:'50px',paddingRight:'50px'}} src={`${domain}/img/${receiptHttp['image']}.jpg?a47`} alt={receiptHttp['hairstyle']}/></div>
                        <ul className="list-group mt-3 listeceiptul">
                          <li><span>Name</span><span>{receiptHttp['customername']}</span></li>
                          <li><span>Phone</span><span style={{color:'blue'}} onClick={()=>copyPhoneEmail(receiptHttp['phonne'],"phone")}>{receiptHttp['phonne']}</span></li>
                          <li><span>Email</span><span style={{color:'blue'}} onClick={()=>{copyPhoneEmail(receiptHttp['email'],"email")}}>{receiptHttp['email']}</span></li>
                          <li><span>Hairstyle</span><span>{receiptHttp['hairstyle']}</span></li>
                          <li><span>Price</span><span>{receiptHttp['price']}</span></li>
                          <li><span>Date</span><span style={{color:'green'}}>{format(parse(receiptHttp['date'], 'yyyyMMdd', new Date()), 'eeee d MMMM yyyy')}</span></li>
                          <li><span>Time</span><span style={{color:'green'}}>{format(receiptHttp['time'], 'hh:mm a')}</span></li>
                        </ul>
                      </div>
                      </>,
                okText: "Delete this Appointment",
                okColor: "btn-danger",
                okFunc: () => {
                  setShowModalPassArg({
                  visible:true,
                  body:<>
                        <div><b>Name: </b>{receiptHttp['customername']}</div>
                        <div><b>Hairstyle: </b>{receiptHttp['hairstyle']}</div>
                        <div><b>Phone: </b>{receiptHttp['phonne']}</div>
                        <div><b>Email: </b>{receiptHttp['email']}</div>
                      </>,
                  header:"Delete this appointment? Are you sure?",
                  okColor: "btn-danger",
                  okText: "Delete this Appointment", 
                  okFunc: () => {
                    httpPost({cros: '1',
                      deleteAppointment: '2',
                      ksy: appointment['orderId']}).then((deleteResponse)=>{
                        if(deleteResponse !== null){
                          setShowModalPassArg({visible:false});
                          setTimeout(function(){
  
                            window.location.reload();
                          },1000);
                        }
                      });
                      
                  }});
                }
              });
          }else{
            setShowModalPassArg({visible:true, header:<>Error !!!</>,body:(<>Error getting receipt.</>)});
          }}}>

          {activeCalendarButton !== null && <div className="container d-flex flex-row align-items-center mt-4">
            <div style={{ flex: '2', maxWidth: '120px' }}> <img src={appointment['imageUrl']} alt={appointment['hairname']} /></div>

            <div className="mx-3 appointmentbookedlist">
              <div className="appointmentbookedlist">{appointment['hairname']}</div>
              <div className="mt-1 text-success"><b>{appointment['datetime']}</b></div>
            </div>

            <div style={{ flex: '1' }}><i className="bi bi-eye"></i></div>
          </div>}

         </div >);
        })}
        </div >
      
    </div >
  );
};

