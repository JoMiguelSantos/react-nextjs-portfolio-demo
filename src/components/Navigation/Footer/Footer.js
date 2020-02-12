import "./Footer.scss";
import FooterNavItems from "./FooterNavItems/FooterNavItems";

const footer = ({ user, loading }) => (
  <footer className="footer">
    <FooterNavItems user={user} loading={loading} />
  </footer>
);

export default footer;
