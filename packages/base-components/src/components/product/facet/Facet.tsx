"use client";

import { IAttributeValues, IFacetArray, IFacets } from "@znode/types/facet";
import { useEffect, useState } from "react";

import Button from "../../common/button/Button";
import FacetData from "./FacetData";
import { FacetName } from "./FacetName";
import { SETTINGS } from "@znode/constants/settings";
import { ZIcons } from "../../common/icons";
import { useTranslations } from "next-intl";

export function Facet({ facetData, ...rest }: Readonly<{ facetData: IFacets[] }>) {
  const facetTranslations = useTranslations("Facet");
  const [facetArray, setFacetArray] = useState<IFacetArray[]>([]);
  const [checkedListArray, setCheckedListArray] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<{ [key: string]: boolean }>({});
  const [showFilter, setShowFilter] = useState<boolean>(true);

  useEffect(() => {
    const activeTabList: { [key: string]: boolean } = {};
    facetData.map((item: IFacets) => (activeTabList[item.attributeCode] = true));
    setActiveTab(activeTabList);
    if (window.innerWidth < 1024) {
      setShowFilter(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFacetAttributes = (facet: IFacets) => {
    return (
      facet?.attributeValues &&
      facet?.attributeValues?.map((facetAttribute: IAttributeValues, i: number) => {
        return (
          <FacetData
            key={i}
            facetAttributeData={facetAttribute || {}}
            facetGroup={facet}
            facetArray={facetArray}
            setFacetArray={setFacetArray}
            checkedListArray={checkedListArray}
            setCheckedListArray={setCheckedListArray}
            {...rest}
          />
        );
      })
    );
  };

  const renderFacet = (facetDetails: IFacets[]) => {
    return (
      facetDetails &&
      facetDetails?.map(
        (filtersData: IFacets) =>
          filtersData?.attributeValues.length !== 0 && (
            <div className="mb-4" key={filtersData?.attributeCode}>
              <FacetName filtersData={filtersData} activeTab={activeTab} setActiveTab={setActiveTab} />
              {activeTab[filtersData?.attributeCode] && renderFacetAttributes(filtersData)}
            </div>
          )
      )
    );
  };

  return (
    <>
      <div className="flex items-center justify-center mb-4 lg:mb-0">
        <Button
          type="secondary"
          size="small"
          className="p-2 mb-2 mt-3 lg:hidden xs:hover:bg-white xs:hover:text-textColor"
          dataTestSelector="sortFilterBtn"
          endIcon={
            <>
              <ZIcons name="chevron-up" className={showFilter ? "block" : "hidden"} color={`${SETTINGS.DEFAULT_ICONS_COLOR}`} data-test-selector="svgFacetArrowUp" />
              <ZIcons
                name="chevron-down"
                strokeWidth={"1.5px"}
                className={!showFilter ? "block" : "hidden"}
                color={`${SETTINGS.DEFAULT_ICONS_COLOR}`}
                data-test-selector="svgFacetArrowDown"
              />
            </>
          }
          onClick={() => setShowFilter((prev) => !prev)}
          ariaLabel="facet sort and filter button"
        >
          {facetTranslations("filter")}
        </Button>
      </div>
      {showFilter && facetData?.length > 0 && renderFacet(facetData)}
    </>
  );
}
