import { IFacetChipNameProps } from "@znode/types/facet-chip-list";

export function FacetChipName({ facetName, facet, attributeCode, removeChip, filterBy, firstFacetFlag = true }: IFacetChipNameProps) {
  return (
    <div className="flex items-center justify-start flex-wrap mx-2">
      {firstFacetFlag && <span className="font-semibold pr-1 text-sm mr-1">{filterBy} :</span>}
      <span className="capitalize font-semibold px-1 text-sm mr-2" data-test-selector={`spn${facet}Name`}>
        {facetName} :
      </span>{" "}
      {attributeCode?.map((name: string, index: number) => {
        return (
          <div className="flex px-1 items-center mx-1  whitespace-nowrap text-sm shadow-md rounded py-1" key={index}>
            {" "}
            <span className="px-1" data-test-selector={`spn${name}`}>
              {name}
            </span>{" "}
            <div
              onClick={() => removeChip(facet, name)}
              ata-test-selector={`div${name}Clear`}
              className="rounded-full flex items-center justify-center mx-1 bg-primaryColor text-white w-4 h-4 pb-1 cursor-pointer"
            >
              x
            </div>
          </div>
        );
      })}
    </div>
  );
}
