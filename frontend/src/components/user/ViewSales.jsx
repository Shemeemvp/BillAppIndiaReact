import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";
import "./styles/Base.css";
import "./styles/Styles.css";
import "./styles/ViewSales.css";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import config from "../../functions/config";
import { Link, useNavigate, useParams } from "react-router-dom";

function ViewSales() {
  const navigate = useNavigate();
  const ID = Cookies.get("user_id");
  const { saleId } = useParams();

  function activeLink() {
    var nav_links = document.querySelectorAll(".nav-item.nav-link");

    for (var i = 0; i < nav_links.length; i++) {
      nav_links[i].classList.remove("active");
      if (nav_links[i].classList.contains("nav-sales")) {
        nav_links[i].classList.add("active");
        break;
      }
    }
  }

  useEffect(() => {
    activeLink();
  }, []);

  const handleRowClick = (id) => {
    window.history.pushState({}, "", `/view_sales_bill/${id}/`);
    fetchSalesDetails(id);
  };

  const [sales, setSales] = useState([]);
  const [salesBill, setSalesBill] = useState({});
  const [billItems, setBillItems] = useState([]);

  const fetchSales = () => {
    axios
      .get(`${config.base_url}/get_sales_bills/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          let itms = res.data.sales;
          setSales([]);
          itms.map((i) => {
            setSales((prevState) => [...prevState, i]);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const [cmp, setCmp] = useState({});

  const fetchSalesDetails = (id) => {
    var dt = {
      salesId: id,
      Id: ID,
    };
    axios
      .get(`${config.base_url}/get_sale_bill_details/`, { params: dt })
      .then((res) => {
        if (res.data.status) {
          let bill = res.data.bill;
          let itms = res.data.items;

          setSalesBill({});
          setBillItems([]);
          setSalesBill(bill);
          itms.map((i) => {
            setBillItems((prevState) => [...prevState, i]);
          });
          setCmp(res.data.cmp);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSalesDetails(saleId);
  }, []);

  function searchSalesList(e) {
    var rows = document.querySelectorAll("#purchases_table tbody tr");
    var val = e.target.value.trim().replace(/ +/g, " ").toLowerCase();

    rows.forEach(function (row) {
      var text = row.textContent.replace(/\s+/g, " ").toLowerCase();
      if (text.indexOf(val) === -1) {
        row.style.display = "none";
      } else {
        row.style.display = "";
      }
    });
  }

  function handleDeleteSalesBill() {
    Swal.fire({
      title: `Delete Bill '${salesBill.bill_number}' ?`,
      text: "All details will be erased.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_sales_bill/${salesBill.bill_no}/`)
          .then((res) => {
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Bill deleted.",
              });
              navigate("/sales");
            } else {
              Swal.fire({
                icon: "error",
                title: `${res.data.message}`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  function printSheet(sectionId) {
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

    .slip h5 {
      font-family: serif;
    }
    p {
      font-size: 1.2em;
    }
    .address {
      display: flex;
      flex-direction: column;
    }
    .address p,
    .footer p {
      font-size: 1rem;
      margin: 0;
    }
    .slip-container {
      width: 100mm;
      margin: 2rem auto;
      padding: 2rem;
      box-shadow: rgba(60, 64, 67, 0.5) 0px 1px 2px 0px,
        rgba(60, 64, 67, 0.35) 0px 2px 6px 2px;
    }
    
    .equal-length-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .equal-length-item {
      flex: 1;
      text-align: center;
    }
    .divider {
      margin: 1rem 0;
      border-bottom: 3px dotted black;
    }
    .trns-id p,
    .datetime p {
      font-size: 0.85rem;
      margin: 0;
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

  const [createdTime, setCreatedTime] = useState("");

  function updateDateTime() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();
    var formattedDay = day < 10 ? `0${day}` : day;
    var formattedMonth = month < 10 ? `0${month}` : month;
    var formattedHours = hours < 10 ? `0${hours}` : hours;
    var formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    var formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    var formattedDateTime = `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    // document.getElementById("dateTimeDisplay").textContent = formattedDateTime;
    setCreatedTime(formattedDateTime);
  }

  useEffect(() => {
    setInterval(updateDateTime, 1000);
  }, []);

  function showSlip() {
    document.getElementById("slip_btn").style.background = "#0d533ae6";
    document.getElementById("template_btn").style.background = "darkkhaki";
    document.getElementById("printBill").style.display = "none";
    document.getElementById("printSlip").style.display = "block";
    document.getElementById("templatePrintButton").style.display = "none";
    document.getElementById("slipPrintButton").style.display = "";
  }

  function showTemplate() {
    document.getElementById("template_btn").style.background = "#0d533ae6";
    document.getElementById("slip_btn").style.background = "darkkhaki";
    document.getElementById("printSlip").style.display = "none";
    document.getElementById("printBill").style.display = "block";
    document.getElementById("templatePrintButton").style.display = "";
    document.getElementById("slipPrintButton").style.display = "none";
  }

  const [emailIds, setEmailIds] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

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
        className="container-fluid position-relative d-flex p-0 userViewSale"
        id="userSection"
      >
        <UserSidebar />
        <div className="content">
          <UserNavbar />
          <main style={{ background: "#fff" }}>
            <div className="container-fluid">
              <div className="sales_section py-4">
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <div className="all_sales">
                      <div className="all_sales_table px-1 py-2 border rounded-1">
                        <div className="top d-flex justify-content-start px-2 py-3">
                          <div className="sales_head">
                            <h4>All Sales</h4>
                          </div>
                        </div>
                        <div className="row px-2">
                          <div className="col-md-12 d-flex justify-content-start">
                            <input
                              type="search"
                              id="purchases_search_box"
                              placeholder="Search..."
                              className="form-control"
                              onChange={searchSalesList}
                              autoComplete="off"
                            />
                            <button
                              className="btn add_new_btn ms-2"
                              onClick={() => navigate("/add_sales")}
                            >
                              <i className="fa fa-plus me-2" />
                              ADD
                            </button>
                          </div>
                        </div>
                        <div className="purchases_table_section table-responsive">
                          <table
                            className="table table-hover mt-2 purchases_table"
                            id="purchases_table"
                          >
                            <thead>
                              <tr>
                                <th scope="col" className="col-8">
                                  BILL NO.
                                </th>
                                <th scope="col" className="col-2">
                                  TOTAL
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {sales &&
                                sales.map((i) => (
                                  <tr
                                    className="purchase_bills"
                                    onClick={() => handleRowClick(i.bill_no)}
                                  >
                                    <td scope="col" className="col-8">
                                      BILL - {i.bill_number}
                                    </td>
                                    <td scope="col" className="col-4">
                                      <span className="me-1">₹</span>
                                      {i.total_amount}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <div className="purchase_bill_view">
                      <div className="purchase_bill px-1 py-2 border rounded-1">
                        <div className="top d-flex justify-content-start px-2 py-3">
                          <div className="sl_head">
                            <h3>BILL - {salesBill.bill_number}</h3>
                          </div>
                        </div>
                        <div className="row px-2">
                          <div className="col-md-12 d-flex justify-content-between">
                            <div className="template_switch">
                              <button
                                id="template_btn"
                                className="btn btn-sm me-1"
                                title="TEMPLATE"
                                onClick={showTemplate}
                              >
                                <i className="fas fa-file-alt me-1" />
                                TEMPLATE
                              </button>
                              <button
                                id="slip_btn"
                                className="btn btn-sm"
                                title="SLIP"
                                onClick={showSlip}
                              >
                                <i className="fas fa-receipt me-1" />
                                SLIP
                              </button>
                            </div>
                            <div className="action_btns d-flex">
                              <a href="{% url 'editSalesBill' salesBill.bill_no %}">
                                <button className="btn btn-sm action_btn ms-1">
                                  <i className="fa-solid fa-pen-to-square me-1" />
                                  EDIT
                                </button>
                              </a>
                              <button
                                onClick={handleDeleteSalesBill}
                                className="btn btn-sm action_btn ms-1"
                              >
                                <i className="fa-solid fa-trash me-1" />
                                DELETE
                              </button>
                              <button
                                className="btn btn-sm action_btn ms-1"
                                id="templatePrintButton"
                                onClick={() => printSheet("printBill")}
                              >
                                <i className="fas fa-print me-1" />
                                PRINT
                              </button>
                              <button
                                className="btn btn-sm action_btn ms-1"
                                id="slipPrintButton"
                                style={{ display: "none" }}
                                onClick={() => printSheet("printSlip")}
                              >
                                <i className="fas fa-print me-1" />
                                PRINT
                              </button>
                              <a href="{% url 'salesBillPdf' salesBill.bill_no %}">
                                <button className="btn btn-sm action_btn ms-1">
                                  <i className="fas fa-file-pdf me-1" />
                                  PDF
                                </button>
                              </a>
                              <button
                                className="btn btn-sm action_btn ms-1"
                                data-bs-target="#shareBillEmail"
                                data-bs-toggle="modal"
                              >
                                <i className="fas fa-mail-bulk me-1" />
                                MAIL
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="bill_template_section">
                          {/* Bill view */}
                          <div
                            id="printBill"
                            className="printTemplates template1"
                            style={{ display: "block" }}
                          >
                            <div className="page bg-light px-3 py-2">
                              <div
                                className="row px-3 py-4"
                                style={{ backgroundColor: "#433f42" }}
                              >
                                <div
                                  id="ember2512"
                                  className="col-md-4 d-flex justify-content-start tooltip-container ember-view ribbon text-ellipsis"
                                ></div>
                                <div className="col-md-4 d-flex justify-content-center align-items-center bill_header">
                                  <center className="h4 text-white">
                                    <b>SALES BILL</b>
                                  </center>
                                </div>
                                <div className="col-md-4 d-flex justify-content-end">
                                  <div className="text-white">
                                    <p className="mb-0">
                                      BILL #<b>{salesBill.bill_number}</b>
                                    </p>
                                    <p className="mb-0">
                                      Date:
                                      <b>{salesBill.date}</b>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="row mt-5 px-2 bg-light">
                                <div className="col-md-6">
                                  <h5
                                    className="text-secondary"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {cmp.company_name}
                                  </h5>
                                  <p
                                    className="address"
                                    style={{
                                      fontWeight: "normal",
                                      color: "#000",
                                    }}
                                  >
                                    {cmp.address}
                                    <br />
                                    {cmp.state} {"-"} {cmp.country}
                                    <br />
                                    {cmp.email}
                                    <br />
                                    {cmp.phone_number}
                                    <br />
                                  </p>
                                </div>
                                <div className="col-md-6">
                                  <div>
                                    {salesBill.party_name != "" ? (
                                      <p
                                        className="text-muted mt-2 mb-0"
                                        style={{ color: "#000" }}
                                      >
                                        Party Name:{" "}
                                        <span style={{ float: "right" }}>
                                          <b>
                                            {salesBill.party_name != ""
                                              ? salesBill.party_name
                                              : "Nill"}
                                          </b>
                                        </span>
                                      </p>
                                    ) : null}
                                    {salesBill.phone_number != "" ? (
                                      <p
                                        className="text-muted mb-0"
                                        style={{ color: "#000" }}
                                      >
                                        Party Contact:{" "}
                                        <span style={{ float: "right" }}>
                                          <b>
                                            {salesBill.phone_number != ""
                                              ? salesBill.phone_number
                                              : "Nill"}
                                          </b>
                                        </span>
                                      </p>
                                    ) : null}
                                    {salesBill.gstin != "" ? (
                                      <p
                                        className="text-muted mb-0"
                                        style={{ color: "#000" }}
                                      >
                                        Party GSTIN:{" "}
                                        <span style={{ float: "right" }}>
                                          <b>
                                            {salesBill.gstin != ""
                                              ? salesBill.gstin
                                              : "Nill"}
                                          </b>
                                        </span>
                                      </p>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <div className="row mt-3">
                                <div className="col-md-12">
                                  <table className="table table-hover table-bordered border-dark table-secondary">
                                    <thead className="table-dark">
                                      <tr className="templatetablehead">
                                        <th className="text-center">Items</th>
                                        <th className="text-center">
                                          HSN Code
                                        </th>
                                        <th className="text-center">
                                          Quantity
                                        </th>
                                        <th className="text-center">Rate</th>
                                        <th className="text-center">Tax</th>
                                        <th className="text-center">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {billItems &&
                                        billItems.map((itm) => (
                                          <tr>
                                            <td className="text-center">
                                              {itm.name}
                                            </td>
                                            <td className="text-center">
                                              {itm.hsn}
                                            </td>
                                            <td className="text-center">
                                              {itm.quantity}
                                            </td>
                                            <td className="text-center">
                                              {itm.rate}
                                            </td>
                                            <td className="text-center">
                                              {itm.tax}
                                            </td>
                                            <td className="text-center">
                                              {itm.total}
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="row mt-3">
                                <div className="col-4" />
                                <div className="col-4" />
                                <div className="col-4">
                                  <table className="table table-borderless">
                                    <tbody>
                                      <tr>
                                        <td style={{ color: "#000" }}>
                                          Sub Total
                                        </td>
                                        <td style={{ color: "#000" }}>:</td>
                                        <td
                                          className="text-center"
                                          style={{ color: "#000" }}
                                        >
                                          {salesBill.subtotal}
                                        </td>
                                      </tr>
                                      {salesBill.state_of_supply == "State" ? (
                                        <>
                                          <tr>
                                            <td style={{ color: "#000" }}>
                                              CGST
                                            </td>
                                            <td style={{ color: "#000" }}>:</td>
                                            <td
                                              className="text-center"
                                              style={{ color: "#000" }}
                                            >
                                              {salesBill.cgst}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style={{ color: "#000" }}>
                                              SGST
                                            </td>
                                            <td style={{ color: "#000" }}>:</td>
                                            <td
                                              className="text-center"
                                              style={{ color: "#000" }}
                                            >
                                              {salesBill.sgst}
                                            </td>
                                          </tr>
                                        </>
                                      ) : (
                                        <tr>
                                          <td style={{ color: "#000" }}>
                                            IGST
                                          </td>
                                          <td style={{ color: "#000" }}>:</td>
                                          <td
                                            className="text-center"
                                            style={{ color: "#000" }}
                                          >
                                            {salesBill.igst}
                                          </td>
                                        </tr>
                                      )}
                                      <tr>
                                        <td style={{ color: "#000" }}>
                                          Tax Amount
                                        </td>
                                        <td style={{ color: "#000" }}>:</td>
                                        <td
                                          className="text-center"
                                          style={{ color: "#000" }}
                                        >
                                          {salesBill.tax}
                                        </td>
                                      </tr>
                                      {salesBill.adjustment != 0.0 ? (
                                        <tr>
                                          <td style={{ color: "#000" }}>
                                            Adjustment
                                          </td>
                                          <td style={{ color: "#000" }}>:</td>
                                          <td
                                            className="text-center"
                                            style={{ color: "#000" }}
                                          >
                                            {salesBill.adjustment}
                                          </td>
                                        </tr>
                                      ) : null}
                                    </tbody>
                                  </table>
                                  <hr />
                                  <table className="table table-borderless">
                                    <tbody>
                                      <tr>
                                        <th style={{ color: "#000" }}>
                                          Grand Total
                                        </th>
                                        <th style={{ color: "#000" }}>:</th>
                                        <th
                                          className="text-center"
                                          style={{ color: "#000" }}
                                        >
                                          {salesBill.total_amount}
                                        </th>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="row container-fluid  px-4 mb-5">
                                <div className="col-sm-4 m-0 p-0">
                                  <label style={{ color: "#000" }}>
                                    <b>Authorized Signature</b>
                                  </label>
                                </div>
                                <div className="col-sm-4 m-0 p-0 text-dark">
                                  ________________________
                                </div>
                                <div className="col-sm-4 m-0 p-0" />
                              </div>
                            </div>
                          </div>
                          {/* Bill Slip view */}
                          <div
                            className="saleBillSlip"
                            id="printSlip"
                            style={{ display: "none" }}
                          >
                            <div
                              className="slip-container bg-light"
                              id="slip_container"
                            >
                              <div className="slip">
                                <h5 className="fw-bold text-center">
                                  {cmp.company_name}
                                </h5>
                                <div className="address text-center">
                                  <p>{cmp.address}</p>
                                  <p>
                                    {cmp.state}
                                    {","} {cmp.country}
                                  </p>
                                  <p>{cmp.phone_number}</p>
                                  {cmp.gst_number ? (
                                    <p>GSTIN: {cmp.gst_number}</p>
                                  ) : null}
                                </div>
                                <div className="divider" />
                                <div
                                  className="equal-length-container"
                                  style={{ color: "black", fontWeight: "bold" }}
                                >
                                  <div
                                    className="equal-length-item"
                                    style={{ textAlign: "center" }}
                                  >
                                    Item
                                    <hr
                                      style={{
                                        borderBottom: "1px solid black",
                                        marginTop: "1vh",
                                        width: "95%",
                                      }}
                                    />
                                  </div>
                                  <div
                                    className="equal-length-item ml-2"
                                    style={{ textAlign: "center" }}
                                  >
                                    HSN
                                    <hr
                                      style={{
                                        borderBottom: "1px solid black",
                                        marginTop: "1vh",
                                        width: "63%",
                                        marginLeft: 10,
                                      }}
                                    />
                                  </div>
                                  <div
                                    className="equal-length-item"
                                    style={{ textAlign: "center" }}
                                  >
                                    Qty
                                    <hr
                                      style={{
                                        borderBottom: "1px solid black",
                                        marginTop: "1vh",
                                        width: "60%",
                                        marginLeft: 10,
                                      }}
                                    />
                                  </div>
                                  <div
                                    className="equal-length-item"
                                    style={{ textAlign: "center" }}
                                  >
                                    Rate
                                    <hr
                                      style={{
                                        borderBottom: "1px solid black",
                                        marginTop: "1vh",
                                        width: "65%",
                                        marginLeft: 10,
                                      }}
                                    />
                                  </div>
                                  <div
                                    className="equal-length-item"
                                    style={{ textAlign: "center" }}
                                  >
                                    Tax
                                    <hr
                                      style={{
                                        borderBottom: "1px solid black",
                                        marginTop: "1vh",
                                        width: "60%",
                                        marginLeft: 10,
                                      }}
                                    />
                                  </div>
                                  <div
                                    className="equal-length-item"
                                    style={{ textAlign: "center" }}
                                  >
                                    Total
                                    <hr
                                      style={{
                                        borderBottom: "1px solid black",
                                        marginTop: "1vh",
                                        width: "65%",
                                        marginLeft: 10,
                                      }}
                                    />
                                  </div>
                                </div>
                                {billItems &&
                                  billItems.map((i) => (
                                    <div
                                      className="equal-length-container"
                                      style={{
                                        color: "black",
                                        fontSize: "small",
                                        wordWrap: "break-word",
                                        marginBottom: "1vh",
                                      }}
                                    >
                                      <div
                                        className="equal-length-item"
                                        style={{
                                          textAlign: "center",
                                          marginLeft: 2,
                                        }}
                                      >
                                        {i.name}
                                      </div>
                                      <div
                                        className="equal-length-item"
                                        style={{ textAlign: "right" }}
                                      >
                                        {i.hsn}
                                      </div>
                                      <div
                                        className="equal-length-item"
                                        style={{ textAlign: "center" }}
                                      >
                                        {i.quantity}
                                      </div>
                                      <div
                                        className="equal-length-item"
                                        style={{ textAlign: "center" }}
                                      >
                                        {i.rate}
                                      </div>
                                      <div className="equal-length-item">
                                        {i.tax}
                                      </div>
                                      <div
                                        className="equal-length-item"
                                        style={{ textAlign: "center" }}
                                      >
                                        {i.total}
                                      </div>
                                    </div>
                                  ))}
                                <div className="subtot mt-5">
                                  <div className="subtot-item d-flex justify-content-between">
                                    <span>Subtotal</span>
                                    <span>
                                      <span>₹ </span>
                                      {salesBill.subtotal}
                                    </span>
                                  </div>
                                  {salesBill.state_of_supply == "State" ? (
                                    <>
                                      <div className="subtot-item d-flex justify-content-between">
                                        <span>CGST</span>
                                        <span>
                                          <span>₹ </span>
                                          {salesBill.cgst}
                                        </span>
                                      </div>
                                      <div className="subtot-item d-flex justify-content-between">
                                        <span>SGST</span>
                                        <span>
                                          <span>₹ </span>
                                          {salesBill.sgst}
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="subtot-item d-flex justify-content-between">
                                      <span>IGST</span>
                                      <span>
                                        <span>₹ </span>
                                        {salesBill.igst}
                                      </span>
                                    </div>
                                  )}
                                  <div className="subtot-item d-flex justify-content-between">
                                    <span>Tax</span>
                                    <span>
                                      <span>₹ </span>
                                      {salesBill.tax}
                                    </span>
                                  </div>
                                  {salesBill.adjustment != 0.0 ? (
                                    <div className="subtot-item d-flex justify-content-between">
                                      <span>Adjustment</span>
                                      <span>
                                        <span>₹ </span>
                                        {salesBill.adjustment}
                                      </span>
                                    </div>
                                  ) : null}
                                </div>
                                <div className="divider" />
                                <div className="grandtot fw-bold d-flex justify-content-between">
                                  <span>
                                    <strong>TOTAL</strong>
                                  </span>
                                  <span>
                                    <strong>
                                      <span>₹ </span>
                                      {salesBill.total_amount}
                                    </strong>
                                  </span>
                                </div>
                                <div className="divider" />
                                <div className="paid-by mb-4 d-flex justify-content-between">
                                  <span>Paid By:</span>
                                  <span>Credit</span>
                                </div>
                                <div className="datetime d-flex justify-content-between">
                                  <p className="">Printed On:</p>
                                  <span id="dateTimeDisplay">
                                    {createdTime}
                                  </span>
                                </div>
                                <div className="trns-id d-flex flex-column">
                                  <div>
                                    <p className="float-start">
                                      <span>Transaction ID:</span>
                                      <span>XXXXXXXXX</span>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="float-start">
                                      <span>Vendor ID:</span>
                                      <span>XXXXXXXXXX</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="footer mt-4 text-center">
                                  <p>
                                    Thank you for supporting Local business!
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <UserFooter />
        </div>
      </div>

      <>
        {/* Share bill Modal */}
        <div
          className="modal fade"
          id="shareBillEmail"
          tabIndex={-1}
          aria-labelledby="shareBillEmailLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content" style={{ background: "#ddddbe" }}>
              <div
                className="modal-header"
                style={{ borderBottom: "1px solid #ffffff" }}
              >
                <h5 className="modal-title text-dark" id="shareBillEmailLabel">
                  Share Bill Via Email
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <form
                action="{% url 'shareSalesBillToEmail' bill.bill_no %}"
                method="post"
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
                      rows={3}
                      placeholder="Multiple emails can be added by separating with a comma(,)."
                      required
                      value={emailIds}
                      onChange={(e) => setEmailIds(e.target.value)}
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor="email_message">Message(optional)</label>
                    <textarea
                      name="email_message"
                      id="email_message"
                      className="form-control"
                      cols=""
                      rows={4}
                      placeholder="This message will be sent along with Bill details."
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
      </>
    </>
  );
}

export default ViewSales;
