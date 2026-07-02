import { createContext, useContext, useState, useEffect } from "react";

export const AdminContext = createContext(null);

const AdminContextProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");
  const [adminName, setAdminName] = useState(localStorage.getItem("adminName") || "");
  const url = "http://localhost:4000";

  const adminLogin = (token, name) => {
    setAdminToken(token);
    setAdminName(name);
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminName", name);
  };

  const adminLogout = () => {
    setAdminToken("");
    setAdminName("");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
  };

  return (
    <AdminContext.Provider value={{ adminToken, adminName, adminLogin, adminLogout, url }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
export default AdminContextProvider;
