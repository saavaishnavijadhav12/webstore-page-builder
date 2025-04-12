import { NextRequest, NextResponse } from "next/server";
import { clearDataInGlobalCache, getPortalDataFromGlobalCache, getRedirectionDataFromGlobalCache, setResponseHeaders } from "@znode/utils/server";

import { ErrorCodes } from "@znode/types/enums";
import { NextURL } from "next/dist/server/web/next-url";
import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";
interface IPortalData {
  message: string;
  hasError?: boolean;
  portalId: number;
  localeId: number;
  publishState: number;
  publishCatalogId: number;
  localeCode: string;
  storeCode: string;
  themeName: string;
  publishCatalogCode: string;
  loginRequired: boolean;
}

export default async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api") && request.nextUrl.pathname !== "/error") {
    const handleI18nRouting = createMiddleware(routing);
    const response = handleI18nRouting(request);
    return await setPortalDataInGlobalStore(request, response);
  } else {
    const response: NextResponse = NextResponse.next();
    return await setPortalDataInGlobalStore(request, response);
  }
}

export async function checkForValidatePath(request: NextRequest, portalData: IPortalData, response: NextResponse) {
  const session = await loginAuthorization(request);
  const url = request.nextUrl.clone();
  const userPage = await checkForExcludedPaths(url);
  const isUserLoggedIn = session ? true : false; 
  // restricting the user to access the the below routes when user is having session
  const authRoutes = ["/signup", "/reset-password", "/forgot-password", "/login"];
  if (session && authRoutes.includes(url.pathname)) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const loginRequired = portalData?.loginRequired;
  if (loginRequired === true && userPage && !session) {
    url.pathname = "/login";
    const response = NextResponse.redirect(url);
    response.headers.set("user-logged-in", String(isUserLoggedIn));
    return response;
  } else if (portalData && portalData.hasError && process.env.NODE_ENV == "development") {
    return validatePath("dev-error-code", portalData.message, request, response);
  } else if (portalData && !portalData.publishState && portalData.publishState == 0) {
    return validatePath("x-error-code", ErrorCodes.StoreNotPublished, request, response);
  } else if (!portalData) {
    return validatePath("x-error-code", ErrorCodes.StoreDataNotFound, request, response);
  } else {
    return setResponseHeaders(response, isUserLoggedIn);
  }
}

export async function checkForExcludedPaths(url: NextURL) {
  const excludedPaths = ["/signup", "/reset-password", "/forgot-password", "/validate-impersonation-session", "/login"];

  function normalizePathname(pathname: string) {
    return pathname.replace(/^\/[a-z]{2}-[A-Z]{2}/, ""); // Removes locale like "/en-US"
  }
  const normalizedPathname = normalizePathname(url.pathname);
  const userPage = !excludedPaths.some((path) => normalizedPathname.startsWith(path));
  return userPage;
}

export async function loginAuthorization(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.SECRET });
  return session;
}

export async function setPortalDataInGlobalStore(request: NextRequest, response: NextResponse) {
  const domainURL = request.headers.get("host");
  if (request.nextUrl.pathname.includes("revalidate")) {
    clearDataInGlobalCache();
  }
  const portalResponse = await getPortalDataFromGlobalCache(String(domainURL));
  if (!request.nextUrl.pathname.startsWith("/api") && !request.nextUrl.pathname.includes("check-global-cache")) {
    response = await checkForValidatePath(request, portalResponse, response);
    if (process.env.IS_301_REDIRECT == "true" && portalResponse.portalId && process.env.APP_NAME !== "PAGE_BUILDER") {
      {
        const redirectionResponse = await getRedirectionDataFromGlobalCache(Number(portalResponse.portalId), request.nextUrl.pathname, String(domainURL));
        if (redirectionResponse) {
          const url = request.nextUrl.clone();
          url.pathname = `/${redirectionResponse}`;
          const response = NextResponse.redirect(url);
          return response;
        } else {
          return response;
        }
      }
    }
    return response;
  } else {
    const session = await loginAuthorization(request);
    const isUserLoggedIn = session ? true : false;
    return setResponseHeaders(response, isUserLoggedIn);
  }
}

export function validatePath(headerKey: string, headerValue: string, request: NextRequest, response: NextResponse) {
  const path = request.nextUrl.pathname;
  if (!path.includes("error")) {
    const url = request.nextUrl.clone();
    url.pathname = "/error";
    const response = NextResponse.redirect(url);
    response.headers.set(headerKey, headerValue);
    response.headers.set("x-redirect", "false");
    return response;
  } else {
    response.headers.set(headerKey, headerValue);
    response.headers.set("x-redirect", "false");
    return response;
  }
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/((?!_next/static|_next/image|static|static/chunks|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest).*)"],
};
