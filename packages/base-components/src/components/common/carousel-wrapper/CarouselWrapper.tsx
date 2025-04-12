"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Carousel, CarouselProps } from "react-responsive-carousel";

import { CustomImage } from "../image";
import React from "react";
import Image from "next/image";

export type ICarouselProps = Pick<
  CarouselProps,
  | "axis"
  | "showThumbs"
  | "thumbWidth"
  | "showArrows"
  | "transitionTime"
  | "swipeScrollTolerance"
  | "interval"
  | "selectedItem"
  | "showIndicators"
  | "infiniteLoop"
  | "autoPlay"
  | "swipeable"
  | "stopOnHover"
  | "useKeyboardArrows"
  | "showStatus"
  | "emulateTouch"
  | "autoFocus"
>;
interface ISliderWrapperProps extends Partial<CarouselProps> {
  children: React.ReactChild[];
  thumbs?: Array<{ url: string; alt: string }>;
}

export function CarousalWrapper(props: Readonly<ISliderWrapperProps>) {
  const getConfigurableProps = () =>
    ({
      showArrows: props.showArrows,
      showStatus: props.showStatus,
      showIndicators: props.showIndicators ? props.children.length > 1 : false,
      infiniteLoop: props.infiniteLoop,
      useKeyboardArrows: props.useKeyboardArrows,
      autoPlay: false,
      stopOnHover: props.stopOnHover,
      swipeable: props.swipeable,
      emulateTouch: props.emulateTouch,
      thumbWidth: props.thumbWidth,
      selectedItem: props.selectedItem,
      interval: props.interval,
      swipeScrollTolerance: props.swipeScrollTolerance,
      axis: props.axis,
      showThumbs: props.showThumbs,
      transitionTime: props.transitionTime,
      autoFocus: props.autoFocus,
    } as CarouselProps);

  const thumbs = props.thumbs ?? [];

  return (
    <Carousel
      {...props}
      {...getConfigurableProps()}
      renderThumbs={() => {
        return thumbs?.map((thumb, index) => (
          <Image src={thumb.url} 
          alt={thumb.alt} width={200} height={100} className="object-cover" priority loading="eager"/>
        ));
      }}
    >
      {props.children}
    </Carousel>
  );
}
