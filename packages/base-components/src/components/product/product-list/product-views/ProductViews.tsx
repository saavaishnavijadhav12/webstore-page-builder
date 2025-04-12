"use client";

import { IProductList, IProductListCard } from "@znode/types/product";
import { useEffect, useState } from "react";

import { FacetChipList } from "../../facet";
import { Heading } from "../../../common/heading";
import { MODE } from "@znode/constants/mode";
import { Modal } from "../../../common/modal";
import { NoRecordFound } from "../../../common/no-record-found/NoRecordFound";
import { ProductCard } from "../../../common/product-card";
import ProductComparePopup from "../../compare-product/compare-product-popup/CompareProductPopUp";
import { ProductListFilter } from "../product-list-filter/ProductListFilter";
import QuickViewDetails from "../../../common/product-card/quick-view/QuickViewDetails";
import { useTranslationMessages } from "@znode/utils/component";

export function ProductViews({
  productData,
  isFromSearch,
  isEnableCompare,
  breadCrumbsDetails,
  ...rest
}: Readonly<{ productData: IProductList; isFromSearch?: boolean; isEnableCompare?: boolean; breadCrumbsDetails?: { breadCrumbsTitle: string; isCategoryFlow: boolean } }>) {
  const [selectedMode, setSelectedMode] = useState(MODE.GRID_MODE);
  const commonTranslations = useTranslationMessages("Common");

  const { productList, loginToSeePricingAndInventory, displayAllWarehousesStock } = productData;
  const globalAttributes = {
    loginToSeePricingAndInventory: loginToSeePricingAndInventory ?? "false",
    displayAllWarehousesStock: displayAllWarehousesStock ?? "false",
  };

  useEffect(() => {
    const savedMode = sessionStorage.getItem("selectedMode") || MODE.GRID_MODE;
    setSelectedMode(savedMode);
  }, []);

  const changeView = (mode: string) => {
    setSelectedMode(mode);
    sessionStorage.setItem("selectedMode", mode);
  };

  const renderProductsView = () => {
    return productList.map((product: IProductListCard, i: number) => {
      const props = { product, id: i, globalAttributes, selectedMode, ...rest };
      return <ProductCard breadCrumbsDetails={breadCrumbsDetails} isEnableCompare={isEnableCompare} {...props} key={i + product.sku} />;
    });
  };

  return (
    <>
      <Modal size="5xl" modalId="QuickView" maxHeight="lg" customClass="overflow-y-auto no-print">
        <QuickViewDetails />
      </Modal>
      <Modal size="5xl" modalId="ProductCompare" maxHeight="lg" customClass="overflow-y-auto no-print p-3" noDefaultClass="m-0 p-0">
        <ProductComparePopup />
      </Modal>
      <ProductListFilter productData={productData} viewChange={changeView} selectedMode={selectedMode} />
      <FacetChipList />
      {productList && productList.length > 0 ? (
        <div className={selectedMode === MODE.GRID_MODE ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2" : "grid grid-cols-1 gap-4"}>
          {renderProductsView()}
        </div>
      ) : isFromSearch ? (
        <div className="w-full lg:w-[70%] text-sm pb-4">
          <Heading name={commonTranslations("noProductMatch")} level="h3" customClass="font-normal" dataTestSelector="hdgNoProductMatch" />
          <Heading name={`${commonTranslations("trySomethingLike")}:`} level="h4" customClass="font-semibold py-0" dataTestSelector="hdgTrySomethingLike" />
          <ul className="pl-3 ml-3 list-disc">
            <li>
              <Heading name={commonTranslations("usingGeneralTerms")} level="h4" customClass="py-0" dataTestSelector="hdgUsingGeneralTerms" />
            </li>
            <li>
              <Heading name={commonTranslations("checkSpelling")} level="h4" customClass="py-0" dataTestSelector="hdgCheckSpelling" />
            </li>
          </ul>
        </div>
      ) : (
        <NoRecordFound text={`${commonTranslations("noRecordsFound")}`} customClass="my-2" />
      )}
    </>
  );
}
