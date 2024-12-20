//import logo from './logo.svg';
import React, { useEffect, useState } from "react";
import {
  EventCalendar,
  WEEKDAYS,
  httpPost,
  todayDate,
  domain,
  IsLive,
  LoadingOverlay,
} from "./functions.tsx";
import { format, parse, startOfMonth, subMonths } from "date-fns";
import {
  Modal,
  Navbar,
  Dropdown,
  Toast,
  ToastContainer,
} from "react-bootstrap";

//
//
const pagesNav = {
  appointments: "appointments",
  settings: "settings",
  stats: "stats",
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
  const [weeklyAvailabilityInputs, setweeklyAvailabilityInputs] = useState(
    WEEKDAYS.reduce((acc, day) => ({ ...acc, [day.toLowerCase()]: "" }), {})
  );
  const [calenderDaysClick, setcalenderDaysClick] = useState(null);
  const [overrideInput, setoverrideInput] = useState("");
  const [fromTodayDateFurther, setFromTodayDateFurther] = useState([]);
  const [statsPage, setstatsPage] = useState({
    popularHairstyleBooked: [
      {
        hairstyle: "xxxxxx",
        image: "nuul",
        appearance_count: "0",
      },
    ],
    beginingOfThisMonth: "5",
    lastMonth: "10",
    allToDate: "38",
  });

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
  const [showToast, setshowToast] = useState({
    visible: false,
    header: false,
    message: <></>,
    closeFunc: false, //()=>{}
  });
  const [showLoading, setshowLoading] = useState();

  const [headerNav, setheaderNav] = useState({
    left: <></>,
    center: <></>,
    right: <></>,
  });
  const [overrideScheduleJson, setoverrideScheduleJson] = useState([]);
  const [isLoggedIn, setisLoggedIn] = useState("awaitloading");
  const [inputLoginEmail, setinputLoginEmail] = useState("");
  const [inputLoginPassword, setinputLoginPassword] = useState("");
  //

  //
  //***********************
  //***********************
  //***********************
  //***********************
  //***********************
  //***********************
  //***********************
  //***********************
  //***********************
  const bottomNavClickPage = async (divName) => {
    setshowLoading(true);
    setheaderNav({ left: null, center: null, right: null });
    if (divName === pagesNav.appointments) {
      const httpResponse = await httpPost({
        cros: "getterCross",
        getDatesAppointmentsMoreThanDate: "2",
        dateTo: format(todayDate, "yyyyMMdd"),
      });

      if (httpResponse !== null) {
        const eventDatesBooked = await httpResponse.json();
        const eventDatesBookedToInt = (eventDatesBooked.message ?? []).map(
          (date) => {
            return parseInt(date, 10);
          }
        );
        setFromTodayDateFurther(eventDatesBookedToInt);
      }
      //******************
    } else if (divName === pagesNav.edit) {
      setheaderNav({
        right: (
          <Dropdown>
            <Dropdown.Toggle
              as="button"
              className="btn"
              bsPrefix="custom-toggle"
              variant="transparent"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="p-2 fs-7">
              <Dropdown.Item
                className="p-2"
                onClick={() => setshowEditNavigation(pagesNav.edit_weekly)}
              >
                Weekly Schedules
              </Dropdown.Item>
              <hr className="m-1" />
              <Dropdown.Item
                className="p-2"
                onClick={() => setshowEditNavigation(pagesNav.edit_override)}
              >
                Override Specific Dates
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ),
      });
      //
      const httpWeeklySchedule = await httpPost({
        cros: "getterCross",
        getweeklyStatic: "2",
        had: "a",
      });
      if (httpWeeklySchedule ?? false) {
        const httpJson = await httpWeeklySchedule.json();

        const updatedInputs = WEEKDAYS.reduce(
          (acc, day) => ({
            ...acc,
            [day.toLowerCase()]: httpJson[day.toLowerCase()],
          }),
          {}
        );
        setweeklyAvailabilityInputs({
          ...weeklyAvailabilityInputs,
          ...updatedInputs,
        });
      }
      //
      const httpOverrideSchedule = await httpPost({
        cros: "getterCross",
        getOverrideDates: "2",
        va: "a",
      });

      if (httpOverrideSchedule ?? false) {
        setoverrideScheduleJson(await httpOverrideSchedule.json());
      }
    } else if (divName === pagesNav.stats) {
      const httpOverrideSchedule = await httpPost({
        cros: "getterCross",
        v: "1,",
        stats: "",
        beginingOfThisMonth: format(startOfMonth(new Date()), "yyyyMMdd"),
        beginingOfLastMonth: format(
          startOfMonth(subMonths(new Date(), 1)),
          "yyyyMMdd"
        ),
        sg: "0",
      });

      if (httpOverrideSchedule ?? false) {
        setstatsPage(await httpOverrideSchedule.json());
      }
    }

    setshowTabNavigation(divName);

    setTimeout(function () {
      setshowLoading(false);
    }, 1200);
  };
  function copyPhoneEmail(phoneEmail, type) {
    try {
      navigator.clipboard.writeText(phoneEmail);
      window.open(
        (type === "phone" ? "tel" : "mailto") + ":" + phoneEmail,
        "_blank"
      );
      // window.sharparp.push({
      //   title: window.sharparp.option.title.href,
      //   value: (type === "phone" ? "tel" : "mailto") + ":" + phoneEmail,
      // });
    } catch (e) {
      navigator.clipboard.writeText(phoneEmail);
    }
  }
  //
  //input preg 24hrs time
  const timeWriterInputOnchange = (e) => {
    const { name, value } = e.target;

    // Format the value as comma-separated values
    const formattedValue = value
      .replace(/\D+/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1, "); // Add commas every 4 digits
    if (name === "updateoverrideInput") {
      setoverrideInput(formattedValue);
    } else {
      setweeklyAvailabilityInputs({
        ...weeklyAvailabilityInputs,
        [name]: formattedValue,
      });
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedinResponse = await httpPost({
        cros: "1",
        isloggedin: "2",
      });

      if (isLoggedinResponse !== null) {
        let sss = (await isLoggedinResponse.json()).code;
        console.log(sss);
        setisLoggedIn(sss === 200 ? true : false);
      }
    };

    const siOnline = () => setshowModal({ visible: false });
    const siOffline = () =>
      setshowModal({
        visible: true,
        title: "Warning !",
        body: <>No internet connection !</>,
        closeText: "Retry",
        closeFunc: () => {},
      });
    const blockContextMenu = (event) => {
      const allowedTags = ["INPUT", "TEXTAREA"];
      let target = event.target;
      while (target && target !== document) {
        if (allowedTags.includes(target.tagName)) {
          return; // Allow context menu
        }
        target = target.parentNode;
      }
      // If not allowed, prevent the default context menu
      event.preventDefault();
    };

    window.addEventListener("contextmenu", blockContextMenu);
    window.addEventListener("online", siOnline);
    window.addEventListener("offline", siOffline);
    checkLogin();

    return () => {
      window.removeEventListener("contextmenu", blockContextMenu);
      window.removeEventListener("online", siOnline);
      window.removeEventListener("offline", siOffline);
    };
  }, []);

  //
  //
  //render/render/render/render
  //**************/render/render
  //**************/render/render
  //**************
  //**************
  //**************
  //**************
  //**************
  //**************
  //**************
  //**************
  if (isLoggedIn === "awaitloading") {
    return <>Loading .......</>;
  }
  return (
    <>
      <header className="container">
        <Navbar expand="lg" style={{ minHeight: "59px" }}>
          <div>{headerNav.left && headerNav.left}</div>
          <div>{headerNav.center && headerNav.center}</div>
          <div>{headerNav.right && headerNav.right}</div>
        </Navbar>
      </header>

      <main className="container">
        {showTabNavigation === "firstpage" && (
          //first page
          <section>
            {isLoggedIn === true ? (
              <div
                style={{
                  height: "79vh",
                }}
                className="d-flex justify-content-center align-items-center"
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
            ) : (
              <div
                style={{
                  height: "79vh",
                }}
                className="text-center d-flex justify-content-center align-items-center"
              >
                <div className="login-container">
                  <h2 className="text-center mb-1">Login</h2>
                  <div className="text-center mb-3">cocohairsignature.com</div>
                  <div>
                    <div className="form-group">
                      <label htmlFor="useremail">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="useremail"
                        placeholder="Enter Email"
                        value={inputLoginEmail}
                        onChange={(e) => setinputLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={inputLoginPassword}
                        onChange={(e) => setinputLoginPassword(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn btn-primary mt-3 w-100"
                      onClick={async () => {
                        if (
                          inputLoginEmail.length > 5 &&
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                            inputLoginEmail
                          ) &&
                          inputLoginPassword.length >= 6
                        ) {
                          const loginResponse = await httpPost({
                            cros: "getterCross",
                            loginn: "o",
                            remail: btoa(inputLoginEmail),
                            rpassword: btoa(inputLoginPassword),
                          });
                          if (loginResponse !== null) {
                            let sss = await loginResponse.json();
                            if (sss.code === 200) {
                              setisLoggedIn(true);
                              bottomNavClickPage(pagesNav.appointments);
                            } else {
                              setshowToast({
                                visible: true,
                                message: sss.message,
                              });
                            }
                          } else {
                            setshowToast({
                              visible: true,
                              message: "Error trying to login.",
                            });
                          }
                        } else {
                          setshowToast({
                            visible: true,
                            message: "Input a valid email or password.",
                          });
                        }
                      }}
                    >
                      <span>
                        <i className="bi bi-file-lock"></i>
                      </span>
                      <span>Login</span>
                    </button>
                    <button
                      className="btn btn-light mt-3 mb-5 w-100 d-flex align-items-center justify-content-center"
                      onClick={() => {}}
                    >
                      <span>
                        <i className="bi bi-caret-left"></i>
                      </span>{" "}
                      <span>Back</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {showTabNavigation === pagesNav.appointments && (
          //page [appointments]
          <section>
            <h2 className="text-center mb-4">Upcoming Appointments</h2>
            <EventCalendar
              events={fromTodayDateFurther}
              blockedDates={["20240101-20500101"]}
              onclicked={async (buttonId, datetoget) => {
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
                    style={
                      index !== 0
                        ? { borderTop: "1px solid #ccc", cursor: "pointer" }
                        : { cursor: "pointer" }
                    }
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
                                      onClick={() =>
                                        copyPhoneEmail(
                                          receiptHttp["email"],
                                          "email"
                                        )
                                      }
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
                                      {format(
                                        parse(
                                          receiptHttp["time"],
                                          "HHmm",
                                          new Date()
                                        ),
                                        "hh:mm a"
                                      )}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </>
                          ),
                          okText: "Delete this Appointment",
                          okColor: "btn-danger",
                          okFunc: () =>
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
                              header: "Delete this appointment? Are you sure?",
                              okColor: "btn-danger",
                              okText: "Delete this Appointment",
                              okFunc: () => {
                                if (IsLive) {
                                  httpPost({
                                    cros: "1",
                                    deleteAppointment: "2",
                                    ksy: appointment["orderId"],
                                  }).then((deleteResponse) => {
                                    if (deleteResponse !== null) {
                                      setshowToast({
                                        visible: true,
                                        message:
                                          "Appointment has been deleted.",
                                      });
                                      setshowModal({ visible: false });
                                      setTimeout(function () {
                                        window.location.reload();
                                      }, 1000);
                                    }
                                  });
                                } else {
                                  setshowToast({
                                    visible: true,
                                    message:
                                      "This feature has been disabled for app store testing !!",
                                  });
                                }
                              },
                            }),
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
                        value={weeklyAvailabilityInputs[day.toLowerCase()]}
                        onChange={timeWriterInputOnchange}
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
                          if (IsLive) {
                            let err = false;
                            WEEKDAYS.forEach((day) => {
                              const dayKey = day.toLowerCase();
                              const inputValue =
                                weeklyAvailabilityInputs[dayKey] ?? "null";
                              const matches =
                                inputValue.match(/^(\d{4})(, \d{4})*$/) ||
                                false;
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
                              const updateweeklyResponse = httpPost({
                                cros: "getterCross",
                                updatesWeekly: JSON.stringify(
                                  weeklyAvailabilityInputs
                                ),
                                ajr: "a",
                              });
                              if (updateweeklyResponse !== null) {
                                setshowModal({ visible: false });
                                setshowToast({
                                  visible: true,
                                  message:
                                    "Your weekly schedule has been updated.",
                                });
                              }
                            }
                          } else {
                            setshowToast({
                              visible: true,
                              message:
                                "This feature has been disabled for app store testing !!",
                            });
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
                  <div className="mt-4">
                    <EventCalendar
                      events={[]}
                      onclicked={(buttonid, date) => setcalenderDaysClick(date)}
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
                    placeholder="0920, 1230, 1400, 1845"
                    className="text-success form-control mb-2 shadow-sm"
                    id="updateoverride"
                    value={overrideInput}
                    name="updateoverrideInput"
                    onChange={timeWriterInputOnchange}
                  />

                  <div className="p-2 pb-1 mt-3">
                    <b>Saved Overridden Dates</b>
                  </div>
                  <ul className="list-group">
                    {(overrideScheduleJson ?? []).map((a, n) => {
                      return (
                        <li key={`ll-${a.date}`}>
                          <div className="d-flex align-items-center justify-content-between p-2">
                            <div className="row w-100">
                              <span className="row-md-1 mb-1">
                                {format(
                                  parse("" + a.date, "yyyyMMdd", new Date()),
                                  "eeee d MMMM yyyy"
                                )}
                              </span>
                              <span className="col-md-4 mb-1">
                                {a.time === ""
                                  ? "Not available"
                                  : a.time
                                      .split(",")
                                      .map((timew) => timew.trim())
                                      .map((time, index) => (
                                        <span key={index}>
                                          {format(
                                            parse(time, "HHmm", new Date()),
                                            "hh:mm a"
                                          )}
                                          {index !==
                                          a.time.split(",").length - 1
                                            ? ", "
                                            : ""}
                                        </span>
                                      ))}
                              </span>
                            </div>
                            <button
                              className="btn"
                              onClick={async () => {
                                setshowModal({
                                  visible: true,
                                  header:
                                    "Do you want to delete this override date!",
                                  body: (
                                    <>
                                      Return{" "}
                                      {format(
                                        parse(
                                          "" + a.date,
                                          "yyyyMMdd",
                                          new Date()
                                        ),
                                        "eeee d MMMM yyyy"
                                      )}{" "}
                                      back to weekly schedule?
                                    </>
                                  ),
                                  okText: "Revert/Remove",
                                  okFunc: async () => {
                                    if (IsLive) {
                                      var tts = (
                                        overrideScheduleJson ?? []
                                      ).filter((item) => item.date !== a.date);
                                      setoverrideScheduleJson(tts);
                                      const httpOverrideSchedule = await httpPost(
                                        {
                                          cros: "getterCross",
                                          cat: JSON.stringify(tts),
                                          updateOverrided: "v1",
                                        }
                                      );

                                      if (httpOverrideSchedule ?? false) {
                                        setshowModal({ visible: false });
                                      }
                                    } else {
                                      setshowToast({
                                        visible: true,
                                        message:
                                          "This feature has been disabled for app store testing !!",
                                      });
                                    }
                                  },
                                });
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                          <hr className="m-1" />
                        </li>
                      );
                    })}
                  </ul>

                  <button
                    type="submit"
                    className="shadow-sm btn btn-primary w-100 mt-3 p-3 addoverridebtnclick"
                    onClick={() => {
                      if (calenderDaysClick !== null) {
                        if (
                          overrideInput.match(/^(\d{4})(, \d{4})*$/) ||
                          overrideInput === ""
                        ) {
                          const da = parse(
                            "" + calenderDaysClick,
                            "yyyyMMdd",
                            new Date()
                          );
                          setshowModal({
                            visible: true,
                            header: "Override this date !",
                            body: (
                              <>
                                <>Do you want to override this date ?</>
                                <br />
                                <br />
                                <b>Date: </b>
                                {format(da, "eeee d MMMM yyyy")}
                                <br />
                                <br />
                                <b>From: </b>
                                <>
                                  {
                                    weeklyAvailabilityInputs[
                                      format(da, "eeee").toLowerCase()
                                    ]
                                  }
                                </>
                                <br />
                                <b>To: </b>
                                <>
                                  {overrideInput === ""
                                    ? "Not Available"
                                    : overrideInput}
                                </>
                              </>
                            ),
                            okFunc: async () => {
                              if (IsLive) {
                                function updateOrPush(date, newTime) {
                                  let fff = overrideScheduleJson ?? [];
                                  // Check if the date exists in the array
                                  const index = fff.findIndex(
                                    (item) => item.date === date
                                  );
                                  if (index !== -1) {
                                    // Date exists, update the time
                                    fff[index].time = newTime;
                                  } else {
                                    // Date does not exist, push new object
                                    fff.push({ date: date, time: newTime });
                                  }
                                  setoverrideScheduleJson(fff);
                                }

                                updateOrPush(
                                  String(calenderDaysClick),
                                  overrideInput
                                );

                                const httpOverrideSchedule = await httpPost({
                                  cros: "getterCross",
                                  cat: JSON.stringify(overrideScheduleJson),
                                  updateOverrided: "v1",
                                });

                                if (httpOverrideSchedule ?? false) {
                                  setshowModal({ visible: false });
                                }
                              } else {
                                setshowToast({
                                  visible: true,
                                  message:
                                    "This feature has been disabled for app store testing !!",
                                });
                              }
                            },
                            okText: "Override",
                          });
                        } else {
                          setshowModal({
                            visible: true,
                            body: <>Type in valid 24hrs time.</>,
                            header: "Error !!",
                          });
                        }
                      } else {
                        setshowModal({
                          visible: true,
                          header: "Override this date",
                          body: "Make sure to select a date to override.",
                          closeText: "OK",
                        });
                      }
                    }}
                  >
                    Add Override
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        {showTabNavigation === pagesNav.stats && (
          //page [stats]

          <section>
            <hr />
            <h2 className="text-center">Top 5 Hairstyle Booked</h2>
            <ul>
              {(statsPage["popularHairstyleBooked"] ?? []).map(
                (item, index) => (
                  <li
                    key={index}
                    className="d-flex flex-row align-items-center mb-3"
                  >
                    <div style={{ flex: "2", maxWidth: "120px" }}>
                      <img
                        src={`https://cocohairsignature.com/img/${item["image"]}.jpg?trd`}
                        alt={item["hairstyle"]}
                      />
                    </div>

                    <div className="mx-3 appointmentbookedlist">
                      <div className="appointmentbookedlist">
                        {item["hairstyle"]}
                      </div>
                      <div className="mt-1 text-success">
                        <b>{item["appearance_count"]}: people booked this.</b>
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
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
                <br />
                {IsLive && (
                  <div
                    className="list-group-item list-group-item-action d-flex justify-content-between"
                    onClick={() => window.open("https://stripe.com/", "_blank")}
                  >
                    <span>View payments - stripe.com </span>
                    <i className="bi bi-box-arrow-up-right"></i>
                  </div>
                )}
                <div
                  className="list-group-item list-group-item-action d-flex justify-content-between"
                  onClick={() =>
                    window.open("https://cocohairsignature.com/", "_blank")
                  }
                >
                  <span>cocohairsignature.com </span>
                  <i className="bi bi-box-arrow-up-right"></i>
                </div>
                <br />

                {/* <div
                  className="list-group-item list-group-item-action"
                  onClick={() => bottomNavClickPage(pagesNav.profile)}
                >
                  <i className="bi bi-person"></i> <span>Profile</span>
                </div> */}

                <div
                  className="list-group-item list-group-item-action"
                  onClick={async () => {
                    await httpPost({
                      cros: "getterCross",
                      signlogout: "0",
                    });
                    setisLoggedIn(false);
                    setshowTabNavigation("firstpage");
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
        {isLoggedIn === true && (
          <nav className="bg-light navbar ">
            <div className="container">
              <button
                onClick={() => bottomNavClickPage(pagesNav.appointments)}
                className="nav-link"
              >
                <i className="bi bi-house"></i>
                <span className="d-block navb-fs">Appointments</span>
              </button>
              <button
                onClick={() => bottomNavClickPage(pagesNav.edit)}
                className="nav-link"
              >
                <i className="bi bi-pencil-square"></i>
                <span className="d-block navb-fs">Edits</span>
              </button>
              <button
                className="nav-link"
                onClick={() => bottomNavClickPage(pagesNav.stats)}
              >
                <i className="bi bi-bar-chart"></i>
                <span className="d-block navb-fs">Stats</span>
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
        )}
      </footer>

      {/* toast */}
      <ToastContainer position="top-end">
        <Toast
          show={showToast.visible}
          onClose={() => {
            if (showToast.closeFunc) {
              showToast.closeFunc();
            } else {
              setshowToast({ visible: false });
            }
          }}
          delay={3000}
          style={{ backgroundColor: "rgb(52 58 64 / 69%)", color: "#fff" }}
          autohide
        >
          {showToast.header ? (
            <Toast.Header>
              <strong className="me-auto">Toast Title</strong>
              <small>Just now</small>
            </Toast.Header>
          ) : (
            <></>
          )}
          <Toast.Body>{showToast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

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
              onClick={() =>
                showModal.closeFunc
                  ? showModal.closeFunc()
                  : setshowModal({ show: false })
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

      {showLoading && <LoadingOverlay />}
    </>
  );
}

export default App;
