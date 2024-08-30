import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../functions/config";

function AdminNav() {
  const navigate = useNavigate();
  const [noti, setNoti] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const getAdminNotifications = () => {
    axios
      .get(`${config.base_url}/admin_notifications/`)
      .then((res) => {
        if (res.data.status) {
          setNoti(true);
          const details = res.data.renewals;
          console.log(details);
          setNotifications([]);
          details.map((i) => {
            setNotifications((prevState) => [...prevState, i]);
          });
        } else {
          setNoti(false);
          setNotifications([]);
        }
      })
      .catch((err) => {
        console.log("ERROR==", err);
      });
  };

  useEffect(() => {
    getAdminNotifications();
  }, []);

  function handleLogout() {
    Cookies.remove("user_id");
    Cookies.remove("role");
    navigate("/");
  }

  function toggleSidebar(event) {
    event.preventDefault();

    document.querySelector(".sidebar").classList.toggle("open");
    document.querySelector(".content").classList.toggle("open");
    // document.querySelectorAll(".sidebar-toggler").forEach(function (toggler) {
    //   toggler.addEventListener("click", function (event) {
    //   });
    // });
  }
  return (
    <nav className="navbar navbar-expand b-primary navbar-dark sticky-top px-4 py-0">
      <a href="/go_dashboard" className="navbar-brand d-flex d-lg-none me-4">
        <h2 className="text-white mb-0">BSI</h2>
      </a>
      <a
        onClick={toggleSidebar}
        className="sidebar-toggler flex-shrink-0"
        style={{ textDecoration: "none", cursor: "pointer" }}
      >
        <i className="fa fa-bars text-light" />
      </a>
      <div className="navbar-nav align-items-center ms-auto">
        {noti ? (
          <div className="nav-item dropdown">
            <a
              href="#"
              className="dropdown-toggle text-decoration-none text-white d-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              <i className="fa fa-bell me-lg-2 fs-5 position-relative" />
              {noti ? (
                <span
                  className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger"
                  style={{
                    padding: "0.2rem 0.4rem",
                    fontSize: "0.5rem",
                    marginLeft: "0rem",
                  }}
                >
                  !
                </span>
              ) : null}
              <span className="d-none d-lg-inline-flex">Notification</span>
            </a>
            <div className="notification-dropdown dropdown-menu dropdown-menu-end bg-dark border-0 rounded-0 rounded-bottom m-0">
              {noti &&
                notifications.map((i) => (
                  <>
                    <a href="#" className="dropdown-item my-2">
                      <h6 className="fw-normal mb-0">
                        {i.company.company_name} wants to purchase..
                      </h6>
                    </a>
                    <Link
                      to="/demo_clients"
                      className="text-decoration-none text-success ms-3"
                    >
                      Continue
                    </Link>
                    <hr className="dropdown-divider bg-white" />
                  </>
                ))}
            </div>
          </div>
        ) : null}
        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <img
              className="rounded-circle me-lg-2"
              src={`${process.env.PUBLIC_URL}/static/assets/img/nouser.jpg`}
              alt=""
              style={{ width: 40, height: 40 }}
            />
            <span className="d-none d-lg-inline-flex text-uppercase">
              ADMIN
            </span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-dark border-0 rounded-0 rounded-bottom m-0">
            <a
              onClick={handleLogout}
              className="dropdown-item"
              style={{ cursor: "pointer" }}
            >
              Log Out
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNav;
