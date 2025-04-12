import { IMegaMenuCategory } from "@znode/types/category";
import { NavLink } from "../../../../common/nav-link";
import { SETTINGS } from "@znode/constants/settings";
import SubCategory from "./SubCategory";
import { ZIcons } from "../../../../common/icons";
import { formatTestSelector } from "@znode/utils/common";
import { setLocalStorageData } from "@znode/utils/component";
import { useCategoryDetails } from "../../../../../stores";
import { useModal } from "../../../../../stores/modal";
import { useState } from "react";
const DesktopCategory = () => {
  const { category } = useCategoryDetails();
  let filteredData: IMegaMenuCategory | undefined;
  const { setIsMenuShown } = useModal();
  const [isShown, setIsShown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(filteredData);

  const showCategoryData = (categoryId: number) => {
    setIsShown(true);
    filteredData = category.find((data: IMegaMenuCategory) => data?.publishCategoryId === categoryId);
    setHoveredCategory(filteredData);
    setIsShown(true);
  };

  const redirectToCategory = (url: string) => {
    setIsMenuShown && setIsMenuShown(false);
    setLocalStorageData("breadCrumbsDetails", JSON.stringify({ breadCrumbsTitle: url, isCategoryFlow: true }));
  };

  const renderCategory = () => {
    return category.map((categoryData: IMegaMenuCategory, index: number) => {
      return (
        <li key={index} className="flex items-center justify-between px-4 py-2 border-none cursor-pointer text-megaMenuLinkColor shop-department-wrapper">
          <NavLink
            className="w-full font-medium uppercase text-start shop-department-wrapper"
            onMouseEnter={() => {
              categoryData.hasSubCategories ? showCategoryData(categoryData?.publishCategoryId) : setIsShown(false);
            }}
            url={categoryData?.categoryUrl || ""}
            onClick={() => redirectToCategory(categoryData.breadcrumbHtml)}
            dataTestSelector={formatTestSelector("link", categoryData.name || "")}
          >
            {categoryData?.name}
          </NavLink>
          <span
            className="cursor-pointer shop-department-wrapper"
            data-test-selector={`spn${categoryData.dataTestSelector}RightIcon`}
            onClick={() => {
              categoryData?.hasSubCategories && showCategoryData(categoryData?.publishCategoryId);
            }}
          >
            {!categoryData?.hasSubCategories ? "" : <ZIcons name="chevron-right" color={`${SETTINGS.ARROW_COLOR}`} />}
          </span>
        </li>
      );
    });
  };
  return (
    <>
      <div className="z-20 overflow-y-auto category bg-megaMenuBgColor custom-scroll shop-department-wrapper" data-test-selector="divCategoryMenus">
        {category && category.length > 0 ? <ul>{renderCategory()}</ul> : null}
      </div>
      {isShown && <SubCategory setIsMenuShown={setIsMenuShown} {...hoveredCategory} />}
      <div className="absolute left-0 w-full h-screen z-10 bg-black/[0.4]" onClick={() => setIsMenuShown(false)}></div>
    </>
  );
};

export default DesktopCategory;
