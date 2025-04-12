"use client";

import { Heading } from "../../common/heading";
import { ICategory } from "@znode/types/category";
import Link from "next/link";
import { Separator } from "../../common/separator";
import { ZIcons } from "../../common/icons";
import { useState } from "react";
import { useTranslationMessages } from "@znode/utils/component";

export function SearchResultCategoryList({ facetData }: { facetData: ICategory[] }) {
  const facetTranslations = useTranslationMessages("Facet");
  const [isActive, setIsActive] = useState(true);

  const renderSearchResultCategoryList = (associatedCategoryList: ICategory[]) => {
    return (
      associatedCategoryList.length > 0 &&
      associatedCategoryList?.map((category: ICategory, index: number) => (
        <p key={index} className="flex items-center pb-2">
          <ZIcons name="chevron-right" data-test-selector="svgChevronRight" />
          <Link href={`/category/${category?.publishCategoryId}`} className="w-full font-semibold" data-test-selector={`linkAssociatedCategory${category?.publishCategoryId}`}>
            {category?.name}
          </Link>
        </p>
      ))
    );
  };

  return (
    <>
      {facetData?.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center cursor-pointer accordion-title" onClick={() => setIsActive(!isActive)}>
            <Heading customClass="uppercase" dataTestSelector="hdgCategories" name={facetTranslations("labelCategories")} level="h2" />
            <div>{isActive ? <ZIcons name="minus" /> : <ZIcons name="plus" />}</div>
          </div>
          <Separator customClass="mt-0" />
          {isActive && renderSearchResultCategoryList(facetData)}
        </div>
      )}
    </>
  );
}
