"use client";

import { CartIcon } from "../../common/icons";
import { NavLink } from "../../common/nav-link";
import React from "react";
import { useProduct } from "../../../stores/product";
import { useTranslations } from "next-intl";
const CartCount: React.FC<{ dataTestSelector?: string }> = React.memo(({ dataTestSelector }) => {
  const {
    product: { cartCount },
  } = useProduct();

  const t = useTranslations("CartIcon");
  

  return (
    <div className="text-lg relative pl-5">
      <NavLink url="/cart" dataTestSelector={`link${dataTestSelector}CartPage`} ariaLabel={t("cartAriaLabel")}>
        <CartIcon dataTestSelector={dataTestSelector} />
        {cartCount ? (
          <span
            data-test-selector={`spn${dataTestSelector}CartIcon`}
            className="absolute h-4 px-1 text-xs leading-tight text-center text-white rounded-full -right-1 -top-2 bg-cyan-700"
          >
            {cartCount}
          </span>
        ) : (
          <></>
        )}
      </NavLink>
    </div>
  );
});

export default CartCount;
