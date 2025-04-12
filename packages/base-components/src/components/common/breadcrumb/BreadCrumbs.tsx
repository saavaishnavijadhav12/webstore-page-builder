"use client";

import { getLocalStorageData, removeLocalStorageData, setLocalStorageData } from "@znode/utils/component";
import { useEffect, useState } from "react";

import { IBreadCrumb } from "@znode/types/breadcrumb";
import Link from "next/link";
import { formatTestSelector } from "@znode/utils/common";
import { useRouter } from "next/navigation";

export function BreadCrumbs({ isParentCategory, name, znodeCategoryIds, customPath, combinationErrorMessage, parentConfigurableProductName, breadCrumbsTitle }: IBreadCrumb) {
  const [breadCrumbInfo, setBreadCrumbInfo] = useState("");
  const title = `<a href=${customPath?.routingPath}>${customPath?.routingLabel}</a> / ${customPath?.title}`;
  const breadCrumb = customPath && customPath?.title !== "" ? title : breadCrumbInfo === "" ? breadCrumbsTitle : breadCrumbInfo;
  const router = useRouter();

  const createBreadCrumbsDetails = () => {
   try {
     const data = getLocalStorageData("breadCrumbsDetails");
     if (!data) {
       return { breadCrumbsTitle: "", isCategoryFlow: false };
     }
     return JSON.parse(data);
   } catch (error) {
     return { breadCrumbsTitle: "", isCategoryFlow: false };
   }
  };

  useEffect(() => {
    const breadCrumbData = createBreadCrumbsDetails();

    if (breadCrumbData.isCategoryFlow) {
      setBreadCrumbInfo(breadCrumbData.breadCrumbsTitle as string);
      setLocalStorageData("breadCrumbsDetails", JSON.stringify({ breadCrumbsTitle: breadCrumbData.breadCrumbsTitle, isCategoryFlow: true }));
    } else {
      removeLocalStorageData("breadCrumbsDetails");
      setBreadCrumbInfo("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breadCrumbInfo]);

  const handleClick = (event: React.MouseEvent<HTMLUListElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "A" || target.tagName === "a") {
      event.preventDefault();
      const href = target.getAttribute("href");
      if (href) {
        router.push(href);
      }
    }
  };

 const handleBreadcrumbClick = (event: React.MouseEvent<HTMLDivElement>) => {
   event.preventDefault();
   const target = event.target as HTMLElement;

   if (target.tagName === "A") {
     const href = target.getAttribute("href");
     if (!href) return;
     const breadcrumbParts = breadCrumb?.split(" / ");
     const clickedIndex = breadcrumbParts?.findIndex((part) => part.includes(`href="${href}"`)) ;
     const modifiedBreadcrumb = breadcrumbParts?.slice(0, Number(clickedIndex) + 1).join(" / ");
     setBreadCrumbInfo(modifiedBreadcrumb as string);
     setLocalStorageData("breadCrumbsDetails", JSON.stringify({ breadCrumbsTitle: modifiedBreadcrumb, isCategoryFlow: true }));
   }
 };


  return (
    <div className="flex flex-wrap items-center text-xs separator-xs my-0 no-print">
      <ul
        className="flex flex-wrap items-center mb-2 text-breadCrumbsTextColor"
        onClick={handleClick}
        data-test-selector={formatTestSelector("listBreadCrumbCategoryContainer", `${name}`)}
      >
        {!customPath && (
          <li className="inline-flex items-center">
            <Link href="/" className="uppercase hover:text-hoverColor hover:underline" data-test-selector="linkBreadcrumbPathHome">
              {"Home"}
            </Link>
            {breadCrumb && <span className="h-auto mx-1 font-medium">/</span>}
          </li>
        )}
        {znodeCategoryIds?.at(-1) !== 0 && (
          <li className="inline-flex items-center uppercase" data-test-selector="linkBreadcrumbPathCategory">
            <div className="breadcrumb-category" onClick={handleBreadcrumbClick}>
              {breadCrumb && <span dangerouslySetInnerHTML={{ __html: breadCrumb }}></span>}
            </div>
            {isParentCategory && (
              <span className="h-auto mx-1 font-medium" data-test-selector="breadCrumbCategory">
                /
              </span>
            )}
          </li>
        )}
        {isParentCategory && (
          <li className="inline-flex items-center uppercase" data-test-selector={`breadCrumbCategory${name}`}>
            {!combinationErrorMessage ? name : parentConfigurableProductName}
          </li>
        )}
      </ul>
    </div>
  );
}
