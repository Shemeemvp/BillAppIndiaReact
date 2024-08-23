import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";
import "./styles/Base.css";
import "./styles/Items.css";
import "./styles/Styles.css";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../functions/config";
import { useNavigate } from "react-router-dom";

function Items() {
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

  const [items, setItems] = useState([]);

  return (
    <>
      <div
        class="container-fluid position-relative d-flex p-0 userItems"
        id="userSection"
      >
        <UserSidebar />
        <div class="content">
          <UserNavbar />
          {items.length == 0 ? (
            <main style={{ background: "#ddddbeed" }}>
              <div class="container-fluid">
                <div className="no_items">
                  <div className="row">
                    <div className="col">
                      <div className="image_basket d-flex justify-content-center">
                        <img
                          className="img-fluid w-25"
                          src={`${process.env.PUBLIC_URL}/static/assets/img/basket.png`}
                          alt=""
                        />
                      </div>
                      <div className="additem_btn d-flex justify-content-center">
                        <button
                          className="add_newitem_btn"
                          onClick={() => navigate("/add_items")}
                        >
                          <i className="fa fa-plus me-2" />
                          ADD ITEM
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          ) : (
            <main style={{ background: "#fff" }}>
              <div class="container-fluid"></div>
            </main>
          )}
          <UserFooter />
        </div>
      </div>
    </>
  );
}

export default Items;
