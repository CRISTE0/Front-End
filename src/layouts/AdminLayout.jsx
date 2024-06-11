import React from "react";




import { AdminHeader } from "../components/Admin/AdminHeader";


export const AdminLayout = ({ children }) => {
  return (
    <>
      <AdminHeader>
        <>{children} </>
      </AdminHeader>
    </>
  );
};

