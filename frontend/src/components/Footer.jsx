import React from 'react';
import styles from './Footer.module.css';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.footerMain}>
                <div className={styles.footerItem}>
                    <h2>INSITE</h2>
                    <p>Optimizing Digital Performance in the Age of AI</p>
                </div>
                <div className={styles.footerItemSpread}>
                    <table>
                        <thead>
                            <tr>
                                <th>Explore</th>
                                <th>Menu</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><a>Resources</a></td>
                                <td><a>Home</a></td>
                            </tr>
                            <tr>
                                <td><a>Blog</a></td>
                                <td><a>About</a></td>
                            </tr>
                            <tr>
                                <td><a>Documents</a></td>
                                <td><a>Contact</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={styles.footerBot}>
                <div className={styles.footerItem}>
                    <div className={styles.footerTerms}>
                        <a>Terms</a>
                        <a>Privacy</a>
                        <a>Cookies</a>
                    </div>
                </div>
                <div className={styles.footerItem}>
                    <p className={styles.copyright}>© 2025 By INSITE. All Rights Reserved.</p>
                </div>
                <div className={styles.footerItem}>
                    <div className={styles.socialButtons}>
                        <button><FaFacebookF size={20} color="white"/></button>
                        <button><FaLinkedinIn size={20} color="white" /></button>
                        <button><FaTwitter size={20} color="white" /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;
