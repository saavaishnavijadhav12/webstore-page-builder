"use client";

import "@measured/puck/puck.css";
import "../styles/index.css";

import { ActionBar, Puck, usePuck, Overrides } from "@measured/puck";

import { useEffect, useMemo, useState } from "react";
import { CustomizeControlBar } from "@znode/base-components/znode-widget/customize-control-bar";
import type { Data } from "@measured/puck";
import type { ReactNode } from "react";
import { getConfig } from "../configs/get-config";
import { PUBLISH_VISUAL_EDITOR_CONSTANTS, VISUAL_EDITOR_EVENT_CONSTANTS, VISUAL_EDITOR_SETTINGS } from "../constants/visual-editor";
import { doPostMessageToParent, removeApiResponse } from "../utils/common";
import { IConfigParam } from "../types/page-builder";

const enableEditDefaultWidget: boolean = Boolean(VISUAL_EDITOR_SETTINGS.ENABLE_EDIT_WIDGET);
import { IPageStructure } from "@znode/types/visual-editor";
import { generatePageStructure } from "../utils/page-structure/generate-page-structure";
import { PageEditorLayout } from "./PageEditorLayout";

export interface IPageEditorProps {
  pageStructure: IPageStructure;
  onPublish: (data: Data) => void;
  configParams: IConfigParam;
}

interface ParentMessage {
  data: {
    category: string;
  };
}

interface ParentMessage {
  data: {
    category: string;
  };
}

export function PageEditor(props: Readonly<IPageEditorProps>) {
  const { configParams, pageStructure } = props || {};
  const data: Data = pageStructure.data;

  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    getConfig(configParams).then((cfg) => {
      if (isMounted) setConfig(cfg);
    });
    return () => {
      isMounted = false;
    };
  }, [configParams]);

  function onChangeDataToParentIframe(data: Data) {
    console.log("onChangeDataToParentIframe---", data);
    const schema = removeApiResponse(data);
    const pageStructureJson = generatePageStructure(schema, { url: pageStructure.key });
    const eventData = {
      pageJson: pageStructureJson,
    };
    console.log("onChangeDataToParentIframe-eventData---", eventData);
    doPostMessageToParent(
      VISUAL_EDITOR_EVENT_CONSTANTS.EVENT_TYPE,
      VISUAL_EDITOR_EVENT_CONSTANTS.EVENT_ACTION_TYPE,
      PUBLISH_VISUAL_EDITOR_CONSTANTS.NOTIFY_VISUAL_EDITOR_CHANGES,
      eventData
    );
  }

  const overrides: Partial<Overrides> = useMemo(() => {
    return {
      actionBar: (props) => <CustomActionBar {...props} />,
      header: (props) => (enableEditDefaultWidget ? <>{props.children}</> : <div style={{ height: "65px" }}></div>),
      iframe: ({ children }) => (
        <PageEditorLayout configParams={configParams} pageStructure={pageStructure}>
          {children}
        </PageEditorLayout>
      ),
    };
  }, []);


  return <Puck config={config} data={data} onPublish={props.onPublish} overrides={overrides} onChange={onChangeDataToParentIframe} />;
}

interface ICustomActionBarProps {
  children: ReactNode;
  label?: string;
}

function CustomActionBar(props: Readonly<ICustomActionBarProps>) {
  const { children, label } = props || {};
  const { selectedItem, appState } = usePuck();

  const selectedItemProps = selectedItem?.props;
  const hasConfigurable = selectedItemProps?.config?.hasConfigurable;
  const selectedConfig = selectedItemProps?.config;
  let widgetConfig = selectedItemProps?.config?.widgetConfig;

  async function receiveMessage(parentMessage: ParentMessage) {
    if (parentMessage?.data?.category === PUBLISH_VISUAL_EDITOR_CONSTANTS.PUBLISH_VISUAL_EDITOR_RECEIVER) {
      const schema = removeApiResponse(appState.data);
      const eventData = {
        pageJson: schema,
      };
      // Send the updated data via postMessage
      doPostMessageToParent(
        VISUAL_EDITOR_EVENT_CONSTANTS.EVENT_TYPE,
        VISUAL_EDITOR_EVENT_CONSTANTS.EVENT_ACTION_TYPE,
        PUBLISH_VISUAL_EDITOR_CONSTANTS.PUBLISH_VISUAL_EDITOR_SENDER,
        eventData
      );
    } else if (parentMessage?.data?.category === PUBLISH_VISUAL_EDITOR_CONSTANTS.PUBLISH_VISUAL_EDITOR_PREVIEW_RECEIVER) {
      const schema = removeApiResponse(appState.data);
      const eventData = {
        pageJson: schema,
      };
      // Send the updated data via postMessage
      doPostMessageToParent(
        VISUAL_EDITOR_EVENT_CONSTANTS.EVENT_TYPE,
        VISUAL_EDITOR_EVENT_CONSTANTS.EVENT_ACTION_TYPE,
        PUBLISH_VISUAL_EDITOR_CONSTANTS.PUBLISH_VISUAL_EDITOR_PREVIEW_SENDER,
        eventData
      );
    }
  }

  useEffect(() => {
    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  return (
    <ActionBar label={label}>
      <ActionBar.Group>
        {children}

        {/* Show Configurable Gear Icon for Widget */}
        {hasConfigurable && <CustomizeControlBar selectedConfig={selectedConfig} widgetConfig={widgetConfig} />}
      </ActionBar.Group>
    </ActionBar>
  );
}