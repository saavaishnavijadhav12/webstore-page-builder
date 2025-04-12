"use client";

import { generateQueryString, getLocalStorageData, setLocalStorageData, urlEncodeSpecialCharacters } from "@znode/utils/component";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FacetChipName } from "./FacetChipName";
import { IFacetArray } from "@znode/types/facet-chip-list";
import { useTranslations } from "next-intl";

export function FacetChipList() {
  const facetChipListTranslations = useTranslations("FacetChipList");
  const [facetArray, setFacetArray] = useState<IFacetArray[]>([]);
  const [checkedListArray, setCheckedListArray] = useState<string[]>([]);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const handleRemoveChips = (brandName: string, chipName: string) => {
    const data = [...facetArray];
    let updatedUrl = window?.location?.search?.split("&") || [];
    if (updatedUrl && updatedUrl.length > 1) {
      updatedUrl = updatedUrl.slice(1);
    }
    const index = data.findIndex((item: IFacetArray) => item.facet === brandName);
    if (index !== -1 && data.length > 0) {
      const brandIndex = data[index].attributeCode.indexOf(chipName);
      if (brandIndex !== -1) {
        data[index].attributeCode.splice(brandIndex, 1);
        if (data[index].attributeCode.length === 0) {
          data.splice(index, 1);
        }
        const filterChips = checkedListArray.filter((items: string) => items !== chipName);
        setCheckedListArray(filterChips);
        setFacetArray(data);
        setLocalStorageData("facet", JSON.stringify(data));
        setLocalStorageData("checkedFacet", JSON.stringify(filterChips));
        data?.length > 0
          ? router.push(`${generateQueryString(pathName, searchParams, createFilteredURL(data), "facet")}`)
          : router.push(`${pathName}?${updatedUrl && updatedUrl.join("&")}`);
      }
    }
  };

  const handleClearAll = () => {
    let updatedUrl = window?.location?.search?.split("&") || [];
    if (updatedUrl && updatedUrl.length > 1) {
      updatedUrl = updatedUrl.slice(1);
    }
    setLocalStorageData("facet", "[]");
    setLocalStorageData("checkedFacet", "[]");
    setSessionDataInState();
    router.push(`${pathName}?${updatedUrl && updatedUrl.join("&")}`);
  };

  const createFilteredURL = (selectedAttributes: IFacetArray[]) => {
    const facetURL =
      selectedAttributes &&
      selectedAttributes?.map((selectedData: IFacetArray) => {
        const generateValues = (selectedAttributeCodes: string[]) => {
          if (selectedAttributeCodes?.length > 1) {
            const attributeValues = selectedAttributeCodes.map((selectedCode: string) => selectedCode).join("~");
            return urlEncodeSpecialCharacters(attributeValues);
          } else {
            return urlEncodeSpecialCharacters(selectedAttributeCodes[0] || "");
          }
        };
        return `${selectedData.facet}|${generateValues(selectedData?.attributeCode)}`;
      });

    return facetURL;
  };
  const setSessionDataInState = async () => {
    const facetData = getLocalStorageData("facet");
    const facetDataParse = await JSON.parse(facetData);
    setFacetArray(facetDataParse);
    const checkedFacetData = getLocalStorageData("checkedFacet");
    const checkedFacetParse = await JSON.parse(checkedFacetData);
    setCheckedListArray(checkedFacetParse);
  };

  useEffect(() => {
    if (searchParams?.get("facetGroup") === null) {
      setLocalStorageData("facet", "[]");
      setLocalStorageData("checkedFacet", "[]");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchParams?.get("facetGroup") !== null || pathName !== "") {
      setSessionDataInState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.get("facetGroup")]);

  return (
    facetArray?.length > 0 && (
      <div className="mb-3 flex items-center justify-start flex-wrap">
        {facetArray.map((chips, index: number) => (
          <FacetChipName
            facetName={chips?.facetName || ""}
            facet={chips?.facet || ""}
            attributeCode={chips?.attributeCode || []}
            key={index}
            removeChip={handleRemoveChips}
            filterBy={facetChipListTranslations("filterBy")}
            firstFacetFlag={index === 0}
          />
        ))}
        <div className="text-linkColor capitalize text-sm ml-2 cursor-pointer underline" data-test-selector="divClearAllFacet" onClick={handleClearAll}>
          clear all
        </div>
      </div>
    )
  );
}
