import "./FooterNavItem.scss";
import Link from "next/link";
import { capitalize } from "../../../../../js.utils.js";

const footerNavItem = props => {
  return (
    <Link href="">
      <a className={`footer__nav--item ${props.link}`}>
        {capitalize(props.link)}
      </a>
    </Link>
  );
};

export default footerNavItem;
