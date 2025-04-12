"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

import { IMAGE_REGEX } from "@znode/constants/regex";
import { Images } from "../../../../assets";
import { LoaderComponent } from "../loader-component";

type ICustomImageProps = ImageProps & { imageWrapperClass?: string; dataTestSelector: string };

const isValidImageSrc = (src: ImageProps["src"]) => {
  if (typeof src !== "string" || src === "" || src === null) return false;
  return IMAGE_REGEX.IMAGE_SRC_REGEX.test(src);
};

export function CustomImage(props: Readonly<ICustomImageProps>) {
  const { src, alt, imageWrapperClass, dataTestSelector, priority, width, ...restProps } = props || {};
  const [imgSrc, setImgSrc] = useState<string>(isValidImageSrc(src) ? src : Images.noImage);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleError = () => {
    setImgSrc(Images.noImage);
  };

  useEffect(() => {
    if (typeof src === "string" && isValidImageSrc(src)) {
      setImgSrc(src);
    } else {
      setImgSrc(Images.noImage);
    }
  }, [src]);

  return (
    <div
    className={`relative aspect-[1492/479] w-full ${imageWrapperClass ?? ""}`}
    data-test-selector={dataTestSelector}
  >      {!hasLoaded && (
        <div className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 loader top-1/2 left-1/2">
          <LoaderComponent isLoading={true} width="20px" height="20px" />
        </div>
      )}
      {
       !width ? (<Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover"
      loading={priority ? "eager" : "lazy"}
      onError={handleError}
      onLoad={() => setHasLoaded(true)}
      {...restProps}
      data-test-selector={dataTestSelector}
    />) : (
      <Image
        src={imgSrc}
        alt={alt}
        className="w-full min-h-[7.813rem] m-auto"
        width={200}
        height={0}
        loading={priority ? "eager" : "lazy"}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={handleError}
        onLoad={() => setHasLoaded(true)}
        {...restProps}
        data-test-selector={dataTestSelector}
      />
    )
      }
    </div>
  );
}
