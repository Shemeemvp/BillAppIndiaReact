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
import { useNavigate, useParams } from "react-router-dom";

function EditSales() {
  const ID = Cookies.get("user_id");
  const navigate = useNavigate();
  const { saleId } = useParams();

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

  function checkTax(stateOfSupply) {
    if (stateOfSupply == "State") {
      document.querySelectorAll(".tax_ref").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.querySelectorAll(".tax-gst").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.getElementById("cgst_val").style.display = "grid";
      document.getElementById("sgst_val").style.display = "grid";
      document.getElementById("igst_val").style.display = "none";
    } else {
      document.querySelectorAll(".tax_ref").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.querySelectorAll(".tax-igst").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.getElementById("cgst_val").style.display = "none";
      document.getElementById("sgst_val").style.display = "none";
      document.getElementById("igst_val").style.display = "grid";
    }
  }

  const fetchSalesBillDetails = () => {
    var dt = {
      salesId: saleId,
      Id: ID,
    };
    axios
      .get(`${config.base_url}/get_sale_bill_details/`, { params: dt })
      .then((res) => {
        if (res.data.status) {
          var bill = res.data.bill;
          var itms = res.data.items;
          console.log(itms);

          if (bill.party_name != "" && bill.party_name != null) {
            setParty(true);
          }

          setPartyName(bill.party_name);
          setContact(bill.phone_number);
          setGstIn(bill.gstin);
          setBillNo(bill.bill_number);
          setDate(bill.date);
          setStateOfSupply(bill.state_of_supply);
          setSubTotal(bill.subtotal);
          setIgst(bill.igst);
          setCgst(bill.cgst);
          setSgst(bill.sgst);
          setTaxAmount(bill.tax);
          setAdjustment(bill.adjustment);
          setGrandTotal(bill.total_amount);
          setSalesItems([]);
          const saleItems = itms.map((i, index) => {
            return {
              id: index + 1,
              item: i.item.id,
              hsn: i.hsn,
              quantity: i.quantity,
              price: i.rate,
              taxGst: i.item.gst,
              taxIgst: i.item.igst,
              total: i.total,
              taxAmount: "",
            };
          });

          setSalesItems(saleItems);
          refreshIndexes(saleItems);

          checkTax(bill.state_of_supply);
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
  };

  useEffect(() => {
    fetchSalesBillDetails();
  }, []);

  var currentDate = new Date();
  var formattedDate = currentDate.toISOString().slice(0, 10);

  const [date, setDate] = useState(formattedDate);
  const [billNo, setBillNo] = useState("");
  const [party, setParty] = useState(false);
  const [partyName, setPartyName] = useState("");
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

  // const [salesItems, setSalesItems] = useState([
  //   {
  //     id: 1,
  //     item: "",
  //     hsn: "",
  //     quantity: "",
  //     price: "",
  //     taxGst: "",
  //     taxIgst: "",
  //     total: "",
  //     taxAmount: "",
  //   },
  // ]);

  const [barcode, setBarcode] = useState("");
  const [barcode2, setBarcode2] = useState("");

  const [salesItems, setSalesItems] = useState([]);

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
          focusBarcode();
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

      calc3(updatedItems);
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
        getItemData(value, id);
      } else {
        alert("Select Place of Supply.!");
      }
    } else {
      alert("Item already exists, choose another or change quantity.!");
    }
  };

  function getItemData(item, id) {
    var exists = itemExists(item);
    var plc = stateOfSupply;

    if (!exists) {
      if (plc != "") {
        var itm = {
          Id: ID,
          item: item,
        };

        axios
          .get(`${config.base_url}/get_item_data/`, { params: itm })
          .then((res) => {
            if (res.data.status) {
              var itemData = res.data.itemData;

              setSalesItems((prevItems) =>
                prevItems.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        price: itemData.sale_rate,
                        taxGst: itemData.gst,
                        taxIgst: itemData.igst,
                        hsn: itemData.hsn,
                      }
                    : item
                )
              );
            }
          })
          .catch((err) => {
            console.log("ERROR", err);
          });
      } else {
        alert("Select State of Supply.!");
      }
    } else {
      alert("Item already exists, choose another or change quantity.!");
    }
  }

  useEffect(() => {
    document.getElementById("igst_val").style.display = "none";
    focusBarcode();
  }, []);

  function handleStateOfSupply(val) {
    setStateOfSupply(val);
    refreshTax(val);
  }

  const itemExists = (itemToCheck) => {
    for (const item of salesItems) {
      if (item.item === itemToCheck) {
        return true;
      }
    }
    return false;
  };

  function refreshTax(stateOfSupply) {
    if (stateOfSupply == "State") {
      document.querySelectorAll(".tax_ref").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.querySelectorAll(".tax-gst").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.getElementById("cgst_val").style.display = "grid";
      document.getElementById("sgst_val").style.display = "grid";
      document.getElementById("igst_val").style.display = "none";
    } else {
      document.querySelectorAll(".tax_ref").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.querySelectorAll(".tax-igst").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.getElementById("cgst_val").style.display = "none";
      document.getElementById("sgst_val").style.display = "none";
      document.getElementById("igst_val").style.display = "grid";
    }
    calc2(stateOfSupply);
  }

  function refreshTax2() {
    if (stateOfSupply == "State") {
      document.querySelectorAll(".tax_ref").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.querySelectorAll(".tax-gst").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.getElementById("cgst_val").style.display = "grid";
      document.getElementById("sgst_val").style.display = "grid";
      document.getElementById("igst_val").style.display = "none";
    } else {
      document.querySelectorAll(".tax_ref").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.querySelectorAll(".tax-igst").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.getElementById("cgst_val").style.display = "none";
      document.getElementById("sgst_val").style.display = "none";
      document.getElementById("igst_val").style.display = "grid";
    }
  }

  function refreshValues() {
    refreshTax2();
    calc();
  }

  function extractTaxRate(label) {
    if (label) {
      var match = label.match(/\[(\d+)%\]/);
      if (match && match[1]) {
        return parseFloat(match[1]);
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  const calc3 = (salesItems) => {
    const updatedItems = salesItems.map((item) => {
      let qty = parseInt(item.quantity || 0);
      let price = parseFloat(item.price || 0);

      let tax =
        stateOfSupply === "State"
          ? extractTaxRate(item.taxGst || 0)
          : extractTaxRate(item.taxIgst || 0);

      let total = parseFloat(qty) * parseFloat(price);
      let taxAmt = qty * price * (tax / 100);

      return {
        ...item,
        total: total.toFixed(2),
        taxAmount: taxAmt.toFixed(2),
      };
    });

    setSalesItems(updatedItems);

    calc_total(updatedItems);
  };

  function calc2(stateOfSupply) {
    const updatedItems = salesItems.map((item) => {
      var qty = parseInt(item.quantity || 0);
      var price = parseFloat(item.price || 0);

      if (stateOfSupply == "State") {
        var tax = extractTaxRate(item.taxGst || 0);
      } else {
        var tax = extractTaxRate(item.taxIgst || 0);
      }
      let total = parseFloat(qty) * parseFloat(price);
      let taxAmt = qty * price * (tax / 100);
      return {
        ...item,
        total: total.toFixed(2),
        taxAmount: taxAmt.toFixed(2),
      };
    });

    setSalesItems(updatedItems);
    refreshIndexes(updatedItems);
    calc_total2(updatedItems, stateOfSupply);
  }

  const calc = () => {
    const updatedItems = salesItems.map((item) => {
      var qty = parseInt(item.quantity || 0);
      var price = parseFloat(item.price || 0);

      if (stateOfSupply == "State") {
        var tax = extractTaxRate(item.taxGst || 0);
      } else {
        var tax = extractTaxRate(item.taxIgst || 0);
      }
      let total = parseFloat(qty) * parseFloat(price);
      let taxAmt = qty * price * (tax / 100);
      return {
        ...item,
        total: total.toFixed(2),
        taxAmount: taxAmt.toFixed(2),
      };
    });

    setSalesItems(updatedItems);
    refreshIndexes(updatedItems);
    calc_total(updatedItems);
  };

  function calc_total(salesItems) {
    var total = 0;
    var taxamount = 0;
    salesItems.map((item) => {
      total += parseFloat(item.total || 0);
    });
    salesItems.map((item) => {
      taxamount += parseFloat(item.taxAmount || 0);
    });
    setSubTotal(total.toFixed(2));
    setTaxAmount(taxamount.toFixed(2));

    var adj_val = parseFloat(adjustment || 0);
    var gtot = taxamount + total + adj_val;

    setGrandTotal(gtot.toFixed(2));

    splitTax(taxamount, stateOfSupply);
  }

  function splitTax(taxamount, stateOfSupply) {
    var d = 0;
    if (stateOfSupply == "State") {
      var gst = taxamount / 2;
      setCgst(parseFloat(gst.toFixed(2)));
      setSgst(parseFloat(gst.toFixed(2)));
      setIgst(parseFloat(d.toFixed(2)));
    } else {
      setIgst(taxamount.toFixed(2));
      setCgst(d.toFixed(2));
      setSgst(d.toFixed(2));
    }
  }

  function calc_total2(salesItems, stateOfSupply) {
    var total = 0;
    var taxamount = 0;
    salesItems.map((item) => {
      total += parseFloat(item.total || 0);
    });
    salesItems.map((item) => {
      taxamount += parseFloat(item.taxAmount || 0);
    });
    setSubTotal(total.toFixed(2));
    setTaxAmount(taxamount.toFixed(2));

    var adj_val = parseFloat(adjustment || 0);
    var gtot = taxamount + total + adj_val;

    setGrandTotal(gtot.toFixed(2));
    splitTax2(taxamount, stateOfSupply);
  }

  function splitTax2(taxamount, stateOfSupply) {
    var d = 0;
    if (stateOfSupply == "State") {
      var gst = taxamount / 2;
      setCgst(parseFloat(gst.toFixed(2)));
      setSgst(parseFloat(gst.toFixed(2)));
      setIgst(parseFloat(d.toFixed(2)));
    } else {
      setIgst(taxamount.toFixed(2));
      setCgst(d.toFixed(2));
      setSgst(d.toFixed(2));
    }
  }

  function handleAdjustment(val) {
    setAdjustment(val);
    updateGrandTotalAdj(val);
  }

  function updateGrandTotalAdj(val) {
    var subtot = subTotal;
    var tax = taxAmount;
    var adj = val;
    var gtot = (
      parseFloat(subtot || 0) +
      parseFloat(tax || 0) +
      parseFloat(adj || 0)
    ).toFixed(2);
    setGrandTotal(gtot);
  }

  function refreshIndexes(items) {
    const itms = items.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    setSalesItems(itms);
  }

  function validateForm() {
    var phone = contact;
    var gstin = gstIn;

    const mobPattern = /^\d{10}$/;
    const gstinPattern =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;

    var checkParty = party;
    if (checkParty) {
      if (phone !== "") {
        if (!mobPattern.test(phone)) {
          alert("Invalid.! Mobile Number should have 10 digits..");
          return false;
        }
      }

      if (gstin !== "") {
        if (!gstinPattern.test(gstin)) {
          alert("Invalid GST Number..\n Ex: 22AAAAA0000A1Z5");
          return false;
        }
      }
    }

    // var saleItemsTableBody = document.getElementById("sale-items-table-body");
    // if (saleItemsTableBody.getElementsByTagName("tr").length === 0) {
    //     alert("Add at least one item.!");
    //     return false;
    // }
    if (salesItems.length === 0) {
      alert("Add at least one item.!");
      return false;
    }

    return true;
  }

  function focusBarcode() {
    document.getElementById("barcode").focus();
  }

  function checkItemBarcode() {
    if (barcode2 !== "") {
      const data = {
        Id: ID,
        barcode: barcode2,
      };

      axios
        .get(`${config.base_url}/get_barcode_details/`, { params: data })
        .then((res) => {
          if (res.data.status) {
            const itemData = res.data.itemData;
            var exists = itemExists(itemData.id);
            if (!exists) {
              const newId = salesItems.length + 1;
              const newItem = {
                id: newId,
                item: itemData.id,
                hsn: itemData.hsn,
                quantity: 1,
                price: itemData.sale_rate,
                taxGst: itemData.gst,
                taxIgst: itemData.igst,
                total: "",
                taxAmount: "",
              };

              setSalesItems((prevItems) => {
                const updatedItems = [...prevItems, newItem];

                setBarcode2("");
                focusBarcode();
                refreshTax2();
                calc3(updatedItems);
                return updatedItems.map((item, index) => ({
                  ...item,
                  id: index + 1,
                }));
              });
            } else {
              const items = salesItems.map((item) =>
                item.item === itemData.id
                  ? { ...item, quantity: parseInt(item.quantity) + 1 }
                  : item
              );

              setSalesItems(() => {
                setBarcode2("");
                focusBarcode();
                refreshTax2();
                calc3(items);
                return items.map((item, index) => ({
                  ...item,
                  id: index + 1,
                }));
              });
            }
          } else {
            alert(res.data.message);
            setBarcode2("");
            focusBarcode();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleBarcode(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      var bc = event.target.value.toUpperCase();
      if (bc !== "") {
        const data = {
          Id: ID,
          barcode: bc,
        };

        axios
          .get(`${config.base_url}/get_barcode_details/`, { params: data })
          .then((res) => {
            if (res.data.status) {
              const itemData = res.data.itemData;
              var exists = itemExists(itemData.id);
              if (!exists) {
                const newId = salesItems.length + 1;
                const newItem = {
                  id: newId,
                  item: itemData.id,
                  hsn: itemData.hsn,
                  quantity: 1,
                  price: itemData.sale_rate,
                  taxGst: itemData.gst,
                  taxIgst: itemData.igst,
                  total: "",
                  taxAmount: "",
                };

                setSalesItems((prevItems) => {
                  const updatedItems = [...prevItems, newItem];

                  setBarcode2("");
                  setBarcode("");
                  focusBarcode();
                  refreshTax2();
                  calc3(updatedItems);
                  return updatedItems.map((item, index) => ({
                    ...item,
                    id: index + 1,
                  }));
                });
              } else {
                const items = salesItems.map((item) =>
                  item.item === itemData.id
                    ? { ...item, quantity: parseInt(item.quantity) + 1 }
                    : item
                );

                setSalesItems(() => {
                  setBarcode2("");
                  setBarcode("");
                  focusBarcode();
                  refreshTax2();
                  calc3(items);
                  return items.map((item, index) => ({
                    ...item,
                    id: index + 1,
                  }));
                });
              }
            } else {
              alert(res.data.message);
              setBarcode2("");
              setBarcode("");
              focusBarcode();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  function checkForNull(val) {
    return val !== "" ? val : null;
  }

  function checkForZero(val) {
    return val !== "" ? val : 0.0;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = validateForm();

    const formData = new FormData();
    formData.append("Id", ID);
    formData.append("saleId", saleId);
    formData.append("party", party);
    formData.append("party_name", partyName);
    formData.append("phone_number", contact);
    formData.append("gstin", gstIn);
    formData.append("state_of_supply", stateOfSupply);
    formData.append("bill_number", billNo);
    formData.append("date", date);
    formData.append("subtotal", checkForZero(subTotal));
    formData.append("igst", checkForZero(igst));
    formData.append("cgst", checkForZero(cgst));
    formData.append("sgst", checkForZero(sgst));
    formData.append("tax", checkForZero(taxAmount));
    formData.append("adjustment", checkForZero(adjustment));
    formData.append("total_amount", checkForZero(grandTotal));
    formData.append("salesItems", JSON.stringify(salesItems));

    if (valid) {
      axios
        .put(`${config.base_url}/update_sales/`, formData)
        .then((res) => {
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Sales bill Updated.",
            });
            navigate(`/view_sales_bill/${saleId}/`);
          }
          if (!res.data.status && res.data.message != "") {
            Swal.fire({
              icon: "error",
              title: `${res.data.message}`,
            });
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
                        onClick={() => navigate(`/view_sales_bill/${saleId}/`)}
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
                                EDIT SALE
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
                        className="needs-validation"
                        onSubmit={handleSubmit}
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
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-6">
                            <div className="form-group">
                              <label htmlFor="item_hsn">Invoice No.</label>
                              <input
                                type="number"
                                name="bill_no"
                                id="bill_no"
                                value={billNo}
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
                              checked={party}
                              onChange={(e) => setParty(e.target.checked)}
                            />
                            <span className="slider round" />
                          </label>
                        </div>
                        <div
                          className="row mt-3"
                          id="party_details"
                          style={{ display: party ? "flex" : "none" }}
                        >
                          <div className="col-md-4">
                            <label htmlFor="party_name">Party's Name</label>
                            <input
                              type="text"
                              name="party_name"
                              id="party_name"
                              className="form-control"
                              value={partyName}
                              onChange={(e) => setPartyName(e.target.value)}
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
                              value={contact}
                              onChange={(e) => setContact(e.target.value)}
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
                              value={gstIn}
                              onChange={(e) => setGstIn(e.target.value)}
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
                              value={stateOfSupply}
                              onChange={(e) =>
                                handleStateOfSupply(e.target.value)
                              }
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
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                placeholder="Scan barcode.."
                                className="form-control form-control-sm text-uppercase"
                                autoComplete="off"
                                onKeyDown={handleBarcode}
                              />
                            </div>
                            <input
                              type="text"
                              name="barcode2"
                              id="barcode2"
                              value={barcode2}
                              onChange={(e) => setBarcode2(e.target.value)}
                              onKeyDown={handleBarcode}
                              placeholder="Or enter manually.."
                              className="form-control form-control-sm w-50 ms-2 text-uppercase"
                              title="Type barcode and press Enter key"
                              autoComplete="off"
                            />
                            <button
                              className="btn btn-sm btn-outline-secondary ms-1"
                              title="Check Barcode"
                              onClick={checkItemBarcode}
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
                                {salesItems.map((row) => {
                                  const selectedOptionI = items.find(
                                    (option) => option.value === row.item
                                  );

                                  return (
                                    <tr key={row.id} id={`addr${row.id}`}>
                                      <td className="item_sl_num">{row.id}</td>
                                      <td>
                                        <Select
                                          options={items}
                                          styles={customStyles}
                                          name="item"
                                          placeholder="Item.."
                                          className="w-100"
                                          id={`item${row.id}`}
                                          required
                                          value={selectedOptionI}
                                          onChange={(selectedOption) =>
                                            handleItemChange(
                                              selectedOption
                                                ? selectedOption.value
                                                : "",
                                              row.id
                                            )
                                          }
                                          onBlur={refreshValues}
                                          isClearable
                                          isSearchable
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="hsn[]"
                                          value={row.hsn}
                                          id={`hsn${row.id}`}
                                          placeholder="HSN Code"
                                          className="form-control"
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="qty[]"
                                          placeholder="Quantity"
                                          id={`qty${row.id}`}
                                          value={row.quantity}
                                          onChange={(e) =>
                                            handleSalesItemsInputChange(
                                              row.id,
                                              "quantity",
                                              e.target.value
                                            )
                                          }
                                          onBlur={refreshValues}
                                          className="form-control qty"
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
                                          className="form-control price"
                                          value={row.price}
                                          step="0.00"
                                          min="0"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          name="taxgst[]"
                                          className="form-control tax tax_ref tax-gst"
                                          placeholder="0 %"
                                          id={`taxgst${row.id}`}
                                          style={{
                                            display: "block",
                                          }}
                                          value={row.taxGst}
                                          readOnly
                                        />
                                        <input
                                          type="text"
                                          name="taxigst[]"
                                          className="form-control tax tax_ref tax-igst"
                                          placeholder="0 %"
                                          id={`taxigst${row.id}`}
                                          style={{
                                            display: "none",
                                          }}
                                          value={row.taxIgst}
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="total[]"
                                          id={`total${row.id}`}
                                          className="form-control total"
                                          value={row.total}
                                          step="any"
                                          readOnly
                                        />
                                        <input
                                          type="number"
                                          step="any"
                                          id={`taxamount${row.id}`}
                                          className="form-control taxamount"
                                          value={row.taxAmount}
                                          readOnly
                                          hidden
                                        />
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          id="1"
                                          className="btn remove_row btn-outline-secondary w-100"
                                          title="Remove Row"
                                          onClick={() => removeRow(row.id)}
                                        >
                                          -
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                              <tbody>
                                <tr>
                                  <td>
                                    <button
                                      type="button"
                                      id="add_row_btn"
                                      className="btn btn-outline-secondary w-100"
                                      title="Add Row"
                                      onClick={addNewRow}
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
                                    value={subTotal}
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
                                style={{
                                  display:
                                    stateOfSupply == "State" ? "grid" : "none",
                                }}
                              >
                                <div className="cgst_head_label">
                                  <label>CGST</label>
                                </div>
                                <div className="val">
                                  <input
                                    type="number"
                                    placeholder={0.0}
                                    value={cgst}
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
                                style={{
                                  display:
                                    stateOfSupply == "State" ? "grid" : "none",
                                }}
                              >
                                <div className="sgst_head_label">
                                  <label>SGST</label>
                                </div>
                                <div className="val">
                                  <input
                                    type="number"
                                    placeholder={0.0}
                                    value={sgst}
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
                                style={{
                                  display:
                                    stateOfSupply == "State" ? "none" : "grid",
                                }}
                              >
                                <div className="igst_head_label">
                                  <label>IGST</label>
                                </div>
                                <div className="val">
                                  <input
                                    type="number"
                                    placeholder={0.0}
                                    value={igst}
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
                                    value={taxAmount}
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
                                    value={adjustment}
                                    onChange={(e) =>
                                      handleAdjustment(e.target.value)
                                    }
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
                                    value={grandTotal}
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

export default EditSales;
