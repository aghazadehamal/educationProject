import React from "react";
import { NavLink } from "react-router-dom";
import { FiLogOut, FiX } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LogoutConfirmModal from "../logoutmodal/LogoutConfirmModal";
import { useState } from "react";
import {
  FiBookOpen,
  FiUsers,
  FiUser,
  FiPlayCircle,
  FiClipboard,
  FiBarChart2,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";

import styles from "./Sidebar.module.css";

const Sidebar = ({ isMobileOpen = false, onMobileClose }) => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
  };

  const handleLogoutCancel = () => {
    setIsLogoutOpen(false);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutOpen(false);
    if (onMobileClose) onMobileClose();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className={styles.overlay}
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${styles.sidebar} ${
          isMobileOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.brand}>
          <img
            className={styles.brandLogoImg}
            src="/gradlogo.png"
            alt="Novademy Logo"
          />

          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {user?.name || user?.username || "İstifadəçi"}
            </span>
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onMobileClose}
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Subjects</div>

            <NavLink
              to="/subjects/base"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiBookOpen />
              </span>
              <span>Fənn bazası</span>
            </NavLink>

            <NavLink
              to="/subjects/teachers"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiUsers />
              </span>
              <span>Təlimçilər</span>
            </NavLink>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Students</div>

            <NavLink
              to="/students"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiUser />
              </span>
              <span>Tələbə paneli</span>
            </NavLink>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Lessons</div>

            <NavLink
              to="/lessons"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiPlayCircle />
              </span>
              <span>Dərs paneli</span>
            </NavLink>

            <NavLink
              to="/my-lessons"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiPlayCircle />
              </span>
              <span>Dərslərim</span>
            </NavLink>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Exams</div>

            <NavLink
              to="/exams/base"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiClipboard />
              </span>
              <span>İmtahan bazası</span>
            </NavLink>

            <NavLink
              to="/exams/panel"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiClipboard />
              </span>
              <span>İmtahan paneli</span>
            </NavLink>

            <NavLink
              to="/exams/my"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiClipboard />
              </span>
              <span>İmtahanlarım</span>
            </NavLink>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Analytics</div>

            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiBarChart2 />
              </span>
              <span>Analitika</span>
            </NavLink>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Users</div>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiUsers />
              </span>
              <span>İstifadəçi paneli</span>
            </NavLink>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Settings</div>

            <NavLink
              to="/settings/account"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiUser />
              </span>
              <span>Mənim hesabım</span>
            </NavLink>

            <NavLink
              to="/settings/addresses"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiMapPin />
              </span>
              <span>Ünvanlar</span>
            </NavLink>

            <NavLink
              to="/settings/subscription"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
              onClick={onMobileClose}
            >
              <span className={styles.linkIcon}>
                <FiCreditCard />
              </span>
              <span>Abunəlik</span>
            </NavLink>
          </div>

          <div className={styles.logoutSection}>
            <button
              className={styles.logoutBtn}
              type="button"
              onClick={handleLogoutClick}
            >
              <FiLogOut size={18} />
              <span>Çıxış</span>
            </button>
          </div>

         
        </nav>

        <LogoutConfirmModal
          isOpen={isLogoutOpen}
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      </aside>
    </>
  );
};

export default Sidebar;
