import { AREA, errorStack, logServer } from "@znode/logger/server";
import { EmailAFriendRequest, WebstoreProducts_sendMailToFriend } from "@znode/clients/v2";
import { IEmailAFriendRequest, IEmailFriendResponse } from "@znode/types/email-friend";
import { convertCamelCase, convertPascalCase } from "@znode/utils/server";

import { getCatalogCode } from "../category";
import { getPortalDetails } from "../portal";

/**
 * Send product link mail to friend.
 * @param EmailAFriendListModel
 * @returns  send mail to friend.
 */

export async function sendEmailToFriend(emailAFriend: IEmailAFriendRequest) {
  try {
    const portalData = await getPortalDetails();
    const catalogCode = await getCatalogCode(portalData);
    emailAFriend.catalogCode = catalogCode as string;
    const emailRequest = convertPascalCase({
      ...emailAFriend,
    });

    const sendMail: IEmailFriendResponse = convertCamelCase(await WebstoreProducts_sendMailToFriend(emailRequest as EmailAFriendRequest));
    return sendMail;
  } catch (error) {
    logServer.error(AREA.PRODUCT, errorStack(error));
    return null;
  }
}
