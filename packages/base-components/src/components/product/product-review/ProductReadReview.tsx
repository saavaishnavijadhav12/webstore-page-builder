"use client";

import { NavLink } from "../../common/nav-link";
import { useModal } from "../../../stores";
import { useProduct } from "../../../stores/product";
import { useTranslations } from "next-intl";

export function ProductReadReview({ redirectionUrl, id }: { redirectionUrl?: string; id: number; _handleReadReviewClick?: () => void }) {
  const t = useTranslations("Product");
  const { setIsReviewTriggered } = useProduct();
  const { closeModal } = useModal();
  return redirectionUrl ? (
    <NavLink
      url={redirectionUrl}
      className="ml-2 underline cursor-pointer heading-4 text-linkColor hover:text-hoverColor decoration-linkColor hover:decoration-hoverColor no-print"
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        if (redirectionUrl === "#") {
          e.preventDefault();
        }
        closeModal();
        setTimeout(() => {
          setIsReviewTriggered(true);
        }, 1000);
      }}
      aria-label="Read Review Section"
      dataTestSelector={`linkReadReviews${id}`}
    >
      {t("readReviews")}
    </NavLink>
  ) : (
    <div
      id="readRating"
      className="mt-1 ml-1 text-sm underline cursor-pointer text-linkColor hover:text-hoverColor decoration-linkColor hover:decoration-hoverColor whitespace-nowrap no-print"
      data-test-selector={`divReadReviews${id}`}
    >
      {t("readReviews")}
    </div>
  );
}
