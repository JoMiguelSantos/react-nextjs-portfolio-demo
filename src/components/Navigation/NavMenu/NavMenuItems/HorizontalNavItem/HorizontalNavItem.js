import Link from "next/link";
import Router from "next/router";
import Spinner from "../../../../Spinner/Spinner";

import { capitalize } from "../../../../../js.utils";

import "./HorizontalNavItem.scss";

import { useState } from "react";

const horizontalNavItem = props => {
  const [isLoading, setLoading] = useState(false);

  const pageClickHandler = () => {
    Router.events.on("routeChangeStart", () => setLoading(true));
    Router.events.on("routeChangeComplete", () => setLoading(false));
    Router.events.on("routeChangeError", () => setLoading(false));
  };

  let pageName = props.pageName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const inputClasses = ["navmenu__content--item"];
  let id = false;
  if (props.isActive && props.fullPath.includes(pageName)) {
    inputClasses.push("active");
    id = "active-page";
  } else inputClasses.push("inactive");

  return isLoading ? (
    <Spinner message={`Loading ${capitalize(pageName)}`} size="small" />
  ) : (
    <Link
      href={
        props.basePath === "/applications"
          ? `${props.basePath}/${pageName}`
          : ""
      }
    >
      <a
        className={inputClasses.join(" ")}
        id={id ? id : ""}
        onClick={pageClickHandler}
      >
        {capitalize(pageName)}
      </a>
    </Link>
  );
};

export default horizontalNavItem;
