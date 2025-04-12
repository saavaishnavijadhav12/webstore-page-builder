import { CacheHandler } from "@neshca/cache-handler";
import { isImplicitTag } from "@neshca/cache-handler/helpers";
import { createClient, commandOptions } from "redis";
 
CacheHandler.onCreation(async () => {
  const client = createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });
 
  client.on("error", (error) => {
    if (typeof process.env.NEXT_PRIVATE_DEBUG_CACHE !== "undefined") {
     
      console.error("Redis client error:", error);
    }
  });
 
  await client.connect();
 

  const timeoutMs = 5000;
 
  const keyPrefix = "";
 
  const sharedTagsKey = "_sharedTags_";
 
  function assertClientIsReady() {
    if (!client.isReady) {
      throw new Error("Redis client is not ready yet or connection is lost.");
    }
  }

  async function deleteKeys(keys) {
    if (!keys.length) return;
    try {
      await client.del(keys);
    } catch (error) {
      console.error("Error deleting keys:", error);
    }
  }

  const revalidatedTagsKey = `${keyPrefix}__revalidated_tags__`;
 
  // Create a custom Redis Handler
  const customRedisHandler = {
    name: "redis-strings-custom",

    async get(key, { implicitTags }) {
      assertClientIsReady();
 
      const options = commandOptions({ signal: AbortSignal.timeout(timeoutMs) });
 
      const result = await client.get(options, keyPrefix + key);
 
      if (!result) {
        return null;
      }
 
      const cacheValue = JSON.parse(result);
 
      if (!cacheValue) {
        return null;
      }
 
      const combinedTags = new Set([...cacheValue.tags, ...implicitTags]);
 
      if (combinedTags.size === 0) {
        return cacheValue;
      }
 
      // Get the revalidation times for the tags.
      const revalidationTimes = await client.hmGet(commandOptions({ signal: AbortSignal.timeout(timeoutMs) }), revalidatedTagsKey, Array.from(combinedTags));
 
      for (const timeString of revalidationTimes) {
        if (timeString && Number.parseInt(timeString, 10) > cacheValue.lastModified) {
          await client.unlink(commandOptions({ signal: AbortSignal.timeout(timeoutMs) }), keyPrefix + key);
 
          return null;
        }
      }
 
      return cacheValue;
    },
    async set(key, cacheHandlerValue) {
      assertClientIsReady();
 
      const options = commandOptions({ signal: AbortSignal.timeout(timeoutMs) });
 
      const setOperation = client.set(options, keyPrefix + key, JSON.stringify(cacheHandlerValue));
 
      const expireOperation = cacheHandlerValue.lifespan ? client.expireAt(options, keyPrefix + key, cacheHandlerValue.lifespan.expireAt) : undefined;
 
      const setTagsOperation = cacheHandlerValue.tags.length ? client.hSet(options, keyPrefix + sharedTagsKey, key, JSON.stringify(cacheHandlerValue.tags)) : undefined;
 
      await Promise.all([setOperation, expireOperation, setTagsOperation]);
    },
      
    async revalidateTag(tag) {
      assertClientIsReady();
      const splitTags = tag && tag.split(",");
      if (splitTags && splitTags.length > 0) {
        let updateTagsOperation;
        for (const i of splitTags) {
          const tag = i;
          if (isImplicitTag(tag)) {
            await client.hSet(commandOptions({ signal: AbortSignal.timeout(timeoutMs) }), revalidatedTagsKey, tag, Date.now());
          }
     
          const tagsMap = new Map();
     
          let cursor = 0;
     
          const hScanOptions = { COUNT: 100 };
     
          do {
            const remoteTagsPortion = await client.hScan(commandOptions({ signal: AbortSignal.timeout(timeoutMs) }), keyPrefix + sharedTagsKey, cursor, hScanOptions);
      
            for (const { field, value } of remoteTagsPortion.tuples) {
              tagsMap.set(field, JSON.parse(value));
            }
     
            cursor = remoteTagsPortion.cursor;
  
          } while (cursor !== 0);
      
          const keysToDelete = [];
          const tagsToDelete = [];

          // Iterate over all keys and tags.
          for (const [key, tags] of tagsMap) {
            if (tags.includes(tag)) {
              keysToDelete.push(keyPrefix + key);
              tagsToDelete.push(key);
            }
          }
          if (!client.isReady) {
            throw new Error("Redis client is not ready yet or connection is lost.");
          }
          if (keysToDelete.length === 0) {
            return;
          }
          await deleteKeys(keysToDelete);
          updateTagsOperation = client.hDel({ isolated: true, ...commandOptions({ signal: AbortSignal.timeout(timeoutMs) }) }, keyPrefix + sharedTagsKey, tagsToDelete);
        };
        await Promise.all([updateTagsOperation]);
      }
    },
  };
 
  return {
    handlers: [customRedisHandler],
  };
});
 
export default CacheHandler;
