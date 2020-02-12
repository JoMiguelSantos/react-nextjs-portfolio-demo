import "./FooterNavItems.scss";

import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";

import FooterNavItem from "./FooterNavItem/FooterNavItem";

const footerNavItems = ({ user, loading }) => {
  return (
    <React.Fragment>
      <FooterNavItem link="about-us" />
      <FooterNavItem link="contact-us" />
      {!loading && (user ? <FooterNavItem link="roadmap" /> : null)}
      <p className="copyright">Reshaped &copy; {new Date().getFullYear()}</p>
      <FooterNavItem link="faq" />
      {!loading && (user ? <FooterNavItem link="onboarding" /> : null)}
      <div className="social-media">
        <FacebookIcon className="icon--facebook"></FacebookIcon>
        <LinkedInIcon className="icon--linkedin"></LinkedInIcon>
        <TwitterIcon className="icon--twitter"></TwitterIcon>
      </div>
    </React.Fragment>
  );
};

export default footerNavItems;
