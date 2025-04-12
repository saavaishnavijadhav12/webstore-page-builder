import { IChildCategoryItemsData, ISubCategoryData, ISubCategoryItemsData } from "@znode/types/category";
import React, { useCallback } from "react";

import { NavLink } from "../../../../common/nav-link";
import { setLocalStorageData } from "@znode/utils/component";

const SubCategory: React.FC<ISubCategoryData> = ({ setIsMenuShown, subCategories }) => {
  const redirectToCategory = useCallback(
    (url: string) => {
      if (setIsMenuShown) {
        setIsMenuShown(false);
      }
      setLocalStorageData("breadCrumbsDetails", JSON.stringify({ breadCrumbsTitle: url, isCategoryFlow: true }));
    },
    [setIsMenuShown]
  );

  const renderSubCategory = useCallback(
    (subCategory: ISubCategoryItemsData[]) => {
      return subCategory.map((subCategoryData: ISubCategoryItemsData) => {
        return (
          <div className="max-w-60 mr-6 mb-2 shop-department-wrapper" key={subCategoryData.categoryUrl}>
            <div className="text-megaMenuLinkColor mb-3" data-test-selector="divSubCategories">
              <NavLink
                dataTestSelector={`link${subCategoryData.dataTestSelector}`}
                className="font-bold shop-department-wrapper"
                url={subCategoryData?.categoryUrl || ""}
                onClick={() => redirectToCategory(subCategoryData.breadcrumbHtml)}
              >
                {subCategoryData.name}
              </NavLink>
            </div>
            {subCategoryData.subCategories && subCategoryData.subCategories.length > 0 && (
              <ul className="mb-2 font-medium border-none text-megaMenuLinkColor shop-department-wrapper">
                {subCategoryData.subCategories.map((childCategoryData: IChildCategoryItemsData) => (
                  <li className="mb-2 border-none shop-department-wrapper" key={childCategoryData.categoryUrl}>
                    <NavLink
                      dataTestSelector={`link${childCategoryData.dataTestSelector}`}
                      className="font-medium shop-department-wrapper"
                      url={childCategoryData.categoryUrl}
                      onClick={() => redirectToCategory(childCategoryData.breadcrumbHtml)}
                    >
                      {childCategoryData.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      });
    },
    [redirectToCategory]
  );

  if (!subCategories?.length) return null;

  return (
    <div
      className="z-20 flex flex-wrap w-full p-4 capitalize bg-white shop-department-wrapper max-h-[calc(100vh-235px)] overflow-y-auto custom-scroll"
      data-test-selector="divSubCategory"
    >
      {renderSubCategory(subCategories)}
    </div>
  );
};

export default SubCategory;
