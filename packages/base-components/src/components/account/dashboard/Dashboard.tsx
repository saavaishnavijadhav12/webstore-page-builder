import { Heading } from "../../common/heading";
import { IAddress } from "@znode/types/address";
import { IDashboardFields } from "@znode/types/account";
import { IUser } from "@znode/types/user";
import Link from "next/link";
import { OrderHistory } from "../order";
import { Separator } from "../../common/separator";
import { useTranslationMessages } from "@znode/utils/component";

interface IDashBoard {
  userData: IUser;
  shippingAddress: IAddress;
  billingAddress: IAddress;
}

export function Dashboard(props: IDashBoard) {
  const { billingAddress, shippingAddress, userData } = props;
  const dashboardTranslations = useTranslationMessages("Dashboard");
  const orderHistoryTranslations = useTranslationMessages("OrderHistory");

  const isValidAddress = (address: IAddress) => !!address && typeof address.addressId === "number" && address.addressId > 0;

  const fieldMappings: IDashboardFields = {
    userName: dashboardTranslations("userName"),
    firstName: dashboardTranslations("firstName"),
    lastName: dashboardTranslations("lastName"),
    phoneNumber: dashboardTranslations("phoneNumber"),
    email: dashboardTranslations("email"),
  };

  return (
    <div>
      {shippingAddress && billingAddress && userData && (
        <>
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="break-words sm:w-2/5">
              <div className="flex items-center justify-between">
                <Heading name={dashboardTranslations("myProfile")} dataTestSelector="hdgMyProfile" level="h2" customClass="w-56 uppercase" />
                <div className="text-sm underline whitespace-nowrap text-linkColor hover:text-hoverColor">
                  <Link href="/account/edit-profile">{dashboardTranslations("viewAll")}</Link>
                </div>
              </div>
              <Separator customClass="mt-0" />
              <div className="flex flex-col p-2">
                {Object.keys(fieldMappings).map((fieldKey, index) => {
                  // Assert that fieldKey is a valid key for IDashboardFields
                  const field = fieldKey as keyof IDashboardFields;
                  return (
                    <div className="flex items-center" key={`div${field}Label${index}`}>
                      <div className="w-1/2 font-semibold" data-test-selector={`div${field}Label`}>
                        {fieldMappings[field]}:
                      </div>
                      <div className="w-1/2" data-test-selector={`div${field}`}>
                        {userData[field] ?? "-"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="sm:w-3/5">
              <div className="flex items-center justify-between">
                <Heading name={dashboardTranslations("addressInformation")} dataTestSelector="hdgAddressInformation" level="h2" customClass="w-56 uppercase" />
                <div className="text-sm underline whitespace-nowrap text-linkColor hover:text-hoverColor">
                  <Link href="/account/address-book">{dashboardTranslations("viewAll")}</Link>
                </div>
              </div>
              <Separator customClass="mt-0 mb-1" />
              <div className="grid-cols-2 gap-3 md:grid">
                <div className="col-span-1">
                  <div className="p-2">
                    <Heading name={dashboardTranslations("shippingAddress")} dataTestSelector="hdgShippingAddress" level="h3" customClass="uppercase" showSeparator />
                    {isValidAddress(shippingAddress) ? (
                      <div>
                        <p data-test-selector="paraDisplayName">{shippingAddress.displayName}</p>
                        <p data-test-selector="paraShippingCompanyName">{shippingAddress.companyName}</p>
                        <div>
                          <span data-test-selector="spnShippingFirstName">{shippingAddress.firstName ?? "-"} </span>
                          <span data-test-selector="spnShippingLastName">{shippingAddress.lastName ?? "-"}</span>
                        </div>
                        <p data-test-selector="paraShippingAddress">
                          {shippingAddress.address1} {shippingAddress.address2}
                        </p>
                        <p>
                          <span data-test-selector="spnShippingCityName"> {shippingAddress.cityName}, </span>
                          <span data-test-selector="spnShippingStateName">{shippingAddress.stateName}, </span>
                          <span data-test-selector="spnShippingCountryName">{shippingAddress.countryName} </span>
                          <span data-test-selector="spnShippingPostalCode">{shippingAddress.postalCode}</span>
                        </p>
                        <p data-test-selector="paraShippingPhoneNumber">
                          {dashboardTranslations("ph")}: {shippingAddress.phoneNumber ?? "-"}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4" data-test-selector="divErrorNoShippingAddress">
                        {dashboardTranslations("errorNoPrimaryAddress")}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="p-2">
                    <Heading name={dashboardTranslations("billingAddress")} dataTestSelector="hdgBillingAddress" level="h3" customClass="uppercase" showSeparator />
                    {isValidAddress(billingAddress) ? (
                      <div>
                        <p data-test-selector="paraBillingCompanyName">{billingAddress.displayName}</p>
                        <p data-test-selector="paraBillingCompanyName">{billingAddress.companyName}</p>
                        <div>
                          <span data-test-selector="spnBillingFirstName">{billingAddress.firstName ?? "-"} </span>
                          <span data-test-selector="spnBillingLastName">{billingAddress.lastName ?? "-"}</span>
                        </div>
                        <p data-test-selector="paraBillingAddress">
                          {billingAddress.address1} {billingAddress?.address2}
                        </p>
                        <p>
                          <span data-test-selector="spnBillingCityName">{billingAddress.cityName}, </span>
                          <span data-test-selector="spnBillingStateName">{billingAddress.stateName}, </span>
                          <span data-test-selector="spnBillingCountryName">{billingAddress.countryName} </span>
                          <span data-test-selector="spnBillingPostalCode">{billingAddress.postalCode}</span>
                        </p>
                        <p data-test-selector="paraBillingPhoneNumber">
                          {dashboardTranslations("ph")}: {billingAddress.phoneNumber ?? "-"}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4" data-test-selector="divErrorNoBillingAddress">
                        {dashboardTranslations("errorNoPrimaryAddress")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2" data-test-selector="divOrderHistory">
            <div className="flex items-center justify-between">
              <Heading name={orderHistoryTranslations("orderHistory")} dataTestSelector="hdgOrderHistory" level="h2" customClass="w-56 uppercase" />
              <div className="text-sm underline whitespace-nowrap text-linkColor hover:text-hoverColor">
                <Link href="/account/order/list" data-test-selector="linkViewAllMenus">
                  {dashboardTranslations("viewAll")}
                </Link>
              </div>
            </div>
            <Separator customClass="mt-0" />
            <OrderHistory isInvoiceBtnEnabled={false} />
          </div>
          {/* TODO : Yet to implement wishlist */}
          {/* <div className="mt-4 mb-4" data-test-selector="divWishList">
            <WishList isViewAll={true} />
          </div> */}
        </>
      )}
    </div>
  );
}
