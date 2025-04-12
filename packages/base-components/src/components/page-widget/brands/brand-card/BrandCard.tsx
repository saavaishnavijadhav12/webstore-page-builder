"use client";
import { CustomImage } from "../../../common/image";
import Link from "next/link";

interface IBrandCardProps {
  name: string;
  img: string;
  code: string;
  brandId: number;
  seoUrl: string;
  seoTitle: string;
}

export function BrandCard(props: Readonly<IBrandCardProps>) {
  const { name, img, code, brandId, seoUrl, seoTitle } = props;
  const brandUrl = seoUrl ? "/" + seoUrl : `/brand/${code}`;
  const sanitizedTitle = new DOMParser().parseFromString(name, "text/html").body.textContent || "";
   return (
    <Link href={brandUrl} data-test-selector={`linkBrand-${brandId}`} className="col-span-1">
     <figure title={sanitizedTitle} className="flex flex-col items-center mx-2">
        <div className="relative flex justify-center p-4 mb-4 shadow-lg h-36 hover:shadow-xl">
          <div className="relative w-full h-full max-h-[300px]  flex justify-center">
            <CustomImage
              alt={seoTitle || name}
              src={img}
              width={200}
              height={350}
              style={{ maxHeight: 300 }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              className="object-contain h-full"
              dataTestSelector={`img${brandId}`}
            />
          </div>
        </div>
        <figcaption className="pt-0 text-center uppercase heading-2" dangerouslySetInnerHTML={{ __html: name }}></figcaption>
      </figure>
    </Link>
  );
}
