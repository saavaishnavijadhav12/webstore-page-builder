"use client";

import { IFacetArray, IFacetData, IFacets } from "@znode/types/facet";
import React, { useEffect } from "react";
import { generateQueryString, urlEncodeSpecialCharacters } from "@znode/utils/component";
import { getLocalStorageData, setLocalStorageData } from "@znode/utils/component";
import { usePathname, useSearchParams } from "next/navigation";

import Input from "../../common/input/Input";
import { PAGINATION } from "@znode/constants/pagination";
import { formatTestSelector } from "@znode/utils/common";
import { removeWhiteSpaces } from "@znode/utils/component";
import { useRouter } from "next/navigation";

export function FacetData({ facetAttributeData, facetGroup, facetArray, setFacetArray, checkedListArray, setCheckedListArray, ...props }: Readonly<IFacetData>) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const createFilteredURL = (selectedAttributes: IFacetArray[]) => {
    const facetURL =
      selectedAttributes &&
      selectedAttributes?.map((selectedData: IFacetArray) => {
        const generateValues = (selectedAttributeCodes: string[]) => {
          if (selectedAttributeCodes?.length > 1) {
            const attributeValues = selectedAttributeCodes?.map((selectedCode: string) => selectedCode).join("~");
            return urlEncodeSpecialCharacters(attributeValues);
          } else {
            return urlEncodeSpecialCharacters(selectedAttributeCodes[0] || "");
          }
        };
        return `${selectedData.facet}|${generateValues(selectedData?.attributeCode)}`;
      });

    return facetURL;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, facet: IFacets, attributeCode: string) => {
    const contentToAddOrRemove = {
      facet: facet?.attributeCode,
      facetName: facet?.attributeName,
      attributeCode: [attributeCode],
    };
    const pageSize = props?.pageSize?.toString() || PAGINATION.DEFAULT_PAGINATION;
    const sort = searchParams.get("sort");

    if (e.target.checked) {
      const updateChecklist = checkedListArray?.length ? [...checkedListArray] : [];
      updateChecklist.push(attributeCode);
      setCheckedListArray(updateChecklist);
      setLocalStorageData("checkedFacet", JSON.stringify(updateChecklist));
      const checkedAttributes = facetArray?.length ? [...facetArray] : [];

      const index = checkedAttributes.findIndex((checkedAttribute: IFacetArray) => checkedAttribute?.facet === facet?.attributeCode);
      if (index !== -1) {
        checkedAttributes[index]?.attributeCode.push(attributeCode);
      } else {
        checkedAttributes.push(contentToAddOrRemove);
      }
      setLocalStorageData("facet", JSON.stringify(checkedAttributes));
      setFacetArray(checkedAttributes);
      router.push(`${generateQueryString(pathName, searchParams, createFilteredURL(checkedAttributes), "facet", pageSize)}`);
    } else {
      const unCheckedIndex = checkedListArray.findIndex((unChecked: string) => unChecked === attributeCode);
      const removeElementAtIndex = (arr: string[], index: number) => {
        arr.splice(index, 1);
        return arr;
      };
      const filteredChecklist = removeElementAtIndex(checkedListArray, unCheckedIndex);
      setCheckedListArray(filteredChecklist);
      setLocalStorageData("checkedFacet", JSON.stringify(filteredChecklist));
      const index: number = facetArray.findIndex((uncheckedAttribute: IFacetArray) => uncheckedAttribute?.facet === facet?.attributeCode);
      const attributeIndex: number = facetArray[index]?.attributeCode.findIndex((unCheckedAttrCode: string) => unCheckedAttrCode === attributeCode);

      if (facetArray && facetArray[index]?.attributeCode?.length > 1) {
        const filterCheckedAttributes = facetArray.filter((attributeObj: IFacetArray) => attributeObj?.attributeCode.splice(attributeIndex, 1));
        setFacetArray(filterCheckedAttributes);
        setLocalStorageData("facet", JSON.stringify(filterCheckedAttributes));
        router.push(`${generateQueryString(pathName, searchParams, createFilteredURL(filterCheckedAttributes), "facet", pageSize)}`);
      } else {
        const filterCheckedAttributes = facetArray.filter((facetAttribute: IFacetArray) => facetAttribute?.facet !== facet?.attributeCode);
        setFacetArray(filterCheckedAttributes);
        setLocalStorageData("facet", JSON.stringify(filterCheckedAttributes));
        filterCheckedAttributes?.length > 0 || pageSize || sort
          ? router.push(`${generateQueryString(pathName, searchParams, createFilteredURL(filterCheckedAttributes), "facet", pageSize)}`)
          : router.push(`${pathName}`);
      }
    }
  };
  const setSessionDataInState = async () => {
    const facetData = getLocalStorageData("facet");
    const facetParse = await JSON.parse(facetData);
    setFacetArray(facetParse);
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
    setSessionDataInState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.get("facetGroup")]);

  const { attributeValue, facetCount } = facetAttributeData;

  return (
    <div className="flex justify-between mb-2" key={attributeValue}>
      <div className="flex items-center ">
        <Input
          type="checkbox"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, facetGroup, attributeValue)}
          className="xs:w-4 h-4 accent-accentColor"
          id={removeWhiteSpaces(attributeValue)}
          checked={checkedListArray.includes(attributeValue)}
          dataTestSelector={`chkFacetValue${attributeValue.split(" ").join("")}`}
          ariaLabel={`facet-${removeWhiteSpaces(attributeValue)}`}
        />
        <label className="cursor-pointer break-all pl-5" htmlFor={removeWhiteSpaces(attributeValue)} data-test-selector={`lblFacetValue${attributeValue.split(" ").join("")}`}>
          {facetAttributeData?.label}
        </label>
      </div>
      {facetCount && (
        <div className="px-3 bg-gray-300 flex justify-center items-center cursor-default w-10 ml-1" data-test-selector={formatTestSelector("div", `FacetCount${attributeValue}`)}>
          {facetCount}
        </div>
      )}
    </div>
  );
}

export default FacetData;
