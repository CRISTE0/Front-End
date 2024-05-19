import React from "react";

// import "../assets/vendor/fontawesome-free/css/all.min.css";
// import "../assets/css/sb-admin-2.min.css";
// import "../assets/vendor/datatables/dataTables.bootstrap4.min.css"

// import "../assets/vendor/jquery/jquery.min.js";
// import "../assets/vendor/bootstrap/js/bootstrap.bundle.min.js";
// import "../assets/vendor/jquery-easing/jquery.easing.min.js";
// import "../assets/js/sb-admin-2.min.js";
// import "../assets/vendor/chart.js/Chart.min.js";
// import "../assets/vendor/datatables/jquery.dataTables.min.js";
// import "../assets/vendor/datatables/dataTables.bootstrap4.min.js";
// import "../assets/js/demo/datatables-demo.js";
// import "../assets/js/demo/chart-pie-demo.js";
// import "../assets/js/demo/chart-area-demo.js";

// import "startbootstrap-sb-admin-2/vendor/jquery/jquery.min.js"
// import "startbootstrap-sb-admin-2/vendor/bootstrap/js/bootstrap.bundle.min.js"

// import "startbootstrap-sb-admin-2/vendor/jquery-easing/jquery.easing.min.js"

// import "startbootstrap-sb-admin-2/js/sb-admin-2.min.js"

// import "startbootstrap-sb-admin-2/vendor/chart.js/Chart.min.js"

// import "startbootstrap-sb-admin-2/js/demo/chart-area-demo.js"
// import "startbootstrap-sb-admin-2/js/demo/chart-pie-demo.js"

// import "startbootstrap-sb-admin-2/vendor/fontawesome-free/css/all.min.css"
// import "startbootstrap-sb-admin-2/css/sb-admin-2.min.css"



import { AdminHeader } from "../components/AdminHeader";


export const AdminLayout = ({ children }) => {
  return (
    <>
      <AdminHeader>
        <>{children} </>
      </AdminHeader>
    </>
  );
};

