import { Data } from "@measured/puck";

export function generatePageStructure(schema: Data, params: { url: string }): { key: string; data: Data } {
  const contentJson: { key: string; data: Data } = {
    key: params.url,
    data: schema,
  };

  return contentJson;
}
