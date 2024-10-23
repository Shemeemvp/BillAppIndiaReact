import React, { useEffect, useState, useRef } from "react";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";
import "./styles/Base.css";
import "./styles/Styles.css";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import axios from "axios";
import Cookies from "js-cookie";
import config from "../../functions/config";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function SalesReports() {
  function activeLink() {
    var nav_links = document.querySelectorAll(".nav-item.nav-link");

    for (var i = 0; i < nav_links.length; i++) {
      nav_links[i].classList.remove("active");
      if (nav_links[i].classList.contains("nav-sales-reports")) {
        nav_links[i].classList.add("active");
        break;
      }
    }
  }

  useEffect(() => {
    activeLink();
  }, []);

  const [graphMode, setGraphMode] = useState(false);
  const [graphMonthlyType, setGraphMonthlyType] = useState(true);

  const [monthlyChartLabels, setMonthlyChartLabels] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [yearlyChartLabels, setYearlyChartLabels] = useState([]);
  const [yearlyChartData, setYearlyChartData] = useState([]);

  // Refs to hold chart instances
  const monthlyChartRef = useRef(null);
  const yearlyChartRef = useRef(null);

  const currentUrl = window.location.href;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    currentUrl
  )}`;

  const ID = Cookies.get("user_id");
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [company, setCompany] = useState({});
  const [totalSales, setTotalSales] = useState(0.0);

  const fetchSalesReports = () => {
    axios
      .get(`${config.base_url}/get_sales_report_details/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          let sale = res.data.sales;
          let cmp = res.data.company;
          let chartData = res.data.chart;
          setCompany(cmp);

          setSales([]);
          sale.map((i) => {
            setSales((prevState) => [...prevState, i]);
          });

          setTotalSales(res.data.total_sales_amount);

          setMonthlyChartLabels(chartData.monthly_labels);
          setMonthlyChartData(chartData.monthly_sales);
          setYearlyChartLabels(chartData.yearly_labels);
          setYearlyChartData(chartData.yearly_sales);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSalesReports();
  }, []);

  useEffect(() => {
    // Cleanup existing chart instances before creating new ones
    if (monthlyChartRef.current) {
      monthlyChartRef.current.destroy();
    }
    if (yearlyChartRef.current) {
      yearlyChartRef.current.destroy();
    }

    // Initialize Sales & Purchase Chart
    const ctx2 = document.getElementById("monthlyChart").getContext("2d");
    monthlyChartRef.current = new Chart(ctx2, {
      type: "bar",
      data: {
        labels: monthlyChartLabels,
        datasets: [
          {
            label: "Monthly Sales",
            data: monthlyChartData,
            backgroundColor: "#003e27",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    // Initialize Stock In Hand Reports Chart
    const ctx1 = document.getElementById("yearlyChart").getContext("2d");
    yearlyChartRef.current = new Chart(ctx1, {
      type: "line",
      data: {
        labels: yearlyChartLabels,
        datasets: [
          {
            label: "Yearly Sales",
            data: yearlyChartData,
            backgroundColor: "#003e27",
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    // Cleanup function to destroy the charts when the component unmounts or data changes
    return () => {
      if (monthlyChartRef.current) {
        monthlyChartRef.current.destroy();
      }
      if (yearlyChartRef.current) {
        yearlyChartRef.current.destroy();
      }
    };
  }, [
    monthlyChartLabels,
    yearlyChartLabels,
    monthlyChartData,
    yearlyChartData,
  ]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function handleStartDateChange(val) {
    setStartDate(val);
    filterTableRows(val, endDate);
  }

  function handleEndDateChange(val) {
    setEndDate(val);
    filterTableRows(startDate, val);
  }

  function formatDate(date) {
    // Extract day, month, and year components
    var day = date.getDate().toString().padStart(2, "0");
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var year = date.getFullYear();
    // Construct formatted date string
    return day + "-" + month + "-" + year;
  }

  const filterTableRows = (start, end) => {
    const fromDate = new Date(start);
    const toDate = new Date(end);
    toDate.setHours(23, 59, 59, 999);

    if (start != "" && end != "") {
      if (fromDate.valueOf() > toDate.valueOf()) {
        alert("End date should be greater than start date.!");
      } else {
        const rows = document.querySelectorAll("#sales_reports_table tbody tr");
        const rows2 = document.querySelectorAll(
          "#sales_reports_table_pdf tbody tr"
        );

        rows.forEach((row) => {
          const dateCell = row.querySelector("td:nth-child(2)");
          const rowDate = new Date(dateCell.textContent.trim());

          if (rowDate >= fromDate && rowDate <= toDate) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        });

        rows2.forEach((row) => {
          const dateCell = row.querySelector("td:nth-child(2)");
          const rowDate = new Date(dateCell.textContent.trim());

          if (rowDate >= fromDate && rowDate <= toDate) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        });

        // Format dates
        var formattedFromDate = formatDate(fromDate);
        var formattedToDate = formatDate(toDate);

        var dateDisplay = document.getElementById("dateDisplay");
        var dateDisplay2 = document.getElementById("dateDisplay2");
        dateDisplay.textContent =
          "From: " + formattedFromDate + " To: " + formattedToDate;
        dateDisplay2.textContent =
          "From: " + formattedFromDate + " To: " + formattedToDate;
      }
    } else {
      reloadTable();
      document.getElementById("dateDisplay").textContent = "";
      document.getElementById("dateDisplay2").textContent = "";
    }
  };

  function printSection(sectionId) {
    var styles = `
    .custom-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      }

      .custom-table th,
      .custom-table td {
      border: 1px solid #ddd;
      padding: 8px; 
      text-align: left; 
      }

      .custom-table th {
      background-color: #f2f2f2; 
      color: #333; 
      font-weight: bold; 
      }

      .dropdown-content {
        display: none;
      }
    `;
    var divToPrint = document.getElementById(sectionId);
    var printWindow = window.open("", "", "height=700,width=1000");

    printWindow.document.write("<html><head><title></title>");
    printWindow.document.write(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Agbalumo&family=Black+Ops+One&family=Gluten:wght@100..900&family=Playball&display=swap" rel="stylesheet">
    `);
    printWindow.document.write("</head>");
    printWindow.document.write("<body>");
    printWindow.document.write("<style>");
    printWindow.document.write(styles);
    printWindow.document.write("</style>");
    printWindow.document.write(divToPrint.innerHTML);
    printWindow.document.write("</body>");
    printWindow.document.write("</html>");
    printWindow.document.close();
    printWindow.print();
    printWindow.addEventListener("afterprint", function () {
      printWindow.close();
    });
  }

  function generatePdf() {
    document.getElementById("report2").style.display = "block";
    var element = document.getElementById("report2");
    // Set PDF options
    var opt = {
      margin: 1,
      filename: "SalesReports.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    // Generate the PDF
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        document.getElementById("report2").style.display = "none";
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  }

  function exportToExcel(type, fn, dl) {
    var elt = document.getElementById("sales_reports_table");

    if (!elt) {
      console.error("Table element not found!");
      return;
    }

    var wb = XLSX.utils.book_new();

    var header = [["#", "Date", "Invoice No.", "Party Name", "Amount"]];

    var customSheet = XLSX.utils.aoa_to_sheet(header);

    var rows = Array.from(elt.rows);
    var data = [];

    // Iterate through the rows, starting from index 1 to skip the header
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      // Check if the row is hidden (style display set to none)
      if (row.style.display !== "none") {
        const rowData = Array.from(row.cells).map((cell) => cell.innerText);
        data.push(rowData);
      }
    }

    XLSX.utils.sheet_add_aoa(customSheet, data, { origin: -1 });

    XLSX.utils.book_append_sheet(wb, customSheet, "sheet1");

    try {
      // Determine whether to download as a base64 string or save as a file
      if (dl) {
        return XLSX.write(wb, {
          bookType: type,
          bookSST: true,
          type: "base64",
        });
      } else {
        XLSX.writeFile(wb, fn || `Sales_Reports.${type}`);
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  }

  function toggleDropdown(index) {
    var dropdownContent = document.getElementById("dropdownContent" + index);
    var isVisible = dropdownContent.style.display === "block";
    var allDropdowns = document.querySelectorAll(".dropdown-content");
    allDropdowns.forEach(function (dropdown) {
      dropdown.style.display = "none";
    });
    dropdownContent.style.display = isVisible ? "none" : "block";
  }

  function clearDropdown(columnIndex) {
    document.getElementById("filterInput" + columnIndex).value = "";
    document.getElementById("dropdownContent" + columnIndex).style.display =
      "none";
    reloadTable();
  }

  function filterTable(index) {
    var input;
    document.getElementById("dropdownContent" + index).style.display = "none";
    if (index === 1) {
      input = document.getElementById("filterInput" + index).value;
    } else {
      input = document
        .getElementById("filterInput" + index)
        .value.toUpperCase();
    }
    var table = document.getElementById("sales_reports_table");
    var table2 = document.getElementById("sales_reports_table_pdf");
    var rows = table.getElementsByTagName("tr");
    var rows2 = table2.getElementsByTagName("tr");
    // var emptyMessage = document.getElementById("emptyMessage");
    var isEmpty = true;
    for (var i = 1; i < rows.length; i++) {
      var cells = rows[i].getElementsByTagName("td");
      var cell = cells[index];
      if (cell) {
        var textValue = cell.textContent || cell.innerText;
        if (index === 0) {
          if (input == "") {
            rows[i].style.display = "table-row";
            isEmpty = false;
          } else {
            var dateval = textValue.replace(
              /(\d{2})-(\d{2})-(\d{2})/,
              "$2-$1-$3"
            );
            var inputval = input.replace(/(\d{2})-(\d{2})-(\d{2})/, "$2-$1-$3");
            const formattedDate = formatDateString(input);
            if (dateval === formattedDate) {
              rows[i].style.display = "table-row";
              isEmpty = false;
            } else {
              rows[i].style.display = "none";
            }
          }
        } else {
          if (textValue == input) {
            rows[i].style.display = "table-row";
            isEmpty = false;
          } else {
            rows[i].style.display = "none";
          }
        }
      }
    }

    for (var i = 1; i < rows2.length; i++) {
      var cells = rows2[i].getElementsByTagName("td");
      var cell = cells[index];
      if (cell) {
        var textValue = cell.textContent || cell.innerText;
        if (index === 0) {
          if (input == "") {
            rows2[i].style.display = "table-row";
            isEmpty = false;
          } else {
            var dateval = textValue.replace(
              /(\d{2})-(\d{2})-(\d{2})/,
              "$2-$1-$3"
            );
            var inputval = input.replace(/(\d{2})-(\d{2})-(\d{2})/, "$2-$1-$3");
            const formattedDate = formatDateString(input);
            if (dateval === formattedDate) {
              rows2[i].style.display = "table-row";
              isEmpty = false;
            } else {
              rows2[i].style.display = "none";
            }
          }
        } else {
          if (textValue == input) {
            rows2[i].style.display = "table-row";
            isEmpty = false;
          } else {
            rows2[i].style.display = "none";
          }
        }
      }
    }
    // emptyMessage.style.display = isEmpty ? "block" : "none";
  }

  function reloadTable() {
    var table = document.getElementById("sales_reports_table");
    var table2 = document.getElementById("sales_reports_table_pdf");
    var rows = table.getElementsByTagName("tr");
    var rows2 = table2.getElementsByTagName("tr");
    for (var i = 1; i < rows.length; i++) {
      rows[i].style.display = "table-row";
    }

    for (var i = 1; i < rows2.length; i++) {
      rows2[i].style.display = "table-row";
    }

    if (startDate != "" && endDate != "") {
      filterTableRows(startDate, endDate);
    }
  }

  function formatDateString(inputDate) {
    const parsedDate = new Date(inputDate);
    const day = parsedDate.getDate();
    const month = parsedDate.getMonth() + 1;
    const year = parsedDate.getFullYear();
    const formattedDate = `${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}-${year}`;
    return formattedDate;
  }

  const [emailIds, setEmailIds] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  function handleShareEmail(e) {
    e.preventDefault();

    var emailsString = emailIds.trim();

    var emails = emailsString.split(",").map(function (email) {
      return email.trim();
    });

    var emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    var invalidEmails = [];
    if (emailsString === "") {
      alert("Enter valid email addresses.");
    } else {
      for (var i = 0; i < emails.length; i++) {
        var currentEmail = emails[i];

        if (currentEmail !== "" && !emailRegex.test(currentEmail)) {
          invalidEmails.push(currentEmail);
        }
      }

      if (invalidEmails.length > 0) {
        alert("Invalid emails. Please check!\n" + invalidEmails.join(", "));
      } else {
        // document.getElementById("share_to_email_form").submit();
        var em = {
          Id: ID,
          email_ids: emailIds,
          email_message: emailMessage,
        };
        axios
          .post(`${config.base_url}/share_sales_reports_email/`, em)
          .then((res) => {
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Shared via mail.",
              });
              setEmailIds("");
              setEmailMessage("");
              document.getElementById("emailModalClose").click();
            }
          })
          .catch((err) => {
            console.log("ERROR=", err);
            if (
              err.response &&
              err.response.data &&
              !err.response.data.status
            ) {
              Swal.fire({
                icon: "error",
                title: `${err.response.data.message}`,
              });
            }
          });
      }
    }
  }

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
    <>
      <div
        className="container-fluid position-relative d-flex p-0 userSalesReports"
        id="userSection"
      >
        <UserSidebar />
        <div className="content">
          <UserNavbar />
          <main style={{ background: "#fff" }}>
            <div className="container-fluid">
              <div className="stock_reports_section py-4">
                {/* <div className="row"> */}
                {/* <div className="col-md-12"> */}
                <div
                  className="all_stock_reports"
                  style={{ background: "#eae9c4" }}
                >
                  <div
                    className="all_stock_reports_table px-1 py-2 border rounded-1"
                    id="salesReports"
                    style={{ display: graphMode ? "none" : "block" }}
                  >
                    <div className="row px-2">
                      <div className="col-12 col-sm-12 col-md-5 d-block d-md-flex justify-content-start align-items-center">
                        <label
                          htmlFor=""
                          style={{
                            color: "rgb(0, 0, 0)",
                            fontSize: "1rem",
                          }}
                        >
                          <b>Date</b>
                        </label>
                        <input
                          type="date"
                          id="fromDate"
                          className="form-control ms-1 form-control-sm"
                          value={startDate}
                          onChange={(e) =>
                            handleStartDateChange(e.target.value)
                          }
                        />
                        <label
                          htmlFor=""
                          style={{
                            color: "rgb(0, 0, 0)",
                            fontSize: "1rem",
                          }}
                          className="mx-1"
                        >
                          to
                        </label>
                        <input
                          type="date"
                          id="toDate"
                          value={endDate}
                          onChange={(e) => handleEndDateChange(e.target.value)}
                          className="form-control form-control-sm"
                        />
                      </div>
                      <div className="col-12 col-sm-12 col-md-7 d-flex justify-content-center justify-content-md-end mt-2 mt-md-0">
                        <button
                          className="btn btn-sm action_btns"
                          onClick={() => printSection("report2")}
                        >
                          <i className="fas fa-print me-1" />
                          Print
                        </button>
                        <button
                          className="btn btn-sm action_btns ms-1"
                          onClick={() => exportToExcel("xlsx")}
                        >
                          <i className="fas fa-table me-1" />
                          Excel
                        </button>
                        <button
                          className="btn btn-sm action_btns ms-1"
                          onClick={generatePdf}
                        >
                          <i className="fas fa-file-pdf me-1" />
                          Pdf
                        </button>
                        <button
                          className="btn btn-sm action_btns ms-1"
                          onClick={() => setGraphMode(true)}
                        >
                          <i className="fas fa-chart-line me-1" />
                          Graph
                        </button>
                        <div class="dropdown">
                          <button
                            class="btn action_btns btn-sm ms-1 dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fas fa-mail-bulk me-1" />
                            Share
                          </button>
                          <ul
                            class="dropdown-menu"
                            aria-labelledby="dropdownMenuButton1"
                          >
                            <li>
                              <a
                                class="dropdown-item"
                                href={shareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                WhatsApp
                              </a>
                            </li>
                            <li>
                              <a
                                class="dropdown-item"
                                data-bs-toggle="modal"
                                href="#shareReportEmail"
                              >
                                Mail
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-4" id="report">
                      <h2>
                        <ul
                          style={{
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}
                        >
                          {company.company_name}
                        </ul>
                      </h2>
                      <h3>
                        <ul style={{ textAlign: "center" }}>Sales Report</ul>
                      </h3>
                      <div
                        id="dateDisplay"
                        style={{
                          color: "black",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      ></div>
                    </div>
                    <div className="stock_reports_table_section table-responsive">
                      <table
                        className="table mt-2 table-hover stock_reports_table"
                        style={{ textAlign: "center" }}
                        id="sales_reports_table"
                      >
                        <thead>
                          <tr id="tableHeadings">
                            <th>#</th>
                            <th>
                              DATE
                              <a onClick={() => toggleDropdown(1)}>
                                &nbsp;
                                <i
                                  className="fa fa-filter"
                                  aria-hidden="true"
                                />
                              </a>
                              <div
                                className="dropdown-content"
                                id="dropdownContent1"
                              >
                                <label
                                  htmlFor="filterInput1"
                                  style={{
                                    color: "black",
                                    textAlign: "left",
                                  }}
                                >
                                  Equal To
                                </label>
                                <input type="date" id="filterInput1" />
                                <div className="button-row">
                                  <a
                                    className="btn"
                                    style={{ backgroundColor: "#1d8d68" }}
                                    onClick={() => clearDropdown(1)}
                                  >
                                    Clear
                                  </a>
                                  <a
                                    className="btn ms-1"
                                    style={{ backgroundColor: "#1d8d68" }}
                                    onClick={() => filterTable(1)}
                                  >
                                    Apply
                                  </a>
                                </div>
                              </div>
                            </th>
                            <th>
                              INVOICE NO
                              <a onClick={() => toggleDropdown(2)}>
                                &nbsp;
                                <i
                                  className="fa fa-filter"
                                  aria-hidden="true"
                                />
                              </a>
                              <div
                                className="dropdown-content"
                                id="dropdownContent2"
                              >
                                <label
                                  htmlFor="filterInput2"
                                  style={{
                                    color: "black",
                                    textAlign: "left",
                                  }}
                                >
                                  Equal To
                                </label>
                                <input type="text" id="filterInput2" />
                                <div className="button-row">
                                  <a
                                    className="btn"
                                    style={{ backgroundColor: "#1d8d68" }}
                                    onClick={() => clearDropdown(2)}
                                  >
                                    Clear
                                  </a>
                                  &nbsp;
                                  <a
                                    className="btn ms-1"
                                    style={{ backgroundColor: "#1d8d68" }}
                                    onClick={() => filterTable(2)}
                                  >
                                    Apply
                                  </a>
                                </div>
                              </div>
                            </th>
                            <th>
                              PARTY NAME
                              <a onClick={() => toggleDropdown(3)}>
                                &nbsp;
                                <i
                                  className="fa fa-filter"
                                  aria-hidden="true"
                                />
                              </a>
                              <div
                                className="dropdown-content"
                                id="dropdownContent3"
                              >
                                <label
                                  htmlFor="filterInput3"
                                  style={{
                                    color: "black",
                                    textAlign: "left",
                                  }}
                                >
                                  Equal To
                                </label>
                                <input type="text" id="filterInput3" />
                                <div className="button-row">
                                  <a
                                    className="btn"
                                    style={{ backgroundColor: "#1d8d68" }}
                                    onClick={() => clearDropdown(3)}
                                  >
                                    Clear
                                  </a>
                                  &nbsp;
                                  <a
                                    className="btn ms-1"
                                    style={{ backgroundColor: "#1d8d68" }}
                                    onClick={() => filterTable(3)}
                                  >
                                    Apply
                                  </a>
                                </div>
                              </div>
                            </th>
                            <th>
                              AMOUNT
                              <a onClick={() => toggleDropdown(4)}>
                                &nbsp;
                                <i
                                  className="fa fa-filter"
                                  aria-hidden="true"
                                />
                              </a>
                              <div
                                className="dropdown-content"
                                id="dropdownContent4"
                              >
                                <label
                                  htmlFor="filterInput4"
                                  style={{
                                    color: "black",
                                    textAlign: "left",
                                  }}
                                >
                                  Equal To
                                </label>
                                <input type="text" id="filterInput4" />
                                <div className="button-row">
                                  <a
                                    className="btn"
                                    style={{ backgroundColor: "#1d8d68" }}
                                    onClick={() => clearDropdown(4)}
                                  >
                                    Clear
                                  </a>
                                  &nbsp;
                                  <a
                                    className="btn ms-1"
                                    style={{ backgroundColor: "#1d8d68" }}
                                    onClick={() => filterTable(4)}
                                  >
                                    Apply
                                  </a>
                                </div>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sales.map((i, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{i.date}</td>
                              <td>{i.bill_number}</td>
                              <td>
                                {i.party_name != "" ? i.party_name : "Nill"}
                              </td>
                              <td>{i.total_amount}</td>
                            </tr>
                          ))}
                          {sales.length ? (
                            <tr>
                              <td colSpan="4">
                                <strong>Total Sales Amount:</strong>
                              </td>
                              <td>
                                <strong>{totalSales || 0}</strong>
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    id="salesReportsGraph"
                    className="mx-auto w-75"
                    style={{ display: graphMode ? "block" : "none" }}
                  >
                    <div className="chartSectionHead">
                      <div className="d-flex justify-content-end">
                        <div className="ml-auto">
                          <a
                            onClick={() => setGraphMode(false)}
                            style={{
                              fontSize: "x-large",
                              color: "black",
                              cursor: "pointer",
                            }}
                            title="Close"
                          >
                            <i
                              className="fa fa-times-circle fs-6 tb close_pad mt-4 "
                              aria-hidden="true"
                            />
                          </a>
                        </div>
                      </div>
                      <form id="chartToggleForm">
                        <label>
                          <input
                            type="radio"
                            name="chartType"
                            value="monthly"
                            checked={graphMonthlyType}
                            onChange={() =>
                              setGraphMonthlyType((prev) => !prev)
                            }
                          />
                          Monthly
                        </label>
                        <label className="ms-3">
                          <input
                            type="radio"
                            name="chartType"
                            value="yearly"
                            onChange={() =>
                              setGraphMonthlyType((prev) => !prev)
                            }
                          />
                          Yearly
                        </label>
                      </form>
                    </div>

                    <div className="chartSection">
                      <div
                        id="monthlyChartContainer"
                        style={{
                          display: graphMonthlyType ? "block" : "none",
                        }}
                      >
                        <canvas id="monthlyChart" />
                      </div>
                      <div
                        id="yearlyChartContainer"
                        style={{
                          display: !graphMonthlyType ? "block" : "none",
                        }}
                      >
                        <canvas id="yearlyChart" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* </div> */}
                {/* </div> */}
              </div>
            </div>
          </main>
          <UserFooter />
        </div>
      </div>

      {/* Share bill Modal */}
      <div
        className="modal fade"
        id="shareReportEmail"
        tabIndex={-1}
        aria-labelledby="shareReportEmailLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content" style={{ background: "#ddddbe" }}>
            <div
              className="modal-header"
              style={{ borderBottom: "1px solid #ffffff" }}
            >
              <h5 className="modal-title text-dark" id="shareReportEmailLabel">
                Share Report Via Email
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="emailModalClose"
                aria-label="Close"
              />
            </div>
            <form
              onSubmit={handleShareEmail}
              className="needs-validation"
              id="share_to_email_form"
            >
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="emailIds">Email IDs</label>
                  <textarea
                    className="form-control"
                    name="email_ids"
                    id="emailIds"
                    value={emailIds}
                    onChange={(e) => setEmailIds(e.target.value)}
                    rows={3}
                    placeholder="Multiple emails can be added by separating with a comma(,)."
                    required
                  />
                </div>
                <div className="form-group mt-2">
                  <label htmlFor="item_unitname">Message(optional)</label>
                  <textarea
                    name="email_message"
                    id="email_message"
                    className="form-control"
                    cols=""
                    rows={4}
                    placeholder="This message will be sent along with the Stock Report."
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                  />
                </div>
              </div>
              <div
                className="modal-footer d-flex justify-content-center"
                style={{ borderTop: "1px solid #ffffff" }}
              >
                <button
                  type="submit"
                  id="share_with_email"
                  className="submitShareEmailBtn w-50 text-uppercase"
                >
                  SEND MAIL
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="row mt-4" id="report2" style={{ display: "none" }}>
        <h2>
          <ul
            style={{
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {company.company_name}
          </ul>
        </h2>
        <h3>
          <ul style={{ textAlign: "center" }}>Sales Report</ul>
        </h3>
        <center>
          <div
            id="dateDisplay2"
            style={{
              color: "black",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          ></div>
        </center>

        <div className="stock_reports_table_section table-responsive">
          <table
            className="table table-responsive-md mt-2 table-hover stock_reports_table custom-table"
            style={{ textAlign: "center" }}
            id="sales_reports_table_pdf"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>DATE</th>
                <th>INVOICE NO</th>
                <th>PARTY NAME</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((i, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{i.date}</td>
                  <td>{i.bill_number}</td>
                  <td>{i.party_name != "" ? i.party_name : "Nill"}</td>
                  <td>{i.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default SalesReports;
