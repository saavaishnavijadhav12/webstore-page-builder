"use client";

import { IAddAddressRequest, IAddress, IAddressList, IEditAddressRequest } from "@znode/types/address";
import { IUpdateAddressResponse, IUser, IUserAddressModel } from "@znode/types/user";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ADDRESS } from "@znode/constants/address";
import { AddEditAddress } from "../add-edit/AddEditAddress";
import AddressSelector from "../AddressSelector";
import { Heading } from "../../common/heading";
import { useTranslations } from "next-intl";

interface BillingAddressSectionProps {
  addressList: IAddress[];
  selectedAddress?: IAddress;
  onAddressChange: (_id: string, _type: string) => void;
  onSaveAddress: (_res: IUpdateAddressResponse, _isBilling: boolean) => void;
  hideAddressButtons: boolean;
  userInfo?: IUserAddressModel;
  addressInfo?: IAddressList;
  restrictOtherActions?: Dispatch<SetStateAction<{ isShippingAddressOpen: boolean; isBillingAddressOpen: boolean }>>;
  isDefaultAddAddressView: boolean;
  setDontSaveAddressChecked: Dispatch<SetStateAction<boolean>>;
  isHideAddEditButton: boolean;
  enableAddressValidation: boolean;
}

const BillingAddressSection: React.FC<BillingAddressSectionProps> = ({
  addressList,
  selectedAddress,
  onAddressChange,
  hideAddressButtons,
  userInfo,
  addressInfo,
  onSaveAddress,
  restrictOtherActions,
  isDefaultAddAddressView,
  setDontSaveAddressChecked,
  isHideAddEditButton,
  enableAddressValidation,
}) => {
  const addressTranslations = useTranslations("Address");

  const [showEditAddress, setShowEditAddress] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(isDefaultAddAddressView || false);
  const [addressType, setAddressType] = useState<string>("");

  const handleShowHideBillingAddress = () => {
    setShowEditAddress(false);
    setShowAddAddress(false);
  };

  const filterBillingAddresses = (addresses: IAddress[]): number => {
    return addresses.filter((address: IAddress) => address.isBilling || address.isDefaultBilling || address.isBothBillingShipping).length;
  };

  const userAddressCount = filterBillingAddresses(addressList);

  const saveAddress = (address: IUpdateAddressResponse) => {
    handleShowHideBillingAddress();
    onSaveAddress(address, true);
  };

  const onAddressChanged = (addressId: string) => {
    onAddressChange(addressId, ADDRESS.BILLING_ADDRESS_TYPE);
  };

  const onAddNew = (isSectionShow: boolean) => {
    setShowAddAddress(isSectionShow);
    setAddressType(ADDRESS.ADD_ADDRESS);
    restrictOtherActions && restrictOtherActions({ isShippingAddressOpen: false, isBillingAddressOpen: true });
  };

  const onEdit = (isSectionShow: boolean) => {
    setShowAddAddress(isSectionShow);
    setAddressType(ADDRESS.EDIT_ADDRESS);
    restrictOtherActions && restrictOtherActions({ isShippingAddressOpen: false, isBillingAddressOpen: true });
  };

  const handleBackClick = () => {
    setShowAddAddress(false);
    restrictOtherActions && restrictOtherActions({ isShippingAddressOpen: false, isBillingAddressOpen: false });
  };

  /** Request body after click on Add or Edit button  */
  const createAddEditAddressRequest = (type: string): IEditAddressRequest | IAddAddressRequest => {
    if (type === ADDRESS.EDIT_ADDRESS) {
      return {
        addressId: selectedAddress?.addressId ?? 0,
        otherAddressId: selectedAddress?.otherAddressId ?? 0,
        type: ADDRESS.BILLING_ADDRESS_TYPE,
        isFromEdit: true,
        isGuestUser: userInfo?.userId && userInfo.userId > 0 ? false : true,
      };
    } else {
      return {
        type: ADDRESS.BILLING_ADDRESS_TYPE,
        isGuestUser: userInfo?.userId && userInfo.userId > 0 ? false : true,
        userId: userInfo?.userId,
        accountId: userInfo?.accountId,
        hasDefaultBillingAddress: addressInfo?.billingAddress?.postalCode ? true : false,
      };
    }
  };

  useEffect(() => {
    setShowAddAddress(isDefaultAddAddressView);
  }, [isDefaultAddAddressView]);

  return (
    <div className="w-full">
      <Heading name={addressTranslations("billingAddress")} dataTestSelector="hdgBillingAddress" customClass="uppercase" level="h2" showSeparator />

      {!showAddAddress && !showEditAddress && (
        <AddressSelector
          addressList={addressList}
          selectedAddress={selectedAddress}
          onAddressChange={(res) => onAddressChanged(res)}
          hideAddressButtons={hideAddressButtons}
          dataTestSelectorName="Billing"
          onAddNewAddress={(isSectionShow) => onAddNew(isSectionShow)}
          onEditAddress={(isSectionShow) => onEdit(isSectionShow)}
          enableShippingAddressSuggestion={false}
          addressType="Billing"
          isHideAddEditButton={isHideAddEditButton}
        />
      )}

      {showAddAddress && (
        <AddEditAddress
          addAddressData={createAddEditAddressRequest(ADDRESS.ADD_ADDRESS)}
          backClick={handleBackClick}
          saveClick={(res) => saveAddress(res)}
          userAddressCount={userAddressCount}
          backClickForGuest={handleBackClick}
          editAddressData={createAddEditAddressRequest(ADDRESS.EDIT_ADDRESS) as IEditAddressRequest}
          addressType={addressType}
          setDontSaveAddressChecked={setDontSaveAddressChecked}
          selectedAddress={selectedAddress}
          userDetails={userInfo as IUser}
          enableAddressValidation={enableAddressValidation}
        />
      )}
    </div>
  );
};

export default BillingAddressSection;
