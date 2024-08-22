import React from "react";
import { useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();
  return (
    <div className="sidebar b-primary pe-4 pb-3">
      <nav className="navbar b-primary navbar-dark">
        <a href="/go_dashboard" className="navbar-brand mx-4 mb-3">
          <h4 className="text-light">BillingSoftware</h4>
        </a>
        <div className="d-flex align-items-center ms-4 mb-4">
          <div className="position-relative">
            <img
              className="rounded-circle me-lg-2"
              src={`${process.env.PUBLIC_URL}/static/assets/img/nouser.jpg`}
              alt=""
              style={{ width: 40, height: 40 }}
            />
            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1" />
          </div>
          <div className="ms-3">
            <h6 className="mb-0 text-light text-uppercase">ADMIN</h6>
          </div>
        </div>
        <div className="navbar-nav w-100">
          <li
            onClick={() => navigate("/registered_clients")}
            className="nav-item nav-link nav-reg-clients"
          >
            <i className="fas fa-users me-2" />
            Registered Clients
          </li>
          <li
            onClick={() => navigate("/")}
            className="nav-item nav-link nav-demo-clients"
          >
            <i className="fas fa-user-clock me-2" />
            Demo Clients
          </li>
          <li
            onClick={() => navigate("/")}
            className="nav-item nav-link nav-purchased-clients"
          >
            <i className="fas fa-user-check me-2" />
            Purchased Clients
          </li>
          <li
            onClick={() => navigate("/payment_terms")}
            className="nav-item nav-link nav-payment-terms d-flex align-items-center"
          >
            <i className="fas fa-cubes me-2" />
            Payment Terms
            <a
              className="px-0"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/add_payment_terms");
              }}
            >
              <i className="fa-solid fa-plus bg-transparent float-end add-icon" />
            </a>
          </li>
        </div>
      </nav>
    </div>
  );
}

export default AdminSidebar;
