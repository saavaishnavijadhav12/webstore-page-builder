import "./navigation.scss";

import { useCallback, useEffect } from "react";

import { MENU } from "@znode/constants/menu";
import MegaMenu from "../mega-menu/MegaMenu";
import { useModal } from "../../../../stores/modal";
import { useTranslations } from "next-intl";

export const Navigation = () => {
  const menuTranslations = useTranslations("Layout");
  const { isMenuShown, setIsMenuShown } = useModal();

  const displayMenu = () => {
    document.body.classList.add("overflow-hidden");
    isMenuShown === false ? setIsMenuShown(true) : setIsMenuShown(false);
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!event.target || !(event.target instanceof Element)) return;
      if (!event.target.classList.contains("shop-department-wrapper")) {
        setIsMenuShown(false);
      }
      document.body.classList.remove("overflow-hidden"); 
    },
    [setIsMenuShown]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav>
      <ul className="flex items-center gap-6 mt-1 font-semibold uppercase" data-test-selector="listNavigationContainer">
        <li className="self-end" data-test-selector="listShopDepartment">
          <button className="w-full py-1 font-medium uppercase text-start" onClick={displayMenu} data-test-selector="btnDepartment">
            <span>Menu</span>
          </button>
          <MegaMenu type={MENU.DESKTOP} customClass="mega-menu absolute left-0 top-full" isVisible={isMenuShown} />
        </li>
      </ul>
    </nav>
  );
};
