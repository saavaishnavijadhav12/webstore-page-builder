"use client";

import { useEffect, useState } from "react";

import { ISearchUrl } from "@znode/types/common";
import { IUserSignUp } from "@znode/types/user";
import { RegisterUserWithEmailVerification } from "../register/register-with-email";
import { RegisterUserWithoutEmailVerification } from "../register/register-without-email";
import { UserVerificationTypeEnum } from "@znode/types/enums";
import { getUserSettings } from "../../http-request/user-settings/user-settings";
import { LoadingSpinnerComponent } from "../common/icons";

export function SignUp({ searchParams }: Readonly<{ searchParams: ISearchUrl }>) {
  const [userSetting, setUserSetting] = useState<IUserSignUp>();
  const returnUrl = searchParams?.returnUrl;
  const isCheckoutAsGuest = returnUrl === "checkout";

  const getPortalDetails = async () => {
    const userSettings = await getUserSettings();
    setUserSetting(userSettings);
  };

  useEffect(() => {
    getPortalDetails();
  }, []);

  const isNoVerificationOrAdminApproval =
    userSetting?.userVerificationTypeCode === UserVerificationTypeEnum.NoVerificationCode || userSetting?.userVerificationTypeCode === UserVerificationTypeEnum.AdminApprovalCode;
  if (!userSetting) {
    return <LoadingSpinnerComponent />;
  }
  return (
    <div>
      {userSetting?.userVerificationTypeCode === UserVerificationTypeEnum.EmailVerificationCode ? (
        <RegisterUserWithEmailVerification isCheckoutAsGuest={isCheckoutAsGuest} attributes={userSetting.globalAttributes} />
      ) : isNoVerificationOrAdminApproval ? (
        <RegisterUserWithoutEmailVerification
          isCheckoutAsGuest={isCheckoutAsGuest}
          attributes={userSetting.globalAttributes}
          storeCode={userSetting.storeCode}
          returnUrl={returnUrl}
        />
      ) : null}
    </div>
  );
}
