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

interface ShowModalOptions {
  body: React.ReactNode; closebtnFunc: () => void;
  title?: string; closebtn?: string; okbtn?: string;  okbtncolor?: string; okbtnFunc?: () => void;


}
///!options.title || !options.body || !options.ok || !options.okFunc
export const ShowModal = ({ body, closebtnFunc,
  title = "Alert", closebtn = "Close", okbtn = "",okbtnFunc=()=>{},okbtncolor = "btn-primary"
}: ShowModalOptions) => {
  return (
    <>
      <div className="modal fade show" tabIndex={-1} role="dialog" aria-labelledby="111" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
            </div>
            <div className="modal-body">{body}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closebtnFunc}>{closebtn}</button>
              {(okbtn !== "")?<button type="button" className={"btn " + okbtncolor} onClick={okbtnFunc}>{okbtn}</button>:""}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}






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
  setModalShowPass;
}

export const EventCalendar = ({ events, setModalShowPass }: EventCalendarProps) => {
  const firstDayOfMonth = startOfMonth(todayDate);
  const lastDayOfMonth = endOfMonth(todayDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);
  const [scedulesBookedList, setBookedList] = useState([]);
  const [activeCalendarButton, setActiveCalendarButton] = useState(null);

  const getthisDayAppointmentList = async (buttonId, datetoget: number) => {
    setActiveCalendarButton(buttonId);
    const httpResponse = await httpPost({ 'cros': "getterCross", 'getDatesAppointmentsSpecDate': "2", 'dateFrom': "" + datetoget });
    //alert(input);
    if (httpResponse !== null) {
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
          return (<div key={day}><b>{day.substring(0, 3)}</b></div>);
        })}
        {Array.from({ length: startingDayIndex }).map((_, index) => {
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
            setModalShowPass(() => () =>ShowModal({
                title: "Receipt",
                body: <>
                      <div className="modal-body">
                        <div className="w-100 "><img className="w-100" style={{paddingLeft:'50px',paddingRight:'50px'}} src={`${domain}/img/${receiptHttp['image']}.jpg?a47`} /></div>
                        <ul className="list-group mt-3 listeceiptul">
                          <li><span>Name</span><span>{receiptHttp['customername']}</span></li>
                          <li><span>Phone</span><span style={{color:'blue'}}>{receiptHttp['phonne']}</span></li>
                          <li><span>Email</span><span style={{color:'blue'}}>{receiptHttp['email']}</span></li>
                          <li><span>Hairstyle</span><span>{receiptHttp['hairstyle']}</span></li>
                          <li><span>Price</span><span>{receiptHttp['price']}</span></li>
                          <li><span>Date</span><span style={{color:'green'}}>{format(parse(receiptHttp['date'], 'yyyyMMdd', new Date()), 'eeee d MMMM yyyy')}</span></li>
                          <li><span>Time</span><span style={{color:'green'}}>{format(receiptHttp['time'], 'hh:mm a')}</span></li>
                        </ul>
                      </div>
                      </>,
                okbtn: "Delete this Appointment", okbtncolor: "btn-danger", okbtnFunc: () => { },
                closebtnFunc: () => { setModalShowPass(null) }
              })
                    );
          }else{
            setModalShowPass(() => () =>ShowModal({body:<>Error getting receipt.</>,closebtnFunc:() => { setModalShowPass(null) }}));
          }}}>
  <div className="container d-flex flex-row align-items-center mt-4">
    <div style={{ flex: '2', maxWidth: '120px' }}> <img src={appointment['imageUrl']} alt="Hair Style" /></div>

    <div className="mx-3 appointmentbookedlist">
      <div className="appointmentbookedlist">{appointment['hairname']}</div>
      <div className="mt-1 text-success"><b>{appointment['datetime']}</b></div>
    </div>

    <div style={{ flex: '1' }}><i className="bi bi-eye"></i></div>
  </div>
                </div >);
        })}
        </div >
      
    </div >
  );
};

