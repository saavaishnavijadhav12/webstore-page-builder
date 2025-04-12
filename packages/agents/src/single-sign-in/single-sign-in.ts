import { AREA, errorStack, logServer } from "@znode/logger/server";
import { Users_validateLoginToken, Users_loginToken } from "@znode/clients/v2";
import { getSavedUserSession } from "@znode/utils/common";
import { convertCamelCase } from "@znode/utils/server";

export async function checkExistingUserSession(token: string) {
  try {
    const currentUser = await getSavedUserSession();
    const userDetails = await validateSingleSignInToken(token);
    if (currentUser === null || currentUser === undefined || currentUser.userId === userDetails) {
      return false;
    }
    return true;
  } catch (error) {
    logServer.error(AREA.SINGLE_SIGN_IN, errorStack(error));
    return false;
  }
}

export async function validateSingleSignInToken(token: string) {
  try {
    const userBody = {
      Token: token,
    };
    const signInUserDetails = await Users_validateLoginToken(userBody);
    return signInUserDetails;
  } catch (error) {
    logServer.error(AREA.SINGLE_SIGN_IN, errorStack(error));
    return { HasError: true };
  }
}

export async function getSingleSignInUserToken(username: string, password: string, storeCode: string) {
  try {
    const userBody = {
      Password: password,
      StoreCode: storeCode,
    };

    const signUpToken = await Users_loginToken(username, userBody);
    return convertCamelCase(signUpToken);
  } catch (error) {
    logServer.error(AREA.SINGLE_SIGN_IN, errorStack(error));
    return { HasError: true };
  }
}
