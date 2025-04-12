import React, { Dispatch, SetStateAction, useState } from "react";

import { IMegaMenuCategory } from "@znode/types/category";
import Link from "next/link";
import { ZIcons } from "../../../../common/icons";
import { formatTestSelector } from "@znode/utils/common";
import { setLocalStorageData } from "@znode/utils/component";

const Categories = ({ category, setShowNavBar }: { category: IMegaMenuCategory; setShowNavBar?: Dispatch<SetStateAction<boolean>> }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const redirectToCategory = (url: string) => {
    setIsOpen(!isOpen);
    setShowNavBar && setShowNavBar(false);
    setLocalStorageData("breadCrumbsDetails", JSON.stringify({ breadCrumbsTitle: url, isCategoryFlow: true }));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      handleToggle();
    }
  };

  return (
    <>
      <div className="flex justify-between border-b py-3.5" role={"button"} tabIndex={0} onKeyDown={() => handleKeyDown} onClick={handleToggle}>
        <Link
         
          className={`${!(category.subCategories && category.subCategories.length > 0) ? "w-full" : ""}`}
          data-test-selector={formatTestSelector("link", category.name || "")}
         
          href={category?.categoryUrl  || ""}
         
          onClick={() => redirectToCategory(category.breadcrumbHtml)}
        
        >
          {category.name}
        </Link>
        {category?.hasSubCategories && (
          <div className={"text-white cursor-pointer"} data-test-selector={`${isOpen ? "hideCategory" : "showCategory"}${category.publishCategoryId}`}>
            {isOpen ? <ZIcons name="minus" data-test-selector="svgClose" /> : <ZIcons name="plus" strokeWidth={"3px"} data-test-selector="svgOpen" />}
          </div>
        )}
      </div>
      {isOpen && category.subCategories && (
        <div className="ml-6">
          {category.subCategories.map((subCategory: IMegaMenuCategory, index: number) => (
            <Categories key={index} category={subCategory} setShowNavBar={setShowNavBar} />
          ))}
        </div>
      )}
    </>
  );
};

export default Categories;
