"use client";
import React, { useEffect } from "react";
import { useCommonDetails } from "../../stores/common";

const TrackingPixel: React.FC = () => {
  const { analyticsInfo } = useCommonDetails();
  const trackingPixelScript = analyticsInfo.trackingPixelScript;
  useEffect(() => {
    if (!trackingPixelScript) return;

    const script = document.createElement("script");
    script.textContent = trackingPixelScript;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [trackingPixelScript]);

  if (!trackingPixelScript) return null;
  return null;
};

export default TrackingPixel;
