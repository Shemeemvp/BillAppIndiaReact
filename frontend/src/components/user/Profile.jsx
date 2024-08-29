import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";
import "./styles/Base.css";
import "./styles/Styles.css";
import "./styles/Profile.css";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../functions/config";
import Cookies from "js-cookie";

function Profile() {
  const ID = Cookies.get("user_id");

  const [updateLogo, setUpdateLogo] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [logo, setLogo] = useState(null);

  const [company, setCompany] = useState({});
  const [companyLogo, setCompanyLogo] = useState(null);

  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstIn, setGstIn] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const getUserDetails = () => {
    axios
      .get(`${config.base_url}/user_details/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          const details = res.data.data;
          let cmp = details.company;
          setCompany(cmp);
          var logImg = null;
          if (details.image) {
            logImg = `${config.base_url}/${details.image}`;
            setUpdateLogo(true);
          }
          setCompanyLogo(logImg);
          setUserName(cmp.user.username);
          setCompanyName(cmp.company_name);
          setGstIn(cmp.gst_number);
          setEmail(cmp.user.email);
          setContact(cmp.phone_number);
          setAddress(cmp.address);
          setState(cmp.state);
          setCountry(cmp.country);
        }
      })
      .catch((err) => {
        console.log("ERROR==", err);
      });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleLogoUpdate = (e) => {
    e.preventDefault();

    if (logo) {
      var formData = new FormData();
      formData.append("logo", logo);
      formData.append("Id", ID);
      axios
        .put(`${config.base_url}/update_company_logo/`, formData)
        .then((res) => {
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Logo Updated.!",
            });
            setUpdateLogo(false);
            getUserDetails();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    let valid = await validateForm();

    var profileData = {
      Id: ID,
      username: userName,
      email: email,
      company_name: companyName,
      phone_number: contact,
      gst_number: gstIn,
      address: address,
      state: state,
      country: country,
    };

    if (valid) {
      axios
        .post(`${config.base_url}/update_profile_data/`, profileData)
        .then((res) => {
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Profile Updated.!",
            });
            getUserDetails();
            setUpdateProfile(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  function handleRemoveLogo() {
    Swal.fire({
      title: "Remove Company Logo ?",
      text: "Logo will be removed permanently.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        var data = {
          Id: ID,
        };
        axios
          .post(`${config.base_url}/remove_company_logo/`, data)
          .then((res) => {
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Logo Removed.!",
              });
              getUserDetails();
              setUpdateLogo(false);
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

  async function validateForm() {
    if (email != "" && email != company.user.email) {
      var em = {
        email: email,
      };
      await axios
        .get(`${config.base_url}/validate_email/`, { params: em })
        .then((res) => {
          if (res.data.is_taken) {
            document.getElementById("email_err").textContent =
              'Email "' + email + '" already exists..';
            return false;
          } else {
            document.getElementById("email_err").textContent = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (email == "") {
      document.getElementById("email_err").textContent = "Email is required..";
      return false;
    }

    if (userName != "" && userName != company.user.username) {
      var us = {
        user: userName,
      };
      await axios
        .get(`${config.base_url}/validate_username/`, { params: us })
        .then((res) => {
          if (res.data.is_taken) {
            document.getElementById("username_err").textContent =
              'Username "' + userName + '" already exists..';
            return false;
          } else {
            document.getElementById("username_err").textContent = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (userName == "") {
      document.getElementById("username_err").textContent =
        "Username is required..";
      return false;
    }

    if (contact != "" && contact != company.phone_number) {
      var em = {
        phone: contact,
      };
      await axios
        .get(`${config.base_url}/validate_phone_number/`, { params: em })
        .then((res) => {
          if (res.data.is_taken) {
            document.getElementById("phone_err").textContent =
              'Phone number "' + contact + '" already exists..';
            return false;
          } else {
            document.getElementById("phone_err").textContent = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (contact == "") {
      document.getElementById("phone_err").textContent =
        "Phone number is required..";
      return false;
    }

    if (companyName != "" && companyName != company.company_name) {
      var cmp = {
        company: companyName,
      };
      await axios
        .get(`${config.base_url}/validate_company_name/`, { params: cmp })
        .then((res) => {
          if (res.data.is_taken) {
            document.getElementById("cname_err").textContent =
              'Company "' + companyName + '" already exists..';
            return false;
          } else {
            document.getElementById("cname_err").textContent = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (companyName == "") {
      document.getElementById("cname_err").textContent =
        "Company Name is required..";
      return false;
    }

    return true;
  }

  function checkEmail(email) {
    // var email = document.getElementById("email").value.trim();
    if (email != "" && email != company.user.email) {
      var em = {
        email: email,
      };
      axios
        .get(`${config.base_url}/validate_email/`, { params: em })
        .then((res) => {
          if (res.data.is_taken) {
            document.getElementById("email_err").textContent =
              'Email "' + email + '" already exists..';
            setEmail("");
          } else {
            document.getElementById("email_err").textContent = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (email == "") {
      document.getElementById("email_err").textContent = "Email is required..";
    } else {
      document.getElementById("email_err").textContent = "";
    }
  }

  function checkUsername(user) {
    if (user != "" && user != company.user.username) {
      var us = {
        user: user,
      };
      axios
        .get(`${config.base_url}/validate_username/`, { params: us })
        .then((res) => {
          if (res.data.is_taken) {
            document.getElementById("username_err").textContent =
              'Username "' + user + '" already exists..';
            setUserName("");
          } else {
            document.getElementById("username_err").textContent = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (user == "") {
      document.getElementById("username_err").textContent =
        "Username is required..";
    } else {
      document.getElementById("username_err").textContent = "";
    }
  }

  function checkPhone(phone) {
    // var phone = document.getElementById("phone").value.trim();
    if (phone != "" && phone != company.phone_number) {
      var em = {
        phone: phone,
      };
      axios
        .get(`${config.base_url}/validate_phone_number/`, { params: em })
        .then((res) => {
          if (res.data.is_taken) {
            document.getElementById("phone_err").textContent =
              'Phone number "' + phone + '" already exists..';
            setContact("");
          } else {
            document.getElementById("phone_err").textContent = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (phone == "") {
      document.getElementById("phone_err").textContent =
        "Phone number is required..";
    } else {
      document.getElementById("phone_err").textContent = "";
    }
  }

  function checkCompany(cmp) {
    if (cmp != "" && cmp != company.company_name) {
      var cmp = {
        company: cmp,
      };
      axios
        .get(`${config.base_url}/validate_company_name/`, { params: cmp })
        .then((res) => {
          if (res.data.is_taken) {
            document.getElementById("cname_err").textContent =
              'Company "' + cmp + '" already exists..';
            setCompanyName("");
          } else {
            document.getElementById("cname_err").textContent = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (cmp == "") {
      document.getElementById("cname_err").textContent =
        "Company Name is required..";
    } else {
      document.getElementById("cname_err").textContent = "";
    }
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
        className="container-fluid position-relative d-flex p-0 userProfile"
        id="userSection"
      >
        <UserSidebar />
        <div className="content">
          <UserNavbar />
          <main>
            <div className="container-fluid pt-4 px-4">
              <div className="row">
                <div className="col-md-4">
                  <div className="left_box w-100">
                    <div className="logo_section w-100 my-4 mb-1">
                      <div className="logo_img d-flex justify-content-center align-items-center">
                        {companyLogo != null ? (
                          <img
                            className="img-fluid rounded-circle w-75"
                            src={companyLogo}
                            alt={company.company_name}
                            id="company_logo"
                          />
                        ) : (
                          <img
                            className="img-fluid rounded-circle w-75"
                            src={`${process.env.PUBLIC_URL}/static/assets/img/no-image.webp`}
                            alt={company.company_name}
                            id="company_logo"
                          />
                        )}
                      </div>
                      <div className="logo_change_btn_section">
                        {!companyLogo ? (
                          <div className="upload-log-seg py-1">
                            <div className="upload-btn d-flex justify-content-center">
                              <button
                                className="btn btn-outline-primary btn-sm my-3"
                                id="update-logo-btn"
                                onClick={() => setUpdateLogo(!updateLogo)}
                                style={{
                                  display: updateLogo ? "none" : "block",
                                }}
                              >
                                Update Logo
                              </button>
                            </div>
                            <div
                              className="logo-input-seg"
                              id="logo-input-seg"
                              style={{ display: updateLogo ? "block" : "none" }}
                            >
                              <form
                                className="form"
                                onSubmit={handleLogoUpdate}
                                encType="multipart/form-data"
                              >
                                <div className="form-group">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={(e) => setLogo(e.target.files[0])}
                                    name="logo"
                                    id="inputLogo"
                                    required
                                  />
                                </div>
                                <div className="w-100 d-flex justify-content-center pt-1">
                                  <input
                                    type="submit"
                                    className="btn btn-outline-success actionbuttons me-2 btn-sm"
                                    id=""
                                    defaultValue="SAVE"
                                  />
                                  <input
                                    type="button"
                                    className="btn btn-info actionbuttons btn-sm"
                                    id="logo-input-cancel"
                                    defaultValue="CANCEL"
                                    onClick={() => setUpdateLogo(!updateLogo)}
                                  />
                                </div>
                              </form>
                            </div>
                          </div>
                        ) : (
                          <div className="upload-image-seg py-1">
                            <div className="upload-btn d-flex justify-content-center">
                              <button
                                className="btn btn-outline-danger btn-sm my-3"
                                onClick={handleRemoveLogo}
                                id="remove-image-btn"
                              >
                                <span>
                                  <i className="bx bx-trash" />
                                </span>
                                Remove Logo
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="cname_section w-100 my-1">
                      <div className="cmp_name d-flex justify-content-center align-items-center mb-2">
                        <h2 className="cmp_name_label">
                          {company.company_name}
                        </h2>
                      </div>
                      <div className="cmp_gst d-flex align-items-center justify-content-center">
                        <label htmlFor="" className="me-1">
                          GSTIN:
                        </label>
                        <h6 className="cmp_name_label mb-0">
                          {company.gst_number ? company.gst_number : "N/A"}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div
                    className="right_box w-100"
                    id="edit_profile_section"
                    style={{ display: updateProfile ? "none" : "block" }}
                  >
                    <div className="head_section w-100 my-2">
                      <div className="profile_header d-flex justify-content-between align-items-center px-3">
                        <div className="hd">
                          <h3>Profile</h3>
                        </div>
                        <div className="edit-btn">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            id="edit_profile_btn"
                            onClick={() => setUpdateProfile(!updateProfile)}
                          >
                            EDIT
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="prof_data w-100 px-3">
                      <div className="data_entr cmp_eml">
                        <div className="h">
                          <span className="data_head">Email</span>
                        </div>
                        <div className="val">
                          <span className="data">
                            {company?.user?.email || "Loading..."}
                          </span>
                        </div>
                      </div>
                      <hr />
                      <div className="data_entr cmp_gst">
                        <div className="h">
                          <span className="data_head">GSTIN</span>
                        </div>
                        <div className="val">
                          <span className="data">
                            {company.gst_number ? company.gst_number : "N/A"}
                          </span>
                        </div>
                      </div>
                      <hr />
                      <div className="data_entr cmp_cntct">
                        <div className="h">
                          <span className="data_head">Contact</span>
                        </div>
                        <div className="val">
                          <span className="data">{company.phone_number}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="data_entr cmp_adrs">
                        <div className="h">
                          <span className="data_head">Address</span>
                        </div>
                        <div className="val">
                          <span className="data text-end">
                            {company.address}
                          </span>
                        </div>
                      </div>
                      <hr />
                      <div className="data_entr cmp_st">
                        <div className="h">
                          <span className="data_head">State</span>
                        </div>
                        <div className="val">
                          <span className="data">{company.state}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="data_entr cmp_cntry">
                        <div className="h">
                          <span className="data_head">Country</span>
                        </div>
                        <div className="val">
                          <span className="data">{company.country}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* EDIT Form */}
                  <div
                    className="edit_data_section w-100"
                    style={{ display: !updateProfile ? "none" : "block" }}
                    id="edit_profile_form_section"
                  >
                    <div className="head d-flex justify-content-between px-3 mb-2">
                      <div className="label">
                        <h3>EDIT PROFILE</h3>
                      </div>
                      <div className="close_btn">
                        <button
                          className="btn btn-sm"
                          id="close_form_btn"
                          onClick={() => setUpdateProfile(!updateProfile)}
                        >
                          <i className="fa fa-close fs-5" />
                        </button>
                      </div>
                    </div>
                    <div className="edit_profile_form px-3">
                      <form
                        className="form edit_profile_form"
                        onSubmit={handleProfileUpdate}
                      >
                        <div className="row form-group">
                          <div className="col-md-6">
                            <label htmlFor="">Username</label>
                            <input
                              type="text"
                              required
                              name="username"
                              id="uname"
                              className="form-control"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              onBlur={(e) => checkUsername(e.target.value)}
                            />
                            <div className="text-danger" id="username_err" />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="">Company Name</label>
                            <input
                              type="text"
                              required
                              name="company_name"
                              id="cname"
                              className="form-control"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              onBlur={(e) => checkCompany(e.target.value)}
                            />
                            <div className="text-danger" id="cname_err" />
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-md-6">
                            <label htmlFor="">Email</label>
                            <input
                              type="text"
                              required
                              name="email"
                              id="cemail"
                              className="form-control"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onBlur={(e) => checkEmail(e.target.value)}
                              pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                              title="Incorrect Email format.!"
                            />
                            <div className="text-danger" id="email_err" />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="">GSTIN</label>
                            <input
                              type="text"
                              name="gst_number"
                              id="cgstin"
                              pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}"
                              title="Ex: 22AAAAA0000A1Z5"
                              className="form-control"
                              value={gstIn}
                              onChange={(e) => setGstIn(e.target.value)}
                            />
                            <div className="text-danger" id="gstin_err" />
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-md-6">
                            <label htmlFor="">Contact</label>
                            <input
                              type="text"
                              required
                              name="phone_number"
                              id="cmobile"
                              className="form-control"
                              value={contact}
                              onChange={(e) => setContact(e.target.value)}
                              onBlur={(e) => checkPhone(e.target.value)}
                              pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                              title="Phone Number must have 10 digits"
                            />
                            <div className="text-danger" id="phone_err" />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="">State</label>
                            <select
                              className="form-control"
                              id="cstate"
                              name="state"
                              style={{ border: "none" }}
                              required
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                            >
                              <option value="" selected="">
                                Choose State..
                              </option>
                              <option value="Andaman and Nicobar Islads">
                                Andaman and Nicobar Islads
                              </option>
                              <option value="Andhra Predhesh">
                                Andhra Predhesh
                              </option>
                              <option value="Arunachal Predesh">
                                Arunachal Predesh
                              </option>
                              <option value="Assam">Assam</option>
                              <option value="Bihar">Bihar</option>
                              <option value="Chandigarh">Chandigarh</option>
                              <option value="Chhattisgarh">Chhattisgarh</option>
                              <option value="Dadra and Nagar Haveli">
                                Dadra and Nagar Haveli
                              </option>
                              <option value="Daman and Diu">
                                Daman and Diu
                              </option>
                              <option value="Delhi">Delhi</option>
                              <option value="Goa">Goa</option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="Haryana">Haryana</option>
                              <option value="Himachal Predesh">
                                Himachal Predesh
                              </option>
                              <option value="Jammu and Kashmir">
                                Jammu and Kashmir
                              </option>
                              <option value="Jharkhand">Jharkhand</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Kerala">Kerala</option>
                              <option value="Ladakh">Ladakh</option>
                              <option value="Lakshadweep">Lakshadweep</option>
                              <option value="Madhya Predesh">
                                Madhya Predesh
                              </option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Manipur">Manipur</option>
                              <option value="Meghalaya">Meghalaya</option>
                              <option value="Mizoram">Mizoram</option>
                              <option value="Nagaland">Nagaland</option>
                              <option value="Odisha">Odisha</option>
                              <option value="Puducherry">Puducherry</option>
                              <option value="Punjab">Punjab</option>
                              <option value="Rajasthan">Rajasthan</option>
                              <option value="Sikkim">Sikkim</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Telangana">Telangana</option>
                              <option value="Tripura">Tripura</option>
                              <option value="Uttar Predesh">
                                Uttar Predesh
                              </option>
                              <option value="Uttarakhand">Uttarakhand</option>
                              <option value="West Bengal">West Bengal</option>
                              <option value="Other Territory">
                                Other Territory
                              </option>
                            </select>
                            <div className="text-danger" id="state_err" />
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-md-6">
                            <label htmlFor="">Address</label>
                            <textarea
                              name="address"
                              required
                              id="caddress"
                              cols=""
                              className="form-control"
                              rows={3}
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                            <div className="text-danger" id="address_err" />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="">Country</label>
                            <input
                              type="text"
                              required
                              name="country"
                              id="ccountry"
                              className="form-control"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                            />
                            <div className="text-danger" id="country_err" />
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-md-12 d-flex justify-content-center">
                            <div className="save_btn">
                              <input
                                type="submit"
                                id="edit_form_sub"
                                className="btn btn-outline-success me-2 fw-bold"
                                value="SAVE"
                              />
                            </div>
                          </div>
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

export default Profile;
