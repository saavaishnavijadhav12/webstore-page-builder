"use client";
import React, { useState } from "react";
import { createWishList, deleteWishList } from "../../../../base-components/src/http-request";
import { useTranslationMessages } from "@znode/utils/component";
import Button from "../common/button/Button";
import { useToast } from "../../stores/toast";
import { useUser } from "../../stores/user-store";
import { Heart } from "lucide-react";
import { WISHLIST } from "@znode/constants/wishlist";
import { Tooltip } from "../common/tooltip";

interface IWishListButtonProps {
  sku: string;
  znodeProductId: number;
  fromQuickView?: boolean;
}

const checkIsMarked = (sku: string) => {
  const heartIcon = document.querySelector(`#wishlist-icon-${sku}`);
  const styleFill = heartIcon && heartIcon.getAttribute("style");
  const isFillNone = styleFill && styleFill.includes("fill: none");
  return !(isFillNone === null || isFillNone === "" || isFillNone);
};
const WishListButton: React.FC<IWishListButtonProps> = ({ znodeProductId, sku = "", fromQuickView = false }) => {
  const { error, success } = useToast();
  const { user } = useUser();
  const wishlistTranslations = useTranslationMessages("WishList");
  const commonTranslations = useTranslationMessages("Common");
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tooltipTitle, setTooltipTitle] = useState("");
  const addProductToWishlist = async () => {
    try {
      setIsLoading(true);
      if (!user) {
        error(wishlistTranslations("pleaseLogin"));
        return;
      }
      setIsActive(true);
      const createWishlistResponse = await createWishList({ sku });
      if (!createWishlistResponse?.hasError) {
        success(wishlistTranslations("successWishListAdded"));
        setTooltipTitle(wishlistTranslations("removeFromWishlist"));
        updateWishlistButton(true);
      } else if (createWishlistResponse?.hasError && createWishlistResponse?.errorCode === 2) {
        removeProduct();
      }
    } catch (err) {
      error(wishlistTranslations("error"));
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = async () => {
    try {
      const deleteWishlistResponse = await deleteWishList(sku);
      if (deleteWishlistResponse) {
        setIsActive(false);
        success(wishlistTranslations("successWishListRemoved"));
        setTooltipTitle(wishlistTranslations("addToWishlist"));
        updateWishlistButton(false);
      } else error(wishlistTranslations("error"));
    } catch (err) {
      error(commonTranslations("somethingWentWrong"));
    }
  };

  const updateWishlistButton = (mark: boolean) => {
    if (fromQuickView) {
      const elements = document.querySelectorAll(`[data-wishlist-sku="${sku}"]`);
      elements.forEach((element) => {
        (element as SVGElement).style.fill = mark ? WISHLIST.ICON_FILL_COLOR : "none";
      });
    }
  };
  return (
    <div
      onMouseEnter={() => setTooltipTitle(checkIsMarked(sku) ? wishlistTranslations("removeFromWishlist") : wishlistTranslations("addToWishlist"))}
      onMouseLeave={() => setTooltipTitle("")}
    >
      <Tooltip message={isLoading ? "" : tooltipTitle} isFromModal={fromQuickView}>
        <Button
          type="text"
          size="small"
          onClick={addProductToWishlist}
          dataTestSelector={`btnAddToWishList${znodeProductId}`}
          ariaLabel="wishlist icon button"
          loading={isLoading}
          loaderHeight="20px"
          loaderWidth="20px"
        >
          <Heart
            id={`wishlist-icon-${sku}`}
            data-wishlist-sku={sku}
            size={20}
            strokeWidth={1}
            color={WISHLIST.ICON_COLOR}
            {...(isActive && { style: { fill: WISHLIST.ICON_FILL_COLOR } })}
          />
        </Button>
      </Tooltip>
    </div>
  );
};

export default WishListButton;
