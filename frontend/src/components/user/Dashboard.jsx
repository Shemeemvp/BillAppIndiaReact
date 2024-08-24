import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";
import "./styles/Base.css";
import "./styles/Styles.css";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../functions/config";

function Dashboard() {
  function activeLink() {
    var nav_links = document.querySelectorAll(".nav-item.nav-link");

    for (var i = 0; i < nav_links.length; i++) {
      nav_links[i].classList.remove("active");
      if (nav_links[i].classList.contains("nav-dashboard")) {
        nav_links[i].classList.add("active");
        break;
      }
    }
  }

  useEffect(() => {
    activeLink();
  }, []);

  return (
    <>
      <div
        className="container-fluid position-relative d-flex p-0 userDashboard"
        id="userSection"
      >
        <UserSidebar />
        <div className="content">
          <UserNavbar />
          <main>
            <div className="container-fluid pt-4 px-4">
              <div className="row g-4">
                <div className="col-sm-6 col-xl-3">
                  <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                    <i className="fa fa-chart-line fa-3x text-primary" />
                    <div className="ms-3">
                      <p className="mb-2">Today Sale</p>
                      <h6 className="mb-0">₹ {"todSale"}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="bg-light  rounded d-flex align-items-center justify-content-between p-4">
                    <i className="fa fa-chart-bar fa-3x text-primary" />
                    <div className="ms-3">
                      <p className="mb-2">Total Sale</p>
                      <h6 className="mb-0">₹ {"totSale"}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="bg-light  rounded d-flex align-items-center justify-content-between p-4">
                    <i className="fa fa-chart-area fa-3x text-primary" />
                    <div className="ms-3">
                      <p className="mb-2">Today Purchase</p>
                      <h6 className="mb-0">₹ {"todPurchase"}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="bg-light  rounded d-flex align-items-center justify-content-between p-4">
                    <i className="fa fa-chart-pie fa-3x text-primary" />
                    <div className="ms-3">
                      <p className="mb-2">Total Purchase</p>
                      <h6 className="mb-0">₹ {"totPurchase"}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container-fluid pt-4 px-4">
              <div className="row g-4">
                <div className="col-sm-12 col-xl-6">
                  <div className="bg-light text-center rounded p-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <h6 className="mb-0">Stock In hand Reports</h6>
                      {/* <a href="">Show All</a> */}
                    </div>
                    <canvas id="stockinhand-reports" />
                    <span>Last 5 Years</span>
                  </div>
                </div>
                <div className="col-sm-12 col-xl-6">
                  <div className="bg-light text-center rounded p-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <h6 className="mb-0">Sale &amp; Purchase</h6>
                      {/* <a href="">Show All</a> */}
                    </div>
                    <canvas id="sales-purchase" />
                    <span>Last 5 Years</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <UserFooter />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
