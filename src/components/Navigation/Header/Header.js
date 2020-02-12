import "./Header.scss";

import HeaderNavItems from "./HeaderNavItems/HeaderNavItems";
import Logo from "../../Logo/Logo";

import { useState, useEffect } from "react";
import { debounce } from "lodash";

const Header = props => {
  const [oldScroll, setOldScroll] = useState(-1);
  const [isVisible, setVisible] = useState(true);

  const handleScroll = debounce(
    () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      const scrollDistance = scrollY - oldScroll;
      if (
        // if going up then make header visible
        scrollY < oldScroll ||
        // if it's a small scroll and the header is already visible then keep the header visible
        (scrollDistance > 0 && scrollDistance < 10 && isVisible) ||
        // if scrolling on the top then header visible
        scrollY < 70
      ) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      setOldScroll(scrollY);
    },
    20,
    { leading: true, trailing: false }
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (typeof window !== "undefined") {
    // redundancy to avoid Header to disappear due to very fast scroll
    useEffect(() => {
      if (window.pageYOffset < 70) {
        setVisible(true);
      }
      return;
    }, [window.pageYOffset]);
  }

  return (
    <header className={`header ${!isVisible && `header--hidden`}`}>
      <Logo />
      <nav>
        <HeaderNavItems user={props.user} loading={props.loading} />
      </nav>
    </header>
  );
};

export default Header;
