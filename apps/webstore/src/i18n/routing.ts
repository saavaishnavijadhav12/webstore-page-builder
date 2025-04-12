import { defineRouting } from "next-intl/routing";
import { FALLBACK, LOCALES } from "@znode/constants/i18n";
// import {createSharedPathnamesNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES,

  // Used when no locale matches
  defaultLocale: FALLBACK.code,

  localePrefix: "as-needed"
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
// export const {Link, redirect, usePathname, useRouter} =
//   createSharedPathnamesNavigation(routing);
