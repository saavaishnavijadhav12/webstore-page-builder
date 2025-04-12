import { ILocation, IStoreList } from "@znode/types/store-locator";
import { AccordionItem } from "./AccordionItem";

interface IAccordionParams {
  title?: string;
  data?: IStoreList;
  modeOfTravel: google.maps.TravelMode | string;
  type?: string;
  responseData?: IStoreList;
  userCurrentLocation?: ILocation;
}

export function Accordion(props: IAccordionParams) {
  const { title, data, modeOfTravel, userCurrentLocation } = props;
  return (
    <div className="accordion">
      <AccordionItem title={title} responseData={data} modeOfTravel={modeOfTravel} userCurrentLocation={userCurrentLocation} />
    </div>
  );
}
