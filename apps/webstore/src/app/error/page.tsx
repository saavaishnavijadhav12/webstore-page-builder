import { PortalDataNotFound} from "@znode/base-components/error/PortalDataNotFound";
import { StoreNotPublished} from "@znode/base-components/error/StoreNotPublished";
import { ThemeNotFound} from "@znode/base-components/error/ThemeNotFound";

import { ErrorCodes } from "@znode/types/enums";
import { headers } from "next/headers";

const ErrorPage = () => {
  const errorCode = Number(headers().get("x-error-code"));
  const devErrorMessage = headers().get("dev-error-code");
  if (errorCode == Number(ErrorCodes.StoreDataNotFound)) {
    return <PortalDataNotFound />;
  } else if (errorCode == Number(ErrorCodes.StoreNotPublished)) {
    return <StoreNotPublished />;
  } else if (errorCode == Number(ErrorCodes.ThemeNotFound)) {
    return <ThemeNotFound />;
  } else {
    return (
      <>
        {devErrorMessage ? (
          <div style={{ fontFamily: "Arial", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "10vh" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1 style={{ fontSize: "36px", fontWeight: "bold", paddingLeft: "10px" }}>{devErrorMessage}</h1>
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
};

export default ErrorPage;
