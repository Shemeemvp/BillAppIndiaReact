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

function ViewPurchases() {
  const navigate = useNavigate();
  const ID = Cookies.get("user_id");
  const { purchaseId } = useParams();

  function activeLink() {
    var nav_links = document.querySelectorAll(".nav-item.nav-link");

    for (var i = 0; i < nav_links.length; i++) {
      nav_links[i].classList.remove("active");
      if (nav_links[i].classList.contains("nav-purchase")) {
        nav_links[i].classList.add("active");
        break;
      }
    }
  }

  useEffect(() => {
    activeLink();
  }, []);

  const handleRowClick = (id) => {
    window.history.pushState({}, "", `/view_purchase_bill/${id}/`);
    fetchPurchaseDetails(id);
  };

  const [sales, setSales] = useState([]);
  const [salesBill, setSalesBill] = useState({});
  const [billItems, setBillItems] = useState([]);

  const fetchSales = () => {
    axios
      .get(`${config.base_url}/get_purchase_bills/${ID}/`)
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

  const fetchPurchaseDetails = (id) => {
    var dt = {
      purchaseId: id,
      Id: ID,
    };
    axios
      .get(`${config.base_url}/get_purchase_bill_details/`, { params: dt })
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
    fetchPurchaseDetails(purchaseId);
  }, []);

  function searchPurchaseList(e) {
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

  function handleDeletePurchaseBill() {
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
          .delete(`${config.base_url}/delete_purchase_bill/${salesBill.bill_no}/`)
          .then((res) => {
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Bill deleted.",
              });
              navigate("/purchases");
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

  function billPdf() {
    var data = {
      Id: ID,
      purchaseId: purchaseId,
    };
    axios
      .get(`${config.base_url}/purchase_bill_pdf/`, {
        responseType: "blob",
        params: data,
      })
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = `PurchaseBill_${salesBill.bill_number}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((err) => {
        console.log("ERROR=", err);
        if (err.response && err.response.data && !err.response.data.status) {
          Swal.fire({
            icon: "error",
            title: `${err.response.data.message}`,
          });
        }
      });
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
          purchaseId: purchaseId,
          Id: ID,
          email_ids: emailIds,
          email_message: emailMessage,
        };
        axios
          .post(`${config.base_url}/share_purchase_bill_email/`, em)
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
                            <h4>All Purchases</h4>
                          </div>
                        </div>
                        <div className="row px-2">
                          <div className="col-md-12 d-flex justify-content-start">
                            <input
                              type="search"
                              id="purchases_search_box"
                              placeholder="Search..."
                              className="form-control"
                              onChange={searchPurchaseList}
                              autoComplete="off"
                            />
                            <button
                              className="btn add_new_btn ms-2"
                              onClick={() => navigate("/add_purchases")}
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
                              >
                                <i className="fas fa-file-alt me-1" />
                                TEMPLATE
                              </button>
                            </div>
                            <div className="action_btns d-flex">
                              <button
                                className="btn btn-sm action_btn ms-1"
                                onClick={() =>
                                  navigate(`/edit_purchase_bill/${salesBill.bill_no}/`)
                                }
                              >
                                <i className="fa-solid fa-pen-to-square me-1" />
                                EDIT
                              </button>
                              <button
                                onClick={handleDeletePurchaseBill}
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
                                onClick={billPdf}
                              >
                                <i className="fas fa-file-pdf me-1" />
                                PDF
                              </button>
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
                                    <b>PURCHASE BILL</b>
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

export default ViewPurchases;
