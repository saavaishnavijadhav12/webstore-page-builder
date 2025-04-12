import Image from "next/image";
import Link from "next/link";
import { IOfferBanner } from "@znode/types/offer-banner";

type IOfferBannerProps = Partial<IOfferBanner>;

export function OfferBanner(props: Readonly<IOfferBannerProps>) {
  const { description = "", title = "", mediaPath = "" } = props;
  return (
    <div className="xs:min-w-full min-h-12 md:min-w-[48.50%] lg:min-w-[32.33%] 2xl:min-w-[24.33%] rounded-cardBorderRadius h-full">
      <Link
        href="#"
        className="flex flex-col-reverse items-center justify-between w-full h-full px-6 py-4 bg-white card xs:text-center md:text-left md:flex-row gap-x-8 drop-shadow-md hover:shadow-md"
      >
        {description && (
          <div className="w-1/2 pt-4 md:w-auto md:pt-0">
            <div className="text-sm break-words text-textColor1" dangerouslySetInnerHTML={{ __html: description }}></div>
          </div>
        )}
        {mediaPath && (
          <div className="flex items-center justify-center w-1/2 banner-container h-1/2 md:h-20 md:w-24 ">
            <Image
              src={mediaPath}
              alt={`${title} Image`}
              className="w-full h-auto max-w-full max-h-full object-contain"
              data-test-selector="imgAdvSpecialOfferBannerImg"
              width={200}
              height={0}
              loading="lazy"
              style={{ width: "auto" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </Link>
    </div>
  );
}
