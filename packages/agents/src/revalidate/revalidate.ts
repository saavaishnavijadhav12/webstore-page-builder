/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { deleteKeyPrefix, getByKeyPrefix , deleteKey} from "@znode/cache";
import { getPortalHeader } from "@znode/utils/server";

export async function clearTagLevelCaching(requestData: any): Promise<string[]> {
    try {
        const validJsonString = requestData.Payload.replace(/'/g, "\"");
        const deserializedPayload = JSON.parse(validJsonString);
        const tag: string[] = deserializedPayload?.Tag?.[0]?.split(",").map((t: string) => `webstore${t}`) || [];
        return tag;
    } catch (error) {
        console.error("Error parsing cache payload:", error);
        return [];
    }
}

export async function clearPortalCaching(tag: string[]){
    let storeCode = "";
        Object.values(tag).forEach(tags => {
            tags.split(",").forEach(singleTag => {
                if (singleTag.includes("Portal_")) {
                    const portalTag = singleTag.split("Portal_");
                    if (portalTag.length > 1) {
                        storeCode = portalTag[1];
                    }
                }
            });
        });
    if (storeCode) {
        await deleteKeyPrefix(storeCode);
    }
}

export async function clearProductPageCaching(tag: string[]) {
    const ids = tag.map(item => item.match(/\d+/)?.[0]).filter(Boolean);
    const keys = await getKeys();
    for (const currentKey of keys) {
        if (ids.some(id => currentKey.includes(`product_${id}`))) {
            await deleteKey(currentKey);
        }
    }
}

export async function clearCategoryPageCaching(tag: string[]) {
    const ids = tag.map(item => item.match(/\d+/)?.[0]).filter(Boolean);
    const keys = await getKeys();
    for (const currentKey of keys) {
        if (ids.some(id => currentKey.includes(`category_${id}`))) {
            await deleteKey(currentKey);
        }
    }
}

export async function clearHomePageCaching() {
    const keys = await getKeys();
    for (const currentKey of keys) {
        if (currentKey.includes("home_")) {
            await deleteKey(currentKey);;
        }
    }
}

export async function clearLayoutPageCaching() {
    const keys = await getKeys();
    for (const currentKey of keys) {
        if (currentKey.includes("layout_")) {
            await deleteKey(currentKey);;
        }
    }
}

export async function getKeys() {
  const portalHeader = await getPortalHeader();
  const storeCode = portalHeader.storeCode;
  const keys = await getByKeyPrefix(storeCode);
  return keys;
}
