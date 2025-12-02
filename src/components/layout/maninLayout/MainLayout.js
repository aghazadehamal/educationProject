
import React, { useState } from "react";
import Sidebar from "../sideBar/Sidebar";
import styles from "./MainLayout.module.css";
import { FiMenu } from "react-icons/fi"; 

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.layout}>
      <Sidebar isMobileOpen={isSidebarOpen} onMobileClose={closeSidebar} />

      <main className={styles.main}>
        <header className={styles.mobileHeader}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={openSidebar}
          >
            <FiMenu size={24} />  
          </button>
        </header>

        {children}
      </main>
    </div>
  );
};

export default MainLayout;
