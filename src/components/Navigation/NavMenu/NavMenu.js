import NavMenuItems from "./NavMenuItems/NavMenuItems";

import { useRouter } from "next/router";

import "./NavMenu.scss";

const navMenuItems = ({ user, loading }) => {
  const router = useRouter();
  const routes = ["/profile", "/search", "/insights", "/applications"];

  const basePath = router.pathname
    .split("/")
    .slice(0, 2)
    .join("/");
  const fullPath = router.pathname;
  const filtered_routes = routes.filter(route => route !== basePath);
  const isNotIndex = fullPath !== "/";

  return (
    <React.Fragment>
      {!loading &&
        isNotIndex &&
        (user ? (
          <nav className="navmenu">
            <NavMenuItems
              isActive={true}
              basePath={basePath}
              fullPath={fullPath}
            />
            <div className="navmenu__content">
              {filtered_routes.map(route => (
                <NavMenuItems key={route} basePath={route} />
              ))}
            </div>
          </nav>
        ) : null)}
    </React.Fragment>
  );
};

export default navMenuItems;
