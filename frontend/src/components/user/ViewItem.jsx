import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";
import "./styles/Base.css";
import "./styles/Items.css";
import "./styles/Styles.css";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import config from "../../functions/config";
import { Link, useNavigate, useParams } from "react-router-dom";

function ViewItem() {
  const navigate = useNavigate();
  const ID = Cookies.get("user_id");
  const { itemId } = useParams();

  function activeLink() {
    var nav_links = document.querySelectorAll(".nav-item.nav-link");

    for (var i = 0; i < nav_links.length; i++) {
      nav_links[i].classList.remove("active");
      if (nav_links[i].classList.contains("nav-items")) {
        nav_links[i].classList.add("active");
        break;
      }
    }
  }

  useEffect(() => {
    activeLink();
  }, []);

  const handleRowClick = (id) => {
    window.history.pushState({}, "", `/view_item/${id}/`);
    fetchItemDetails(id);
  };

  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});
  const [transactions, setTransactions] = useState([]);

  const fetchItems = () => {
    axios
      .get(`${config.base_url}/get_items/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          let itms = res.data.items;
          setItems([]);
          itms.map((i) => {
            setItems((prevState) => [...prevState, i]);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItemDetails = (id) => {
    var dt = {
      itemId: id,
    };
    axios
      .get(`${config.base_url}/get_item_details/`, { params: dt })
      .then((res) => {
        if (res.data.status) {
          setItem({});
          setTransactions([]);
          let trns = res.data.transactions;
          let firstItem = res.data.firstItem;
          setItem(firstItem);
          trns.map((t) => {
            setTransactions((prevState) => [...prevState, t]);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchItemDetails(itemId);
  }, []);

  const [stockAdjust, setStockAdjust] = useState(true);
  const [stockAdjQty, setStockAdjQty] = useState("");
  const [stockAdjDate, setStockAdjDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  function handleStockAdjustChange(e) {
    setStockAdjust(!e.target.checked);
    checkStockAdjust(!e.target.checked, stockAdjQty);
  }

  function handleStockAdjustQtyChange(e) {
    setStockAdjQty(e.target.value);
    checkStockAdjust(stockAdjust, e.target.value);
  }

  function validateQuantity() {
    var cQty = parseInt(item.stock);
    var change = parseInt(stockAdjQty);
    var updateCheckbox = document.getElementById("update_qty");
    var qtyErr = document.getElementById("qty_err");

    if (!stockAdjust && change > cQty) {
      qtyErr.textContent =
        "Maximum number of stock can be reduced is " + cQty + ".!";
      return false;
    } else {
      qtyErr.textContent = "";
      return true;
    }
  }

  function checkStockAdjust(adjustStatus, value) {
    var cQty = parseInt(item.stock);
    var itemQtyUpdate = value;
    var updateQtyCheckbox = document.getElementById("update_qty");
    var qtyErr = document.getElementById("qty_err");
    var currentQty = document.getElementById("current_qty");

    if (value === "" || value === " " || value === "0") {
      currentQty.textContent = cQty;
      return;
    }

    var qty = parseInt(value);

    if (!isNaN(qty) && qty !== 0) {
      if (!adjustStatus && qty > cQty) {
        qtyErr.textContent =
          "Maximum number of stock can be reduced is " + cQty + ".!";
        currentQty.textContent = cQty;
      } else {
        qtyErr.textContent = "";

        !adjustStatus
          ? (currentQty.textContent = cQty - qty)
          : (currentQty.textContent = cQty + qty);
      }
    } else {
      currentQty.textContent = cQty;
    }
  }

  function handleStockAdjustModalSubmit(e) {
    e.preventDefault();
    let valid = validateQuantity();

    if (valid) {
      var u = {
        Id: ID,
        item_id: item.id,
        stock: stockAdjQty,
        date: stockAdjDate,
        adjust: stockAdjust,
      };
      axios
        .post(`${config.base_url}/update_stock/`, u)
        .then((res) => {
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Stock Updated",
            });
            fetchItemDetails(item.id);
            document.getElementById("stockAdjModalClose").click();
          }
        })
        .catch((err) => {
          console.log("ERROR=", err);
          if (!err.response.data.status) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            });
          }
        });
    }
  }

  function searchItemsList(e) {
    var rows = document.querySelectorAll(".itemslist tbody tr");
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

  function searchTransactions(e) {
    var rows = document.querySelectorAll(".transaction_table tbody tr");
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

  function ExportToExcel(type, fn, dl) {
    var elt = document.getElementById("transaction_table_print");
    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    return dl
      ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
      : XLSX.writeFile(
          wb,
          fn || `${item.name}-Item_transactions.` + (type || "xlsx")
        );
  }

  //   function getCurrentItem() {
  //     var rows = document.querySelectorAll("#items_table tbody tr");

  //     for (var i = 0; i < rows.length; i++) {
  //       rows[i].classList.remove("table-active");
  //       if (
  //         rows[i].querySelector("td.itm_id").textContent.trim() == item.id
  //       ) {
  //         rows[i].classList.add("table-active");
  //         break;
  //       }
  //     }
  //   }

  //   useEffect(()=>{
  //     getCurrentItem()
  //   },[])

  function handleDeleteItem() {
    Swal.fire({
      title: `Delete Item '${item.name}' ?`,
      text: "All details will be erased.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_item/${item.id}/`)
          .then((res) => {
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Item removed.",
              });
              navigate("/items");
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

  function deleteItemTransaction(id) {
    Swal.fire({
      title: "Delete Transaction ?",
      text: "All details will be erased.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_item_transaction/${id}/`)
          .then((res) => {
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Transaction removed.",
              });
              fetchItemDetails(item.id);
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
        className="container-fluid position-relative d-flex p-0 userItems"
        id="userSection"
      >
        <UserSidebar />
        <div className="content">
          <UserNavbar />
          {items.length == 0 ? (
            <main style={{ background: "#ddddbeed" }}>
              <div className="container-fluid">
                <div className="no_items">
                  <div className="row">
                    <div className="col">
                      <div className="image_basket d-flex justify-content-center">
                        <img
                          className="img-fluid w-25"
                          src={`${process.env.PUBLIC_URL}/static/assets/img/basket.png`}
                          alt=""
                        />
                      </div>
                      <div className="additem_btn d-flex justify-content-center">
                        <button
                          className="add_newitem_btn"
                          onClick={() => navigate("/add_items")}
                        >
                          <i className="fa fa-plus me-2" />
                          ADD ITEM
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
                <div className="items_section py-4">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="item_list px-1 py-2 border rounded-1 mb-3">
                        <div className="top d-flex justify-content-between">
                          <input
                            type="search"
                            id="search_box"
                            placeholder="Search..."
                            className="form-control"
                            autoComplete="off"
                            onChange={searchItemsList}
                          />
                          <Link
                            to="/add_items"
                            className="add-item-btn btn btn-sm d-flex align-items-center"
                          >
                            <i className="fa fa-plus me-1" /> ADD ITEM
                          </Link>
                        </div>
                        <div className="items_table_">
                          <table
                            className="table table-responsive-md mt-2 table-hover itemslist"
                            id="items_table"
                          >
                            <thead>
                              <tr>
                                <th scope="col" className="col-7">
                                  ITEM
                                </th>
                                <th scope="col" className="col-4">
                                  QUANTITY
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {items &&
                                items.map((i) => (
                                  <tr
                                    className="table_rows"
                                    onClick={() => handleRowClick(i.id)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <td className="itm_name">{i.name}</td>
                                    <td className="itm_id" hidden>
                                      {i.id}
                                    </td>
                                    <td className="itm_stock text-center">
                                      {i.stock}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="item_details px-1 py-2 border rounded-1 mb-3">
                        <div className="item_data_top px-2 d-flex justify-content-between">
                          <div className="item_name">
                            <h4>{item.name}</h4>
                          </div>
                          <div className="item_actions d-flex">
                            <div className="edit_item_btn">
                              <button
                                className="btn btn-sm itm-action-btn me-1"
                                onClick={() =>
                                  navigate(`/edit_item/${item.id}/`)
                                }
                              >
                                <i className="fa-solid fa-pen-to-square me-1" />{" "}
                                EDIT
                              </button>
                            </div>
                            <div className="delete_item_btn">
                              <button
                                onClick={handleDeleteItem}
                                className="btn btn-sm itm-action-btn me-1"
                              >
                                <i className="fa-solid fa-trash me-1" /> DELETE
                              </button>
                            </div>
                            <div className="stock_adjustment_btn">
                              <button
                                className="btn btn-sm itm-action-btn"
                                data-bs-toggle="modal"
                                data-bs-target="#stock_adjust"
                              >
                                <i className="fa-solid fa-sliders me-1" /> STOCK
                                ADJUST
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="item_data_body mt-1">
                          <div className="data1 px-2 d-flex justify-content-between">
                            <p>
                              Sales Price: ₹ <span>{item.sale_price}</span>
                            </p>
                            <p className="">
                              Stock Qty:
                              <span className="ms-2 fs-5">{item.stock}</span>
                            </p>
                          </div>
                          <div className="data2 px-2">
                            <p>
                              Purchase Price: ₹{" "}
                              <span>{item.purchase_price}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="item_transactions">
                        <div className="item_transaction_table px-1 py-2 border rounded-1">
                          <div className="top d-flex justify-content-between">
                            <div className="trns_head">
                              <h4>Transactions</h4>
                            </div>
                            <div className="d-flex justify-content-end">
                              <input
                                type="search"
                                id="transaction_search_box"
                                placeholder="Search..."
                                className="form-control"
                                autoComplete="off"
                                onChange={searchTransactions}
                              />
                              <button
                                className="btn btn-sm"
                                title="Print"
                                onClick={() => printSheet("print_trns_table")}
                              >
                                <i
                                  className="fas fa-print fs-5"
                                  style={{ color: "#318961" }}
                                />
                              </button>
                              <button
                                className="btn btn-sm"
                                title="Export to Excel"
                              >
                                <i
                                  className="fas fa-file-excel fs-5"
                                  onClick={() => ExportToExcel("xlsx")}
                                  style={{ color: "#318961" }}
                                />
                              </button>
                            </div>
                          </div>
                          <div className="items_table_section">
                            <table
                              className="table table-responsive-md mt-2 table-hover transaction_table"
                              id="transaction_table"
                            >
                              <thead>
                                <tr>
                                  <th scope="col" className="col-1">
                                    #
                                  </th>
                                  <th scope="col" className="col-3">
                                    DATE
                                  </th>
                                  <th scope="col" className="col-4">
                                    TYPE
                                  </th>
                                  <th scope="col" className="col-3">
                                    QUANTITY
                                  </th>
                                  <th scope="col" className="col-1" />
                                </tr>
                              </thead>
                              <tbody>
                                {transactions &&
                                  transactions.map((i, index) => (
                                    <tr className="">
                                      <td>{index + 1}</td>
                                      <td>{i.date}</td>
                                      <td>{i.type}</td>
                                      <td>{i.quantity}</td>
                                      <td className="three_dot_menu">
                                        <div className="trns_table_menu dropdown">
                                          <i
                                            className="fa-solid fa-ellipsis-vertical dropdown-button dropdown-toggle"
                                            style={{
                                              color:
                                                i.type != "Sale" &&
                                                i.type != "Purchase" &&
                                                i.type != "Opening Stock"
                                                  ? "black"
                                                  : "gray",
                                            }}
                                            data-bs-toggle="dropdown"
                                          />
                                          {i.type != "Sale" &&
                                          i.type != "Purchase" &&
                                          i.type != "Opening Stock" ? (
                                            <ul className="trans-dropdown-menu dropdown-menu">
                                              <li
                                                onClick={() =>
                                                  navigate(
                                                    `/edit_item_transaction/${i.id}/`
                                                  )
                                                }
                                                style={{ cursor: "pointer" }}
                                              >
                                                <a href="#">Edit</a>
                                              </li>
                                              <li
                                                onClick={() =>
                                                  deleteItemTransaction(i.id)
                                                }
                                                style={{ cursor: "pointer" }}
                                              >
                                                <a href="#">Delete</a>
                                              </li>
                                            </ul>
                                          ) : null}
                                        </div>
                                      </td>
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
        className="print_transaction_table page"
        size="A4"
        id="print_trns_table"
        style={{ display: "none" }}
      >
        <div className="item_details_print d-flex justify-content-center align-items-center">
          <span className="h5">Item: </span>
          <span className="fw-bolder h3 ms-2">{item.name}</span>
        </div>
        <div className="stock">
          <p>
            Available Qty:{" "}
            <span className="ms-2 fw-bold text-danger">{item.stock}</span>
          </p>
        </div>
        <div className="mt-3">
          <h6>TRANSACTIONS</h6>
        </div>
        <table
          className="custom-table mt-2 transaction_table"
          id="transaction_table_print"
        >
          <thead>
            <tr>
              <th scope="col" className="col-1">
                #
              </th>
              <th scope="col" className="col-3">
                DATE
              </th>
              <th scope="col" className="col-4">
                TYPE
              </th>
              <th scope="col" className="col-3">
                QUANTITY
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions &&
              transactions.map((i, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{i.date}</td>
                  <td>{i.type}</td>
                  <td>{i.quantity}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <>
        {/* Stock Adjust Modal */}
        <div
          className="modal fade"
          id="stock_adjust"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="stock_adjustLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content" style={{ background: "#ddddbe" }}>
              <div
                className="modal-header"
                style={{ borderBottom: "1px solid #ffffff" }}
              >
                <h5 className="modal-title text-dark" id="stock_adjustLabel">
                  ADJUST STOCK QUANTITY
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  id="stockAdjModalClose"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="stock_item_details d-flex justify-content-between">
                  <div className="item_name">
                    <h4 id="item_name_display">{item.name}</h4>
                  </div>
                  <div className="available_qty">
                    <p>
                      Current Quantity:{" "}
                      <span id="current_qty" className="fs-5 fw-bold">
                        {item.stock}
                      </span>
                    </p>
                  </div>
                </div>
                <hr />
                <form
                  className="needs-validation"
                  onSubmit={handleStockAdjustModalSubmit}
                  id="stock_adjust_form"
                >
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <div className="form-group">
                        <div className="d-block">
                          <label htmlFor="taxable">Add Stock</label>
                          <label className="switch">
                            <input
                              type="checkbox"
                              name="update_qty"
                              id="update_qty"
                              onChange={handleStockAdjustChange}
                            />
                            <span className="slider round" />
                          </label>
                          <label htmlFor="exempt">Reduce Stock</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="item_unitsymbol">Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        name="qty_update"
                        id="item_qty_update"
                        value={stockAdjQty}
                        onChange={handleStockAdjustQtyChange}
                        required
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="item_unitname">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="update_date"
                        id="item_update_date"
                        value={stockAdjDate}
                        onChange={(e) => setStockAdjDate(e.target.value)}
                        required
                      />
                    </div>
                    <span className="text-danger" id="qty_err" />
                  </div>
                  <div
                    className="d-flex justify-content-center mt-2 py-2"
                    style={{ borderTop: "1px solid #ffffff" }}
                  >
                    <button
                      type="submit"
                      id="save_stock"
                      className="adjsutstock_btn w-50 text-uppercase"
                    >
                      SAVE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default ViewItem;
