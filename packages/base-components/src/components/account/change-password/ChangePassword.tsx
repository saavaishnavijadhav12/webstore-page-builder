"use client";

import { IChangePassword, IUser } from "@znode/types/user";
import React, { useEffect, useState } from "react";
import { getUserData, resetPassword } from "../../../http-request/account/user/user";

import Button from "../../common/button/Button";
import { Heading } from "../../common/heading";
import { INPUT_REGEX } from "@znode/constants/regex";
import { ValidationMessage } from "../../common/validation-message";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "../../../stores/toast";
import { useTranslations } from "next-intl";

export const ChangePassword = () => {
  const userPasswordMessages = useTranslations("UserPassword");
  const commonMessages = useTranslations("Common");
  const route = useRouter();
  const { error, success } = useToast();
  const [userDetails, setUserDetails] = useState<IUser>();
  const [resetPasswordFlag, setResetPasswordFlag] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<IChangePassword>({ mode: "onChange" });

  const newPasswordField = {
    ...register("newPassword", {
      required: userPasswordMessages("requiredNewPassword"),
      pattern: { value: INPUT_REGEX.PASSWORD_REGEX, message: userPasswordMessages("passwordPatternMessage") },
    }),
  };

  const clearCartCookie = () => {
    //deleteCookie(CONSTANT.CookieCartCountId);
    // deleteCookie(CONSTANT.CookieMappingId);
    // updateCartCount(0);
    // TODO it needs cart component..
  };

  const onSubmit = async (changePasswordModel: IChangePassword) => {
    const userName = userDetails?.userName ?? "";
    const encodedUserName = Buffer.from(userName).toString("base64");
    changePasswordModel.userName = encodedUserName;
    const resetPasswordResponse = await resetPassword(changePasswordModel);
    if (resetPasswordResponse.hasError === false) {
      success(userPasswordMessages("successPasswordChanged"));
      clearCartCookie();
      //clearLocalAndSessionStorage();
      signOut({ callbackUrl: "/" });
    } else {
      error(resetPasswordResponse?.errorMessage || userPasswordMessages("resetPasswordError"));
      reset();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      setUserDetails(userData);
    };
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reTypeNewPasswordValidation = (): string | boolean => {
    const newPasswordValue = getValues("newPassword");
    const reTypeNewPasswordValue = getValues("reTypeNewPassword");
    if (reTypeNewPasswordValue && newPasswordValue === reTypeNewPasswordValue) return true;
    return userPasswordMessages("passwordNotMatch");
  };

  const newPasswordOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    newPasswordField.onChange(e);
    const reTypeNewPasswordValue = getValues("reTypeNewPassword");
    reTypeNewPasswordValue && trigger("reTypeNewPassword");
  };
  return (
    <>
      <Heading name={userPasswordMessages("changePassword")} customClass="uppercase" dataTestSelector="hdgChangePassword" level="h2" showSeparator />
      <p className="mb-2" data-test-selector="changePasswordInfo">
        {userPasswordMessages("changePasswordInfo")}
      </p>
      <div className="sm:w-4/5 md:w-1/2 lg:w-2/4 h-96">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="pb-2">
            <div className="pb-2 required">
              <label className="font-semibold" htmlFor="current-password" data-test-selector="lblCurrentPassword">
                {userPasswordMessages("currentPassword")} <span className="ml-1 font-bold text-errorColor">*</span>
              </label>
            </div>
            <input
              type="password"
              className="w-full h-10 px-2 py-1 pb-1 text-sm border rounded-inputBorderRadius border-inputColor hover:border-black focus:outline-none input active:border-black"
              {...register("currentPassword", {
                required: userPasswordMessages("requiredPassword"),
                pattern: { value: INPUT_REGEX.PASSWORD_REGEX, message: userPasswordMessages("passwordPatternMessage") },
              })}
              data-test-selector="txtCurrentPassword"
              placeholder=""
              id="current-password"
            />
            {errors?.currentPassword && (resetPasswordFlag || (!resetPasswordFlag && errors?.currentPassword.type !== "required")) && (
              <ValidationMessage message={errors.currentPassword.message} dataTestSelector="requiredCurrentPasswordError" />
            )}
          </div>
          <div className="pb-2">
            <div className="pb-2 required">
              <label className="font-semibold" htmlFor="new-password" data-test-selector="lblNewPassword">
                {userPasswordMessages("newPassword")} <span className="ml-1 font-bold text-errorColor ">*</span>
              </label>
            </div>
            <input
              type="password"
              className="w-full h-10 px-2 py-1 pb-1 text-sm border focus:outline-none rounded-inputBorderRadius border-inputColor hover:border-black active:border-black input"
              data-test-selector="txtNewPassword"
              placeholder=""
              id="new-password"
              {...newPasswordField}
              onChange={newPasswordOnChangeHandler}
            />
            {errors?.newPassword && (resetPasswordFlag || (!resetPasswordFlag && errors?.newPassword.type !== "required")) && (
              <ValidationMessage message={errors.newPassword.message} dataTestSelector="requiredNewPasswordError" />
            )}
          </div>
          <div className="pb-2">
            <div className="pb-2 required">
              <label className="font-semibold" htmlFor="confirm-new-password" data-test-selector="lblConfirmNewPassword">
                {userPasswordMessages("confirmNewPassword")} <span className="ml-1 font-bold text-errorColor">*</span>
              </label>
            </div>
            <input
              type="password"
              className="w-full h-10 px-2 py-1 pb-1 border focus:outline-none rounded-inputBorderRadius border-inputColor hover:border-black input active:border-black"
              {...register("reTypeNewPassword", { required: userPasswordMessages("requiredConfirmPassword"), validate: { reTypeNewPasswordValidation } })}
              placeholder=""
              id="confirm-new-password"
              data-test-selector="txtConfirmNewPassword"
            />
            {errors?.reTypeNewPassword && (resetPasswordFlag || (!resetPasswordFlag && errors?.reTypeNewPassword.type !== "required")) ? (
              <ValidationMessage
                message={errors.reTypeNewPassword.message}
                dataTestSelector={`${errors.reTypeNewPassword.type === "required" ? "requiredConfirmNewPasswordError" : "requiredPasswordNotMatchError"}`}
              />
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col pt-4 text-right sm:flex-row">
            <Button
              htmlType="submit"
              type="primary"
              size="small"
              onClick={() => {
                !resetPasswordFlag && setResetPasswordFlag(true);
              }}
              className="w-full sm:w-auto"
              dataTestSelector="btnSubmit"
              ariaLabel={userPasswordMessages("resetPasswordButton")}
            >
              {userPasswordMessages("resetPasswordText")}
            </Button>
            <Button
              type="secondary"
              size="small"
              className="w-full mt-2 sm:w-auto sm:mt-0 sm:ml-2"
              dataTestSelector="linkCancel"
              ariaLabel={userPasswordMessages("cancelButton")}
              onClick={() => {
                route.push("/account/edit-profile");
              }}
            >
              {commonMessages("cancel")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
