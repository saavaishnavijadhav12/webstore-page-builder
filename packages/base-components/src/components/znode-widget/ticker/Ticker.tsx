"use client";
interface ITickerProps {
  tickerText: string;
}
export function Ticker(props: Readonly<ITickerProps>) {
  const { tickerText = "" } = props || {};

  if (!tickerText) {
    return null;
  }

  return (
    <div className="text-center bg-tickerBgColor mb-3 text-white text-sm py-1.5 no-print" data-test-selector="divTickerText">
      {tickerText}
    </div>
  );
}
