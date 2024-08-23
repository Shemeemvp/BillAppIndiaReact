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

function AdminHome() {
  function activeLink() {
    var nav_links = document.querySelectorAll(".nav-item.nav-link");

    for (var i = 0; i < nav_links.length; i++) {
      nav_links[i].classList.remove("active");
      if (nav_links[i].classList.contains("nav-reg-clients")) {
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
      .get(`${config.base_url}/get_registered_clients/`)
      .then((res) => {
        if (res.data.status) {
          const clnts = res.data.clients;

          const cmpns = clnts.map((i, index) => ({
            slno: index + 1,
            id: i.user_id || "",
            companyName: i.company_name || "",
            email: i.email || "",
            contact: i.contact || "",
            gstin: i.gstin || "",
            registeredDate: i.start_date || "",
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

  function handleDeleteClient(id) {
    Swal.fire({
      title: `Delete Client?`,
      text: "All details will be erased.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (id != "" && result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_client/${id}/`)
          .then((res) => {
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "User removed.",
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

  const header = (
    <div className="table-header">
      <InputText
        type="search"
        onInput={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search"
      />
      {/* <span className="p-input-icon-left">
        <i className="pi pi-search" />
      </span> */}
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
              <div className="Registered_clients py-4">
                <div className="row">
                  <div className="col-md-12">
                    <div
                      className="reg_clients px-3 py-3"
                      style={{ backgroundColor: "#eae9c4" }}
                    >
                      <h4 className="ms-2">Registered Clients</h4>
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
                        <Column field="gstin" header="GSTIN" sortable></Column>
                        <Column
                          field="registeredDate"
                          header="Registered Date"
                          sortable
                        ></Column>
                        <Column
                          header=""
                          body={(rowData) => (
                            <button
                              className="btn bt-sm btn-outline-danger fa fa-trash mb-1"
                              onClick={() =>
                                handleDeleteClient(`${rowData.id}`)
                              }
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

export default AdminHome;
