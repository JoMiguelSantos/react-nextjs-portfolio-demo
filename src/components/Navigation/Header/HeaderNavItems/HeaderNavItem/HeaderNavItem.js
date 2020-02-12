import "./HeaderNavItem.scss";
import Link from "next/link";

const headerNavItem = props => {
  return (
    <Link href={`/api/auth/${props.link}`}>
      <a className="header__nav--item" id="{props.link}">
        {props.link.toUpperCase().split("-")}
      </a>
    </Link>
  );
};

export default headerNavItem;
