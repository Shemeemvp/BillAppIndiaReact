import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";
import "./styles/Base.css";
import "./styles/Styles.css";
import "./styles/AddSales.css";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../functions/config";
import Cookies from "js-cookie";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

function AddSales() {
  const ID = Cookies.get("user_id");
  const navigate = useNavigate();

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

  var currentDate = new Date();
  var formattedDate = currentDate.toISOString().slice(0, 10);

  const [date, setDate] = useState(formattedDate);
  const [billNo, setBillNo] = useState("");
  const [party, setParty] = useState("");
  const [contact, setContact] = useState("");
  const [gstIn, setGstIn] = useState("");
  const [stateOfSupply, setStateOfSupply] = useState("State");

  const [subTotal, setSubTotal] = useState(0.0);
  const [igst, setIgst] = useState(0.0);
  const [cgst, setCgst] = useState(0.0);
  const [sgst, setSgst] = useState(0.0);
  const [taxAmount, setTaxAmount] = useState(0.0);
  const [adjustment, setAdjustment] = useState(0.0);
  const [grandTotal, setGrandTotal] = useState(0.0);

  const [salesItems, setSalesItems] = useState([
    {
      id: 1,
      item: "",
      hsn: "",
      quantity: "",
      price: "",
      taxGst: "",
      taxIgst: "",
      total: "",
      taxAmount: "",
    },
  ]);

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

  const [items, setItems] = useState([]);

  const fetchSalesData = () => {
    axios
      .get(`${config.base_url}/fetch_sales_data/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          let itms = res.data.items;
          setItems([]);
          const newOptions = itms.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          setItems(newOptions);
          setBillNo(res.data.billNo);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const addNewRow = () => {
    var newItem = {
      id: "",
      item: "",
      hsn: "",
      quantity: "",
      price: "",
      taxGst: "",
      taxIgst: "",
      total: "",
      taxAmount: "",
    };
    setSalesItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];

      return updatedItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const removeRow = (id) => {
    setSalesItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);

      return updatedItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const handleSalesItemsInputChange = (id, field, value) => {
    setSalesItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleItemChange = (value, id) => {
    var exists = itemExists(value);
    if (!exists) {
      if (stateOfSupply != "") {
        handleSalesItemsInputChange(id, "item", value);
        // getItemData(value, id);
      } else {
        alert("Select Place of Supply.!");
      }
    } else {
      alert(
        "Item already exists in the Invoice, choose another or change quantity.!"
      );
    }
  };

  const itemExists = (itemToCheck) => {
    for (const item of salesItems) {
      if (item.item === itemToCheck) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      <div
        className="container-fluid position-relative d-flex p-0 userAddSales"
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
                        onClick={() => navigate("/sales")}
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
                              <h4 className="card-title text-dark">ADD SALE</h4>
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
                        className="needs-validation"
                        onsubmit="return validateForm()"
                        id="salesForm"
                      >
                        <div className="row mt-3">
                          <div className="col-md-6 col-lg-6">
                            <div className="form-group">
                              <label htmlFor="pur_date">Date</label>
                              <input
                                type="date"
                                name="date"
                                id="pur_date"
                                className="form-control"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-6">
                            <div className="form-group">
                              <label htmlFor="item_hsn">Bill No.</label>
                              <input
                                type="number"
                                name="bill_no"
                                id="bill_no"
                                defaultValue="{{bill_no}}"
                                className="form-control"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group mt-3">
                          <label htmlFor="check_party">Party</label>
                          <label className="switch">
                            <input
                              type="checkbox"
                              name="party"
                              id="check_party"
                            />
                            <span className="slider round" />
                          </label>
                        </div>
                        <div
                          className="row mt-3"
                          id="party_details"
                          style={{ display: "none" }}
                        >
                          <div className="col-md-4">
                            <label htmlFor="party_name">Party's Name</label>
                            <input
                              type="text"
                              name="party_name"
                              id="party_name"
                              className="form-control"
                            />
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="party_phone">Phone number</label>
                            <input
                              type="tel"
                              name="party_phone"
                              id="party_phone"
                              className="form-control"
                              title="Ex: 7035541267"
                              placeholder="Ex: 7035541267"
                            />
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="party_gstin">GST IN</label>
                            <input
                              type="text"
                              name="party_gstin"
                              id="party_gstin"
                              className="form-control"
                              placeholder="Ex: 22AAAAA0000A1Z5"
                              title="Ex: 22AAAAA0000A1Z5"
                            />
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-4">
                            <label htmlFor="state_of_supply">
                              State of Supply
                            </label>
                            <select
                              name="stateOfSupply"
                              id="state_of_supply"
                              className="form-control"
                            >
                              <option value="State" selected>
                                State
                              </option>
                              <option value="Other State">Other State</option>
                            </select>
                          </div>
                        </div>
                        <hr />
                        <label htmlFor="" className="my-0 text-muted fw-bold">
                          Add items with barcode
                        </label>
                        <div className="row">
                          <div className="col-md-6 d-flex">
                            <div className="input-with-icon w-50">
                              <i className="bx bx-barcode-reader" />
                              <input
                                type="text"
                                name="barcode"
                                id="barcode"
                                placeholder="Scan barcode.."
                                className="form-control form-control-sm text-uppercase"
                                autoComplete="off"
                              />
                            </div>
                            <input
                              type="text"
                              name="barcode2"
                              id="barcode2"
                              placeholder="Or enter manually.."
                              className="form-control form-control-sm w-50 ms-2 text-uppercase"
                              title="Type barcode and press Enter key"
                              autoComplete="off"
                            />
                            <button
                              className="btn btn-sm btn-outline-secondary ms-1"
                              title="Check Barcode"
                              onClick="checkItemBarcode()"
                              type="button"
                            >
                              <i className="fa fa-check" />
                            </button>
                          </div>
                        </div>
                        <div className="row clearfix mt-1">
                          <div className="col-md-12 table-responsive-md sales-table-container">
                            <table
                              className="table table-bordered table-hover mt-3"
                              id="items_table"
                              style={{
                                backgroundColor: "#eae9c4",
                                borderColor: "white",
                              }}
                            >
                              <thead>
                                <tr>
                                  <th scope="col" className="text-center">
                                    #
                                  </th>
                                  <th scope="col" className="text-center col-2">
                                    ITEM
                                  </th>
                                  <th scope="col" className="text-center col-2">
                                    HSN
                                  </th>
                                  <th scope="col" className="text-center col-2">
                                    QTY
                                  </th>
                                  <th scope="col" className="text-center col-2">
                                    RATE
                                  </th>
                                  <th scope="col" className="text-center col-2">
                                    TAX
                                  </th>
                                  <th scope="col" className="text-center col-2">
                                    AMOUNT
                                  </th>
                                  <th scope="col" className="" />
                                </tr>
                              </thead>
                              <tbody id="sale-items-table-body">
                                {salesItems &&
                                  salesItems.map((row) => (
                                    <tr key={row.id} id={`addr${row.id}`}>
                                      <td class="item_sl_num">{row.id}</td>
                                      <td>
                                        <Select
                                          options={items}
                                          styles={customStyles}
                                          name="item"
                                          placeholder="Item.."
                                          className="w-100"
                                          id={`item${row.id}`}
                                          required
                                          defaultInputValue={row.item}
                                          onChange={(selectedOption) =>
                                            handleItemChange(
                                              selectedOption
                                                ? selectedOption.value
                                                : "",
                                              row.id
                                            )
                                          }
                                          // onBlur={refreshValues}
                                          isClearable
                                          isSearchable
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="hsn[]"
                                          id={`hsn${row.id}`}
                                          placeholder="HSN Code"
                                          class="form-control"
                                        />
                                        <input
                                          type="text"
                                          name="sItems[]"
                                          id={`sitem${row.id}`}
                                          hidden
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="qty[]"
                                          placeholder="Quantity"
                                          id={`qty${row.id}`}
                                          value=""
                                          class="form-control qty"
                                          min="1"
                                          required
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="price[]"
                                          id={`price${row.id}`}
                                          placeholder="Unit Price"
                                          class="form-control price"
                                          step="0.00"
                                          min="0"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          name="taxgst[]"
                                          class="form-control tax tax-gst"
                                          placeholder="0 %"
                                          id={`taxgst${row.id}`}
                                          style={{ display: "block" }}
                                          readOnly
                                        />
                                        <input
                                          type="text"
                                          name="taxigst[]"
                                          class="form-control tax tax-igst"
                                          placeholder="0 %"
                                          id={`taxigst${row.id}`}
                                          style={{ display: "none" }}
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="total[]"
                                          id={`total${row.id}`}
                                          class="form-control total"
                                          value="0"
                                          step="any"
                                          readOnly
                                        />
                                      </td>
                                      <td style={{ display: "none" }}>
                                        <input
                                          type="number"
                                          step="any"
                                          id={`taxamount${row.id}`}
                                          class="form-control taxamount"
                                        />
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          id="1"
                                          class="btn remove_row btn-outline-secondary w-100"
                                          title="Remove Row"
                                          onClick={() => removeRow(row.id)}
                                        >
                                          -
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                              <tbody>
                                <tr>
                                  <td>
                                    <button
                                      type="button"
                                      id="add_row_btn"
                                      className="btn btn-outline-secondary w-100"
                                      title="Add Row"
                                      // onClick={addNewRow}
                                    >
                                      +
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-sm-12 col-md-7" />
                          <div className="col-sm-12 col-md-5">
                            <div
                              className="card px-3 py-4"
                              style={{ backgroundColor: "#eae9c4" }}
                            >
                              <div className="sub_total align-items-center amount_summary">
                                <div className="amt_head_label">
                                  <label>SUB TOTAL</label>
                                </div>
                                <div className="val">
                                  <input
                                    type="number"
                                    placeholder={0.0}
                                    defaultValue={0.0}
                                    className="form-control"
                                    name="subtotal"
                                    id="sub_total"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div
                                className="align-items-center amount_summary"
                                id="cgst_val"
                              >
                                <div className="cgst_head_label">
                                  <label>CGST</label>
                                </div>
                                <div className="val">
                                  <input
                                    type="number"
                                    placeholder={0.0}
                                    defaultValue={0.0}
                                    className="form-control"
                                    name="cgst_tax"
                                    id="cgst_tax"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div
                                className="align-items-center amount_summary"
                                id="sgst_val"
                              >
                                <div className="sgst_head_label">
                                  <label>SGST</label>
                                </div>
                                <div className="val">
                                  <input
                                    type="number"
                                    placeholder={0.0}
                                    defaultValue={0.0}
                                    className="form-control"
                                    name="sgst_tax"
                                    id="sgst_tax"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div
                                className="align-items-center amount_summary"
                                id="igst_val"
                              >
                                <div className="igst_head_label">
                                  <label>IGST</label>
                                </div>
                                <div className="val">
                                  <input
                                    type="number"
                                    placeholder={0.0}
                                    defaultValue={0.0}
                                    className="form-control"
                                    name="igst_tax"
                                    id="igst_tax"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="align-items-center amount_summary">
                                <div className="amt_head_label">
                                  <label>TAX AMOUNT</label>
                                </div>
                                <div className="val">
                                  <input
                                    type="number"
                                    placeholder={0.0}
                                    defaultValue={0.0}
                                    className="form-control"
                                    name="tax"
                                    id="tax"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="adjustment align-items-center amount_summary">
                                <div className="amt_head_label">
                                  <label>ADJUSTMENT</label>
                                </div>
                                <div className="val">
                                  <input
                                    type="number"
                                    placeholder={0.0}
                                    defaultValue={0.0}
                                    className="form-control"
                                    step="any"
                                    name="adjustment"
                                    id="adjustment"
                                  />
                                </div>
                              </div>
                              <div className="grand_total align-items-center amount_summary">
                                <div className="amt_head_label">
                                  <label>GRAND TOTAL</label>
                                </div>
                                <div className="val">
                                  <input
                                    type="number"
                                    placeholder={0.0}
                                    className="form-control"
                                    defaultValue={0.0}
                                    name="grand_total"
                                    id="grand_total"
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-5 mb-5">
                          <div className="col-md-3" />
                          <div className="col-md-3">
                            <button
                              className="submit_btn w-100 text-uppercase"
                              type="submit"
                              name="new_sale"
                            >
                              Save &amp; New
                            </button>
                          </div>
                          <div className="col-md-3">
                            <button
                              className="submit_btn w-100 text-uppercase"
                              type="submit"
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
          <UserFooter />
        </div>
      </div>
    </>
  );
}

export default AddSales;
