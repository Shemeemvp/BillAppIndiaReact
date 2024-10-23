import React, { useEffect, useState } from "react";
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
import Select from "react-select";

function StockReports() {
  function activeLink() {
    var nav_links = document.querySelectorAll(".nav-item.nav-link");

    for (var i = 0; i < nav_links.length; i++) {
      nav_links[i].classList.remove("active");
      if (nav_links[i].classList.contains("nav-stock-reports")) {
        nav_links[i].classList.add("active");
        break;
      }
    }
  }

  useEffect(() => {
    activeLink();
  }, []);

  const ID = Cookies.get("user_id");
  const navigate = useNavigate();

  const [stock, setStock] = useState([]);
  const [items, setItems] = useState([]);
  const [balance, setBalance] = useState(null);
  const [count, setCount] = useState(null);

  const fetchStockReports = () => {
    axios
      .get(`${config.base_url}/get_stock_reports/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          let itms = res.data.items;
          let stck = res.data.stock;
          let count = res.data.count;

          setItems([]);
          const newOptions = itms.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          setItems(newOptions);

          setStock([]);
          stck.map((i) => {
            setStock((prevState) => [...prevState, i]);
          });
          setCount(count);
          setBalance(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchStockReports();
  }, []);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#fff",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "black",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "lightgray"
        : state.isFocused
        ? "lightgray"
        : "white",
      color: state.isSelected ? "black" : "black",
    }),
    input: (provided) => ({
      ...provided,
      color: "black",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#484c51",
    }),
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

  function ExportToExcel(type, fn, dl) {
    var elt = document.getElementById("stock_reports_table");
    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    return dl
      ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
      : XLSX.writeFile(wb, fn || "Stock_Reports." + (type || "xlsx"));
  }

  const [searchItem, setSearchItem] = useState("");

  const fetchSearchItemStockReports = (id) => {
    var data = {
      Id: ID,
      itemId: id,
    };
    axios
      .get(`${config.base_url}/get_item_stock_reports/`, { params: data })
      .then((res) => {
        if (res.data.status) {
          let stck = res.data.stock;
          let bal = res.data.balance;

          setStock([]);
          stck.map((i) => {
            setStock((prevState) => [...prevState, i]);
          });

          setBalance(bal);
          setCount(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [selectedOption, setSelectedOption] = useState(null);

  function handleSearch(val) {
    setSearchItem(val);
    if (val == "") {
      fetchStockReports();
      setSelectedOption(null);
    } else {
      const option = items.find((option) => option.value === val);
      setSelectedOption(option);
      fetchSearchItemStockReports(val);
    }
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
          .post(`${config.base_url}/share_stock_reports_email/`, em)
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
        className="container-fluid position-relative d-flex p-0 userStockReports"
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
                      <div className="all_stock_reports_table px-1 py-2 border rounded-1">
                        <div className="top d-flex justify-content-start px-2 py-3">
                          <div className="stk_rpts_head">
                            <h4>Stock Reports</h4>
                          </div>
                        </div>
                        <div className="row px-2">
                          <div className="col-12 col-md-6 d-flex justify-content-start">
                            <Select
                              options={items}
                              styles={customStyles}
                              name="item"
                              placeholder="Select Item.."
                              className="w-50"
                              value={selectedOption || null}
                              onChange={(selectedOption) =>
                                handleSearch(
                                  selectedOption ? selectedOption.value : ""
                                )
                              }
                              isClearable
                              isSearchable
                            />
                          </div>
                          <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end mt-2 mt-md-0">
                            <button
                              className="btn action_btns ms-0 ms-md-2"
                              onClick={() =>
                                printSection("print_stock_reports")
                              }
                            >
                              <i className="fas fa-print me-1" />
                              PRINT
                            </button>
                            <button
                              className="btn action_btns ms-1"
                              onClick={() => ExportToExcel("xlsx")}
                            >
                              <i className="fas fa-table me-1" />
                              EXCEL
                            </button>
                            <button
                              className="btn action_btns ms-1"
                              data-bs-toggle="modal"
                              data-bs-target="#shareReportEmail"
                            >
                              <i className="fas fa-mail-bulk me-1" />
                              MAIL
                            </button>
                          </div>
                        </div>
                        <div className="stock_reports_table_section table-responsive">
                          <table
                            className="table table-responsive-md mt-2 table-hover stock_reports_table"
                            id="stock_reports_table"
                          >
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>ITEM</th>
                                <th>STOCK IN</th>
                                <th>STOCK OUT</th>
                                <th>BALANCE</th>
                              </tr>
                            </thead>
                            <tbody>
                              {stock.map((i, index) => (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{i.name}</td>
                                  <td>{i.stockIn}</td>
                                  <td>{i.stockOut}</td>
                                  <td>{i.balance}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {balance ? (
                          <div className="balance_stock_section">
                            <h5>
                              Stock Remaining:{" "}
                              <span className="fs-2 text-success">
                                {balance}
                              </span>
                            </h5>
                          </div>
                        ) : balance == 0 ? (
                          <div className="balance_stock_section">
                            <h5>
                              Stock Remaining:{" "}
                              <span className="fs-2 text-danger">0</span>
                            </h5>
                          </div>
                        ) : null}
                        {count ? (
                          <div className="stock_count_section">
                            <h5>
                              Stock Count:{" "}
                              <span className="fs-2 text-success">{count}</span>
                            </h5>
                          </div>
                        ) : null}
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

      <div
        className="stock_rp_table_print"
        id="print_stock_reports"
        style={{ display: "none" }}
      >
        <div>
          <h4>STOCK REPORTS</h4>
        </div>
        <table className="custom-table mt-2" id="stk_rprt_table_print">
          <thead>
            <tr>
              <th>#</th>
              <th>ITEM</th>
              <th>STOCK IN</th>
              <th>STOCK OUT</th>
              <th>BALANCE</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((i, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{i.name}</td>
                <td>{i.stockIn}</td>
                <td>{i.stockOut}</td>
                <td>{i.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h5>
          Available Stock: <span className="fs-2 text-success">{count}</span>
        </h5>
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
    </>
  );
}

export default StockReports;
