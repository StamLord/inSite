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
            <a href="#">Platform</a>
            <a href="#">Blog</a>
            <a href="#">Pricing</a>
            <a href="#">Careers</a>
        </div>
        <UserInfo />
    </nav>
  );
};

export default Navbar;