import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";
import "./styles/Base.css";
import "./styles/Styles.css";
import "./styles/Sales.css";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import config from "../../functions/config";
import { useNavigate } from "react-router-dom";

function Sales() {
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

  const ID = Cookies.get("user_id");
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);

  function searchSalesTable(e) {
    var rows = document.querySelectorAll(".sales_table tbody tr");
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
        className="container-fluid position-relative d-flex p-0 userSales"
        id="userSection"
      >
        <UserSidebar />
        <div className="content">
          <UserNavbar />
          {sales.length == 0 ? (
            <main style={{ background: "#ddddbeed" }}>
              <div className="container-fluid">
                <div className="no_sales">
                  <div className="row">
                    <div className="col">
                      <div className="image_sales d-flex justify-content-center">
                        <img
                          className="img-fluid"
                          style={{ width: "25%" }}
                          src={`${process.env.PUBLIC_URL}/static/assets/img/sale.png`}
                          alt=""
                        />
                      </div>
                      <div className="addsale_btn d-flex justify-content-center">
                        <button
                          className="add_newsale_btn mt-3"
                          onClick={() => navigate("/add_sales")}
                        >
                          <i className="fa fa-plus me-2"></i>ADD SALE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          ) : (
            <main style={{ background: "#fff" }}>
              <div className="container-fluid">
                <div className="sales_section py-4">
                  <div className="row">
                    <div className="col-md-12">
                      <div
                        className="all_sales"
                        style={{ background: "#eae9c4" }}
                      >
                        <div className="all_sales_table px-1 py-2 border rounded-1">
                          <div className="top d-flex justify-content-between px-2 py-3">
                            <div className="sales_head">
                              <h4>All Sales</h4>
                            </div>
                            <form
                              action="{% url 'salesInBetween' %}"
                              className="date-filter d-flex align-items-center justify-content-between"
                            >
                              <div className="form-group">
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  name="start_date"
                                  id="from-date"
                                  defaultValue="{{start}}"
                                  required
                                />
                              </div>
                              <label htmlFor="" className="mx-2">
                                to
                              </label>
                              <div className="form-group">
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  name="end_date"
                                  id="to-date"
                                  defaultValue="{{end}}"
                                  required
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn btn-sm fltr_btn ms-2"
                              >
                                <i className="fa-solid fa-filter me-2" />
                                Filter
                              </button>
                            </form>
                          </div>
                          <div className="row px-2">
                            <div className="col-md-6 d-flex justify-content-start">
                              <input
                                type="search"
                                id="sales_search_box"
                                placeholder="Search..."
                                className="form-control w-50"
                                autoComplete="off"
                                onChange={searchSalesTable}
                              />
                              <button
                                className="btn add_new_btn ms-2"
                                onClick={() => navigate("/add_sales")}
                              >
                                <i className="fa fa-plus me-2" />
                                SALE
                              </button>
                            </div>
                            <div className="col-md-6 d-flex justify-content-end">
                              <button
                                className="btn print_btn btn-sm ms-2"
                                onClick={() =>
                                  printSection("print_sales_table")
                                }
                              >
                                <i className="fas fa-print me-2" />
                                PRINT
                              </button>
                            </div>
                          </div>
                          <div className="sales_table_section table-responsive">
                            <table
                              className="table mt-2 table-hover sales_table"
                              id="sales_table"
                            >
                              <thead>
                                <tr>
                                  <th scope="col" className="col-1">
                                    #
                                  </th>
                                  <th scope="col" className="col-2">
                                    DATE
                                  </th>
                                  <th scope="col" className="col-2">
                                    BILL NO.
                                  </th>
                                  <th scope="col" className="col-3">
                                    PARTY NAME
                                  </th>
                                  <th scope="col" className="col-2">
                                    TAX AMOUNT
                                  </th>
                                  <th scope="col" className="col-2">
                                    TOTAL
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {sales &&
                                  sales.map((i, index) => (
                                    <tr
                                      className="sales_bills"
                                      onClick={() =>
                                        navigate(
                                          `/view_sales_bill/${i.bill_no}`
                                        )
                                      }
                                    >
                                      <td>{index + 1}</td>
                                      <td>{i.date}</td>
                                      <td>{i.bill_number}</td>
                                      <td>
                                        {i.party_name != ""
                                          ? i.party_name
                                          : "Nill"}
                                      </td>
                                      <td>{i.tax}</td>
                                      <td>{i.total_amount}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}
          <UserFooter />
        </div>
      </div>

      <div
        className="print_sales_table"
        id="print_sales_table"
        style={{ display: "none" }}
      >
        <div>
          <h4>ALL SALES</h4>
        </div>
        <table className="table table-bordered mt-2" id="sales_table_print">
          <thead>
            <tr>
              <th scope="col" className="col-1">
                #
              </th>
              <th scope="col" className="col-2">
                DATE
              </th>
              <th scope="col" className="col-2">
                BILL NO.
              </th>
              <th scope="col" className="col-3">
                PARTY NAME
              </th>
              <th scope="col" className="col-2">
                TAX AMOUNT
              </th>
              <th scope="col" className="col-2">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            {sales &&
              sales.map((i, index) => (
                <tr className="">
                  <td>{index + 1}</td>
                  <td>{i.date}</td>
                  <td>{i.bill_number}</td>
                  <td>{i.party_name != "" ? i.party_name : "Nill"}</td>
                  <td>{i.tax}</td>
                  <td>{i.total_amount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Sales;
