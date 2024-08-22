import React from "react";

function AdminFooter() {
  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-dark rounded-top p-4">
        <div className="row">
          <div className="col-12 col-sm-6 text-center text-sm-start text-white">
            ©
            <a href="#" className="text-white">
              Billing Software
            </a>
            , All Right Reserved.
          </div>
          <div className="col-12 col-sm-6 text-center text-sm-end"></div>
        </div>
      </div>
    </div>
  );
}

export default AdminFooter;
