"use client";

import { IAddAddressRequest, IAddress, IAddressList, IEditAddressRequest } from "@znode/types/address";
import { IUpdateAddressResponse, IUser, IUserAddressModel } from "@znode/types/user";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ADDRESS } from "@znode/constants/address";
import { AddEditAddress } from "../add-edit/AddEditAddress";
import AddressSelector from "../AddressSelector";
import { Heading } from "../../common/heading";
import { useTranslationMessages } from "@znode/utils/component";

interface IShippingAddressSectionProps {
  addressList: IAddress[];
  selectedAddress?: IAddress | undefined;
  onAddressChange: (_id: string, _type: string) => void;
  resetForm?: boolean;
  onSaveAddress: (_res: IUpdateAddressResponse, _isBilling: boolean) => void;
  userInfo?: IUserAddressModel;
  addressInfo?: IAddressList;
  hideAddressButtons: boolean;
  isDefaultAddAddressView?: boolean;
  restrictOtherActions?: Dispatch<SetStateAction<{ isShippingAddressOpen: boolean; isBillingAddressOpen: boolean }>>;
  enableShippingAddressSuggestion: boolean;
  setHideBillingSection: Dispatch<SetStateAction<boolean>>;
  resetAddress?: boolean;
  setDontSaveAddressChecked: Dispatch<SetStateAction<boolean>>;
  isHideAddEditButton: boolean;
  enableAddressValidation: boolean;
}

const ShippingAddressSection: React.FC<IShippingAddressSectionProps> = ({
  hideAddressButtons,
  addressList,
  selectedAddress,
  onAddressChange,
  userInfo,
  addressInfo,
  onSaveAddress,
  resetForm,
  restrictOtherActions,
  isDefaultAddAddressView = false,
  enableShippingAddressSuggestion,
  setHideBillingSection,
  resetAddress,
  setDontSaveAddressChecked,
  isHideAddEditButton,
  enableAddressValidation,
}) => {
  const checkoutTranslations = useTranslationMessages("Checkout");

  const [showEditAddress, setShowEditAddress] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressType, setAddressType] = useState<string>(ADDRESS.ADD_ADDRESS || "Add");

  const handleShowHideShippingAddress = () => {
    setShowEditAddress(false);
    setShowAddAddress(false);
  };

  const filterBillingAddresses = (addresses: IAddress[]): number => {
    return addresses.filter((address: IAddress) => address.isBilling || address.isDefaultBilling || address.isBothBillingShipping).length;
  };

  const userAddressCount = filterBillingAddresses(addressList);

  const saveAddress = (address: IUpdateAddressResponse) => {
    handleShowHideShippingAddress();
    onSaveAddress(address, false);
  };

  const onAddressChanged = (addressId: string) => {
    onAddressChange(addressId, ADDRESS.SHIPPING_ADDRESS_TYPE);
  };

  const onAddNew = (isSectionShow: boolean) => {
    setShowAddAddress(isSectionShow);
    setAddressType(ADDRESS.ADD_ADDRESS);
    setHideBillingSection(false);
    restrictOtherActions && restrictOtherActions({ isShippingAddressOpen: true, isBillingAddressOpen: false });
  };

  const onEdit = (isSectionShow: boolean) => {
    setShowAddAddress(isSectionShow);
    setAddressType(ADDRESS.EDIT_ADDRESS);
    restrictOtherActions && restrictOtherActions({ isShippingAddressOpen: true, isBillingAddressOpen: false });
  };

  useEffect(() => {
    setShowAddAddress(isDefaultAddAddressView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDefaultAddAddressView]);

  const createAddEditAddressRequest = (type: string): IEditAddressRequest | IAddAddressRequest => {
    if (type === ADDRESS.EDIT_ADDRESS) {
      return {
        addressId: selectedAddress?.addressId ?? 0,
        otherAddressId: selectedAddress?.otherAddressId ?? 0,
        type: ADDRESS.SHIPPING_ADDRESS_TYPE,
        isFromEdit: true,
        isGuestUser: userInfo?.userId && userInfo.userId > 0 ? false : true,
      };
    } else {
      return {
        type: ADDRESS.SHIPPING_ADDRESS_TYPE,
        isGuestUser: userInfo?.userId && userInfo.userId > 0 ? false : true,
        userId: userInfo?.userId,
        accountId: userInfo?.accountId,
        hasDefaultShippingAddress: addressInfo?.shippingAddress?.postalCode ? true : false,
      };
    }
  };

  const handleBackClick = () => {
    setShowAddAddress(false);
    setHideBillingSection(true);
    restrictOtherActions && restrictOtherActions({ isShippingAddressOpen: false, isBillingAddressOpen: false });
  };

  return (
    <div className="w-full">
      <Heading level="h2" name={checkoutTranslations("shippingAddress")} customClass="uppercase" dataTestSelector="hdgShippingAddress" showSeparator />
      {!showAddAddress && !showEditAddress && (
        <AddressSelector
          addressList={addressList}
          isHideAddEditButton={isHideAddEditButton}
          selectedAddress={selectedAddress}
          onAddressChange={(res: string) => onAddressChanged(res)}
          hideAddressButtons={hideAddressButtons}
          dataTestSelectorName="Shipping"
          onAddNewAddress={(isSectionShow: boolean) => onAddNew(isSectionShow)}
          onEditAddress={(isSectionShow: boolean) => onEdit(isSectionShow)}
          enableShippingAddressSuggestion={enableShippingAddressSuggestion}
          addressType="Shipping"
        />
      )}

      {showAddAddress && (
        <AddEditAddress
          addAddressData={createAddEditAddressRequest(ADDRESS.ADD_ADDRESS)}
          backClick={handleBackClick}
          saveClick={(res: IUpdateAddressResponse) => saveAddress(res)}
          resetHandle={resetForm}
          userAddressCount={userAddressCount}
          backClickForGuest={handleBackClick}
          editAddressData={createAddEditAddressRequest(ADDRESS.EDIT_ADDRESS) as IEditAddressRequest}
          addressType={addressType}
          setHideBillingSection={setHideBillingSection}
          resetAddress={resetAddress}
          setDontSaveAddressChecked={setDontSaveAddressChecked}
          selectedAddress={selectedAddress}
          userDetails={userInfo as IUser}
          enableAddressValidation={enableAddressValidation}
        />
      )}
    </div>
  );
};

export default ShippingAddressSection;
