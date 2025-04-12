/* eslint-disable no-console */
import { createClient } from "redis";

let client: ReturnType<typeof createClient>;
let isConnected = false; 

export const redisClient = async () => {
  if (!client) {
    // Create a new Redis client instance if not already created
    client = createClient({
      url: process.env.REDIS_CONNECTION_STRING,
    });

    client.on("error", (err) => console.log("Redis Client Error:", err));

    // Connect the Redis client only once
    try {
      await client.connect();
      isConnected = true;
    } catch (err) {
      console.error("Failed to connect to Redis:", err);
      throw err; 
    }

    client.on("connect", () => {
      console.log("Connected to Redis");
    });
  } else if (isConnected) {
    console.log("redis is connected");
  }

  return client;
};



