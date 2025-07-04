import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
        <div className={styles.nav_logo}>
            inSITE
        </div>
        <div className={styles.nav_center}>
            <a>Dashboard</a>
            <a>What is AEO</a>
            <a>How It Works</a>
            <a>Pricing</a>
            <a>Partner with us</a>
        </div>
    </nav>
  );
};

export default Navbar;