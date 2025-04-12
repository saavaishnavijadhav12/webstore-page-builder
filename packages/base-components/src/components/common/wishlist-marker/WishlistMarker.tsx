"use client";
import { WISHLIST } from "@znode/constants/wishlist";
import { getWishListByProductSkus } from "../../../http-request";
import { useEffect } from "react";
import { useUser } from "../../../stores";
import { useSearchParams } from "next/navigation";

export const WishlistMarker = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  useEffect(() => {
    const markWishlistItems = () => {
      const skuList: string[] = [];
      const elements = document.querySelectorAll("[data-wishlist-sku]");

      elements.forEach((element) => {
        const sku = element.getAttribute("data-wishlist-sku");
        skuList.push(sku as string);
      });

      const isLoggedIn = user?.userId && user.userId > 0 ? true : false;
      isLoggedIn && getWishlistProductSkus(skuList);
    };

    markWishlistItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user,searchParams]);

  const getWishlistProductSkus = async (skus: string[] = []) => {
    if (skus.length === 0) return;
    const wishlistData = await getWishListByProductSkus(skus.join(","));
    if (Array.isArray(wishlistData)) {
      const elements: NodeListOf<HTMLElement> = document.querySelectorAll("[data-wishlist-sku]");
      elements.forEach((element) => {
        const sku = element.getAttribute("data-wishlist-sku");
        if (wishlistData.find((data) => data.sku === sku)) {
          element.style.fill = WISHLIST.ICON_FILL_COLOR;
        } else element.style.fill = "none";
      });
    }
  };
  return null;
};
