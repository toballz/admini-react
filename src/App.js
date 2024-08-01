//import logo from './logo.svg';
import React, { useState } from "react";
import { EventCalendar, WEEKDAYS, httpPost, todayDate } from "./functions.tsx";
import { format } from "date-fns";
import { Toast, ToastContainer, Modal, Navbar, Nav } from "react-bootstrap";

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
    WEEKDAYS.reduce((acc, day) => ({ ...acc, [day]: "" }), {})
  );
  const [fromTodayDateFurther, setFromTodayDateFurther] = useState([]);

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
  const [showToast, setshowToast] = useState({
    visible: true,
    body: <>Body xxxxxxxx</>,
    backgroundColor: "",
    closeFunc: () => {},
    position: "bottom-end",
    delay: 1600,
    autohide: true,
  });
  //
  //
  //***********************
  const bottomNavClickPage = async (divName) => {
    if (divName === pagesNav.appointments) {
      const httpResponse = await httpPost({
        cros: "getterCross",
        getDatesAppointmentsMoreThanDate: "2",
        //'dateTo': "20240707"});
        dateTo: format(todayDate, "yyyyMMdd"),
      });

      if (httpResponse !== null) {
        const gasg = await httpResponse.json();
        const formattedDates = gasg.map((date) => {
          return `${date.year}${date.month}${date.day}`;
        });
        setFromTodayDateFurther(JSON.stringify(formattedDates));
      }
      //******************
    } else if (divName === pagesNav.edit) {
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
  //

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

  //
  //
  //
  //**************
  return (
    <>
      <header> </header>

      <main className="container">
        {showTabNavigation === "firstpage" && (
          //first page
          <section>
            <div
              className="container mt-5"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "70vh",
                textAlign: "center",
              }}
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
            <div className="container mt-5">
              <h2 style={{ textAlign: "center" }}>Upcoming Appointments</h2>
              <EventCalendar
                events={fromTodayDateFurther}
                setShowModalPassArg={setshowModal}
              />
            </div>
          </section>
        )}

        {showTabNavigation === pagesNav.settings && (
          //page [settings]
          <section>
            <div className="container mt-5">
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

                <div className="list-group-item list-group-item-action signoutClick">
                  <i className="bi bi-box-arrow-right"></i> Sign Out
                </div>
              </div>
            </div>
          </section>
        )}

        {showTabNavigation === pagesNav.edit && (
          //edits
          <section>
            <Navbar className="custom-navbar  " expand="lg">
              <Navbar.Brand> </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <button
                    className="btn"
                    onClick={() => setshowEditNavigation(pagesNav.edit_weekly)}
                  >
                    Weekly Schedules
                  </button>
                  <button
                    className="btn"
                    onClick={() =>
                      setshowEditNavigation(pagesNav.edit_override)
                    }
                  >
                    Override Specific Dates
                  </button>
                  <button className="btn">Services</button>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <div className="container mt-2">
              {showEditNavigation === pagesNav.edit_weekly && (
                <>
                  <h2 className="text-center mb-4">Weekly schedules</h2>
                  <p>Leave empty for unavailability (24hrs clock)</p>
                  {WEEKDAYS.map((day, index) => (
                    <div
                      className="form-group schld-days-ofweek d-flex mb-3 align-items-center"
                      key={day}
                    >
                      <label htmlFor={day.toLowerCase()}>{day}:</label>
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
                            alert("thats wassup");
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
                  <h2 className="mb-4">Block or Override Specific Dates</h2>
                  <div className="mt-4" id="overridecalendar"></div>
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

        {showTabNavigation === pagesNav.profile && (
          //profile page
          <section className="container mt-5">
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

      <footer
        style={{ position: "fixed", bottom: "0", left: "0", width: "100%" }}
      >
        <nav className="bg-light navbar ">
          <div className="container">
            <button
              onClick={() => bottomNavClickPage(pagesNav.appointments)}
              className="nav-link btn-href"
            >
              <i className="bi bi-house"></i>
              <span className="d-block navb-fs">Appointments</span>{" "}
            </button>
            <button
              onClick={() => bottomNavClickPage(pagesNav.edit)}
              className="nav-link btn-href"
            >
              <i className="bi bi-pencil-square"></i>
              <span className="d-block navb-fs">Edits</span>{" "}
            </button>
            <button className="nav-link btn-href">
              <i className="bi bi-bar-chart"></i>{" "}
              <span className="d-block navb-fs">Stats</span>{" "}
            </button>
            <button
              onClick={() => bottomNavClickPage(pagesNav.settings)}
              className="nav-link btn-href"
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

      <ToastContainer position={showToast.position} className="p-3">
        <Toast
          show={showToast.visible}
          onClose={() => setshowToast({ visible: false })}
          className="bg-success"
          delay={showToast.delay}
          autohide={showToast.autohide}
        >
          <Toast.Body>{showToast.body}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default App;
