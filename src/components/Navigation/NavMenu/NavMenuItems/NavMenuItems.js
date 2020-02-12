import AssessmentIcon from "@material-ui/icons/Assessment"; // insights
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter"; //applications
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd"; // profile
import FindInPageIcon from "@material-ui/icons/FindInPage"; //search

import HorizontalNavItem from "./HorizontalNavItem/HorizontalNavItem";

import Router from "next/router";

import "./NavMenuItems.scss";

const navMenuItem = props => {
  let inputElement;
  const basePathName = props.basePath.split("/")[1];
  const iconClasses = ["navmenu__content--icon"];
  const itemsClasses = ["navmenu__content--items"];
  let id;

  if (props.isActive) {
    iconClasses.push("active");
    itemsClasses.push("active");
    id = "active-icon";
  } else {
    iconClasses.push("inactive");
    itemsClasses.push("inactive");
  }

  // pages for the menu
  const pages = {
    profile: {
      icon: (
        <AssignmentIndIcon
          // onClick={() => Router.push("/profile")}
          className={iconClasses.join(" ")}
          fontSize="large"
          id={id ? id : ""}
        />
      ),
      basePage: "/profile",
      childPages: [
        "checklist",
        "basic-profile",
        "educational-background",
        "professional-experience",
        "skills",
        "resumés",
        "cover-letters"
      ]
    },
    search: {
      icon: (
        <FindInPageIcon
          // onClick={() => Router.push("/search")}
          className={iconClasses.join(" ")}
          fontSize="large"
          id={id ? id : ""}
        />
      ),
      basePage: "/search",
      childPages: ["search-profile", "job-search", "saved-jobs"]
    },
    insights: {
      icon: (
        <AssessmentIcon
          // onClick={() => Router.push("/insights")}
          className={iconClasses.join(" ")}
          fontSize="large"
          id={id ? id : ""}
        />
      ),
      basePage: "/insights",
      childPages: ["career-insights", "job-application-insights", "explore"]
    },
    applications: {
      icon: (
        <BusinessCenterIcon
          onClick={() => Router.push("/applications")}
          className={iconClasses.join(" ")}
          fontSize="large"
          id={id ? id : ""}
        />
      ),
      basePage: "/applications",
      childPages: ["closed-applications", "open-applications"]
    }
  };

  inputElement = (
    <React.Fragment>
      <div className="navmenu__content--base icon">
        {pages[basePathName].icon}
        <p>{pages[basePathName].basePage.split("/")[1].toUpperCase()}</p>
      </div>
      <div className="navmenu__horizontal--items">
        {pages[basePathName].childPages.map(pageName => (
          <HorizontalNavItem
            basePath={pages[basePathName].basePage}
            pageName={pageName}
            isActive={props.isActive}
            fullPath={props.fullPath}
          />
        ))}
      </div>
    </React.Fragment>
  );

  return (
    <div
      id={props.isActive && "active-section"}
      className={itemsClasses.join(" ")}
    >
      {inputElement}
    </div>
  );
};

export default navMenuItem;
