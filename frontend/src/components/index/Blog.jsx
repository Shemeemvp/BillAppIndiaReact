import React, { useEffect, useState, useRef } from "react";
import "./Blog.css";
import AOS from "aos";
import { Link, useNavigate } from "react-router-dom";

function Blog() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  useEffect(() => {
    const backtotop = document.querySelector(".back-to-top");

    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop?.classList.add("active");
      } else {
        backtotop?.classList.remove("active");
      }
    };

    // Add event listeners
    window.addEventListener("scroll", toggleBacktotop);

    // Call the functions to set initial state
    toggleBacktotop();

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("scroll", toggleBacktotop);
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

  const bgRef = useRef(null);
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);
  const canvasRef3 = useRef(null);

  useEffect(() => {
    const background = canvasRef1.current;
    const foreground1 = canvasRef2.current;
    const foreground2 = canvasRef3.current;

    if (!background || !foreground1 || !foreground2) return;

    const config = {
      circle: {
        amount: 18,
        layer: 3,
        color: [207, 192, 97],
        alpha: 0.3,
      },
      line: {
        amount: 12,
        layer: 3,
        color: [255, 255, 255],
        alpha: 0.3,
      },
      speed: 0.5,
      angle: 20,
    };

    const bctx = background.getContext("2d");
    const fctx1 = foreground1.getContext("2d");
    const fctx2 = foreground2.getContext("2d");

    const M = window.Math; // Cached Math
    const degree = (config.angle / 360) * M.PI * 2;
    let circles = [];
    let lines = [];
    let wWidth, wHeight, timer;

    const requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function (callback) {
        setTimeout(callback, 1000 / 60);
      };

    const cancelAnimationFrame =
      window.cancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      clearTimeout;

    const setCanvasHeight = () => {
      wWidth = window.innerWidth;
      wHeight = window.innerHeight;

      [background, foreground1, foreground2].forEach((canvas) => {
        canvas.width = wWidth;
        canvas.height = wHeight;
      });
    };

    const drawCircle = (x, y, radius, color, alpha) => {
      const gradient = fctx1.createRadialGradient(x, y, radius, x, y, 0);
      gradient.addColorStop(
        0,
        `rgba(${color[0]},${color[1]},${color[2]},${alpha})`
      );
      gradient.addColorStop(
        1,
        `rgba(${color[0]},${color[1]},${color[2]},${alpha - 0.1})`
      );

      fctx1.beginPath();
      fctx1.arc(x, y, radius, 0, M.PI * 2, true);
      fctx1.fillStyle = gradient;
      fctx1.fill();
    };

    const drawLine = (x, y, width, color, alpha) => {
      const endX = x + M.sin(degree) * width;
      const endY = y - M.cos(degree) * width;
      const gradient = fctx2.createLinearGradient(x, y, endX, endY);
      gradient.addColorStop(
        0,
        `rgba(${color[0]},${color[1]},${color[2]},${alpha})`
      );
      gradient.addColorStop(
        1,
        `rgba(${color[0]},${color[1]},${color[2]},${alpha - 0.1})`
      );

      fctx2.beginPath();
      fctx2.moveTo(x, y);
      fctx2.lineTo(endX, endY);
      fctx2.lineWidth = 3;
      fctx2.lineCap = "round";
      fctx2.strokeStyle = gradient;
      fctx2.stroke();
    };

    const drawBack = () => {
      bctx.clearRect(0, 0, wWidth, wHeight);

      const gradient = [];

      gradient[0] = bctx.createRadialGradient(
        wWidth * 0.3,
        wHeight * 0.1,
        0,
        wWidth * 0.3,
        wHeight * 0.1,
        wWidth * 0.9
      );
      gradient[0].addColorStop(0, "transparent");
      gradient[0].addColorStop(1, "transparent");

      bctx.translate(wWidth, 0);
      bctx.scale(-1, 1);
      bctx.beginPath();
      bctx.fillStyle = gradient[0];
      bctx.fillRect(0, 0, wWidth, wHeight);

      gradient[1] = bctx.createRadialGradient(
        wWidth * 0.1,
        wHeight * 0.1,
        0,
        wWidth * 0.3,
        wHeight * 0.1,
        wWidth
      );
      gradient[1].addColorStop(0, "transparent");
      gradient[1].addColorStop(0.8, "transparent");

      bctx.translate(wWidth, 0);
      bctx.scale(-1, 1);
      bctx.beginPath();
      bctx.fillStyle = gradient[1];
      bctx.fillRect(0, 0, wWidth, wHeight);

      gradient[2] = bctx.createRadialGradient(
        wWidth * 0.1,
        wHeight * 0.5,
        0,
        wWidth * 0.1,
        wHeight * 0.5,
        wWidth * 0.5
      );
      gradient[2].addColorStop(0, "transparent");
      gradient[2].addColorStop(1, "transparent");

      bctx.beginPath();
      bctx.fillStyle = gradient[2];
      bctx.fillRect(0, 0, wWidth, wHeight);
    };

    const animate = () => {
      const sin = M.sin(degree);
      const cos = M.cos(degree);

      if (config.circle.amount > 0 && config.circle.layer > 0) {
        fctx1.clearRect(0, 0, wWidth, wHeight);
        circles.forEach((item) => {
          let { x, y, radius, speed } = item;

          if (x > wWidth + radius) {
            x = -radius;
          } else if (x < -radius) {
            x = wWidth + radius;
          } else {
            x += sin * speed;
          }

          if (y > wHeight + radius) {
            y = -radius;
          } else if (y < -radius) {
            y = wHeight + radius;
          } else {
            y -= cos * speed;
          }

          item.x = x;
          item.y = y;
          drawCircle(x, y, radius, item.color, item.alpha);
        });
      }

      if (config.line.amount > 0 && config.line.layer > 0) {
        fctx2.clearRect(0, 0, wWidth, wHeight);
        lines.forEach((item) => {
          let { x, y, width, speed } = item;

          if (x > wWidth + width * sin) {
            x = -width * sin;
          } else if (x < -width * sin) {
            x = wWidth + width * sin;
          } else {
            x += sin * speed;
          }

          if (y > wHeight + width * cos) {
            y = -width * cos;
          } else if (y < -width * cos) {
            y = wHeight + width * cos;
          } else {
            y -= cos * speed;
          }

          item.x = x;
          item.y = y;
          drawLine(x, y, width, item.color, item.alpha);
        });
      }

      timer = requestAnimationFrame(animate);
    };

    const createItem = () => {
      circles = [];
      lines = [];

      if (config.circle.amount > 0 && config.circle.layer > 0) {
        for (let i = 0; i < config.circle.amount / config.circle.layer; i++) {
          for (let j = 0; j < config.circle.layer; j++) {
            circles.push({
              x: M.random() * wWidth,
              y: M.random() * wHeight,
              radius: M.random() * (20 + j * 5) + (20 + j * 5),
              color: config.circle.color,
              alpha: M.random() * 0.2 + (config.circle.alpha - j * 0.1),
              speed: config.speed * (1 + j * 0.5),
            });
          }
        }
      }

      if (config.line.amount > 0 && config.line.layer > 0) {
        for (let m = 0; m < config.line.amount / config.line.layer; m++) {
          for (let n = 0; n < config.line.layer; n++) {
            lines.push({
              x: M.random() * wWidth,
              y: M.random() * wHeight,
              width: M.random() * (20 + n * 5) + (20 + n * 5),
              color: config.line.color,
              alpha: M.random() * 0.2 + (config.line.alpha - n * 0.1),
              speed: config.speed * (1 + n * 0.5),
            });
          }
        }
      }

      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(animate);
      drawBack();
    };

    // Initial setup
    setCanvasHeight();
    createItem();

    // Window resize handler
    window.addEventListener("resize", () => {
      setCanvasHeight();
      createItem();
    });

    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(timer);
      window.removeEventListener("resize", setCanvasHeight);
    };
  }, []);

  return (
    <div className="blogBody">
      <div id="blogNav">
        <div id="bg" ref={bgRef}>
          <canvas ref={canvasRef1} />
          <canvas ref={canvasRef2} />
          <canvas ref={canvasRef3} />
        </div>
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
                  ? "navbar blogNavbar navbar-mobile"
                  : "navbar blogNavbar"
              }
            >
              <ul>
                <li>
                  <Link className="nav-link" to="/">
                    Home
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
          </div>
        </header>
        <section id="hero">
          <div className="banner_image">
            <img
              src={`${process.env.PUBLIC_URL}/static/images/banner1.jpg`}
              style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                zIndex: 1,
              }}
              alt=""
            />
          </div>
        </section>
        <main id="main">
          <section id="blogSection1" className="blogSection1 section-bg">
            <div className="container">
              <div className="section-title">
                <h2 data-aos="fade-in">
                  Necessitatibus eius consequatur ex aliquid
                </h2>
                <p data-aos="fade-in">
                  Alaboris nisi ut aliquip ex ea commodo consequat Magnam
                  dolores commodi suscipit. Alaboris nisi ut aliquip ex ea
                  commodo consequat Magnam dolores commodi suscipit.
                  Necessitatibus eius consequatur ex aliquid fuga eum quidem.
                  Sit sint consectetur velit. Quisquam quos quisquam cupiditate.
                  Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste
                  officiis commodi quidem hic quas.Necessitatibus eius
                  consequatur ex aliquid fuga eum quidem. Sit sint consectetur
                  velit. QuisquAlaboris nisi ut aliquip ex ea commodo consequat
                  Magnam dolores commodi suscipit. Necessitatibus eius
                  consequatur ex aliquid fuga eum quidem. Sit sint consectetur
                  velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit
                  suscipit alias ea. Quia fugiat sit in iste officiis commodi
                  quidem hic quas.am quos quisquam cupiditate. Et nemo qui
                  impedit suscipit alias ea. Quia fugiat sit in iste officiis
                  commodi quidem hic quas.
                </p>
              </div>
              <div className="lineBox">
                <span className="line" />
                <span className="line" />
                <span className="line" />
              </div>
              <div className="row content">
                <div
                  className="col-md-5 order-1 order-md-2"
                  data-aos="fade-left"
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/static/images/blg1.jpg`}
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div
                  className="col-md-7 pt-5 order-2 order-md-1"
                  data-aos="fade-right"
                >
                  <h3>Corporis temporibus maiores provident</h3>
                  <p className="font-italic">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <p>
                    Ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum
                  </p>
                </div>
              </div>
              <div className="row content">
                <div
                  className="col-md-5"
                  data-aos="fade-right"
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/static/images/blg2.jpg`}
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="col-md-7 pt-3" data-aos="fade-left">
                  <h3>
                    Sunt consequatur ad ut est nulla consectetur reiciendis
                    animi voluptas
                  </h3>
                  <p>
                    Cupiditate placeat cupiditate placeat est ipsam culpa.
                    Delectus quia minima quod. Sunt saepe odit aut quia
                    voluptatem hic voluptas dolor doloremque.
                  </p>
                  <p>
                    Ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum
                  </p>
                </div>
              </div>
              <div className="row content">
                <div className="col-md-12" data-aos="fade-up">
                  <p>
                    Duis ante ante, gravida vitae posuere non, ullamcorper sed
                    enim. Praesent molestie erat ut felis pharetra faucibus.
                    Maecenas dignissim consequat elit id rutrum fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident,
                    sunt in culpa qui officia deserunt mollit anim id est
                    laborum
                  </p>
                </div>
                <div
                  className="col-md-12"
                  data-aos="fade-up"
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/static/images/blg3.jpg`}
                    style={{
                      display: "flex",
                      margin: "auto",
                      width: "80vw",
                      height: "75vh",
                    }}
                    alt=""
                  />
                </div>
                <div className="col-md-12" data-aos="fade-up">
                  <p>
                    Duis ante ante, gravida vitae posuere non, posuere non,
                    ullamcorper sed enim. Praesent molestie erat ut felis
                    pharetra faucibus. Maecenas dignissim consequat elit.
                    ullamcorper sed enim. Praesent molestie erat ut felis
                    pharetra faucibusposuere non, ullamcorper sed enim. Praesent
                    molestie erat ut felis pharetra faucibus. Maecenas dignissim
                    consequat elit. Maecenas dignissim consequat elit id rutrum
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident, sunt in culpa qui officia deserunt mollit anim id
                    est laborum posuere non, ullamcorper sed enim. Praesent
                    molestie erat ut felis pharetra faucibus. Maecenas dignissim
                    consequat elit.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="section-bg" id="blogSection2">
            <div className="blog__container container">
              <h3 className="blog__subhead">
                Aenean sit amet justo et risus commodo lacinia ut eu felis?
              </h3>
              <p>
                Morbi massa enim, tempus vitae mauris sit amet, maximus mattis
                metus. Sed quam tortor, pretium ut maximus sit amet, feugiat ac
                dui. Curabitur interdum libero in mi aliquet vehicula
              </p>
              <ul className="content-ul">
                <li>
                  <span style={{ fontWeight: 600 }}>
                    Nunc nec ante ac dui :
                  </span>{" "}
                  Sed tristique, urna id malesuada dignissim, nulla massa
                  consequat massa, ut tincidunt turpis odio ut lorem. Sed nisl
                  libero, varius sed odio id, lobortis ornare ipsum.
                </li>
                <li>
                  <span style={{ fontWeight: 600 }}>
                    malesuada placerat at eget:{" "}
                  </span>{" "}
                  Quisque quis sapien eu elit hendrerit eleifend sed non sapien.
                  In posuere est sit amet erat cursus, sed cursus massa
                  facilisis.
                </li>
                <li>
                  <span style={{ fontWeight: 600 }}>
                    Donec neque qua mattis:
                  </span>{" "}
                  Vestibulum pellentesque ante non sem consectetur, et elementum
                  ligula maximus. Integer eu condimentum metus.
                </li>
                <li>
                  <span style={{ fontWeight: 600 }}>
                    Aenean id sollicitudin eros:{" "}
                  </span>{" "}
                  tristique, urna id malesuada dignissim, nulla massa consequat
                  massa, ut tincidunt turpis odio ut lorem. Sed nisl libero
                </li>
                <li>
                  <span style={{ fontWeight: 600 }}>iaculis enim sit:</span>{" "}
                  posuere non, ullamcorper sed enim. Praesent molestie erat ut
                  felis pharetra faucibus. Maecenas dignissim consequat elit.
                </li>
              </ul>
              <div className="blog__subhead"> </div>
              <p>
                ligula eleifend iaculis. Quisque luctus nulla turpis, at pretium
                ex vehicula sit amet. Aenean lectus lacus, placerat sed luctus
                vel, elementum ac dolor. Pellentesque non lobortis dolorsit amet
                vestibulum. Mauris mollis nisi ac
              </p>
              <p>
                Duis ante ante, gravida vitae posuere non, ullamcorper sed enim.
                Praesent molestie erat ut felis pharetra faucibus. Maecenas
                dignissim consequat elit id rutrum
              </p>
            </div>
          </section>
          <section
            id="contact"
            className="contact section-bg"
            style={{ position: "relative", zIndex: 1 }}
          >
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
        </main>

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
          className="back-to-top blogPageBtn d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-arrow-up-short" />
        </a>
      </div>
    </div>
  );
}

export default Blog;
