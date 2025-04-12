"use client";
import { removeLocalStorageData, useTranslationMessages } from "@znode/utils/component";

import AddToCart from "../../product/product-details/add-to-cart/AddToCart";
import Button from "../../common/button/Button";
const CompareProduct = dynamic(() => import("../../product/compare-product/CompareProduct").then((mod) => mod.default), { ssr: false });
const WishListButton = dynamic(() => import("../../wishlist/WishlistButton").then((mod) => mod.default), { ssr: false });

import { CustomImage } from "../image";
import { Heading } from "../heading";
import { IProductLayoutProps } from "@znode/types/product";
import { InventoryWrapper } from "../../product/product-list/inventory/InventoryWrapper";
import { MODE } from "@znode/constants/mode";
import { NavLink } from "../nav-link";
import { PRODUCT } from "@znode/constants/product";
import { ProductHighlights } from "../../product-highlights/ProductHighlights";
import QuickView from "./quick-view/QuickView";
import RatingWrapper from "../rating/RatingWrapper";
import { Tooltip } from "../tooltip";

import { useState } from "react";
import dynamic from "next/dynamic";

export function ProductCard({
  product,
  id,
  globalAttributes,
  showButton,
  selectedMode = MODE.GRID_MODE,
  displayReview = true,
  displaySKU = true,
  isEnableCompare,
  showWishlist = false,
  breadCrumbsDetails,
}: Readonly<IProductLayoutProps>) {
  const productTranslations = useTranslationMessages("Product");
  const commonTranslations = useTranslationMessages("Common");
  const [productActiveId, setProductActiveId] = useState<number | null>(null);
  const { name, imageSmallPath, seoUrl, znodeProductId, publishProductId, sku, rating, totalReviews, isAddToCartDisabled } = product || {};

  const productId = znodeProductId ? Number(znodeProductId) : publishProductId ? Number(publishProductId) : 0;

  const productUrl = seoUrl ? "/" + seoUrl : `/product/${productId}`;
  const isListMode = selectedMode === MODE.LIST_MODE;
  const isCallForPricingPromotion = product?.promotions?.some((x) => x.promotionType?.toLowerCase() === PRODUCT.CALL_FOR_PRICING_MESSAGE.toLowerCase());

  return (
    <div
      className="relative flex flex-col justify-between h-full p-4 mb-4 bg-white xl:mb-0 product-card card hover:shadow-lg first-line:border-solid hover:z-auto md:mt-0"
      onMouseEnter={() => setProductActiveId(productId)}
      onMouseLeave={() => setProductActiveId(null)}
      onClick={() => {
        if (!breadCrumbsDetails?.isCategoryFlow) {
          removeLocalStorageData("breadCrumbsDetails");
        }
      }}
    >
      <div className={isListMode ? "grid grid-cols-4" : ""} data-test-selector={`divProductCard${productId}`}>
        <div className={isListMode ? "relative col-span-1" : "relative flex-none w-auto"} data-test-selector={`divProductImage${productId}`}>
          <NavLink url={productUrl} dataTestSelector={`linkProductImage${productId}`} className="flex items-center justify-center w-auto">
            <div className="relative flex justify-center items-center h-52 w-60">
              <CustomImage
                src={imageSmallPath}
                alt={name}
                className="object-contain w-auto m-auto"
                width={230}
                height={500}
                style={{ width: "auto", height: "inherit" }}
                id={`${id}`}
                dataTestSelector={`imgProduct${productId}`}
                imageWrapperClass="h-full"
              />
            </div>
          </NavLink>
          <div className="absolute top-0 left-0 ">
            <div className="cursor-pointer quick-view hidden sm:block">
              <Tooltip message={productTranslations("quickView")}>
                <QuickView productId={productId} showIcon={productActiveId === productId} />
              </Tooltip>
            </div>
            <div
              className={`${productActiveId === productId ? "visible" : "lg:invisible"} cursor-pointer quick-view flex flex-col gap-2 sm:mt-2`}
              data-test-selector={`divQuickView${productId}`}
            >
              {showWishlist && <WishListButton znodeProductId={productId} sku={product.sku} />}
              {isEnableCompare && (
                <Tooltip message={productTranslations("productCompare")}>
                  <CompareProduct showIcon product={{ sku, productId, name, image: imageSmallPath, retailPrice: product.retailPrice, salesPrice: product.salesPrice }} />
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <div className={isListMode ? "flex flex-col mx-4 mt-4 col-span-3" : "flex-none pb-2 mt-4"} data-test-selector={`divProductDetails${productId}`}>
          <NavLink url={productUrl} dataTestSelector={`linkProductName${productId}`} className="text-left">
            <Heading name={name} level="h3" customClass="leading-tight cursor-pointer pb-1" dataTestSelector={`hdgProductName${productId}`} />
          </NavLink>
          {displaySKU && (
            <div className="heading-4" data-test-selector={`divProductSKUContainer${productId}`}>
              <span data-test-selector={`spnProductSkuLabel${productId}`}>{productTranslations("sku")}: </span>
              <span data-test-selector={`spnProductSkuValue${productId}`}>{sku}</span>
            </div>
          )}
          {displayReview && (
            <div className="flex flex-wrap items-center py-0 heading-4">
              <RatingWrapper ratingCount={rating || 0} totalReviews={totalReviews || 0} showReview={true} productUrl={productUrl} id={productId} />
            </div>
          )}
          {product.highlightList && <ProductHighlights highlights={product.highlightList} productId={publishProductId as number} seoUrl={product.seoUrl} />}
          <InventoryWrapper productData={product} productUrl={productUrl} globalAttributes={globalAttributes} isListMode={isListMode} />
          {isListMode && (
            <div className="mt-auto text-right">
              <NavLink url={productUrl} className="text-sm underline text-linkColor hover:text-hoverColor" dataTestSelector={`linkViewDetails${productId}`}>
                {commonTranslations("viewDetails")}
              </NavLink>
            </div>
          )}
        </div>
      </div>
      {!showButton && showButton !== undefined && (
        <AddToCart
          isAddToCartDisabled={isAddToCartDisabled}
          productDetails={product}
          showQuantityBox={false}
          btnStyle={{ class: "w-full" }}
          gridAddToCart={true}
          isProductCard={true}
          isProductCompare={false}
          isCallForPricingPromotion={isCallForPricingPromotion}
        />
      )}
      {showButton && (
        <div className="text-center">
          <NavLink url={productUrl} dataTestSelector={`linkViewDetails${productId}`}>
            <Button type="primary" size="small" ariaLabel="view details button" className="w-full" dataTestSelector={`btnViewDetails${productId}`}>
              {commonTranslations("viewDetails")}
            </Button>
          </NavLink>
        </div>
      )}
    </div>
  );
}
