import type { Data } from "@measured/puck";
import { PageRender } from "@znode/page-builder/page-render";
import React from "react";

interface ClientProps {
  data: Data;
  themeName: string;
  configType: string;
}
function Client(props: Readonly<ClientProps>) {
  return (
    <PageRender
      data={props.data}
      configParam={{
        theme: props.themeName,
        header: <></>,
        footer: <></>,
        configType: props.configType,
        enableLayout: false,
      }}
    />
  );
}

export default Client;
