import "./HeaderNavItems.scss";

// import Router from "next/router";

import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import HeaderNavItem from "./HeaderNavItem/HeaderNavItem";

const headerNavItems = ({ user, loading }) => {
  return (
    <React.Fragment>
      {!loading &&
        (user ? (
          <div className="header__navigation--items">
            <HeaderNavItem link="logout" />
            <PersonOutlineIcon
              className="icon--account"
              fontSize="large"
              // onClick={() => Router.push("/account")}
            />
          </div>
        ) : (
          <div className="header__navigation--items">
            <HeaderNavItem link="signup" />
            <HeaderNavItem link="login" />
          </div>
        ))}
    </React.Fragment>
  );
};

export default headerNavItems;
