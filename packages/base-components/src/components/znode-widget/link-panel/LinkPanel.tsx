"use client";

import Image from "next/image";
import Link from "next/link";
import dataUrls from "./../../../../constants/dataUrls.json";
import { formatTestSelector } from "@znode/utils/common";

interface ILinkPanelProps {
  allLinks: Array<{
    url: string;
    isNewTab: boolean;
    mediaPath: string;
    title: string;
  }>;

  contentOrientation?: "horizontal" | "vertical";
  customClass?: string;
  isFont?: boolean;
  customImageClass: string;
}

export function LinkPanel(props: Readonly<ILinkPanelProps>) {
  const { contentOrientation = "", isFont, allLinks = [], customClass = "", customImageClass = "" } = props || {};

  const getOrientation = () => {
    return contentOrientation === "horizontal" ? "block" : "flex flex-col";
  };
  // *** If you want to add a custom class then you can add in array directly
  const linkPanelClasses = ["grid md:flex gap-0 md:gap-4", isFont ? "font-normal" : "font-medium", getOrientation()]
    .filter(Boolean) // Remove falsy values
    .join(" ");

  return (
    <ul className={linkPanelClasses} data-test-selector="listLinkPanel">
      {allLinks.map((item, index) => {
        const { url = "", isNewTab = "", mediaPath = "", title = "" } = item || {};

        const linkTarget = isNewTab ? "_blank" : "_self";
        const imageClass = customImageClass || "pt-3";

        return (
          <li key={index} className={customClass} data-test-selector={formatTestSelector("list", title)}>
            <Link target={linkTarget} href={`${url || "#"}`} prefetch={false} data-test-selector={formatTestSelector("link", title)}>
              {!mediaPath ? (
                title
              ) : (
                <Image
                  src={`${mediaPath}`}
                  alt={title}
                  width={35}
                  height={35}
                  className={imageClass}
                  loading={"lazy"}
                  placeholder={"blur"}
                  blurDataURL={dataUrls.smallPlaceholder}
                  data-test-selector={formatTestSelector("img", title)}
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
