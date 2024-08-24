import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
import UserNavbar from "./UserNavbar";
import "./styles/Base.css";
import "./styles/Styles.css";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../functions/config";

function Items() {
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

  return (
    <>
      <div
        className="container-fluid position-relative d-flex p-0 userDashboard"
        id="userSection"
      >
        <UserSidebar />
        <div className="content">
          <UserNavbar />
          <main>
            
          </main>
          <UserFooter />
        </div>
      </div>
    </>
  );
}

export default Items;
