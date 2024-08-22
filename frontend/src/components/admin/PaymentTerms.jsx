import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNav from "./AdminNav";
import AdminFooter from "./AdminFooter";
import "./AdminBase.css";
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

function PaymentTerms() {
  function activeLink() {
    var nav_links = document.querySelectorAll(".nav-item.nav-link");

    for (var i = 0; i < nav_links.length; i++) {
      nav_links[i].classList.remove("active");
      if (nav_links[i].classList.contains("nav-payment-terms")) {
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

  function fetchTerms() {
    axios
      .get(`${config.base_url}/get_payment_terms/`)
      .then((res) => {
        if (res.data.status) {
          const terms = res.data.terms;
          console.log(terms);
          const trms = terms.map((i) => ({
            id: i.id || "",
            duration: i.duration || "",
            term: i.term || "",
            days: i.days || "",
          }));

          setData(trms);
        }
      })
      .catch((err) => {
        console.error("API request failed:", err);
      });
  }

  useEffect(() => {
    fetchTerms();
  }, []);

  function handleDeleteTerm(id) {
    Swal.fire({
      title: `Delete Payment Term?`,
      text: "All details will be erased.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (id != "" && result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_payment_term/${id}/`)
          .then((res) => {
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Term removed.",
              });
              fetchTerms();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  const header = (
    <div className="table-header">
      <InputText
        type="search"
        onInput={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search"
      />
    </div>
  );

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
              <div className="Payment_terms py-4">
                <div className="row">
                  <div className="col-md-12">
                    <div
                      className="pay_terms p-3"
                      style={{ backgroundColor: "#eae9c4" }}
                    >
                      <div className="row mb-2">
                        <div className="col-12 col-lg-12 col-xl-12">
                          <div
                            className="card"
                            style={{ backgroundColor: "#ddddbeed" }}
                          >
                            <div className="row no-gutters">
                              <div className="col-md-2" />
                              <div className="col-md-8 mt-4 mb-4">
                                <center>
                                  <h4 className="card-title text-dark">
                                    PAYMENT TERMS
                                  </h4>
                                </center>
                              </div>
                              <div className="col-md-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <Link to="/add_payment_terms">
                          <button className="btn btn-sm btn-success">
                            <i className="fas fa-plus me-2" /> ADD NEW
                          </button>
                        </Link>
                      </div>
                      <DataTable
                        value={data}
                        paginator
                        rows={10}
                        header={header}
                        globalFilter={globalFilter}
                      >
                        <Column field="id" header="#" sortable></Column>
                        <Column
                          field="duration"
                          header="Duration"
                          sortable
                        ></Column>
                        <Column field="term" header="Term" sortable></Column>
                        <Column field="days" header="Days" sortable></Column>
                        <Column
                          header="Action"
                          body={(rowData) => (
                            <button
                              className="btn bt-sm btn-outline-danger fa fa-trash mb-1"
                              onClick={() => handleDeleteTerm(`${rowData.id}`)}
                            ></button>
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
    </>
  );
}

export default PaymentTerms;
