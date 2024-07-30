//import logo from './logo.svg'; 
import React , { useState   }   from 'react';
import {EventCalendar,WEEKDAYS,httpPost,todayDate,ShowModal } from "./functions.tsx";
import {format} from "date-fns";



//
//
const pagesNav={
  appointments:"appointments" ,
  settings:"settings",
  availability:"availability" 
}; 

//
//render app


function App() {
  //
  const [showTabNavigation, setshowTabNavigation] = useState('firstpage');
  const [availabilityInputs, setAvailabilityInputs] = useState( WEEKDAYS.reduce((acc, day) => ({ ...acc, [day]: '' }), {}));
   const [fromTodayDateFurther, setFromTodayDateFurther] = useState([]);
  const [ModalShowV, setModalShowV] = useState(null);
  //
 //
 //***********************
  const bottomNavClickPage = async (divName) => {
    if(divName===pagesNav.appointments){
      const httpResponse = await httpPost({'cros': 'getterCross',
        'getDatesAppointmentsMoreThanDate': "2",
        'dateTo': "20240707"});
        //'dateTo': format(todayDate, "yyyyMMdd")});
        
     if(httpResponse !== null){
      const gasg=(await httpResponse.json());
      const formattedDates = gasg.map(date => {
        return `${date.year}${date.month}${date.day}`;
      });
      setFromTodayDateFurther(JSON.stringify(formattedDates));
     }
     //******************
    }else if(divName===pagesNav.availability){
      const httpResponse = await httpPost({'cros':"getterCross",'getweeklyStatic': "2",'had': "a"});
      if (httpResponse !== null) {
        const httpJson= await httpResponse.json();
        
        const updatedInputs = WEEKDAYS.reduce((acc, day) => ({
          ...acc,
          [day.toLowerCase()]: httpJson[day.toLowerCase()],
        } ), {});
        setAvailabilityInputs({
          ...availabilityInputs,
          ...updatedInputs
        });
      } 
    }
    
    setshowTabNavigation(divName);
  };
  // 
 
  //
  //input preg 24hrs time
  const timeWriterOnchange = (e) => {
    const { name, value } = e.target;

    // Format the value as comma-separated values
    const formattedValue = value.replace(/\D+/g, '') 
      .replace(/(\d{4})(?=\d)/g, '$1, '); // Add commas every 4 digits
  
      setAvailabilityInputs({
        ...availabilityInputs,
        [name]: formattedValue,
      });
    };

  //
  //
  //
  //**************
  return (
    <>
    {ModalShowV !== null && <ModalShowV />}
      
      <header>  </header>

      <main>
        {showTabNavigation === "firstpage" &&
        //first page
        <section>
          <div className="container mt-5" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'70vh',textAlign:'center'}} >
            <div>
              <h1>Welcome back</h1>
              <p>cocohairsignature.com</p>
              <br/>
              <button className='btn btn-primary' onClick={() => bottomNavClickPage(pagesNav.appointments)} style={{width:'100%',padding:'12px'}}>View appointments</button>
            </div>
          </div>
        </section>
        }

        {showTabNavigation === pagesNav.appointments &&
        //page [appointments]
        <section  >
            <div className="container mt-5">
                <h2 style={{textAlign:'center'}}>Upcoming Appointments</h2>
                <EventCalendar
              events={fromTodayDateFurther} setModalShowPass={setModalShowV}/>
            </div>
        </section>}

        {showTabNavigation === pagesNav.settings &&
        //page [settings]
        <section  >
            <div className="container mt-5">
                <div className="list-group settingsj">
                    <div className="list-group-item list-group-item-action settingsj-sunmoon"><span><i className="bi bi-bell"></i>Notifications </span><i className="bi bi-toggle-off"></i></div>

                    <br />
                    <div className="list-group-item list-group-item-action settingsj-sunmoon" onClick={()=>{window.sharparp.push({ title: window.sharparp.option.title.href, value: "https://stripe.com/" })}}><span>View payments - stripe.com </span><i className="bi bi-box-arrow-up-right"></i></div>
                    <div className="list-group-item list-group-item-action settingsj-sunmoon" onClick={()=>{window.sharparp.push({ title: window.sharparp.option.title.href, value: "https://cocohairsignature.com/" }) }}><span>cocohairsignature.com </span><i className="bi bi-box-arrow-up-right"></i></div>
                    <br />

                    <div className="list-group-item list-group-item-action">
                        <i className="bi bi-person"></i> <span>Profile</span>
                      </div>

                    <div className="list-group-item list-group-item-action signoutClick">
                        <i className="bi bi-box-arrow-right"></i> Sign Out
                    </div>
                </div>
            </div>
        </section>}



        {showTabNavigation === pagesNav.availability &&
        //availability
        <section>
            <div className="container mt-5">
                <div className="container mt-5">
                    <h2>Weekly schedules</h2>
                    <p>Leave empty for unavailability (24hrs clock)</p>
                    {WEEKDAYS.map((day, index) => (
                      <div className="form-group schld-days-ofweek" key={day}>
                          <label htmlFor={day.toLowerCase()}>{day}:</label>
                          <input placeholder="0845, 1230, 1540, 2000, 0000" type="text"
                            className="form-control" id={day.toLowerCase()}
                            name={day.toLowerCase()} value={ availabilityInputs[day.toLowerCase()]} onChange={timeWriterOnchange}/>
                      </div>
                    ))}

                    <button type="submit" className="btn btn-primary w-100 mt-3 p-3 saveweeklyschedules"
                      onClick={()=>setModalShowV(() => () =>
                        ShowModal({body:<>Do you want to save the weekly schedules.</>,
                          okbtn:"Save",okbtnFunc:()=>{
                                WEEKDAYS.forEach(day => {
                                    const dayKey = day.toLowerCase();
                                    const inputValue = availabilityInputs[dayKey];
                                    const matches = inputValue.match(/(\d{4})(?=, )/g);
                                     if(matches || inputValue===""){
                                      alert(`${day}: ${inputValue}`);
                                      
                                     }
                                  });
                              
                          },
                          closebtnFunc:()=>{setModalShowV(null)}})
                      )}>Update Weekly</button>

                    <h2 className="mt-5">Override Schedules</h2>
                    <div className="mt-4" id="overridecalendar"></div>
                    <p className="mt-4">Click a date and enter only the time(s) you will be available for that date.<br /><br />Leave empty for unavailability (24hrs clock)</p> 

                    <input type="text" placeholder="0920, 1230, 1400,1845" className="text-success form-control mb-2" id="updateoverride" name="updateoverride" />

                    <ul className="list-group overrideitemslist"> </ul>

                    <button type="submit" className="btn btn-primary w-100 mt-3 p-3 addoverridebtnclick"
                      onClick={()=>setModalShowV(() => () =>
                        ShowModal({body:"Do you want to override this date(s).",
                          okbtn:"Save",okbtnFunc:()=>{alert();},
                          closebtn:"Close",closebtnFunc:()=>{setModalShowV(null)}})
                      )}>Add Override</button>
                </div>
            </div>
        </section>
        }






      </main>


       <footer style={{position: 'fixed',bottom: '0',left: '0',width: '100%'}}>
          <nav className="bg-light navbar ">
            <div className='container'>
              <button onClick={() => bottomNavClickPage(pagesNav.appointments)} className='nav-link btn-href'><i className="bi bi-house"></i><span className="d-block navb-fs">Appointments</span> </button>
              <button onClick={() => bottomNavClickPage(pagesNav.availability)} className='nav-link btn-href'><i className="bi bi-calendar-week"></i><span className="d-block navb-fs">Availability</span> </button>
              <button className='nav-link btn-href'><i className="bi bi-bar-chart"></i> <span className="d-block navb-fs">Stats</span> </button>
              <button  onClick={() => bottomNavClickPage(pagesNav.settings)} className='nav-link btn-href'><i className="bi bi-gear"></i><span className="d-block navb-fs">Settings</span></button>
            </div>
          </nav>
       </footer>
    </>
  );
}

export default App;