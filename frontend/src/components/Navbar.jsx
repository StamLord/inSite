import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
        <div className={styles.nav_logo}>
            inSITE
        </div>
        <div className={styles.nav_center}>
            <a href="#">Platform</a>
            <a href="#">Blog</a>
            <a href="#">Pricing</a>
            <a href="#">Careers</a>
        </div>
        <div className={styles.login_container}>
          <button className={styles.login_btn}>Login</button>
          <button className={styles.demo_btn}>Get a Demo</button>
        </div>
    </nav>
  );
};

export default Navbar;