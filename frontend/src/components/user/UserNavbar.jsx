import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../functions/config";
import Swal from "sweetalert2";

function UserNavbar() {
  const navigate = useNavigate();
  const [noti, setNoti] = useState(false);
  const [days, setDays] = useState("");
  const [subscribe, setSubscribe] = useState(false);

  const ID = Cookies.get("user_id");
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");

  const getUserDetails = () => {
    axios
      .get(`${config.base_url}/user_details/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          const details = res.data.data;
          var logImg = null;
          if (details.image) {
            logImg = `${config.base_url}/${details.image}`;
          }
          setCompanyLogo(logImg);
          setCompanyName(details.name);
        }
      })
      .catch((err) => {
        console.log("ERROR==", err);
      });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const getNotifications = () => {
    axios
      .get(`${config.base_url}/fetch_notifications/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          setNoti(true);
          setDays(res.data.days);
          setSubscribe(res.data.subscribe);
        } else {
          setNoti(false);
          setSubscribe(false);
          setDays("");
        }
      })
      .catch((err) => {
        console.log("ERROR==", err);
      });
  };

  useEffect(() => {
    getNotifications();
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
  }

  const changeSubscribeStatus = (status) => {
    var data = {
      Id: ID,
      status: status,
    };
    axios
      .post(`${config.base_url}/change_subscribe_status/`, data)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Updated.!",
          });
          getNotifications();
        }
      })
      .catch((err) => {
        console.log("ERROR==", err);
      });
  };

  const [searchKeyword, setSearchKeyword] = useState("");

  const redirectPages = (e) => {
    e.preventDefault();
    const searchKey = searchKeyword.toLowerCase();

    const data1 = [
      "sale",
      "sales",
      "add sales",
      "sales add",
      "create sales",
      "sales create",
      "new sale",
      "sale new",
    ];
    const data2 = [
      "purchase",
      "add purchase",
      "purchase add",
      "create purchase",
      "purchase create",
      "new purchase",
      "purchase new",
    ];
    const data3 = ["stock", "stock reports", "reports"];
    const data4 = ["item", "add item", "new item", "item add"];

    if (data1.some((keyword) => searchKey.includes(keyword))) {
      navigate("/add_sales");
    } else if (data2.some((keyword) => searchKey.includes(keyword))) {
      navigate("/add_purchases");
    } else if (data3.some((keyword) => searchKey.includes(keyword))) {
      navigate("/stock_reports");
    } else if (data4.some((keyword) => searchKey.includes(keyword))) {
      navigate("/add_items");
    } else {
      alert("Not matches found..!");
      navigate("/dashboard");
    }
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  return (
    <nav className="navbar navbar-expand b-primary navbar-dark sticky-top px-4 py-0">
      <Link to="/dashboard" className="navbar-brand d-flex d-lg-none me-4">
        <h2 className="text-white mb-0">BSI</h2>
      </Link>
      <a
        onClick={toggleSidebar}
        className="sidebar-toggler flex-shrink-0"
        style={{ textDecoration: "none", cursor: "pointer" }}
      >
        <i className="fa fa-bars text-light" />
      </a>
      <form
        className="d-none d-md-flex d-sm-flex ms-auto w-50"
        onSubmit={redirectPages}
      >
        <input
          className="form-control bg-light border-0"
          name="url"
          type="search"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search"
          required
        />
      </form>
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
              <a href="#" className="dropdown-item">
                {days == 0 ? (
                  <h6 className="fw-normal mb-0">
                    Your Trial Period expires Today..
                  </h6>
                ) : (
                  <h6 className="fw-normal mb-0">
                    Your Trial Period expires in {days} days..
                  </h6>
                )}
                {!subscribe ? (
                  <div className="d-flex px-1">
                    <small>Want to Purchase.?</small>
                    <div className="d-flex justify-content-end align-items-center ms-1">
                      <a
                        onClick={() => changeSubscribeStatus("yes")}
                        className="text-decoration-none fw-bolder text-success"
                      >
                        Yes
                      </a>
                      <a
                        onClick={() => changeSubscribeStatus("no")}
                        className="text-decoration-none fw-bolder text-danger ms-3 me-3"
                      >
                        Cancel
                      </a>
                    </div>
                  </div>
                ) : null}
              </a>
            </div>
          </div>
        ) : null}
        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            {companyLogo ? (
              <img
                className="rounded-circle me-lg-2"
                src={companyLogo}
                alt=""
                style={{ width: 40, height: 40 }}
              />
            ) : (
              <img
                className="rounded-circle me-lg-2"
                src={`${process.env.PUBLIC_URL}/static/assets/img/nouser.jpg`}
                alt=""
                style={{ width: 40, height: 40 }}
              />
            )}
            <span className="d-none d-lg-inline-flex text-uppercase">
              {companyName}
            </span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-dark border-0 rounded-0 rounded-bottom m-0">
            <Link to={"/profile"} className="dropdown-item">
              Profile
            </Link>
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

export default UserNavbar;
