import Link from "next/link";
import "./Logo.scss";

const logo = () => (
  <Link href="/">
    <a className="header__logo">
      <img
        src="/images/reshaped_logo.png"
        alt="logo"
        width="60px"
        height="60px"
      />
    </a>
  </Link>
);

export default logo;
