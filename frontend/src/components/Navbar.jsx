import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import InsiteLogo from './InsiteLogo';
import UserInfo from './UserInfo';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
        <div className={styles.nav_logo}>
            <Link to="/"><InsiteLogo/></Link>
        </div>
        <div className={styles.nav_center}>
            <a className={styles.nav_link} href="#">Platform</a>
            <a className={styles.nav_link} href="#">Blog</a>
            <a className={styles.nav_link} href="#">Pricing</a>
            <a className={styles.nav_link} href="#">Careers</a>
        </div>
        <UserInfo />
    </nav>
  );
};

export default Navbar;