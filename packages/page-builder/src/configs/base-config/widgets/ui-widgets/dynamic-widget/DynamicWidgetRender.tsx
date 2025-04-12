import { IDynamicWidgetRenderProps } from "./DynamicWidgetConfig";
import { useEffect, useState } from "react";

export const DynamicWidgetRender = ({ text: htmlContent, puck, id }: IDynamicWidgetRenderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const isEditing = puck.isEditing;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      let frameEl: Element | Document | null | undefined = getIFrame(isEditing);
      const container = frameEl?.getElementById(id);
      if (container) {
        container.innerHTML = htmlContent;
        handleStyles(container);
        handleScripts(container);
      }
    }
  }, [htmlContent, isMounted]);

  if (!isMounted) return null;

  return <div id={id} />;
};

const handleStyles = (container: HTMLElement) => {
  const styleTags = container.querySelectorAll<HTMLStyleElement>("style");
  styleTags.forEach((style) => {
    const newStyle = document.createElement("style");
    newStyle.innerHTML = style.innerHTML;
    document.head.appendChild(newStyle);
  });

  const linkTags = container.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');
  linkTags.forEach((link) => {
    const newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = link.href;
    document.head.appendChild(newLink);
  });
};

const handleScripts = (container: HTMLElement) => {
  const scripts = container.querySelectorAll<HTMLScriptElement>("script");

  // Filter external scripts (those with a src attribute) and inline scripts (those without src)
  const externalScripts = Array.from(scripts).filter((script) => script.src);
  const inlineScripts = Array.from(scripts).filter((script) => !script.src);

  externalScripts.forEach((script) => {
    const newScript = document.createElement("script");
    newScript.type = script.type || "text/javascript";
    newScript.src = script.src;
    newScript.async = true;

    newScript.onload = () => {
      inlineScripts.forEach((inlineScript) => {
        const newInlineScript = document.createElement("script");
        newInlineScript.type = inlineScript.type || "text/javascript";
        newInlineScript.innerHTML = inlineScript.innerHTML;
        container.appendChild(newInlineScript);
      });
    };

    container.appendChild(newScript);
  });
};

function getIFrame(isEditing: boolean) {
  if (typeof window === "undefined") return;

  let frameEl: Element | Document | null | undefined = document.querySelector("#preview-frame");

  if (isEditing) {
    return (frameEl as HTMLIFrameElement)!.contentDocument || document;
  }

  return frameEl?.ownerDocument || document;
}
