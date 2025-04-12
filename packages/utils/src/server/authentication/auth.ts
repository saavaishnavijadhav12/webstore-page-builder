import { AREA, errorStack, logServer } from "@znode/logger/server";
import { ILoginRequest } from "@znode/types/single-sign-in";
import { APP } from "@znode/constants/app";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { convertCamelCase } from "../convert-case";
import { generateDomainBasedToken } from "./domain-authentication";

async function handleSingleSignIn(loginRequest: ILoginRequest) {
  try {
    const res = await fetch(`${loginRequest.domainName}/api/single-sign-in-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginRequest),
    });

    const userDetails = await res.json();
    return convertCamelCase(userDetails.data);
  } catch (error) {
    logServer.error(AREA.SINGLE_SIGN_IN, errorStack(error));
    return null;
  }
}

export const authLoginOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
        storeCode: { label: "storeCode", type: "string" },
        impersonation: {},
        domainName: {},
        singleSignIn: {},
      },
      async authorize(loginRequest) {
        const userModel = {
          user: {
            username: loginRequest?.username || "",
            password: loginRequest?.password || "",
          },
          storeCode: loginRequest?.storeCode,
          domainName: loginRequest?.domainName,
        };
        const baseUrl = process.env.API_URL;
        let user;

        try {
          if (loginRequest && (loginRequest?.singleSignIn || loginRequest?.impersonation)) {
            if (loginRequest?.singleSignIn) {
              user = await handleSingleSignIn(loginRequest);
            }
            if (loginRequest?.impersonation) {
              const res = await fetch(`${loginRequest.domainName}/api/impersonation-login`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(loginRequest),
              });

              const userDetails = await res.json();
              user = convertCamelCase(userDetails.data);
            }
          } else {
            const res = await fetch(`${baseUrl}v2/users/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "basic " + generateDomainBasedToken(),
              },
              body: JSON.stringify(userModel),
            });

            const responseJson = await res.json();
            user = convertCamelCase(responseJson);
            if (user?.hasError) {
              return Promise.reject(new Error(user?.errorMessage || "Something went wrong. Please check your details and try again."));
            }
          }

          if (user && !user.hasError) {
            return {
              id: user.userId,
              firstName: user.firstName,
              email: user.email,
              userName: user.userName,
              userId: user.userId,
              accountId: user.accountId,
              accountCode: user.accountCode,
              returns: user.returns ?? [],
              emailOptIn: user.emailOptIn,
              lastName: user.lastName,
              aspNetUserId: user.aspNetUserId,
              profileId: user.profiles.find((profile: { isDefault: boolean }) => profile.isDefault)?.profileId ?? null,
              isVerified: user.isVerified,
              profiles: user.profiles ?? [],
              smsOptIn: user.smsOptIn,
              phoneNumber: user.phoneNumber,
              voucherCount: user.voucherCount ?? 0,
              pendingOrdersList: user.pendingOrdersList ?? [],
              customerPaymentGuid: user.customerPaymentGUID,
              publishCatalogId: user.publishCatalogId,
              annualBalanceOrderAmount: user.annualBalanceOrderAmount,
              annualOrderLimit: user.annualOrderLimit,
              perOrderLimit: user.perOrderLimit,
              roleName: user.roleName,
              crsName: user.crsName ?? "",
              catalogCode: user.catalogCode,
            };
          }

          return null;
        } catch (error) {
          logServer.error(AREA.WIDGET, errorStack(error));
          return null;
        }
      },
    }),
  ],
  session: {
    maxAge: APP.SESSION_TIMEOUT,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return user ? { ...token, ...user } : token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};
