import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";
import "./styles/Base.css";
import "./styles/AddItems.css";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../functions/config";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

function EditItem() {
  const ID = Cookies.get("user_id");
  const { itemId } = useParams();
  const navigate = useNavigate();

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

  const [units, setUnits] = useState([]);
  const fetchItemUnits = () => {
    axios
      .get(`${config.base_url}/get_item_units/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          let unt = res.data.units;
          setUnits([]);
          unt.map((i) => {
            let obj = {
              name: i.name,
              symbol: i.symbol,
            };
            setUnits((prevState) => [...prevState, obj]);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchItemUnits();
  }, []);

  const [newUnit, setNewUnit] = useState("");
  const [newUnitSymbol, setNewUnitSymbol] = useState("");
  function handleUnitModalSubmit(e) {
    e.preventDefault();
    var name = newUnit;
    var symbol = newUnitSymbol;
    if (name != "" && symbol != "") {
      var u = {
        Id: ID,
        name: newUnit.toUpperCase(),
        symbol: newUnitSymbol.toUpperCase(),
      };
      axios
        .post(`${config.base_url}/create_new_unit/`, u)
        .then((res) => {
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Unit Created",
            });
            fetchItemUnits();
            setUnit(u.symbol + "-" + u.name);
            setNewUnit("");
            setNewUnitSymbol("");
            document.getElementById("newUnitModalClose").click();
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
    } else {
      alert("Invalid");
    }
  }

  const fetchItemDetails = () => {
    var dt = {
      itemId: itemId,
    };
    axios
      .get(`${config.base_url}/get_item_details/`, { params: dt })
      .then((res) => {
        if (res.data.status) {
          console.log(res);
          let itm = res.data.firstItem;
          setName(itm.name);
          setUnit(itm.unit);
          setHsn(itm.hsn);
          if (itm.tax == "Taxable") {
            setTaxRef(true);
          } else {
            setTaxRef(false);
          }
          setInterStateTax(itm.igst);
          setIntraStateTax(itm.gst);
          setPurchasePrice(itm.purchase_price);
          setSalesPrice(itm.sale_price);
          setStock(res.data.op_stock);
          setBarcode(itm.barcode);
          setPrevBarcode(itm.barcode);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchItemDetails();
  }, []);

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [hsn, setHsn] = useState("");
  const [taxRef, setTaxRef] = useState(true);
  const [interStateTax, setInterStateTax] = useState("");
  const [intraStateTax, setIntraStateTax] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [salesPrice, setSalesPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [barcode, setBarcode] = useState("");
  const [prevBarcode, setPrevBarcode] = useState("");

  function openBarcode() {
    document.getElementById("barcode_div").style.display = "flex";
    document.getElementById("barcode").required = true;
    document.getElementById("barcode").focus();
  }

  function closeBarcode() {
    document.getElementById("barcode_div").style.display = "none";
    document.getElementById("barcode").required = false;
    document.getElementById("barcode").value = "";
  }

  async function checkBarcode() {
    var bc = barcode.toUpperCase();
    if (bc !== "" && bc !== prevBarcode) {
      var data = {
        Id: ID,
        barcode: bc,
      };

      try {
        const res = await axios.get(`${config.base_url}/check_item_barcode/`, {
          params: data,
        });
        if (!res.data.status) {
          alert(res.data.message);
          return false;
        }
      } catch (err) {
        console.log(err);
        return false;
      }
    }

    return true;
  }

  function handleBarcode(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      var bc = event.target.value.toUpperCase();
      if (bc !== "" && bc !== prevBarcode) {
        var data = {
          Id: ID,
          barcode: bc,
        };
        axios
          .get(`${config.base_url}/check_item_barcode/`, { params: data })
          .then((res) => {
            if (!res.data.status) {
              alert(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  function checkBarcodeInput(event) {
    var bc = event.target.value.toUpperCase();
    if (bc != "" && bc != prevBarcode) {
      var data = {
        Id: ID,
        barcode: bc,
      };
      axios
        .get(`${config.base_url}/check_item_barcode/`, { params: data })
        .then((res) => {
          if (!res.data.status) {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function validateHSN(val) {
    var hsn = val;
    if (hsn != "") {
      if (hsn.toString().length < 6) {
        alert("HSN should be a 6 digit or greater number.!");
      }
    }
  }

  function validateForm() {
    if (hsn != "") {
      if (hsn.toString().length < 6) {
        alert("HSN should be a 6 digit or greater number.!");
        return false;
      }
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      item_id: itemId,
      name: name,
      unit: unit,
      hsn: hsn,
      tax_reference: taxRef,
      gst: intraStateTax,
      igst: interStateTax,
      sale_price: salesPrice,
      purchase_price: purchasePrice,
      stock: stock,
      barcode: barcode,
    };

    let valid = validateForm();
    let validBarcode = await checkBarcode();

    if (valid && validBarcode) {
      try {
        const res = await axios.put(`${config.base_url}/update_item/`, dt);
        console.log("PUT RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Item Updated",
          });
          navigate(`/view_item/${itemId}/`);
        } else {
          Swal.fire({
            icon: "error",
            title: `${res.data.message}`,
          });
        }
      } catch (err) {
        console.log("ERROR=", err);
        if (err.response && !err.response.data.status) {
          Swal.fire({
            icon: "error",
            title: `${err.response.data.message}`,
          });
        }
      }
    }
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
        className="container-fluid position-relative d-flex p-0 userAddItems"
        id="userSection"
      >
        <UserSidebar />
        <div className="content">
          <UserNavbar />
          <main style={{ padding: "2rem 1rem" }}>
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
                        onClick={() => navigate(`/view_item/${itemId}/`)}
                      >
                        <i className="fa-solid fa-xmark text-dark fs-5" />
                      </span>
                      <div
                        className="card"
                        style={{ backgroundColor: "#eae9c4" }}
                      >
                        <div className="row no-gutters">
                          <div className="col-md-12 mt-4 mb-4">
                            <center>
                              <h4 className="card-title text-dark">
                                EDIT ITEM
                              </h4>
                            </center>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-lg-12">
                      <form
                        className="needs-validation"
                        onSubmit={handleSubmit}
                      >
                        <div className="row mt-3">
                          <div className="col-md-6 col-lg-6">
                            <div className="form-group">
                              <label htmlFor="item_name">Name</label>
                              <input
                                type="text"
                                name="name"
                                id="item_name"
                                className="form-control"
                                autoComplete="off"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-6">
                            <div className="form-group">
                              <label htmlFor="item_hsn">HSN</label>
                              <input
                                type="number"
                                name="hsn"
                                id="item_hsn"
                                className="form-control"
                                autoComplete="off"
                                value={hsn}
                                onChange={(e) => setHsn(e.target.value)}
                                onBlur={(e) => validateHSN(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-6 col-lg-6">
                            <div className="form-group">
                              <label htmlFor="">Unit</label>
                              <div className="d-flex">
                                <select
                                  className="form-control"
                                  name="item_unit"
                                  id="item_units"
                                  value={unit}
                                  onChange={(e) => setUnit(e.target.value)}
                                  required
                                >
                                  <option value="">Choose...</option>
                                  <option value="BTL-BOTTLES">
                                    BTL-BOTTLES
                                  </option>
                                  <option value="BOX-BOX">BOX-BOX</option>
                                  <option value="NOS-NUMBER">NOS-NUMBER</option>

                                  {units &&
                                    units.map((a) => (
                                      <option
                                        value={`${a.symbol}-${a.name}`}
                                        style={{ textTransform: "Uppercase" }}
                                      >
                                        {a.symbol}
                                        {"-"}
                                        {a.name}
                                      </option>
                                    ))}
                                </select>
                                <a href="#" className="ms-2">
                                  <button
                                    type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target="#create_unit"
                                    className="btn btn-outline-light"
                                  >
                                    <i className="fa fa-plus text-dark" />
                                  </button>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-6" />
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-4 col-lg-4">
                            <label htmlFor="item_name" className="mb-2">
                              Tax Reference
                            </label>
                            <div className="form-group">
                              <div className="d-block">
                                <label htmlFor="taxable">Taxable</label>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="tax_ref"
                                    onChange={(e) =>
                                      setTaxRef(!e.target.checked)
                                    }
                                    checked={!taxRef}
                                    id="tax_ref"
                                  />
                                  <span className="slider round" />
                                </label>
                                <label htmlFor="non-taxable">Non Taxable</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="row mt-3"
                          style={{ display: taxRef ? "flex" : "none" }}
                        >
                          <div className="col-md-6 col-lg-6 taxInputs">
                            <div className="form-group">
                              <label htmlFor="taxGST">Intra-State TAX</label>
                              <select
                                name="intraStateTax"
                                className="form-control"
                                id="taxGST"
                                value={intraStateTax}
                                onChange={(e) =>
                                  setIntraStateTax(e.target.value)
                                }
                              >
                                <option value="GST0[0%]">GST0[0%]</option>
                                <option value="GST3[3%]">GST3[3%]</option>
                                <option value="GST5[5%]">GST5[5%]</option>
                                <option value="GST12[12%]">GST12[12%]</option>
                                <option value="GST18[18%]">GST18[18%]</option>
                                <option value="GST28[28%]">GST28[28%]</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-6 taxInputs">
                            <div className="form-group">
                              <label htmlFor="taxIGST">Inter-State TAX</label>
                              <select
                                name="interStateTax"
                                className="form-control"
                                id="taxIGST"
                                value={interStateTax}
                                onChange={(e) =>
                                  setInterStateTax(e.target.value)
                                }
                              >
                                <option value="IGST0[0%]">IGST0[0%]</option>
                                <option value="IGST3[3%]">IGST3[3%]</option>
                                <option value="IGST5[5%]">IGST5[5%]</option>
                                <option value="IGST12[12%]">IGST12[12%]</option>
                                <option value="IGST18[18%]">IGST18[18%]</option>
                                <option value="IGST28[28%]">IGST28[28%]</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-6 col-lg-6">
                            <label htmlFor="">Sale Price</label>
                            <div className="form-group d-flex">
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="INR"
                                style={{ width: 60 }}
                              />
                              <input
                                type="number"
                                name="sale_price"
                                className="form-control"
                                id="salePrice"
                                value={salesPrice}
                                onChange={(e) => setSalesPrice(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-6">
                            <label htmlFor="">Purchase Price</label>
                            <div className="form-group d-flex">
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="INR"
                                style={{ width: 60 }}
                              />
                              <input
                                type="number"
                                name="purchase_price"
                                className="form-control"
                                id="purchasePrice"
                                value={purchasePrice}
                                onChange={(e) =>
                                  setPurchasePrice(e.target.value)
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-6 col-lg-6">
                            <div className="form-group">
                              <label htmlFor="opening_stock">
                                Opening Stock
                              </label>
                              <input
                                type="number"
                                name="stock"
                                id="item_stock"
                                className="form-control"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-6 col-lg-6">
                            <button
                              className="barcode_btn btn-sm mb-1"
                              type="button"
                              onClick={openBarcode}
                              title="ADD BARCODE"
                            >
                              UPDATE <i className="fa fa-barcode" />
                            </button>
                            <div
                              className="align-items-center"
                              id="barcode_div"
                              style={{ display: "none" }}
                            >
                              <input
                                type="text"
                                name="barcode"
                                id="barcode"
                                placeholder="Scan or enter barcode.."
                                className="form-control text-uppercase"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                onKeyDown={handleBarcode}
                              />
                              <i
                                className="fas fa-close ms-1"
                                style={{ cursor: "pointer" }}
                                onClick={closeBarcode}
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

      {/* Unit Create Modal */}
      <div
        className="modal fade"
        id="create_unit"
        tabIndex={-1}
        aria-labelledby="create_unitLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content" style={{ background: "#ddddbe" }}>
            <div
              className="modal-header"
              style={{ borderBottom: "1px solid #ffffff" }}
            >
              <h5 className="modal-title text-dark" id="create_unitLabel">
                Create New Unit
              </h5>
              <button
                type="button"
                className="btn-close"
                id="newUnitModalClose"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form
              method="post"
              className="needs-validation"
              id="newunitform"
              onSubmit={handleUnitModalSubmit}
            >
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="item_unitsymbol">Unit Symbol</label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    name="unit_symbol"
                    id="item_unitsymbol"
                    value={newUnitSymbol}
                    onChange={(e) => setNewUnitSymbol(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mt-2">
                  <label htmlFor="item_unitname">Unit Name</label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    name="unit_name"
                    id="item_unitname"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    required
                  />
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
    </>
  );
}

export default EditItem;
