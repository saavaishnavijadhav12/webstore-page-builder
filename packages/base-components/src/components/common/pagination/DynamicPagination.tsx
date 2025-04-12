"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { IPageList } from "@znode/types/portal";
import { PAGINATION } from "@znode/constants/pagination";
import { SETTINGS } from "@znode/constants/settings";
import { Separator } from "../separator";
import { ZIcons } from "../icons";
import { generateQueryString } from "@znode/utils/component";
import { useTranslations } from "next-intl";

const defaultPaginationCount = PAGINATION.DEFAULT_PAGINATION;
const arrowColor = PAGINATION.ARROW_COLOR;
const disabledArrowColor = PAGINATION.DISABLED_ARROW_COLOR;

export function DynamicPagination({
  totalProducts,
  pageList,
  pageSize = 0,
  isProductsPagination = false,
}: Readonly<{ totalProducts: number; pageList: IPageList[]; pageSize?: number | null | string; isProductsPagination?: boolean }>) {
  const paginationTranslations = useTranslations("Pagination");
  const router = useRouter();
  const pathName = usePathname();
  const currentSearchParams = useSearchParams();

  const initialPageSize = (pageSize || defaultPaginationCount).toString();

  const initialPageNumber = parseInt(currentSearchParams?.get("pageNumber") || "1");

  const [selected, setSelected] = useState<number>(parseInt(initialPageSize));
  const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);

  const totalPages = Math.ceil(totalProducts / selected);

  const isLeftArrowDisabled = pageNumber <= 1;
  const isRightArrowDisabled = pageNumber >= totalPages;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(parseInt(event.target.value));
    setPageNumber(1);
    router.push(`${generateQueryString(pathName, currentSearchParams, event.target.value, "pagination")}`);
  };

  const handleRightClick = () => {
    if (!isRightArrowDisabled) {
      setPageNumber((prevPage) => {
        const newPageNumber = prevPage + 1;
        router.push(`${generateQueryString(pathName, currentSearchParams, newPageNumber, "pageNumber", initialPageSize)}`);
        return newPageNumber;
      });
    }
  };

  const handleLeftClick = () => {
    if (!isLeftArrowDisabled) {
      setPageNumber((prevPage) => {
        const newPageNumber = prevPage - 1;
        router.push(`${generateQueryString(pathName, currentSearchParams, newPageNumber, "pageNumber", initialPageSize)}`);
        return newPageNumber;
      });
    }
  };

  const renderStartProductCount = () => {
    const countFrom = pageNumber > 0 ? selected * (pageNumber - 1) + 1 : 1;
    return countFrom;
  };

  const renderEndProductCount = () => {
    const countTo = pageNumber > 0 ? selected * pageNumber : selected;
    return pageNumber === totalPages ? totalProducts : countTo;
  };


  return (
    <div>
      {totalProducts > 0 && (
        <>
          <Separator customClass="mt-3" />
          <div className="justify-center" data-test-selector="divItemPerPage">
            <div className="flex flex-row items-center justify-center sm:flex-row xs:flex-row">
              <div className="relative text-sm outline-none px-4 md:pl-0">
                <label className="mr-2 capitalize" htmlFor="sort" data-test-selector="lblItemPerPage">
                  {isProductsPagination ? paginationTranslations("productsPerPage") : paginationTranslations("itemsPerPage")}:
                </label>
                <select
                  id="PageSize"
                  value={selected}
                  name="PageSize"
                  data-test-selector="selectPageSize"
                  onChange={handleChange}
                  aria-label="pageSizeDropDown"
                  className="appearance-none bg-transparent h-10 focus-visible:outline-none pr-1 w-7"
                >
                  {pageList &&
                    pageList.length > 0 &&
                    pageList.map((options: IPageList, index: number) => (
                      <option
                        value={options?.pageValue}
                        key={`${index}_${options?.pageValue}`}
                        data-test-selector={`optShow${options?.pageValue}`}
                        data-selected={selected === options.pageValue ? options.pageValue : null}
                      >
                        {options?.pageValue}
                      </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <ZIcons name="chevron-down" data-test-selector="svgPageArrowDown" color={`${SETTINGS.DEFAULT_ICONS_COLOR}`} />
                </div>
              </div>
              <div className="flex border-l border-black h-10 ml-3">
                <p className="flex items-center text-sm px-4">
                  {renderStartProductCount()} - {renderEndProductCount()} {paginationTranslations("of")} {totalProducts}
                </p>
                <div className="flex">
                  <button className="pr-2 text-sm cursor-pointer" disabled={isLeftArrowDisabled} onClick={handleLeftClick} data-test-selector="btnLeftArrow">
                    <ZIcons
                      name="chevron-left"
                      color={isLeftArrowDisabled ? disabledArrowColor : arrowColor}
                      data-test-selector={isLeftArrowDisabled ? "svgLeftArrowDisable" : "svgLeftArrow"}
                    />
                  </button>
                  <button className="pl-2 text-sm cursor-pointer" disabled={isRightArrowDisabled} onClick={handleRightClick} data-test-selector="btnRightArrow">
                    <ZIcons
                      name="chevron-right"
                      color={isRightArrowDisabled ? disabledArrowColor : arrowColor}
                      data-test-selector={isRightArrowDisabled ? "svgRightArrowDisabled" : "svgRightArrow"}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}