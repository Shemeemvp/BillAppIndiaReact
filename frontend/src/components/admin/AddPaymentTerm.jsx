import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNav from "./AdminNav";
import AdminFooter from "./AdminFooter";
import "./AdminBase.css";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../functions/config";
import { useNavigate } from "react-router-dom";

function AddPaymentTerm() {
  const navigate = useNavigate();

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

  const [action, setAction] = useState("new");
  const [duration, setDuration] = useState("");
  const [term, setTerm] = useState("Days");

  const savePaymentTerm = (e) => {
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
          if (action == "save") {
            navigate("/payment_terms");
          } else {
            setDuration("");
            setTerm("Days");
          }
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
            <div className="page-content">
              <div
                className="card radius-15"
                style={{ backgroundColor: "#ddddbeed" }}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-lg-12 col-xl-12">
                      <div
                        className="card"
                        style={{ backgroundColor: "#eae9c4" }}
                      >
                        <div className="row no-gutters">
                          <div className="col-md-2" />
                          <div className="col-md-8 mt-4 mb-4">
                            <center>
                              <h4 className="card-title text-dark">
                                ADD PAYMENT TERM
                              </h4>
                            </center>
                          </div>
                          <div className="col-md-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-9 col-lg-9">
                      <form
                        className="needs-validation"
                        id="paymentForm"
                        onSubmit={savePaymentTerm}
                      >
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
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                step={1}
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
                        <div className="row mt-5 mb-5">
                          <div className="col-md-3" />
                          <div className="col-md-3">
                            <button
                              className="submit_btn w-100 text-uppercase"
                              type="submit"
                              name="next_term"
                              onClick={() => setAction("new")}
                            >
                              Save &amp; Next
                            </button>
                          </div>
                          <div className="col-md-3">
                            <button
                              className="submit_btn w-100 text-uppercase"
                              type="submit"
                              onClick={() => setAction("save")}
                            >
                              Save
                            </button>
                          </div>
                          <div className="col-md-3" />
                        </div>
                      </form>
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

export default AddPaymentTerm;
