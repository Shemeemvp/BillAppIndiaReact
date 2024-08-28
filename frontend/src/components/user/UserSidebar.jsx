import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../functions/config";
import Cookies from "js-cookie";

function UserSidebar() {
  const navigate = useNavigate();

  const ID = Cookies.get("user_id");
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [endDate, setEndDate] = useState(null);

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
          setEndDate(details.endDate);
        }
      })
      .catch((err) => {
        console.log("ERROR==", err);
      });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="sidebar b-primary pe-4 pb-3">
      <nav className="navbar b-primary navbar-dark">
        <a href="#" className="navbar-brand mx-4 mb-3">
          <h4 className="text-light">BillingSoftwareIndia</h4>
        </a>
        <div className="d-flex align-items-center ms-4 mb-4">
          <div className="position-relative">
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
            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1" />
          </div>
          <div className="ms-3">
            <h6 className="mb-0 text-light text-uppercase">{companyName}</h6>
            <span className="text-light">Admin</span>
          </div>
        </div>
        <div className="navbar-nav w-100">
          <li
            onClick={() => navigate("/dashboard")}
            className="nav-item nav-link nav-dashboard"
          >
            <i className="fa fa-tachometer-alt me-2" />
            Dashboard
          </li>

          <li
            onClick={() => navigate("/items")}
            className="nav-item nav-link nav-items"
          >
            <i className="bx bxs-package me-2" />
            Items
            <a
              className="px-0"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/add_items");
              }}
            >
              <i className="fa-solid fa-plus bg-transparent float-end add-icon" />
            </a>
          </li>

          <li
            onClick={() => navigate("/sales")}
            className="nav-item nav-link nav-sales"
          >
            <i className="fa fa-shopping-bag me-2" />
            Sales
            <a
              className="px-0"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/add_sales");
              }}
            >
              <i className="fa-solid fa-plus bg-transparent float-end add-icon" />
            </a>
          </li>

          <li
            onClick={() => navigate("/purchases")}
            className="nav-item nav-link nav-purchase"
          >
            <i className="fa fa-store me-2" />
            Purchases
            <a
              className="px-0"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/add_purchases");
              }}
            >
              <i className="fa-solid fa-plus bg-transparent float-end add-icon" />
            </a>
          </li>

          <li
            onClick={() => navigate("/stock_reports")}
            className="nav-item nav-link nav-stock-reports"
          >
            <i className="fas fa-chart-pie me-2" />
            Stock Reports
          </li>

          <li
            onClick={() => navigate("/sales_reports")}
            className="nav-item nav-link nav-sales-reports"
          >
            <i className="fas fa-chart-pie me-2" />
            Sales Reports
          </li>

          <li
            onClick={() => navigate("/purchase_reports")}
            className="nav-item nav-link nav-purchase-reports"
          >
            <i className="fas fa-chart-pie me-2" />
            Purchase Reports
          </li>
        </div>
        {endDate != null ? (
          <div className="endDate my-3 px-2">
            <p className="text-white fw-bold mb-0">Subscription Ends by:</p>
            <span className="fs-5 fw-bolder" style={{ color: "#c6aa58" }}>
              {endDate}
            </span>
          </div>
        ) : null}
      </nav>
    </div>
  );
}

export default UserSidebar;
