"use client";

import "./rc-table.scss";

import { ColumnsType, RenderExpandIconProps } from "rc-table/lib/interface";
import { useEffect, useState } from "react";

import { FormatPriceWithCurrencyCode } from "../format-price";
import LoaderTableComponent from "../loader-component/LoaderTableComponent";
import { SETTINGS } from "@znode/constants/settings";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from "rc-table";
import { ZIcons } from "../icons";
import { useTranslationMessages } from "@znode/utils/component";

interface IDynamicData {
  [key: string]: string | number | unknown;
}

interface ITableWrapperProps {
  columns: IDynamicData[];
  data: IDynamicData[];
  // eslint-disable-next-line no-unused-vars
  renderAction?: (record: any) => React.ReactNode;
  loading: boolean;
  tableView?: string;
  expandedRowByKey: string;
  rowSelection?: {
    selectedRowKeys: string[];
    // eslint-disable-next-line no-unused-vars
    onChange: (orderIds: string[]) => void;
  };
}

function TableWrapper({ columns, data, renderAction, loading, expandedRowByKey, tableView, rowSelection }: ITableWrapperProps) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const commonTranslations = useTranslationMessages("Common");
  const customExpandIcon: React.FC<RenderExpandIconProps<IDynamicData>> = (props) => {
    return (
      <span className="block expand-row-icon md:hidden md:w-auto w-5" onClick={(e) => props.onExpand(props.record, e)}>
        {props.expanded ? (
          <ZIcons name="chevron-up" strokeWidth={"1.5px"} color={`${SETTINGS.DEFAULT_ICONS_COLOR}`} />
        ) : (
          <ZIcons name="chevron-down" strokeWidth={"1.5px"} color={`${SETTINGS.DEFAULT_ICONS_COLOR}`} />
        )}
      </span>
    );
  };

  const handleExpand = (expanded: boolean, record: IDynamicData) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record[expandedRowByKey] as number]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record[expandedRowByKey]));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window && window.innerWidth <= 768);
      setExpandedRowKeys([]);
    };

    handleResize();
    window && window.addEventListener("resize", handleResize);
    return () => {
      window && window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getValue = (record: IDynamicData, key: string) => {
    const keyContent = String(key);
    return record[keyContent] as string;
  };

  const expandedRowRender = (record: IDynamicData) => {
    return (
      <div>
        <div className="min-[500px]:grid grid-cols-2 px-1 border-t-0 ">
          {columns.map((columnData) => {
            if (columnData && columnData.heading !== "" && !columnData.displayOnMobile) {
              return (
                <div key={columnData?.dataIndex as string} className="flex flex-row mx-2 my-2">
                  <strong>{columnData.heading as string}:</strong>
                  <div className="break-words pl-2" title={getValue(record, columnData?.dataIndex as string)}>
                    {columnData.showCurrencyCode ? (
                      <FormatPriceWithCurrencyCode
                        price={Number(getValue(record, columnData?.dataIndex as string)) || 0}
                        currencyCode={(record?.CurrencyCode as string) || "USD"}
                      />
                    ) : (
                      getValue(record, columnData?.dataIndex as string) || "-"
                    )}
                  </div>
                </div>
              );
            }
          })}
          {renderAction && (
            <div className="flex flex-row items-start mx-2 my-2">
              <strong>{commonTranslations("actions")}:</strong>
              <div className="break-words pl-2">{renderAction(record)}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const expandOption = {
    expandRowByClick: true,
    expandedRowRender: (record: IDynamicData) => <div className="md:hidden">{expandedRowRender(record)}</div>,
    expandIcon: isMobile ? customExpandIcon : undefined,
    onExpand: isMobile ? handleExpand : undefined,
    expandedRowClassName: () => "p-0 custom-expanded-row md:hidden",
    rowExpandable: () => isMobile,
  };

  const renderColumn = () => {
    return columns?.map((col) => {
      if (col.displayOnMobile) {
        return {
          ...col,
          align: isMobile ? "left" : col.align || "",
          className: `${col.className} ${
            col.heading && col.heading !== "" && col.displayOnMobile && !col.imageColumn ? "w-full md:w-auto" : col.imageColumn && isMobile ? "w-1/4" : ""
          }`,
        };
      }
      return { ...col, className: "hidden md:table-cell" };
    });
  };

  return (
    <div className={`mt-2 overflow-x-hidden   xs:w-full custom-scroll ${tableView === "full" ? "" : "responsive-table"}`} data-test-selector="divGiftCardHistory">
      <Table
        tableLayout="auto"
        columns={renderColumn() as ColumnsType<IDynamicData>}
        expandable={isMobile ? expandOption : {}}
        emptyText={() => <LoaderTableComponent isLoading={loading} loaderText={commonTranslations("noRecordsFound")} />}
        data={data}
        rowKey={(record, index) => String(record[expandedRowByKey]) + "-" + index}
        onRow={(record) => ({
          onClick: () => {
            if (isMobile && rowSelection) {
              rowSelection?.onChange([String(record[expandedRowByKey])]);
            }
          },
        })}
        className="text-sm border md:border-none whitespace-break-spaces"
        rowClassName={(record: IDynamicData) =>
          `border md:border-l-0 md:border-r-0  md:border-b-0 md:border-t mb-2  md:hover:bg-gray-100 ${
            expandedRowKeys.includes(record[expandedRowByKey] as number) ? "bg-gray-100 md:bg-none" : ""
          }`
        }
      />
    </div>
  );
}

export default TableWrapper;
