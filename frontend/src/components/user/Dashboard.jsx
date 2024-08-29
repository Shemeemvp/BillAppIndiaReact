import React, { useEffect, useState, useRef } from "react";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";
import "./styles/Base.css";
import "./styles/Styles.css";
import axios from "axios";
import config from "../../functions/config";
import Cookies from "js-cookie";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables); // Register Chart.js components

function Dashboard() {
  const ID = Cookies.get("user_id");

  const activeLink = () => {
    const nav_links = document.querySelectorAll(".nav-item.nav-link");
    nav_links.forEach((link) => link.classList.remove("active"));
    document.querySelector(".nav-item.nav-link.nav-dashboard")?.classList.add("active");
  };

  useEffect(() => {
    activeLink();
  }, []);

  const [todaySales, setTodaySales] = useState(0.0);
  const [totalSales, setTotalSales] = useState(0.0);
  const [todayPurchase, setTodayPurchase] = useState(0.0);
  const [totalPurchase, setTotalPurchase] = useState(0.0);
  const [label, setLabel] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [stockBalance, setStockBalance] = useState([]);

  // Refs to hold chart instances
  const salesPurchaseChartRef = useRef(null);
  const stockInHandChartRef = useRef(null);

  const fetchDashboardDetails = () => {
    axios
      .get(`${config.base_url}/get_dashboard_data/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          const details = res.data.data;
          console.log(details);
          setTodaySales(details.todSale);
          setTotalSales(details.totSale);
          setTodayPurchase(details.todPurchase);
          setTotalPurchase(details.totPurchase);
          setLabel(details.label);
          setSalesData(details.salesData);
          setPurchaseData(details.purchaseData);
          setStockIn(details.stockIn);
          setStockOut(details.stockOut);
          setStockBalance(details.stockBalance);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchDashboardDetails();
  }, []);

  useEffect(() => {
    // Cleanup existing chart instances before creating new ones
    if (salesPurchaseChartRef.current) {
      salesPurchaseChartRef.current.destroy();
    }
    if (stockInHandChartRef.current) {
      stockInHandChartRef.current.destroy();
    }

    // Initialize Sales & Purchase Chart
    const ctx2 = document.getElementById("sales-purchase").getContext("2d");
    salesPurchaseChartRef.current = new Chart(ctx2, {
      type: "line",
      data: {
        labels: label,
        datasets: [
          {
            label: "Purchase",
            data: purchaseData,
            backgroundColor: "#003e27",
            fill: true,
          },
          {
            label: "Sales",
            data: salesData,
            backgroundColor: "#218560",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    // Initialize Stock In Hand Reports Chart
    const ctx1 = document.getElementById("stockinhand-reports").getContext("2d");
    stockInHandChartRef.current = new Chart(ctx1, {
      type: "bar",
      data: {
        labels: label,
        datasets: [
          {
            label: "Stock In",
            data: stockIn,
            backgroundColor: "#003e27",
          },
          {
            label: "Stock Out",
            data: stockOut,
            backgroundColor: "#09593c",
          },
          {
            label: "Balance",
            data: stockBalance,
            backgroundColor: "#218560",
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    // Cleanup function to destroy the charts when the component unmounts or data changes
    return () => {
      if (salesPurchaseChartRef.current) {
        salesPurchaseChartRef.current.destroy();
      }
      if (stockInHandChartRef.current) {
        stockInHandChartRef.current.destroy();
      }
    };
  }, [label, salesData, purchaseData, stockIn, stockOut, stockBalance]);

  return (
    <>
      <div className="container-fluid position-relative d-flex p-0 userDashboard" id="userSection">
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
                      <h6 className="mb-0">₹ {todaySales}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="bg-light  rounded d-flex align-items-center justify-content-between p-4">
                    <i className="fa fa-chart-bar fa-3x text-primary" />
                    <div className="ms-3">
                      <p className="mb-2">Total Sale</p>
                      <h6 className="mb-0">₹ {totalSales}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="bg-light  rounded d-flex align-items-center justify-content-between p-4">
                    <i className="fa fa-chart-area fa-3x text-primary" />
                    <div className="ms-3">
                      <p className="mb-2">Today Purchase</p>
                      <h6 className="mb-0">₹ {todayPurchase}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="bg-light  rounded d-flex align-items-center justify-content-between p-4">
                    <i className="fa fa-chart-pie fa-3x text-primary" />
                    <div className="ms-3">
                      <p className="mb-2">Total Purchase</p>
                      <h6 className="mb-0">₹ {totalPurchase}</h6>
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
