import React, { useEffect, useState, useRef } from "react";
import "./Index.css";
import AOS from "aos";
import axios from "axios";
import config from "../../functions/config";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [gstin, setGstin] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  useEffect(() => {
    const backtotop = document.querySelector(".back-to-top");
    const demoButton = document.querySelector(".get-trial-button");

    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop?.classList.add("active");
      } else {
        backtotop?.classList.remove("active");
      }
    };

    const toggleTrialBtn = () => {
      if (window.scrollY > 100) {
        demoButton?.classList.add("active");
      } else {
        demoButton?.classList.remove("active");
      }
    };

    // Add event listeners
    window.addEventListener("scroll", toggleBacktotop);
    window.addEventListener("scroll", toggleTrialBtn);

    // Call the functions to set initial state
    toggleBacktotop();
    toggleTrialBtn();

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("scroll", toggleBacktotop);
      window.removeEventListener("scroll", toggleTrialBtn);
    };
  }, []);

  const [isNavbarMobile, setIsNavbarMobile] = useState(false);

  const scrollTo = (hash) => {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLinkClick = (e, hash) => {
    e.preventDefault();

    const navbar = document.querySelector("#navbar");
    if (navbar.classList.contains("navbar-mobile")) {
      setIsNavbarMobile(false);
    }

    const navbarToggle = document.querySelector(".mobile-nav-toggle");
    if (navbarToggle) {
      navbarToggle.classList.toggle("bi-list");
      navbarToggle.classList.toggle("bi-x");
    }

    scrollTo(hash);
  };

  function togglePasswordVisibility1() {
    const pwd = document.getElementById("pwd");
    if (pwd.type === "text") {
      pwd.type = "password";
    } else {
      pwd.type = "text";
    }
  }

  function togglePasswordVisibility2() {
    const cnfpwd = document.getElementById("cnfpwd");
    if (cnfpwd.type === "text") {
      cnfpwd.type = "password";
    } else {
      cnfpwd.type = "text";
    }
  }

  useEffect(() => {
    setTimeout(function () {
      try {
        const registerTrial = document.getElementById("registerTrial");
        const registerForm = document.getElementById("register-form");
        const formToggler = document.getElementById("trialFormToggler");

        if (!registerTrial.classList.contains("show")) {
          // registerTrial.classList.toggle("show");
          formToggler.click();

          if (!registerForm.classList.contains("form_active")) {
            registerForm.classList.add("form_active");
          }
        }
      } catch (e) {
        console.log(e);
      }
    }, 18000);
  }, []);

  function validate() {
    var pwd = document.getElementById("pwd").value;
    var cnfpwd = document.getElementById("cnfpwd").value;
    var usnm = document.getElementById("user").value;
    var gstin = document.getElementById("gstin").value;
    const gstregex = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
    const mobPattern = /^\d{10}$/;
    const gstinPattern =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;

    var phone = document.getElementById("phone").value;
    var gstinput = document.getElementById("gstin").value;

    if (!mobPattern.test(phone)) {
      alert("Invalid! Mobile Number should have 10 digits.");
      return false;
    }

    if (gstin !== "") {
      if (!gstinPattern.test(gstinput)) {
        alert("Invalid GST Number.\n Ex: 22AAAAA0000A1Z5");
        return false;
      }
    }

    if (pwd.length < 8 || pwd.length > 18) {
      alert("Password length should be 8-18 characters.");
      return false;
    }

    if (pwd !== cnfpwd) {
      alert("Password and confirm password do not match.");
      return false;
    }

    return true;
  }

  document.querySelectorAll(".trialBtn").forEach(function (button) {
    button.addEventListener("click", function () {
      document.getElementById("register-form").classList.add("form_active");
    });
  });

  document.querySelectorAll(".get-trial-button").forEach(function (button) {
    button.addEventListener("click", function () {
      document.getElementById("register-form").classList.add("form_active");
    });
  });

  function deactivateForm() {
    document.getElementById("register-form").classList.remove("form_active");
  }

  function checkEmail(email) {
    // var email = document.getElementById("email").value.trim();
    if (email != "") {
      var em = {
        email: email,
      };
      axios
        .get(`${config.base_url}/validate_email/`, { params: em })
        .then((res) => {
          if (res.data.is_taken) {
            document.getElementById("email").value = "";
            document.getElementById("emailErr").textContent =
              'Email "' + email + '" already exists..';
            document.getElementById("emailErr").style.display = "block";
            document.getElementById("registerBtn").disabled = true;
          } else {
            document.getElementById("emailErr").style.display = "none";
            document.getElementById("registerBtn").disabled = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      document.getElementById("emailErr").textContent = "Email is required..";
      document.getElementById("emailErr").style.display = "block";
      document.getElementById("registerBtn").disabled = true;
    }
  }

  function checkUsername(user) {
    // if(document.getElementById('register-form').classList.contains('form_active')){
    // var user = document.getElementById("user").value.trim();
    if (user != "") {
      var us = {
        user: user,
      };
      axios
        .get(`${config.base_url}/validate_username/`, { params: us })
        .then((res) => {
          if (res.data.is_taken) {
            document.getElementById("user").value = "";
            document.getElementById("userErr").textContent =
              'Username "' + user + '" already exists..';
            document.getElementById("userErr").style.display = "block";
            document.getElementById("registerBtn").disabled = true;
          } else {
            document.getElementById("userErr").style.display = "none";
            document.getElementById("registerBtn").disabled = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      document.getElementById("userErr").textContent = "Username is required..";
      document.getElementById("userErr").style.display = "block";
      document.getElementById("registerBtn").disabled = true;
    }
    // }
  }

  function checkPhone(phone) {
    // var phone = document.getElementById("phone").value.trim();
    if (phone != "") {
      var em = {
        phone: phone,
      };
      axios
        .get(`${config.base_url}/validate_phone_number/`, { params: em })
        .then((res) => {
          if (res.data.is_taken) {
            document.getElementById("phone").value = "";
            document.getElementById("phoneErr").textContent =
              'Phone number "' + phone + '" already exists..';
            document.getElementById("phoneErr").style.display = "block";
            document.getElementById("registerBtn").disabled = true;
          } else {
            document.getElementById("phoneErr").style.display = "none";
            document.getElementById("registerBtn").disabled = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      document.getElementById("phoneErr").textContent =
        "Phone number is required..";
      document.getElementById("phoneErr").style.display = "block";
      document.getElementById("registerBtn").disabled = true;
    }
  }

  function checkCompany(company) {
    // var company = document.getElementById("company").value.trim();
    if (company != "") {
      var cmp = {
        company: company,
      };
      axios
        .get(`${config.base_url}/validate_company_name/`, { params: cmp })
        .then((res) => {
          if (res.data.is_taken) {
            document.getElementById("company").value = "";
            document.getElementById("cmpErr").textContent =
              'Company "' + company + '" already exists..';
            document.getElementById("cmpErr").style.display = "block";
            document.getElementById("registerBtn").disabled = true;
          } else {
            document.getElementById("cmpErr").style.display = "none";
            document.getElementById("registerBtn").disabled = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      document.getElementById("cmpErr").textContent =
        "Company Name is required..";
      document.getElementById("cmpErr").style.display = "block";
      document.getElementById("registerBtn").disabled = true;
    }
  }

  const handleSubmit = (e) => {
    const formToggler = document.getElementById("trialFormToggler");
    formToggler.click();

    e.preventDefault();
    let valid = validate();
    if (valid) {
      const data = {
        company_name: companyName,
        phone_number: phoneNumber,
        gstin: gstin,
        address: address,
        country: country,
        state: state,
        username: username,
        email: email,
        password: password,
        confirm_password: confirmPassword,
      };
      axios
        .post(`${config.base_url}/register_trial_user/`, data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Registered successfully",
            });
            navigate("/login");
          }
        })
        .catch((err) => {
          console.log(err);
          if (!err.response.data.status) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            }).then((result) => {
              if (result.isConfirmed) {
                formToggler.click();
              }
            });
          }
        });
    }
  };

  function openChatBox() {
    document.getElementById("chat-box-icon").style.display = "none";
    document.getElementById("chat-box").style.display = "block";
  }
  function closeChatBox() {
    document.getElementById("chat-box").style.display = "none";
    document.getElementById("chat-box-icon").style.display = "block";
  }

  const faq = [
    { question: "hai", answer: "Hai How can i help you ?" },
    { question: "hello", answer: "Hai How can i help you ?" },
    { question: "hi..", answer: "Hai How can i help you ?" },
    { question: "Hi..", answer: "Hai How can i help you ?" },
    { question: "Hi", answer: "Hai How can i help you ?" },
    { question: "goodbye", answer: "Talk to you later!" },
    { question: "nice talking to you!", answer: "I am glad I could help" },
    // Add more question-answer pairs here
  ];

  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatMessageBoxRef = useRef(null);

  useEffect(() => {
    if (chatMessageBoxRef.current) {
      chatMessageBoxRef.current.scrollTop =
        chatMessageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const displayMessage = (message, isUser) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, isUser }]);
  };

  const handleSend = () => {
    const question = userInput.trim();
    setUserInput("");

    if (question !== "") {
      displayMessage(question, true);

      const matchingQuestion = faq.find(
        (entry) => entry.question.toLowerCase() === question.toLowerCase()
      );
      if (matchingQuestion) {
        displayMessage(matchingQuestion.answer, false);
      } else {
        displayMessage("Please contact Us for more details..", false);
        displayMessage("Tel: +91 9074 156 818", false);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
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
    <div className="indexBody">
      <div id="indexNav">
        <div id="bg">
          <canvas />
          <canvas />
          <canvas />
        </div>
        {/* ======= Header ======= */}
        <header id="header">
          <div className="container d-flex align-items-center justify-content-between">
            <div className="logo">
              <h1>
                <a href="#">Billing Software</a>
              </h1>
            </div>
            <nav
              id="navbar"
              className={
                isNavbarMobile
                  ? "navbar indexNavbar navbar-mobile"
                  : "navbar indexNavbar"
              }
            >
              <ul>
                <li>
                  <a
                    className="nav-link scrollto"
                    href="#about"
                    onClick={(e) => handleLinkClick(e, "#about")}
                  >
                    About
                  </a>
                  <span className="hover" />
                </li>
                <li>
                  <a
                    className="nav-link scrollto"
                    href="#planAndPricing"
                    onClick={(e) => handleLinkClick(e, "#planAndPricing")}
                  >
                    Plan &amp; Pricing
                  </a>
                  <span className="hover" />
                </li>
                <li>
                  <a
                    className="nav-link scrollto"
                    href="#FAQs"
                    onClick={(e) => handleLinkClick(e, "#FAQs")}
                  >
                    FAQs
                  </a>
                  <span className="hover" />
                </li>
                <li>
                  <Link className="nav-link" to="/blog">
                    Blog
                  </Link>
                  <span className="hover" />
                </li>
                <li>
                  <a
                    className="nav-link scrollto"
                    href="#contact"
                    onClick={(e) => handleLinkClick(e, "#contact")}
                  >
                    Contact Us
                  </a>
                  <span className="hover" />
                </li>
                <li>
                  <Link className="loginBtn" to="/login">
                    Login
                  </Link>
                </li>
              </ul>
              <i
                className={`mobile-nav-toggle ${
                  isNavbarMobile ? "bi-x" : "bi-list"
                }`}
                onClick={() => setIsNavbarMobile(!isNavbarMobile)}
              />
            </nav>
            {/* .navbar */}
          </div>
        </header>
        {/* End Header */}
        {/* ======= Home carousel Section ======= */}
        <section id="hero">
          <div
            id="carouselExampleControls"
            data-bs-interval={4000}
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src={`${process.env.PUBLIC_URL}/static/images/ft5.svg`}
                  className="d-block carousel_image1"
                  alt="..."
                  style={{ width: "31vw", float: "right" }}
                />
                <div className="carousel-caption top-0 mt-4 w-50 caption1">
                  <h6
                    className="text-start float-start"
                    style={{ width: "fit-content" }}
                  >
                    BillingSoftwareIndia
                  </h6>
                  <h4
                    className="text-start d-flex"
                    style={{ width: "115%", fontWeight: "bold" }}
                  >
                    Your Ultimate Billing Solution
                  </h4>
                  <p className="mt-2" style={{ textAlign: "justify" }}>
                    Unlock the Power of Seamless Business Operations with
                    BillingSoftwareIndia the billing software tailored for small
                    businesses navigating the complexities of Goods and Services
                    Tax (GST). Designed with user- friendliness in mind,
                    BillingSoftwareIndia empowers entrepreneurs without an
                    accounting background to effortlessly manage their financial
                    transactions and gain valuable insights into their business
                    performance.
                  </p>
                </div>
                <div className="carousel-caption getTrialBtn1 mt-1">
                  <a
                    href="#registerTrial"
                    data-bs-toggle="modal"
                    className="btn-get-trial trialBtn"
                  >
                    Get Free Trial
                  </a>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src={`${process.env.PUBLIC_URL}/static/images/ft6.svg`}
                  className="d-block carousel_image2"
                  alt="..."
                  style={{ width: "31vw", float: "right" }}
                />
                <div className="carousel-caption w-50 top-0 mt-1 caption1">
                  <h6 className="text-start" style={{ width: "fit-content" }}>
                    BillingSoftwareIndia
                  </h6>
                  <h4
                    className="d-flex"
                    style={{
                      textAlign: "start",
                      width: "115%",
                      fontWeight: "bold",
                    }}
                  >
                    Streamline Your Finances with Seamless Billing Solutions
                  </h4>
                  <p className="mt-2" style={{ textAlign: "justify" }}>
                    Simplify financial management with our comprehensive billing
                    software. This solution offers seamless invoicing, precise
                    expense tracking, and efficient payment processing,
                    empowering your business with a robust and user-friendly
                    platform. Navigate effortlessly through billing
                    complexities, ensuring accuracy and timely transactions.
                    Experience the ease of monitoring and controlling your
                    finances in one central hub, making it an indispensable tool
                    for optimizing your financial processes and fostering
                    business growth.
                  </p>
                </div>
                <div className="carousel-caption getTrialBtn1 mt-1">
                  <a
                    href="#registerTrial"
                    data-bs-toggle="modal"
                    className="btn-get-trial trialBtn"
                  >
                    Get Free Trial
                  </a>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src={`${process.env.PUBLIC_URL}/static/images/ft7.svg`}
                  className="d-block carousel_image1"
                  alt="..."
                  style={{ width: "31vw", float: "right" }}
                />
                <div className="carousel-caption top-0 mt-1 w-50 caption1">
                  <h6
                    className="text-start float-start"
                    style={{ width: "fit-content" }}
                  >
                    BillingSoftwareIndia
                  </h6>
                  <h4
                    className="d-flex"
                    style={{
                      textAlign: "start",
                      width: "120%",
                      fontWeight: "bold",
                    }}
                  >
                    Effortless Invoicing and Payments for Your Business Success
                  </h4>
                  <p className="mt-2" style={{ textAlign: "justify" }}>
                    Revolutionize your billing process effortlessly with our
                    software. Enjoy a smooth and error-free invoicing
                    experience, complemented by seamless payment handling.
                    Elevate your business success by reducing complexities and
                    enhancing efficiency in managing invoices and transactions.
                    This intuitive solution ensures quick, secure, and reliable
                    payment processing, freeing up valuable time for you to
                    focus on strategic aspects of your business, confident in
                    the knowledge that your billing operations are streamlined
                    for success.
                  </p>
                </div>
                <div className="carousel-caption getTrialBtn1 mt-1">
                  <a
                    href="#registerTrial"
                    data-bs-toggle="modal"
                    className="btn-get-trial trialBtn"
                  >
                    Get Free Trial
                  </a>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </section>
        {/* End */}
        <main id="main">
          {/* ======= About Section ======= */}
          <section id="about" className="about section-bg">
            <div className="container">
              <div className="section-title">
                <h2
                  data-aos="fade-in"
                  style={{ position: "relative", zIndex: 1 }}
                >
                  About
                </h2>
              </div>
              <div className="row content">
                <div className="col-md-5 about_image" data-aos="fade-right">
                  <img
                    src={`${process.env.PUBLIC_URL}/static/images/ft1.svg`}
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="col-md-7 pt-4" data-aos="fade-left">
                  <p
                    className="font-italic"
                    style={{
                      position: "relative",
                      zIndex: 1,
                      textAlign: "justify",
                    }}
                  >
                    At BillingSoftwareIndia, we redefine billing software for
                    small businesses. Our user-friendly platform simplifies
                    financial management, empowering entrepreneurs without
                    accounting backgrounds. With intuitive reporting and visual
                    insights, BillingSoftwareIndia streamlines decision-making
                    processes. We prioritize efficiency, allowing for
                    on-the-spot billing and seamless communication with
                    customers. Join us and experience the power of
                    BillingSoftwareIndia in driving your business forward.
                  </p>
                  <ul>
                    <li>
                      <i className="fa fa-check" /> User-friendly interface.
                    </li>
                    <li>
                      <i className="fa fa-check" /> Intuitive stock reporting.
                    </li>
                    <li>
                      <i className="fa fa-check" /> Visual data insights.
                    </li>
                    <li>
                      <i className="fa fa-check" /> Efficient on-the-spot
                      billing.
                    </li>
                    <li>
                      <i className="fa fa-check" /> Comprehensive transaction
                      records.
                    </li>
                    <li>
                      <i className="fa fa-check" /> Versatile data export
                      options.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="row content">
                <div
                  className="col-md-5 order-1 order-md-2 about_image"
                  data-aos="fade-left"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/static/images/ft2.svg`}
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div
                  className="col-md-7 pt-5 order-2 order-md-1"
                  data-aos="fade-right"
                >
                  <h3 style={{ position: "relative", zIndex: 1 }}>
                    {" "}
                    Why BillingSoftwareIndia{" "}
                  </h3>
                  <p
                    className="font-italic"
                    style={{ zIndex: 1, textAlign: "justify" }}
                  >
                    BillingSoftwareIndia is more than just billing software;
                    it's a comprehensive solution crafted to enhance the
                    efficiency and growth of your small business. From
                    simplified stock reporting to intuitive data visualization
                    and versatile export options, BillingSoftwareIndia empowers
                    you to take control of your financial landscape. Join
                    countless businesses that have embraced the power of
                    BillingSoftwareIndia. Experience simplicity, precision, and
                    efficiency in billing like never before.
                  </p>
                  <p style={{ position: "relative", zIndex: 1 }}>
                    Take the first step towards seamless business operations.
                    Try BillingSoftwareIndia today!
                  </p>
                </div>
              </div>
              <div className="row demo-video py-5">
                <div className="col-12 d-flex justify-content-center">
                  <iframe
                    style={{
                      width: "75vw",
                      height: "70vh",
                      position: "relative",
                      zIndex: 1,
                    }}
                    src="https://www.youtube.com/embed/CcjZ2x72iF0?si=WrJTLSJ7EThuf5kA"
                    title="YouTube video player"
                    frameBorder={0}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen=""
                  />
                </div>
              </div>
              <div className="row content">
                <div className="col-md-5 about_image" data-aos="fade-right">
                  <img
                    src={`${process.env.PUBLIC_URL}/static/images/ft3.svg`}
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="col-md-7 pt-5" data-aos="fade-left">
                  <h3> Unlock Business Insights Instantly </h3>
                  <p style={{ textAlign: "justify" }}>
                    {" "}
                    Transform your decision-making process with our
                    revolutionary software. Gain immediate access to intuitive
                    visual data insights, providing clarity and actionable
                    information for strategic choices. Experience a swift and
                    dynamic approach to managing your financial operations with
                    our innovative platform.{" "}
                  </p>
                  <ul>
                    <li>
                      <i className="fa fa-check" /> Immediate Access to
                      Insights.
                    </li>
                    <li>
                      <i className="fa fa-check" /> Clarity for Strategic
                      Decisions.
                    </li>
                    <li>
                      <i className="fa fa-check" /> Dynamic Financial
                      Management.
                    </li>
                    <li>
                      <i className="fa fa-check" /> Streamlined Decision-Making.
                    </li>
                    <li>
                      <i className="fa fa-check" /> Innovative Financial
                      Management.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="row content">
                <div
                  className="col-md-5 order-1 order-md-2 about_image"
                  data-aos="fade-left"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/static/images/ft4.svg`}
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div
                  className="col-md-7 pt-5 order-2 order-md-1"
                  data-aos="fade-right"
                >
                  <h3> Transform Transactions with Speed </h3>
                  <p className="font-italic" style={{ textAlign: "justify" }}>
                    Revolutionize your customer service and operational
                    efficiency. Our on-the-spot billing feature is a
                    game-changer, allowing you to streamline transactions with
                    unparalleled speed. Instantly generate slips or bills,
                    providing a seamless experience for both you and your
                    customers. Accelerate your business transactions, ensuring
                    precision and efficiency in every interaction.
                  </p>
                  <p>
                    Experience a swift and dynamic approach to managing your
                    financial operations with our innovative software.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* End Services Section */}
          {/* ======= Plan & Pricing Section ======= */}
          <section id="planAndPricing" className="planandpricing section-bg">
            <div className="container">
              <div className="section-title">
                <h2 data-aos="fade-in">Plan &amp; Pricing</h2>
                <p data-aos="fade-in">
                  {" "}
                  Explore our flexible pricing option. Find the perfect plan for
                  you.
                </p>
              </div>
              <div className="row mt-5 pt-4">
                <div className="col-lg-4">
                  <div className="pricing-box mt-4">
                    <i className="mdi mdi-account h1" />
                    <h4 className="f-20 text-uppercase fw-bold">Silver</h4>
                    <div className="mt-4 pt-2">
                      <p className="mb-2 f-18">Features</p>
                      <p className="mb-2">
                        <i className="bx bxs-check-circle text-success f-18 me-2" />
                        <b>Lorem Ipsum</b>Lorem Ipsum is simply dummy text
                      </p>
                      <p className="mb-2">
                        <i className="bx bxs-x-circle text-danger f-18 me-2" />
                        <b>Lorem Ipsum</b>Lorem Ipsum is simply dummy text
                      </p>
                      <p className="mb-2">
                        <i className="bx bxs-x-circle text-danger f-18 me-2" />
                        <b>Lorem Ipsum</b>Lorem Ipsum is simply dummy text
                      </p>
                    </div>
                    <div className="pricing-plan mt-4 pt-2">
                      <h4 className="text-muted">
                        <s> ₹499.99</s>{" "}
                        <span className="plan pl-3 text-dark">₹999.99 </span>
                      </h4>
                      <p className="text-muted mb-0">Per Month</p>
                    </div>
                    <div className="mt-4 pt-3 d-flex justify-content-center">
                      <a href="" className="btn purchaseBtn">
                        Purchase Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="pricing-box mt-4">
                    <div className="pricing-badge">
                      <span className="badge">Featured</span>
                    </div>
                    <i className="mdi mdi-account-multiple h1 text-primary" />
                    <h4 className="f-20 text-primary text-uppercase fw-bold">
                      Gold
                    </h4>
                    <div className="mt-4 pt-2">
                      <p className="mb-2">Features</p>
                      <p className="mb-2">
                        <i className="bx bxs-check-circle text-success me-2" />
                        <b>Lorem Ipsum</b>Lorem Ipsum is simply dummy text
                      </p>
                      <p className="mb-2">
                        <i className="bx bxs-check-circle text-success me-2" />
                        <b>Lorem Ipsum</b>Lorem Ipsum is simply dummy text
                      </p>
                      <p className="mb-2">
                        <i className="bx bxs-x-circle text-danger me-2" />
                        <b>Lorem Ipsum</b>Lorem Ipsum is simply dummy text
                      </p>
                    </div>
                    <div className="pricing-plan mt-4 pt-2">
                      <h4 className="text-muted">
                        <s> ₹1549.99</s>{" "}
                        <span className="plan pl-3 text-dark">₹1199.99 </span>
                      </h4>
                      <p className="text-muted mb-0">Per Month</p>
                    </div>
                    <div className="mt-4 pt-3 d-flex justify-content-center">
                      <a href="" className="btn purchaseBtn">
                        Purchase Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="pricing-box mt-4">
                    <i className="mdi mdi-account-multiple-plus h1" />
                    <h4 className="f-20 text-uppercase fw-bold">Diamond</h4>
                    <div className="mt-4 pt-2">
                      <p className="mb-2 f-18">Features</p>
                      <p className="mb-2">
                        <i className="bx bxs-check-circle text-success f-18 me-2" />
                        <b>Lorem Ipsum</b>Lorem Ipsum is simply dummy text
                      </p>
                      <p className="mb-2">
                        <i className="bx bxs-check-circle text-success f-18 me-2" />
                        <b>Lorem Ipsum</b>Lorem Ipsum is simply dummy text
                      </p>
                      <p className="mb-2">
                        <i className="bx bxs-check-circle text-success f-18 me-2" />
                        <b>Lorem Ipsum</b>Lorem Ipsum is simply dummy text
                      </p>
                    </div>
                    <div className="pricing-plan mt-4 pt-2">
                      <h4 className="text-muted">
                        <s> ₹2499.99</s>{" "}
                        <span className="plan pl-3 text-dark">₹1999.99 </span>
                      </h4>
                      <p className="text-muted mb-0">Per Month</p>
                    </div>
                    <div className="mt-4 pt-3 d-flex justify-content-center">
                      <a href="" className="btn purchaseBtn">
                        Purchase Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* End Plan & Pricing Section */}
          {/* ======= FAQs Section ======= */}
          <section id="FAQs" className="faqs section-bg">
            <div className="our-faq-wrapper">
              <div className="container">
                <div className="section-title">
                  <h2 data-aos="fade-in">
                    FAQ<sub>s</sub>
                  </h2>
                  <p data-aos="fade-in">
                    Magnam dolores commodi suscipit. Necessitatibus eius
                    consequatur ex aliquid fuga eum quidem. Sit sint consectetur
                    velit. Quisquam quos quisquam cupiditate. Et nemo qui
                    impedit suscipit alias ea. Quia fugiat sit in iste officiis
                    commodi quidem hic quas.
                  </p>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="accordion" id="accordion">
                      <div className="card">
                        <div className="card-header" id="headingOne">
                          <h5 className="mb-0">
                            <button
                              className="btn btn-link"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              {" "}
                              Can users with no accounting background use the
                              software?{" "}
                            </button>
                          </h5>
                        </div>
                        <div
                          id="collapseOne"
                          className="collapse show"
                          aria-labelledby="headingOne"
                          data-bs-parent="#accordion"
                        >
                          <div className="card-body">
                            {" "}
                            Yes, our user-friendly interface ensures easy
                            navigation for individuals without accounting
                            expertise.{" "}
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-header" id="headingTwo">
                          <h5 className="mb-0">
                            <button
                              className="btn btn-link collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseTwo"
                              aria-expanded="false"
                              aria-controls="collapseTwo"
                            >
                              {" "}
                              How quickly can I generate slips or bills with the
                              on-the-spot billing feature?{" "}
                            </button>
                          </h5>
                        </div>
                        <div
                          id="collapseTwo"
                          className="collapse"
                          aria-labelledby="headingTwo"
                          data-bs-parent="#accordion"
                        >
                          <div className="card-body">
                            {" "}
                            Instantly! Our software allows for immediate
                            generation, streamlining transactions for
                            efficiency.{" "}
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-header" id="headingThree">
                          <h5 className="mb-0">
                            <button
                              className="btn btn-link collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseThree"
                              aria-expanded="false"
                              aria-controls="collapseThree"
                            >
                              {" "}
                              Can I export data to Excel for versatility in data
                              management?{" "}
                            </button>
                          </h5>
                        </div>
                        <div
                          id="collapseThree"
                          className="collapse"
                          aria-labelledby="headingThree"
                          data-bs-parent="#accordion"
                        >
                          <div className="card-body">
                            {" "}
                            Absolutely, every module can be exported seamlessly
                            to Excel for flexible data handling.{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="accordion" id="accordion2">
                      <div className="card">
                        <div className="card-header" id="heading4">
                          <h5 className="mb-0">
                            <button
                              className="btn btn-link"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapse4"
                              aria-expanded="false"
                              aria-controls="collapse4"
                            >
                              {" "}
                              What types of insights do the visual data
                              representations provide?{" "}
                            </button>
                          </h5>
                        </div>
                        <div
                          id="collapse4"
                          className="collapse"
                          aria-labelledby="heading4"
                          data-bs-parent="#accordion2"
                        >
                          <div className="card-body">
                            {" "}
                            The graphical representations offer clear insights
                            into sales trends for informed decision-making.{" "}
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-header" id="heading5">
                          <h5 className="mb-0">
                            <button
                              className="btn btn-link collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapse5"
                              aria-expanded="false"
                              aria-controls="collapse5"
                            >
                              {" "}
                              Is the software suitable for businesses dealing
                              with GST?{" "}
                            </button>
                          </h5>
                        </div>
                        <div
                          id="collapse5"
                          className="collapse"
                          aria-labelledby="heading5"
                          data-bs-parent="#accordion2"
                        >
                          <div className="card-body">
                            {" "}
                            Certainly, our software is tailored for small
                            businesses navigating Goods and Services Tax
                            complexities.{" "}
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-header" id="heading6">
                          <h5 className="mb-0">
                            <button
                              className="btn btn-link collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapse6"
                              aria-expanded="false"
                              aria-controls="collapse6"
                            >
                              {" "}
                              How can I share sales bills with multiple users?{" "}
                            </button>
                          </h5>
                        </div>
                        <div
                          id="collapse6"
                          className="collapse show"
                          aria-labelledby="heading6"
                          data-bs-parent="#accordion2"
                        >
                          <div className="card-body">
                            {" "}
                            Easily share sales bills in PDF format directly via
                            email, ensuring efficient communication with
                            stakeholders.{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* End FAQs Section */}
          {/* ======= Contact Section ======= */}
          <section id="contact" className="contact section-bg">
            <div className="container" data-aos="fade-up">
              <div className="section-title">
                <h2>Contact Us</h2>
              </div>
              <div className="row">
                <div className="col-lg-6 mt-4 mt-lg-0">
                  <div className="mapouter">
                    <div className="gmap_canvas">
                      <iframe
                        className="gmap_iframe h-100"
                        width="100%"
                        frameBorder={0}
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0739866451886!2d76.35812367376452!3d10.01074747285229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d9bfaa6db61%3A0xa5df6acfc2d1e5fd!2sALTOS%20Technologies!5e0!3m2!1sen!2sin!4v1707387050232!5m2!1sen!2sin"
                      />
                      {/* <a href="https://www.embedmymap.com/">Embed My Map</a> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="row pt-3">
                    <div className="col-md-12">
                      <div className="info-box" data-aos="fade-up">
                        <i className="bx bx-map" />
                        <h3>Our Address</h3>
                        <p>
                          1st Floor - Thapasya Building Infopark, Kakkanad,
                          Cochin
                        </p>
                        {/* <p>First floor,D Block Tidel park,Tharamani, Chennai, Tamilnadu 600113</p> */}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="info-box mt-4"
                        data-aos="fade-up"
                        data-aos-delay={100}
                      >
                        <i className="bx bx-envelope" />
                        <h3>Email Us</h3>
                        <p>Info@ altostechnologies.com</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="info-box mt-4"
                        data-aos="fade-up"
                        data-aos-delay={100}
                      >
                        <i className="bx bx-phone-call" />
                        <h3>Call Us</h3>
                        <p>+91 90741 56818</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* End Contact Section */}
        </main>
        {/* End #main */}
        {/* Chat box UI*/}
        {/* floating button */}
        <div
          id="chat-box-icon"
          className="chat-box-icon"
          style={{ display: "block" }}
          onClick={openChatBox}
        >
          <div className="chatbox-button">
            <span>
              <img
                className="rounded"
                src={`${process.env.PUBLIC_URL}/static/images/chatbot.png`}
                alt="chat"
                style={{ maxWidth: "1.65em" }}
              />
            </span>
          </div>
        </div>
        {/* button end */}
        <div className="chat-box-section" id="chat-box">
          <div className="card" id="chat2">
            <div className="card-header d-flex justify-content-between align-items-center px-2">
              <h6 className="mb-0">BillingSoftwareIndia</h6>
              <span
                id="chat-box-close"
                onClick={closeChatBox}
                style={{ cursor: "pointer", fontSize: "2em" }}
              >
                <i className="bx bx-x" />
              </span>
            </div>
            <div
              className="card-body"
              data-mdb-perfect-scrollbar="true"
              id="chat-message-box"
              ref={chatMessageBoxRef}
              style={{ height: "300px", overflowY: "scroll" }}
            >
              <div className="chatmain_content">
                <p className="text-muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="chat_messages" id="chat-messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.isUser ? "user-message" : "bot-message"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                alt="avatar 3"
                style={{ width: 40, height: "100%" }}
              />
              <input
                type="text"
                className="form-control"
                id="chatbox-input"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type message"
              />
              <a className="ms-1 text-muted" href="#!">
                <i className="fa fa-paperclip" />
              </a>
              {/* <a className="ms-3 text-muted" id="emoji-button" href="#!">
            <i className="fa fa-smile" />
          </a> */}
              <a
                className="ms-3 text-primary"
                href="#!"
                id="send-btn"
                role="button"
                onClick={handleSend}
              >
                <i className="fa fa-paper-plane" />
              </a>
            </div>
          </div>
        </div>
        {/* Chat box End */}
        {/* ======= Footer ======= */}
        <footer id="footer">
          <div className="container footer-bottom clearfix">
            <div className="col">
              <center>
                {new Date().getFullYear()} © Copyright
                <strong>
                  <span>BillingSoftwareIndia</span>
                </strong>
                . All Rights Reserved
              </center>
            </div>
          </div>
        </footer>
        <a
          href="#"
          className="back-to-top indexPageBtn d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-arrow-up-short" />
        </a>
        <a
          href="#registerTrial"
          data-bs-toggle="modal"
          id="trialFormToggler"
          className="get-trial-button d-flex align-items-center justify-content-center"
        >
          <i className="bx bxs-hand-right mr-1" />
          Get Trial
        </a>
        {/* Trial Register Modal */}
        <div
          className="modal fade"
          id="registerTrial"
          tabIndex={-1}
          data-bs-backdrop="static"
          aria-labelledby="registerTrialLabel"
          aria-hidden="true"
          style={{ zIndex: 100000 }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ background: "#ddddbe" }}>
              <div
                className="modal-header"
                style={{ borderBottom: "1px solid #C6AA58" }}
              >
                <h5
                  className="modal-title"
                  id="registerTrialLabel"
                  style={{ color: "#003e27", fontWeight: "bold" }}
                >
                  Register for Trial
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ color: "#C6AA58" }}
                  onClick={deactivateForm}
                />
              </div>
              <form className="" id="register-form" onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-field">
                        <i className="fas fa-user" />
                        <input
                          type="text"
                          placeholder="Username"
                          name="username"
                          id="user"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onBlur={(e) => checkUsername(e.target.value)}
                          required
                        />
                      </div>
                      <span
                        className="text-danger"
                        style={{
                          fontSize: "0.85rem",
                          width: "max-content",
                          display: "none",
                        }}
                        id="userErr"
                      >
                        User Name already exists..!
                      </span>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <i className="fas fa-envelope" />
                        <input
                          type="email"
                          placeholder="Email"
                          name="email"
                          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={(e) => checkEmail(e.target.value)}
                          required
                        />
                      </div>
                      <span
                        className="text-danger"
                        style={{
                          fontSize: "0.85rem",
                          width: "max-content",
                          display: "none",
                        }}
                        id="emailErr"
                      >
                        Email already exists..!
                      </span>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <i className="fas fa-phone" />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          name="phone"
                          id="phone"
                          title="Ex: 9048986656"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          onBlur={(e) => checkPhone(e.target.value)}
                          required
                        />
                      </div>
                      <span
                        className="text-danger"
                        style={{
                          fontSize: "0.85rem",
                          width: "max-content",
                          display: "none",
                        }}
                        id="phoneErr"
                      >
                        Phone Number already exists..!
                      </span>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <i className="fa fa-building" />
                        <input
                          type="text"
                          placeholder="Company Name"
                          name="company"
                          id="company"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          onBlur={(e) => checkCompany(e.target.value)}
                          required
                        />
                      </div>
                      <span
                        className="text-danger"
                        style={{
                          fontSize: "0.85rem",
                          width: "max-content",
                          display: "none",
                        }}
                        id="cmpErr"
                      >
                        Company Name already exists..!
                      </span>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <i className="fa fa-pencil" />
                        <input
                          type="text"
                          placeholder="GST Number(optional)"
                          name="gstnum"
                          id="gstin"
                          title="Ex: 22AAAAA0000A1Z5"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value)}
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
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <i className="fa fa-address-card" />
                        <input
                          type="text"
                          name="address"
                          placeholder="Address"
                          id="address"
                          cols=""
                          rows={3}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <i className="fa fa-globe" />
                        <input
                          type="text"
                          placeholder="Country"
                          name="country"
                          id="couuntry"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <i className="fa fa-map-signs" />
                        <select
                          className="form-control"
                          id="state"
                          name="state"
                          style={{ border: "none" }}
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
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
                          <option value="Daman and Diu">Daman and Diu</option>
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
                          <option value="Other Territory">
                            Other Territory
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field password-container">
                        <i className="fas fa-lock" />
                        <input
                          type="password"
                          placeholder="Password"
                          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                          title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          id="pwd"
                          required
                        />
                        <i
                          className="fa fa-eye eye-icon"
                          onClick={togglePasswordVisibility1}
                        />
                        <div
                          className="text-danger"
                          style={{ fontSize: "0.85rem", width: "max-content" }}
                          id="passErr"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <i className="fas fa-lock" />
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          name="confirmPassword"
                          id="cnfpwd"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <div
                          className="text-danger"
                          style={{ fontSize: "0.85rem", width: "max-content" }}
                          id="cnfrmPassErr"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="modal-footer d-flex justify-content-center"
                  style={{ borderTop: "1px solid #C6AA58" }}
                >
                  <button
                    type="submit"
                    id="registerBtn"
                    className="registerTrialBtn w-50 text-uppercase"
                  >
                    REGISTER
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
