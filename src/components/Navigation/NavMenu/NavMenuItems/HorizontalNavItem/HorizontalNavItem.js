import Link from "next/link";

import { capitalize } from "../../../../../js.utils";
import "./HorizontalNavItem.scss";

const horizontalNavItem = props => {
  let pageName = props.pageName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const inputClasses = ["navmenu__content--item"];
  let id = false;
  if (props.isActive && props.fullPath.includes(pageName)) {
    inputClasses.push("active");
    id = "active-page";
  } else inputClasses.push("inactive");

  return (
    <Link
      href={
        props.basePath === "/applications"
          ? `${props.basePath}/${pageName}`
          : ""
      }
    >
      <a className={inputClasses.join(" ")} id={id ? id : ""}>
        {capitalize(pageName)}
      </a>
    </Link>
  );
};

export default horizontalNavItem;
