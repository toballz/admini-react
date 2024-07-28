//import logo from './logo.svg'; 
import React , { useState   }   from 'react';
import {EventCalendar,WEEKDAYS,httpPost,todayDate } from "./functions.tsx";
import {format} from "date-fns";



//
//
const pagesNav={
  appointments:{
    name:"appointments", array:[]
  },
  settings:{
    name:"settings", array:{}
  },
  availability:{
    name:"availability", array:{}
  },
} ;

//
//render app


function App() {
  //
  const [showTabNavigation, setshowTabNavigation] = useState('firstpage');
  const [availabilityInputs, setInputs] = useState({sunday: '', monday: '', tuesday: '', wednesday: '',thursday:'',friday:'', saturday: ''});
  const [fromTodayDateFurther, setFromTodayDateFurther] = useState([]);
 //
 //
 //***********************
  const bottomNavClickPage = async (divName) => {
    if(divName===pagesNav.appointments.name){
      
      const httpResponse = await httpPost({'cros': 'getterCross',
        'getDatesAppointmentsMoreThanDate': "2",
        'dateTo': format(todayDate, "yyyyMMdd")});
        
     if(httpResponse !== null){
      const gasg=(await httpResponse.json());
      const formattedDates = gasg.map(date => {
        return `${date.year}${date.month}${date.day}`;
      });
      setFromTodayDateFurther(JSON.stringify(formattedDates));
     }
     //******************
    }else if(divName===pagesNav.availability.name){
      const httpResponse = await httpPost({'cros':"getterCross",'getweeklyStatic': "2",'had': "a"});
      if (httpResponse !== null) {
        pagesNav.availability.array= await httpResponse.json();
        
        const updatedInputs = WEEKDAYS.reduce((acc, day) => ({
          ...acc,
          [day.toLowerCase()]: pagesNav.availability.array[day.toLowerCase()],
        } ), {});
        setInputs({
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
  
      setInputs({
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
              <button className='btn btn-primary' onClick={() => bottomNavClickPage(pagesNav.appointments.name)} style={{width:'100%',padding:'12px'}}>View appointments</button>
            </div>
          </div>
        </section>
        }

        {showTabNavigation === pagesNav.appointments.name &&
        //page [appointments]
        <section  >
            <div className="container mt-5">
                <h2 style={{textAlign:'center'}}>Upcoming Appointments</h2>
                <EventCalendar
              events={fromTodayDateFurther}/>
            </div>
        </section>}

        {showTabNavigation === pagesNav.settings.name &&
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



        {showTabNavigation === pagesNav.availability.name &&
        //availability
        <section>
            <div className="container mt-5">
                <div className="container mt-5">
                    <h2>Weekly schedules</h2>
                    <p>Leave empty for unavailability (24hrs clock)</p>

                    <div className="form-group schld-days-ofweek">
                        <label htmlFor="sunday">Sunday:</label>
                        <input placeholder="0845, 1230, 1540, 2000, 0000" type="text" className=" form-control" id="sunday" name="sunday" value={ availabilityInputs.sunday} onChange={timeWriterOnchange}/>
                    </div>
                    <div className="form-group schld-days-ofweek">
                        <label htmlFor="monday">Monday:</label>
                        <input placeholder="0845, 1230, 1540, 2000, 0000" type="text" className=" form-control" id="monday" name="monday" value={availabilityInputs.monday} onChange={timeWriterOnchange}/>
                    </div>
                    <div className="form-group schld-days-ofweek">
                        <label htmlFor="tuesday">Tuesday:</label>
                        <input placeholder="0845, 1230, 1540, 2000, 0000" type="text" className=" form-control" id="tuesday" name="tuesday" value={availabilityInputs.tuesday} onChange={timeWriterOnchange}/>
                    </div>
                    <div className="form-group schld-days-ofweek">
                        <label htmlFor="wednesday">Wednesday:</label>
                        <input placeholder="0845, 1230, 1540, 2000, 0000" type="text" className=" form-control" id="wednesday" name="wednesday" value={availabilityInputs.wednesday} onChange={timeWriterOnchange}/>
                    </div>
                    <div className="form-group schld-days-ofweek">
                        <label htmlFor="thursday">Thursday:</label>
                        <input placeholder="0845, 1230, 1540, 2000, 0000" type="text" className=" form-control" id="thursday" name="thursday" value={availabilityInputs.thursday} onChange={timeWriterOnchange}/>
                    </div>
                    <div className="form-group schld-days-ofweek">
                        <label htmlFor="friday">Friday:</label>
                        <input placeholder="0845, 1230, 1540, 2000, 0000" type="text" className=" form-control" id="friday" name="friday" value={availabilityInputs.friday} onChange={timeWriterOnchange}/>
                    </div>
                    <div className="form-group schld-days-ofweek">
                        <label htmlFor="saturday">Saturday:</label>
                        <input placeholder="0845, 1230, 1540, 2000, 0000" type="text" className="form-control" id="saturday" name="saturday" value={availabilityInputs.saturday} onChange={timeWriterOnchange}/>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-3 p-3 saveweeklyschedules" >Update Weekly</button>

                    <h2 className="mt-5">Override Schedules</h2>
                    <div className="mt-4" id="overridecalendar"></div>
                    <p className="mt-4">Click a date and enter only the time(s) you will be available for that date.<br /><br />Leave empty for unavailability (24hrs clock)</p> 

                    <input type="text" placeholder="0920, 1230, 1400,1845" className="text-success form-control mb-2" id="updateoverride" name="updateoverride" />

                    <ul className="list-group overrideitemslist"> </ul>

                    <button type="submit" className="btn btn-primary w-100 mt-3 p-3 addoverridebtnclick">Add Override</button>
                </div>
            </div>
        </section>
        }






      </main>


       <footer style={{position: 'fixed',bottom: '0',left: '0',width: '100%'}}>
          <nav className="bg-light  navbar ">
            <div className='container'>
              <button onClick={() => bottomNavClickPage(pagesNav.appointments.name)} className='nav-link btn-href'><i className="bi bi-house"></i><span className="d-block navb-fs">Appointments</span> </button>
              <button onClick={() => bottomNavClickPage(pagesNav.availability.name)} className='nav-link btn-href'><i className="bi bi-calendar-week"></i><span className="d-block navb-fs">Availability</span> </button>
              <button className='nav-link btn-href'><i className="bi bi-bar-chart"></i> <span className="d-block navb-fs">Stats</span> </button>
              <button  onClick={() => bottomNavClickPage(pagesNav.settings.name)} className='nav-link btn-href'><i className="bi bi-gear"></i><span className="d-block navb-fs">Settings</span></button>
            </div>
          </nav>
       </footer>
    </>
  );
}

export default App;