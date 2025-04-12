"use client";

import React, { useEffect, useState } from "react";

import { SETTINGS } from "@znode/constants/settings";
import { Separator } from "../separator";
import { ZIcons } from "../icons";
import { useTranslations } from "next-intl";

interface IPagination {
  totalResults: string | number;
  onPageSizeChange: (_size: number) => void;
  onPageIndexChange: (_size: number) => void;
}

const Pagination = ({ totalResults, onPageSizeChange, onPageIndexChange }: IPagination) => {
  const t = useTranslations("Pagination");
  const defaultPaginationCount = SETTINGS.DEFAULT_TABLE_PAGE_SIZE;
  const arrowColor = SETTINGS.ARROW_COLOR;
  const disabledArrowColor = SETTINGS.DISABLED_ARROW_COLOR;

  const [selected, setSelected] = useState(defaultPaginationCount);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLeftArrowDisabled, setIsLeftArrowDisabled] = useState(disabledArrowColor);
  const [isRightArrowDisabled, setIsRightArrowDisabled] = useState(disabledArrowColor);
  const totalPages: number = Math.ceil(parseInt(`${totalResults}`) / selected);
  const optionList = [8, 12, 16, 32, 64];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(parseInt(event.target.value));
    setPageNumber(1);
    onPageSizeChange(parseInt(event.target.value));
  };

  const handleRightClick = () => {
    pageNumber === totalPages - 1 && setIsRightArrowDisabled(disabledArrowColor);

    if (pageNumber < totalPages) {
      setIsLeftArrowDisabled("#454545");
      setPageNumber((prevCount) => {
        const updatedCount = prevCount + 1;
        return updatedCount;
      });
    }
  };

  useEffect(() => {
    onPageIndexChange(pageNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  useEffect(() => {
    if (selected < parseInt(totalResults.toString())) {
      setIsRightArrowDisabled(arrowColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLeftClick = () => {
    pageNumber !== totalPages - 1 && setIsRightArrowDisabled(arrowColor);
    pageNumber - 1 === 1 && setIsLeftArrowDisabled(disabledArrowColor);
    if (pageNumber > 1) {
      setPageNumber((prevCount) => {
        const updatedCount = prevCount - 1;
        return updatedCount;
      });
    }
  };

  const renderStartProductCount = () => {
    const countFrom = pageNumber > 0 ? selected * (pageNumber - 1) + 1 : 1;
    return parseInt(`${totalResults}`) > defaultPaginationCount ? countFrom : 1;
  };

  const renderEndProductCount = () => {
    const count = pageNumber > 0 ? selected * (pageNumber - 1) + selected : selected;
    const finalCount = totalPages === pageNumber ? totalResults : count;
    return parseInt(`${totalResults}`) > defaultPaginationCount ? finalCount : totalResults;
  };

  return (
    <div>
      <Separator />
      <div className="flex flex-col items-center justify-center sm:flex-row" data-test-selector="divItemPerPage">
        <div className="flex flex-row items-center sm:flex-row xs:flex-col">
          <div className="relative px-4 xs:outline-none text-sm">
            <label className="mr-2 capitalize" htmlFor="sort" data-test-selector="lblItemPerPage">
              {t("itemsPerPage")}:
            </label>
            <select
              id="PageSize"
              value={selected}
              name="PageSize"
              data-test-selector="selectPageSize"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e)}
              aria-label="pageSizeDropDown"
              className="appearance-none bg-transparent h-10 focus-visible:outline-none pr-1 w-7"
            >
              {optionList.map((option) => {
                return (
                  <option value={option} key={option} data-test-selector={`optShow${option}`}>
                    {option}
                  </option>
                );
              })}
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ZIcons name="chevron-down" data-test-selector="svgPageArrowDown" color={`${SETTINGS.DEFAULT_ICONS_COLOR}`} />
            </div>
          </div>
          <div className="flex items-center text-sm sm:border-l border-black h-10 sm:ml-3">
            <p className="px-4">
              {renderStartProductCount()} - {renderEndProductCount()} {t("of")} {totalResults}
            </p>
            <div className="flex">
              <span className="pr-2 cursor-pointer" onClick={() => handleLeftClick()} data-test-selector="spnLeftArrow">
                <ZIcons name="chevron-left" color={isLeftArrowDisabled} data-test-selector={"svgLeftArrow"} />
              </span>
              <span className="pl-2 cursor-pointer" onClick={() => handleRightClick()} data-test-selector="spnRightArrow">
                <ZIcons name="chevron-right" color={isRightArrowDisabled} data-test-selector="svgRightArrow" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
