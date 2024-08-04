//import logo from './logo.svg';
import React, { useEffect, useState } from "react";
import {
  EventCalendar,
  WEEKDAYS,
  httpPost,
  todayDate,
  domain,
} from "./functions.tsx";
import { format, parse } from "date-fns";
import { Modal, Navbar, Dropdown } from "react-bootstrap";

//
//
const pagesNav = {
  appointments: "appointments",
  settings: "settings",
  edit: "edits",
  edit_weekly: "edit_weekly",
  edit_override: "edit_override",
  profile: "profile",
};

//
//render app

function App() {
  //
  const [showTabNavigation, setshowTabNavigation] = useState("firstpage");
  const [showEditNavigation, setshowEditNavigation] = useState(
    pagesNav.edit_weekly
  );
  const [availabilityInputs, setAvailabilityInputs] = useState(
    WEEKDAYS.reduce((acc, day) => ({ ...acc, [day.toLowerCase()]: "" }), {})
  );
  const [fromTodayDateFurther, setFromTodayDateFurther] = useState([]);

  //

  const [scedulesBookedList, setBookedList] = useState([]);
 //

  const [showModal, setshowModal] = useState({
    visible: false,
    header: <>header xxxxxxxxxx</>,
    body: <>Body xxxxxxxx</>,
    closeText: <></>,
    closeFunc: () => {},
    okText: <></>,
    okColor: "#xxxx",
    okFunc: () => {},
  });
  const [headerNav, setheaderNav] = useState({
    left: <></>,
    center: <></>,
    right: <></>,
  });
  //
  //
  //***********************
  const bottomNavClickPage = async (divName) => {
    setheaderNav({ left: null, center: null, right: null });
    if (divName === pagesNav.appointments) {
      const httpResponse = await httpPost({
        cros: "getterCross",
        getDatesAppointmentsMoreThanDate: "2",
        //'dateTo': "20240707"});
        dateTo: format(todayDate, "yyyyMMdd"),
      });

      if (httpResponse !== null) {
        const eventDatesBooked = await httpResponse.json();
        const eventDatesBookedToInt = eventDatesBooked.message.map((date) => {
          return parseInt(date, 10);
        });
        setFromTodayDateFurther(eventDatesBookedToInt);
      }
      //******************
    } else if (divName === pagesNav.edit) {
      setheaderNav({
        right: (
          <Dropdown>
            <Dropdown.Toggle
              as="div"
              bsPrefix="custom-toggle"
              variant="transparent"
            >
              {" "}
              <i className="bi bi-three-dots-vertical"></i>{" "}
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="p-2 fs-7">
              <Dropdown.Item
                onClick={() => setshowEditNavigation(pagesNav.edit_weekly)}
              >
                Weekly Schedules
              </Dropdown.Item>
              <hr className="m-1" />
              <Dropdown.Item
                onClick={() => setshowEditNavigation(pagesNav.edit_override)}
              >
                Override Specific Dates
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ),
      });
      const httpResponse = await httpPost({
        cros: "getterCross",
        getweeklyStatic: "2",
        had: "a",
      });
      if (httpResponse !== null) {
        const httpJson = await httpResponse.json();

        const updatedInputs = WEEKDAYS.reduce(
          (acc, day) => ({
            ...acc,
            [day.toLowerCase()]: httpJson[day.toLowerCase()],
          }),
          {}
        );
        setAvailabilityInputs({
          ...availabilityInputs,
          ...updatedInputs,
        });
      }
    }
    setshowTabNavigation(divName);
  };
  function copyPhoneEmail(phoneEmail, type) {
    try {
      navigator.clipboard.writeText(phoneEmail);
      window.sharparp.push({
        title: window.sharparp.option.title.href,
        value: (type === "phone" ? "tel" : "mailto") + ":" + phoneEmail,
      });
    } catch (e) {
      navigator.clipboard.writeText(phoneEmail);
    }
  } 
  //
  //input preg 24hrs time
  const timeWriterOnchange = (e) => {
    const { name, value } = e.target;

    // Format the value as comma-separated values
    const formattedValue = value
      .replace(/\D+/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1, "); // Add commas every 4 digits

    setAvailabilityInputs({
      ...availabilityInputs,
      [name]: formattedValue,
    });
  };

  useEffect(() => {
    const siOnline = () => setshowModal({ visible: false });
    const siOffline = () =>
      setshowModal({
        visible: true,
        title: "Warning !",
        body: <>No internet connection !</>,
        closeText: "Retry",
        closeFunc: () => {},
      });
    window.addEventListener("online", siOnline);
    window.addEventListener("offline", siOffline);
    return () => {
      window.removeEventListener("online", siOnline);
      window.removeEventListener("offline", siOffline);
    };
  }, []);

  //
  //
  //
  //**************
  //**************
  //**************
  //**************
  //**************
  //**************
  //**************
  //**************
  //**************
  //**************
  return (
    <>
      <header className="container">
        <Navbar expand="lg">
          <div>{headerNav.left && headerNav.left}</div>
          <div>{headerNav.center && headerNav.center}</div>
          <div>{headerNav.right && headerNav.right}</div>
        </Navbar>
      </header>

      <main className="container">
        {showTabNavigation === "firstpage" && (
          //first page
          <section>
            <div
              style={{
                height: "86vh",
              }}
              className="text-center d-flex justify-content-center align-items-center"
            >
              <div>
                <h1>Welcome back</h1>
                <p>cocohairsignature.com</p>
                <br />
                <button
                  className="btn btn-primary"
                  onClick={() => bottomNavClickPage(pagesNav.appointments)}
                  style={{ width: "100%", padding: "12px" }}
                >
                  View appointments
                </button>
              </div>
            </div>
          </section>
        )}

        {showTabNavigation === pagesNav.appointments && (
          //page [appointments]
          <section>
            <div className="mt-5">
              <h2 className="text-center">Upcoming Appointments</h2>
              <EventCalendar
                events={fromTodayDateFurther}
                blockedDates={["20240101-20500101"]}
                onclicked={ async (buttonId, datetoget) => { 
                  const httpResponse = await httpPost({
                    cros: "getterCross",
                    getDatesAppointmentsSpecDate: "2",
                    dateFrom: "" + datetoget,
                  });
                  //alert(input);
                  if (httpResponse !== null) {
                    setBookedList(await httpResponse.json());
                  }
                }} 
              />

              <div className="mt-5">
                {scedulesBookedList.map((appointment, index) => {
                  //day of week in month
                  return (
                    <div
                      key={index}
                      className="mb-4"
                      style={index !== 0 ? { borderTop: "1px solid #ccc" } : {}}
                      onClick={async () => {
                        const receiptHttpResopnse = await httpPost({
                          cros: "getterCross",
                          receiptIIinfo: appointment["orderId"],
                          j: "1",
                        });
                        if (receiptHttpResopnse !== null) {
                          const receiptHttp = await receiptHttpResopnse.json();
                          setshowModal({
                            visible: true,
                            title: "Receipt",
                            body: (
                              <>
                                <div className="modal-body">
                                  <div className="w-100">
                                    <img
                                      className="w-100"
                                      style={{
                                        paddingLeft: "50px",
                                        paddingRight: "50px",
                                      }}
                                      src={`${domain}/img/${receiptHttp["image"]}.jpg?a47`}
                                      alt={receiptHttp["hairstyle"]}
                                    />
                                  </div>
                                  <ul className="list-group mt-3 listeceiptul">
                                    <li>
                                      <span>Name</span>
                                      <span>{receiptHttp["customername"]}</span>
                                    </li>
                                    <li>
                                      <span>Phone</span>
                                      <span
                                        style={{ color: "blue" }}
                                        onClick={() =>
                                          copyPhoneEmail(
                                            receiptHttp["phonne"],
                                            "phone"
                                          )
                                        }
                                      >
                                        {receiptHttp["phonne"]}
                                      </span>
                                    </li>
                                    <li>
                                      <span>Email</span>
                                      <span
                                        style={{ color: "blue" }}
                                        onClick={() => {
                                          copyPhoneEmail(
                                            receiptHttp["email"],
                                            "email"
                                          );
                                        }}
                                      >
                                        {receiptHttp["email"]}
                                      </span>
                                    </li>
                                    <li>
                                      <span>Hairstyle</span>
                                      <span>{receiptHttp["hairstyle"]}</span>
                                    </li>
                                    <li>
                                      <span>Price</span>
                                      <span>{receiptHttp["price"]}</span>
                                    </li>
                                    <li>
                                      <span>Date</span>
                                      <span style={{ color: "green" }}>
                                        {format(
                                          parse(
                                            receiptHttp["date"],
                                            "yyyyMMdd",
                                            new Date()
                                          ),
                                          "eeee d MMMM yyyy"
                                        )}
                                      </span>
                                    </li>
                                    <li>
                                      <span>Time</span>
                                      <span style={{ color: "green" }}>
                                        {format(receiptHttp["time"], "hh:mm a")}
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </>
                            ),
                            okText: "Delete this Appointment",
                            okColor: "btn-danger",
                            okFunc: () => {
                              setshowModal({
                                visible: true,
                                body: (
                                  <>
                                    <div>
                                      <b>Name: </b>
                                      {receiptHttp["customername"]}
                                    </div>
                                    <div>
                                      <b>Hairstyle: </b>
                                      {receiptHttp["hairstyle"]}
                                    </div>
                                    <div>
                                      <b>Phone: </b>
                                      {receiptHttp["phonne"]}
                                    </div>
                                    <div>
                                      <b>Email: </b>
                                      {receiptHttp["email"]}
                                    </div>
                                  </>
                                ),
                                header:
                                  "Delete this appointment? Are you sure?",
                                okColor: "btn-danger",
                                okText: "Delete this Appointment",
                                okFunc: () => {
                                  httpPost({
                                    cros: "1",
                                    deleteAppointment: "2",
                                    ksy: appointment["orderId"],
                                  }).then((deleteResponse) => {
                                    if (deleteResponse !== null) {
                                      window.sharparp.push({
                                        title:
                                          window.sharparp.option.title.toast,
                                        value: "Appointment has been deleted.",
                                      });
                                      setshowModal({ visible: false });
                                      setTimeout(function () {
                                        window.location.reload();
                                      }, 1000);
                                    }
                                  });
                                },
                              });
                            },
                          });
                        } else {
                          setshowModal({
                            visible: true,
                            header: <>Error !!!</>,
                            body: <>Error getting receipt.</>,
                          });
                        }
                      }}
                    >
                      {
                        //activeCalendarButton !== null && (
                        <div className="d-flex flex-row align-items-center mt-4">
                          <div style={{ flex: "2", maxWidth: "120px" }}>
                            {" "}
                            <img
                              src={appointment["imageUrl"]}
                              alt={appointment["hairname"]}
                            />
                          </div>

                          <div className="mx-3 appointmentbookedlist">
                            <div className="appointmentbookedlist">
                              {appointment["hairname"]}
                            </div>
                            <div className="mt-1 text-success">
                              <b>{appointment["datetime"]}</b>
                            </div>
                          </div>

                          <div style={{ flex: "1" }}>
                            <i className="bi bi-eye"></i>
                          </div>
                        </div>
                        //)
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {showTabNavigation === pagesNav.edit && (
          //edits
          <section>
            <div className="mt-4">
              {showEditNavigation === pagesNav.edit_weekly && (
                <>
                  <h2 className="text-center mb-4">Weekly schedules</h2>
                  <p className="text-center">
                    Leave empty for unavailability (24hrs clock)
                  </p>
                  {WEEKDAYS.map((day, index) => (
                    <div
                      className="form-group schld-days-ofweek d-flex mb-3 align-items-center"
                      key={day}
                    >
                      <label htmlFor={day.toLowerCase()}>
                        {day.substring(0, 3)}:
                      </label>
                      <input
                        placeholder="0845, 1230, 1540, 2000, 0000"
                        type="text"
                        className="shadow-sm form-control"
                        id={day.toLowerCase()}
                        name={day.toLowerCase()}
                        value={availabilityInputs[day.toLowerCase()]}
                        onChange={timeWriterOnchange}
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="shadow-sm btn btn-primary w-100 mt-3 p-3 saveweeklyschedules"
                    onClick={() =>
                      setshowModal({
                        visible: true,
                        body: <>Do you want to save this weekly schedules.</>,
                        okText: "Save",
                        okFunc: () => {
                          let err = false;
                          WEEKDAYS.forEach((day) => {
                            const dayKey = day.toLowerCase();
                            const inputValue = availabilityInputs[dayKey];
                            const matches =
                              inputValue.match(/^(\d{4})(, \d{4})*$/) || false;
                            if (!matches && inputValue !== "") {
                              err = `Input valid dates for ${dayKey}`;
                            }
                          });

                          if (err !== false) {
                            setshowModal({
                              visible: true,
                              body: <>{err}</>,
                              header: "Error !!!",
                            });
                          } else {
                             const updateweeklyResponse = httpPost({cros: 'getterCross',
                                updatesWeekly: JSON.stringify(availabilityInputs),
                                ajr: 'a'});
                                if(updateweeklyResponse !== null){
                                  setshowModal({visible:false});
                                  window.sharparp.push({
                                    title: window.sharparp.option.title.toast,
                                    value: "Your weekly schedule has been updated.",
                                  });
                                }
                          }
                        },
                      })
                    }
                  >
                    Update Weekly
                  </button>
                </>
              )}
              {showEditNavigation === pagesNav.edit_override && (
                <>
                  <h2 className="text-center">
                    Block or Override Specific Dates
                  </h2>
                  <div className="mt-2">
                    <EventCalendar
                      events={[]}
                      onclicked={(buttonid,date) => alert(`${buttonid}-${date}`)} 
                    />
                  </div>
                  <p className="mt-4">
                    Click a date and enter only the time(s) you will be
                    available for that date.
                    <br />
                    <br />
                    Leave empty for unavailability (24hrs clock)
                  </p>

                  <input
                    type="text"
                    placeholder="0920, 1230, 1400,1845"
                    className="text-success form-control mb-2 shadow-sm"
                    id="updateoverride"
                    name="updateoverride"
                  />

                  <ul className="list-group overrideitemslist"> </ul>

                  <button
                    type="submit"
                    className="shadow-sm btn btn-primary w-100 mt-3 p-3 addoverridebtnclick"
                    onClick={() =>
                      setshowModal({
                        visible: true,
                        body: "Do you want to override this date(s).",
                        okbtn: "Save",
                        okbtnFunc: () => {
                          alert();
                        },
                        closeText: "Close",
                      })
                    }
                  >
                    Add Override
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        {showTabNavigation === pagesNav.settings && (
          //page [settings]
          <section
            className="d-flex align-items-center"
            style={{ height: "76vh" }}
          >
            <div className="mt-5 w-100">
              <div className="list-group settingsj">
                <div className="list-group-item list-group-item-action d-flex justify-content-between">
                  <span>
                    <i className="bi bi-bell"></i>Notifications{" "}
                  </span>
                  <i className="bi bi-toggle-off"></i>
                </div>

                <br />
                <div
                  className="list-group-item list-group-item-action d-flex justify-content-between"
                  onClick={() => {
                    window.sharparp.push({
                      title: window.sharparp.option.title.href,
                      value: "https://stripe.com/",
                    });
                  }}
                >
                  <span>View payments - stripe.com </span>
                  <i className="bi bi-box-arrow-up-right"></i>
                </div>
                <div
                  className="list-group-item list-group-item-action d-flex justify-content-between"
                  onClick={() => {
                    window.sharparp.push({
                      title: window.sharparp.option.title.href,
                      value: "https://cocohairsignature.com/",
                    });
                  }}
                >
                  <span>cocohairsignature.com </span>
                  <i className="bi bi-box-arrow-up-right"></i>
                </div>
                <br />

                <div
                  className="list-group-item list-group-item-action"
                  onClick={() => bottomNavClickPage(pagesNav.profile)}
                >
                  <i className="bi bi-person"></i> <span>Profile</span>
                </div>

                <div
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    window.sharparp.push({
                      title: window.sharparp.option.title.setlogout,
                      value: "signout",
                    });
                  }}
                >
                  <i className="bi bi-box-arrow-right"></i> Sign Out
                </div>
              </div>
            </div>
          </section>
        )}
        {showTabNavigation === pagesNav.profile && (
          //profile page
          <section className="mt-5">
            <div
              className="p-3 mb-2 text-light rounded-pill shadow-sm d-flex justify-content-between"
              style={{ backgroundColor: "rgb(98 228 151 / 67%)" }}
            >
              <span>Your account is active</span>
              <i className="bi bi-check2-all"></i>
            </div>
            <div>
              <h2 className="text-center mb-3 mt-3">Edit your profile</h2>
              <label htmlFor="fullname" className="p-1">
                FullName
              </label>
              <input
                type="text"
                id="fullname"
                className="form-control mb-3 shadow-sm"
                placeholder="Full Name"
              />
              <label htmlFor="email" className="p-1">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="form-control mb-3 shadow-sm"
                placeholder="Email"
              />
              <label htmlFor="phonenumber" className="p-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phonenumber"
                className="form-control mb-3 shadow-sm"
                placeholder="Phone Number"
              />
              <button
                type="text"
                placeholder="phoneNumebr"
                className="btn btn-primary mt-1"
              >
                Save Profile
              </button>
            </div>
          </section>
        )}
      </main>

      <footer>
        <nav className="bg-light navbar ">
          <div className="container">
            <button
              onClick={() => bottomNavClickPage(pagesNav.appointments)}
              className="nav-link"
            >
              <i className="bi bi-house"></i>
              <span className="d-block navb-fs">Appointments</span>{" "}
            </button>
            <button
              onClick={() => bottomNavClickPage(pagesNav.edit)}
              className="nav-link"
            >
              <i className="bi bi-pencil-square"></i>
              <span className="d-block navb-fs">Edits</span>{" "}
            </button>
            <button className="nav-link">
              <i className="bi bi-bar-chart"></i>{" "}
              <span className="d-block navb-fs">Stats</span>{" "}
            </button>
            <button
              onClick={() => bottomNavClickPage(pagesNav.settings)}
              className="nav-link"
            >
              <i className="bi bi-gear"></i>
              <span className="d-block navb-fs">Settings</span>
            </button>
          </div>
        </nav>
      </footer>

      {showModal.visible && (
        <Modal
          show={showModal.visible}
          centered={true}
          backdrop="static"
          keyboard={false}
          scrollable={true}
        >
          <Modal.Header closeButton={false}>
            <h5 className="mb-0 mt-0">
              {showModal.header ? showModal.header : <>Alert !</>}
            </h5>
          </Modal.Header>
          <Modal.Body>
            {showModal.body ? showModal.body : <>no body</>}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={
                showModal.closeFunc
                  ? () => showModal.closeFunc()
                  : () => {
                      setshowModal({ show: false });
                    }
              }
            >
              {showModal.closeText ? showModal.closeText : <>Close</>}
            </button>
            {showModal.okText ? (
              <button
                className={`btn ${
                  showModal.okColor ? showModal.okColor : "btn-primary"
                }`}
                onClick={() => showModal.okFunc()}
              >
                {showModal.okText}
              </button>
            ) : (
              <></>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default App;
