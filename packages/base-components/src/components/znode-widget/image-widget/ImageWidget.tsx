import Image from "next/image";
import { Images } from "../../../../assets";
import Link from "next/link";

interface IImageProps {
  srcImg: string;
  alt: string;
  height: number;
  width: number;
  url?: string;
}

export function ImageWidget(props: Readonly<IImageProps>) {
  const { srcImg = "", alt, width = 200, height = 200, url } = props || {};

  const src = srcImg ? srcImg : Images.noImage;
  const isExternal = url?.startsWith("http");

  const imageElement = <Image src={src} alt={alt} fill />;

  return (
    <div className="mt-2" style={{ position: "relative", height: height, width: width }}>
      {url && url.trim() !== "" ? (
        <Link href={url && !isExternal ? `/${url}` : url} passHref target={isExternal ? "_blank" : "_self"} rel={isExternal ? "noopener noreferrer" : undefined}>
          {imageElement}
        </Link>
      ) : (
        imageElement
      )}
    </div>
  );
}
