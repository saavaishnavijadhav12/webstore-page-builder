import { IAdSpace } from "@znode/types/content-container";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function AdSpaceItem({ image, title, text, index, ctaLink = "" }: Readonly<IAdSpace>) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative col-span-1 bg-black min-h-fit xs:mb-4 md:mb-0">
      <Link href={ctaLink || "#"} data-test-selector={`linkAdSpace${index}`}>
        <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-200">
          {isLoading && (
            <div className="absolute inset-0 animate-pulse bg-gray-300 z-0" />
          )}

          {image && (
            <Image
              src={image}
              alt="Home Page Ad"
              className={`object-cover w-full h-full transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
              data-test-selector={`imgAdSpace${index}`}
              fill
              loading="eager"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setIsLoading(false)}
            />
          )}
        </div>

        <div className="absolute w-full p-5 text-center bottom-8">
          {title && (
            <p className="text-lg font-medium text-white" data-test-selector={`paraAdSpaceTitle${index}`}>
              {title}
            </p>
          )}
          {text && (
            <p className="text-white" data-test-selector={`paraAdSpaceText${index}`}>
              {text}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
