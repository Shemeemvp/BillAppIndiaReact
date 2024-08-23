import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNav from "./AdminNav";
import AdminFooter from "./AdminFooter";
import "./styles/AdminBase.css";
import "./styles/AdminStyles.css";
import Swal from "sweetalert2";
// import DataTable from "react-data-table-component";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
// import 'primereact/resources/themes/saga-blue/theme.css';
import "primereact/resources/primereact.min.css";
import axios from "axios";
import config from "../../functions/config";
import { Link } from "react-router-dom";

function PurchasedClients() {
  function activeLink() {
    var nav_links = document.querySelectorAll(".nav-item.nav-link");

    for (var i = 0; i < nav_links.length; i++) {
      nav_links[i].classList.remove("active");
      if (nav_links[i].classList.contains("nav-purchased-clients")) {
        nav_links[i].classList.add("active");
        break;
      }
    }
  }

  useEffect(() => {
    activeLink();
  }, []);

  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);

  function fetchClients() {
    axios
      .get(`${config.base_url}/get_purchased_clients/`)
      .then((res) => {
        if (res.data.status) {
          const clnts = res.data.clients;

          const cmpns = clnts.map((i, index) => ({
            slno: index + 1,
            id: i.trial_id || "",
            companyName: i.company_name || "",
            email: i.email || "",
            contact: i.contact || "",
            gstin: i.gstin || "",
            startDate: i.start_date || "",
            endDate: i.end_date || "",
            purchaseStatus: i.purchase_status || "",
          }));

          setData(cmpns);
        }
      })
      .catch((err) => {
        console.error("API request failed:", err);
      });
  }

  useEffect(() => {
    fetchClients();
  }, []);

  const [terms, setTerms] = useState([]);

  function fetchTerms() {
    axios
      .get(`${config.base_url}/get_payment_terms/`)
      .then((res) => {
        if (res.data.status) {
          const terms = res.data.terms;
          const trms = terms.map((i, index) => ({
            slno: index + 1,
            id: i.id || "",
            duration: i.duration || "",
            term: i.term || "",
            days: i.days || "",
          }));

          setTerms(trms);
        }
      })
      .catch((err) => {
        console.error("API request failed:", err);
      });
  }

  useEffect(() => {
    fetchTerms();
  }, []);

  const header = (
    <div className="table-header mb-2">
      <InputText
        type="search"
        onInput={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search"
      />
    </div>
  );

  const [duration, setDuration] = useState("");
  const [term, setTerm] = useState("Days");

  const saveNewPaymentTerm = (e) => {
    e.preventDefault();

    var dt = {
      duration: duration,
      term: term,
    };

    axios
      .post(`${config.base_url}/create_new_payment_term/`, dt)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Term Created Created",
          });
          fetchTerms();
          setPayTerm("");
          setEndDate("");
          document.getElementById("newPaymentTermModalClose").click();
        }
        if (!res.data.status && res.data.message != "") {
          Swal.fire({
            icon: "error",
            title: `${res.data.message}`,
          });
        }
      })
      .catch((err) => {
        if (!err.response.data.status) {
          Swal.fire({
            icon: "error",
            title: `${err.response.data.message}`,
          });
        }
      });
  };

  let currentDate = new Date().toJSON().slice(0, 10);
  const [purchaseDate, setPurchaseDate] = useState(currentDate);
  const [endDate, setEndDate] = useState("");
  const [payTerm, setPayTerm] = useState("");

  function clientPurchase(c_id) {
    var dt = {
      id: c_id,
      purchaseDate: purchaseDate,
      endDate: endDate,
      term: payTerm,
    };

    axios
      .post(`${config.base_url}/client_purchase/`, dt)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Purchase Completed.!",
          });
          setPayTerm("");
          setEndDate("");
          setPurchaseDate(currentDate);
          fetchClients();
          document.getElementById("purchaseClose" + c_id).click();
        }
        if (!res.data.status && res.data.message != "") {
          Swal.fire({
            icon: "error",
            title: `${res.data.message}`,
          });
        }
      })
      .catch((err) => {
        if (!err.response.data.status) {
          Swal.fire({
            icon: "error",
            title: `${err.response.data.message}`,
          });
        }
      });
  }

  function handlePurchaseDateChange(id, val) {
    setPurchaseDate(val);
    changeEndDate(id, val);
  }

  function handlePayTermChange(id, val) {
    setPayTerm(val);
    changeEndDate(id, purchaseDate);
  }

  function changeAttribute(id) {
    document
      .getElementById("newPaymentTermModalClose")
      .setAttribute("data-bs-target", "#purchase" + id);
  }

  function changeEndDate(id, pDate) {
    // var start = document.getElementById("purchase" + id + "Date").value;
    var end = document.getElementById("end" + id + "Date");
    var start = pDate;
    var days = parseInt(
      document
        .getElementById("paymentTerms" + id)
        .selectedOptions[0].getAttribute("text")
    );

    if (start !== "" && !isNaN(days)) {
      var sDate = new Date(start);
      var eDate = new Date(sDate.getTime() + days * 24 * 60 * 60 * 1000);
      var formattedEndDate = eDate.toISOString().split("T")[0];

      // end.value = formattedEndDate;
      setEndDate(formattedEndDate);
    }
  }

  function cancelSubscription(id) {
    Swal.fire({
      title: "Cancel Subscription.!",
      text: "Are you sure you want to cancel the subscription.?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (id != "" && result.isConfirmed) {
        var dt = {
          id: id,
        };
        axios
          .post(`${config.base_url}/cancel_subscription/`, dt)
          .then((res) => {
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Subscription cancelled.",
              });
              fetchClients();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
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
        class="container-fluid position-relative d-flex p-0"
        id="adminSection"
      >
        <AdminSidebar />
        <div class="content">
          <AdminNav />
          <main style={{ background: "#fff" }}>
            <div className="container-fluid">
              <div className="Purchased_clients py-4">
                <div className="row">
                  <div className="col-md-12">
                    <div
                      className="purchased_clients px-3 py-3"
                      style={{ backgroundColor: "#eae9c4" }}
                    >
                      <h4 className="ms-2">Purchased Clients</h4>

                      <DataTable
                        value={data}
                        paginator
                        rows={10}
                        header={header}
                        globalFilter={globalFilter}
                      >
                        <Column field="slno" header="#" sortable></Column>
                        <Column
                          field="companyName"
                          header="Company Name"
                          sortable
                        ></Column>
                        <Column field="email" header="Email" sortable></Column>
                        <Column
                          field="contact"
                          header="Contact"
                          sortable
                        ></Column>
                        {/* <Column field="gstin" header="GSTIN" sortable></Column> */}
                        <Column
                          field="startDate"
                          header="Start Date"
                          sortable
                        ></Column>
                        <Column
                          field="endDate"
                          header="End Date"
                          sortable
                        ></Column>
                        <Column
                          field="purchaseStatus"
                          header="Status"
                          sortable
                        ></Column>
                        <Column
                          header="Action"
                          body={(rowData) => (
                            <>
                              {rowData.purchaseStatus == "valid" ? (
                                <button
                                  type="button"
                                  class="btn btn-sm btn-outline-danger"
                                  onClick={() => cancelSubscription(rowData.id)}
                                >
                                  CANCEL
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-outline-success btn-sm"
                                  data-bs-toggle="modal"
                                  data-bs-target={`#purchase${rowData.id}`}
                                >
                                  ACTIVATE
                                </button>
                              )}
                            </>
                          )}
                        ></Column>
                      </DataTable>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <AdminFooter />
        </div>
      </div>

      {/* New Payment Term Modal */}
      <div
        className="modal fade"
        id="newPaymentTerm"
        tabIndex={-1}
        aria-labelledby="newPaymentTermLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content" style={{ background: "#ddddbe" }}>
            <div
              className="modal-header"
              style={{ borderBottom: "1px solid #ffffff" }}
            >
              <h5 className="modal-title text-dark" id="newPaymentTermLabel">
                New Payment Term
              </h5>
              <button
                type="button"
                id="newPaymentTermModalClose"
                className="btn-close"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target=""
                aria-label="Close"
              />
            </div>
            <form
              method="post"
              className="needs-validation"
              onSubmit={saveNewPaymentTerm}
              id="newPaymentTermForm"
            >
              <div className="modal-body">
                <div className="row mt-3">
                  <div className="col-md-12 col-lg-12">
                    <div className="form-group">
                      <label htmlFor="duration">Duration</label>
                      <input
                        type="number"
                        name="duration"
                        id="duration"
                        className="form-control"
                        autoComplete="off"
                        min={1}
                        step={1}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12 col-lg-12">
                    <div className="form-group">
                      <label htmlFor="term">Term</label>
                      <select
                        className="form-control"
                        name="term"
                        id="term"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        required
                      >
                        <option value="Days" selected>
                          Days
                        </option>
                        <option value="Months">Months</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="modal-footer d-flex justify-content-center"
                style={{ borderTop: "1px solid #ffffff" }}
              >
                <button
                  type="submit"
                  id="savePaymentTerm"
                  className="submitunit_btn w-50 text-uppercase"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Purchase modal */}
      {data &&
        data.map((i) => (
          <div
            className="modal fade"
            id={`purchase${i.id}`}
            tabIndex={-1}
            aria-labelledby={`purchase${i.id}Label`}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content" style={{ background: "#ddddbe" }}>
                <div
                  className="modal-header"
                  style={{ borderBottom: "1px solid #ffffff" }}
                >
                  <h5
                    className="modal-title text-dark"
                    id={`purchase${i.id}Label`}
                  >
                    Product Purchase
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    id={`purchaseClose${i.id}`}
                    aria-label="Close"
                  />
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    clientPurchase(i.id);
                  }}
                  id={`purchase${i.id}Form`}
                >
                  <div className="modal-body">
                    <div className="client_info d-flex justify-content-between mb-2">
                      <span>
                        Company Name:
                        <span className="fw-bolder fs-5 ms-2">
                          {i.companyName}
                        </span>
                      </span>
                      <span>
                        Contact:
                        <span className="fw-bolder fs-6 ms-2">{i.contact}</span>
                      </span>
                    </div>
                    <div className="client_info d-flex justify-content-between mb-2">
                      <span />
                      <span>
                        Email:
                        <span className="fw-bolder fs-6 ms-2">{i.email}</span>
                      </span>
                    </div>
                    <div className="client_info d-flex justify-content-between mb-2">
                      <span />
                      <span>
                        GSTIN:
                        <span className="fw-bolder fs-6 ms-2">{i.gstin}</span>
                      </span>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor={`purchase${i.id}Date`}>
                            Purchase Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="purchaseDate"
                            id={`purchase${i.id}Date`}
                            value={purchaseDate}
                            onChange={(e) =>
                              handlePurchaseDateChange(
                                `${i.id}`,
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor={`paymentTerms${i.id}`}>
                            Payment Term
                          </label>
                          <div className="d-flex">
                            <select
                              name="paymentTerm"
                              id={`paymentTerms${i.id}`}
                              className="form-control payTerms"
                              value={payTerm}
                              onChange={(e) =>
                                handlePayTermChange(`${i.id}`, e.target.value)
                              }
                              required
                            >
                              <option value="">--Choose One--</option>
                              {terms &&
                                terms.map((item) => (
                                  <option value={item.id} text={item.days}>
                                    {item.duration} {item.term}
                                  </option>
                                ))}
                            </select>
                            <a href="#" className="ms-2">
                              <button
                                type="button"
                                data-bs-dismiss="modal"
                                data-bs-toggle="modal"
                                data-bs-target="#newPaymentTerm"
                                className="btn btn-outline-light"
                                onClick={() => changeAttribute(`${i.id}`)}
                              >
                                <i className="fa fa-plus text-dark" />
                              </button>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor={`end${i.id}Date`}>End Date</label>
                          <input
                            type="date"
                            className="form-control bg-light"
                            name="endDate"
                            value={endDate}
                            id={`end${i.id}Date`}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="modal-footer d-flex justify-content-center"
                    style={{ borderTop: "1px solid #ffffff" }}
                  >
                    <button
                      type="submit"
                      id="save_unit"
                      className="submitunit_btn w-50 text-uppercase"
                    >
                      SAVE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}

export default PurchasedClients;
