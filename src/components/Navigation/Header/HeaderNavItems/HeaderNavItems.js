import "./HeaderNavItems.scss";

import GitHubIcon from "@material-ui/icons/GitHub";

import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import HeaderNavItem from "./HeaderNavItem/HeaderNavItem";

const headerNavItems = ({ user, loading }) => {
  return (
    <React.Fragment>
      {!loading &&
        (user ? (
          <div className="header__navigation--items">
            <a
              className="header__nav--item code"
              target="_blank"
              href="https://github.com/JoMiguelSantos/react-nextjs-portfolio-demo"
            >
              See the code <GitHubIcon className="git-icon" />
            </a>
            <HeaderNavItem link="logout" />
            <PersonOutlineIcon
              className="icon--account"
              fontSize="large"
              // onClick={() => Router.push("/account")}
            />
          </div>
        ) : (
          <div className="header__navigation--items">
            <a
              className="header__nav--item code"
              target="_blank"
              href="https://github.com/JoMiguelSantos/react-nextjs-portfolio-demo"
            >
              See the code <GitHubIcon className="git-icon" />
            </a>
            <HeaderNavItem link="signup" />
            <HeaderNavItem link="login" />
          </div>
        ))}
    </React.Fragment>
  );
};

export default headerNavItems;
