import "./banner.scss";

import { CustomImage } from "../../common/image";
import Link from "next/link";

const getTextPosition = (textAlign: string) => {
  const getPosition = "md:absolute md:top-1/2 md:-translate-y-2/4 max-md:p-5";

  const getAlignment = () => {
    switch (textAlign) {
      case "Left Align":
        return "text-left left-20";
      case "Center Align":
        return "text-center w-full";
      case "Right Align":
        return "text-right right-20";
      default:
        return "text-left left-20";
    }
  };

  return `${getPosition} ${getAlignment()}`;
};

interface IBannerProps {
  index: number;
  buttonLink?: string;
  bannerSequence?: number;
  mediaPath?: string;
  imageAlternateText?: string;
  description?: string;
  textAlignment?: string;
}

export function Banner(props: Readonly<IBannerProps>) {
  const { mediaPath = "", imageAlternateText = "", textAlignment = "", description = "", index, buttonLink = "" } = props;

  return mediaPath ? (
    <div
      key={props.bannerSequence}
      className="w-full h-full"
      style={{
        backgroundColor: "rgba(0,0,0,0.8)",
      }}
      data-test-selector={`divBanner${index}`}
    >
      <Link href={buttonLink || "#"} prefetch={false} data-test-selector={`link${index}`} className="block h-full">
        <CustomImage
          src={mediaPath}
          alt={imageAlternateText || "Product image"}
          dataTestSelector={`imgBanner${index}`}
          // width={200}
          // height={0}
          // sizes="100vw"
          priority={true}
          aria-label={imageAlternateText || "Go to banner"}
            imageWrapperClass="rounded-xl overflow-hidden"
        />
        <div className={textAlignment ? getTextPosition(textAlignment) : ""}>
          {description && (
            <div
              className="text-sm text-white break-words lg:text-4xl md:text-3xl"
              data-test-selector={`divDescription${index}`}
              dangerouslySetInnerHTML={{ __html: description }}
            ></div>
          )}
        </div>
      </Link>
    </div>
  ) : null;
}