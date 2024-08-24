import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import config from "../../functions/config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

function Login() {
  const [logUsername, setLogUsername] = useState("");
  const [logPassword, setLogPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = {
      username: logUsername,
      password: logPassword,
    };

    axios
      .post(`${config.base_url}/user_login/`, loginData)
      .then((res) => {
        if (res.data.status) {
          if (res.data.is_staff) {
            navigate("/registered_clients");
          } else {
            navigate("/dashboard");
          }
          Cookies.set("user_id", res.data.user);
          Cookies.set("access", res.data.access);
          Cookies.set("refresh", res.data.refresh);
          Cookies.set("role", res.data.role);
        } else if (!res.data.status) {
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
    <div className="loginBody">
      <div className="container-fluid">
        <div className="login-section">
          <div className="row">
            <div className="col-md-6 col-lg-6">
              <div className="panel left-panel">
                <div className="content d-flex justify-content-center w-100">
                  <h3>Welcome Back.!</h3>
                </div>
                <img
                  src={`${process.env.PUBLIC_URL}/static/assets/img/sup_log.jpg`}
                  className="image"
                  alt=""
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-6 px-0">
              <div className="login-form-section">
                <form className="sign-in-form" onSubmit={handleLogin}>
                  <h2 className="title text-uppercase">LOGIN</h2>
                  <div className="input-field">
                    <i className="fas fa-user" />
                    <input
                      type="text"
                      placeholder="Username"
                      name="username"
                      value={logUsername}
                      onChange={(e) => setLogUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-field">
                    <i className="fas fa-lock" />
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={logPassword}
                      onChange={(e) => setLogPassword(e.target.value)}
                      required
                    />
                  </div>
                  <input
                    type="submit"
                    defaultValue="Login"
                    className="btn bttn solid"
                  />
                  <a
                    href="#forgot_password"
                    data-bs-toggle="modal"
                    className="forgot-password"
                  >
                    Forgot password...?
                  </a>
                  <msg />
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="register-section" style={{ display: "none" }}>
          <div className="row">
            <div className="col-md-6 col-lg-6 px-0">
              <div className="reg-form-section">
                <form
                  action="#"
                  method="post"
                  className="sign-up-form"
                  id="register-form"
                >
                  <h2 className="title text-uppercase">REGISTER</h2>
                  <div className="input-field">
                    <i className="fas fa-user" />
                    <input
                      type="text"
                      placeholder="Username"
                      name="username"
                      id="user"
                      required=""
                    />
                  </div>
                  <div className="input-field">
                    <i className="fas fa-envelope" />
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                      id="email"
                      required=""
                    />
                  </div>
                  <div className="input-field">
                    <i className="fas fa-phone" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      name="phone"
                      id="phone"
                      title="Ex: 9048986656"
                      required=""
                    />
                  </div>
                  <div className="input-field">
                    <i className="fa fa-building" />
                    <input
                      type="text"
                      placeholder="Company Name"
                      name="company"
                      id="company"
                      required=""
                    />
                  </div>
                  <div className="input-field">
                    <i className="fa fa-pencil" />
                    <input
                      type="text"
                      placeholder="GST Number"
                      name="gstnum"
                      id="gstin"
                      title="Ex: 22AAAAA0000A1Z5"
                    />
                    <div
                      className="text-danger"
                      style={{
                        fontSize: "0.85rem",
                        width: "max-content",
                        fontWeight: 600,
                      }}
                      id="gstErr"
                    />
                  </div>
                  <div className="input-field textarea">
                    {/* <i className="fa fa-address-card"></i> */}
                    <textarea
                      name="address"
                      placeholder="Address"
                      id="address"
                      cols=""
                      rows={3}
                      required=""
                      defaultValue={""}
                    />
                  </div>
                  <div className="input-field">
                    <i className="fa fa-globe" />
                    <input
                      type="text"
                      placeholder="Country"
                      name="country"
                      id="couuntry"
                      required=""
                    />
                  </div>
                  <div className="input-field">
                    <i className="fa fa-map-signs" />
                    {/* <input type="text" placeholder="State" name="state" id="state" required/> */}
                    <select
                      className="form-control"
                      id="state"
                      name="state"
                      style={{ border: "none" }}
                      required=""
                    >
                      <option value="" selected="">
                        Choose State..
                      </option>
                      <option value="Andaman and Nicobar Islads">
                        Andaman and Nicobar Islads
                      </option>
                      <option value="Andhra Predhesh">Andhra Predhesh</option>
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
                      <option value="Daman and Diu">Daman and Diu</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Predesh">Himachal Predesh</option>
                      <option value="Jammu and Kashmir">
                        Jammu and Kashmir
                      </option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Ladakh">Ladakh</option>
                      <option value="Lakshadweep">Lakshadweep</option>
                      <option value="Madhya Predesh">Madhya Predesh</option>
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
                      <option value="Uttar Predesh">Uttar Predesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Other Territory">Other Territory</option>
                    </select>
                  </div>
                  <div className="input-field">
                    <i className="fas fa-lock" />
                    <input
                      type="password"
                      placeholder="Password"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                      name="password"
                      id="pwd"
                    />
                    <div
                      className="text-danger"
                      style={{ fontSize: "0.85rem", width: "max-content" }}
                      id="passErr"
                    />
                  </div>
                  <div className="input-field">
                    <i className="fas fa-lock" />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                      name="confirmPassword"
                      id="cnfpwd"
                    />
                    <div
                      className="text-danger"
                      style={{ fontSize: "0.85rem", width: "max-content" }}
                      id="cnfrmPassErr"
                    />
                  </div>
                  <input
                    type="submit"
                    className="btn bttn"
                    defaultValue="Sign up"
                  />
                </form>
              </div>
            </div>
            <div className="col-md-6 col-lg-6">
              <div className="panel right-panel">
                <div className="content">
                  <h3>Already have an account ?</h3>
                  <p>Sign In from here.!</p>
                  <button className="btn transparent" id="sign-in-btn">
                    Sign in
                  </button>
                </div>
                <img
                  src="{% static 'assets/img/sup_reg.jpg' %}"
                  className="image"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      <div
        className="modal fade"
        id="forgot_password"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="forgot_passwordLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content" style={{ background: "#ddddbe" }}>
            <div
              className="modal-header"
              style={{ borderBottom: "1px solid #ffffff" }}
            >
              <h5 className="modal-title text-dark" id="forgot_passwordLabel">
                Forgot Password
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form
                method="post"
                className="needs-validation w-100"
                id="forgot_pass_form"
              >
                <div className="form-group w-100">
                  <label htmlFor="item_unitsymbol">
                    Enter Your registered Email ID
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="forgot_email"
                    id="forgot_email"
                    required
                  />
                </div>
              </form>
            </div>
            <div
              className="modal-footer d-flex justify-content-center"
              style={{ borderTop: "1px solid #ffffff" }}
            >
              <button
                type="button"
                id="send_code"
                className="submit_btn w-50 text-uppercase"
              >
                SEND CODE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
