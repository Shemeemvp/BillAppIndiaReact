import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";
import "./styles/Base.css";
import "./styles/Styles.css";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../functions/config";
import Cookies from "js-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditTransaction() {
  const navigate = useNavigate();
  const ID = Cookies.get("user_id");
  const { transactionId } = useParams();

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

  const [transaction, setTransaction] = useState({});

  const [transactionType, setTransactionType] = useState("");
  const [transactionQty, setTransactionQty] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const fetchTransactionDetails = () => {
    axios
      .get(`${config.base_url}/get_transaction_details/${transactionId}/`)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          let trns = res.data.transaction;
          setTransaction(trns);
          setTransactionType(trns.type);
          setTransactionQty(trns.quantity);
          setTransactionDate(trns.date);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchTransactionDetails();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    var u = {
      Id: ID,
      trans_id: transaction.id,
      type: transactionType,
      date: transactionDate,
      quantity: transactionQty,
    };
    axios
      .post(`${config.base_url}/update_transaction/`, u)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Transaction Updated",
          });
          navigate(`/view_item/${transaction.item}/`);
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
        className="container-fluid position-relative d-flex p-0"
        id="userSection"
      >
        <UserSidebar />
        <div className="content">
          <UserNavbar />
          <main className="px-2 py-3">
            <div className="page-content">
              <div
                className="card radius-15"
                style={{ backgroundColor: "#ddddbeed" }}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-lg-12 col-xl-12">
                      <span
                        className="d-flex justify-content-end p-2"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/view_item/${transaction.item}/`)
                        }
                      >
                        <i className="fa-solid fa-xmark text-dark fs-5" />
                      </span>
                      <div
                        className="card"
                        style={{ backgroundColor: "#eae9c4" }}
                      >
                        <div className="row no-gutters">
                          <div className="col-md-2" />
                          <div className="col-md-8 mt-4 mb-4">
                            <center>
                              <h4 className="card-title text-dark">
                                EDIT TRANSACTION
                              </h4>
                            </center>
                          </div>
                          <div className="col-md-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-lg-12">
                      <form
                        onSubmit={handleSubmit}
                        method="post"
                        className="needs-validation"
                      >
                        <div className="row mt-3">
                          <div className="col-md-12 col-lg-12">
                            <div className="form-group">
                              <label htmlFor="item_name">Type</label>
                              <input
                                type="text"
                                name="type"
                                value={transactionType}
                                id="item_name"
                                className="form-control"
                                autoComplete="off"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-12 col-lg-12">
                            <div className="form-group">
                              <label htmlFor="item_name">Quantity</label>
                              <input
                                type="text"
                                name="quantity"
                                value={transactionQty}
                                onChange={(e) =>
                                  setTransactionQty(e.target.value)
                                }
                                id="item_name"
                                className="form-control"
                                autoComplete="off"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-12 col-lg-12">
                            <div className="form-group">
                              <label htmlFor="item_name">Date</label>
                              <input
                                type="date"
                                name="date"
                                value={transactionDate}
                                onChange={(e) =>
                                  setTransactionDate(e.target.value)
                                }
                                className="form-control"
                                autoComplete="off"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row mt-5 mb-5">
                          <div className="col-md-4" />
                          <div className="col-md-4">
                            <button
                              className="submit_btn w-100 text-uppercase"
                              type="submit"
                            >
                              Save
                            </button>
                          </div>
                          <div className="col-md-4" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <UserFooter />
        </div>
      </div>
    </>
  );
}

export default EditTransaction;
