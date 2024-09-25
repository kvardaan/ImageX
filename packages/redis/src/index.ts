import { createClient, RedisClientType } from "redis";

class RedisClientSingleton {
	private static instance: RedisClientSingleton;
	private client: RedisClientType;
	private isConnecting: boolean = false;
	private connectionPromise: Promise<void> | null = null;

	private constructor() {
		this.client = createClient({
			password: process.env.REDIS_PASSWORD,
			socket: {
				host: process.env.REDIS_HOST || "localhost",
				port: Number(process.env.REDIS_PORT) || 6379,
				connectTimeout: 20000,
			},
		});

		this.client.on("error", (err) => console.error("Redis Client Error", err));
		this.client.on("connect", () => console.log("Redis Client Connected"));
		this.client.on("ready", () => console.log("Redis Client Ready"));
		this.client.on("end", () => console.log("Redis Client Connection Ended"));
		this.client.on("reconnecting", () => console.log("Redis Client Reconnecting"));
	}

	public static getInstance(): RedisClientSingleton {
		if (!RedisClientSingleton.instance) {
			console.log("Creating new Redis Client instance");
			RedisClientSingleton.instance = new RedisClientSingleton();
		}
		return RedisClientSingleton.instance;
	}

	public async connect(): Promise<void | null> {
		if (this.client.isOpen) {
			console.log("Redis client is already connected");
			return;
		}

		if (this.isConnecting) {
			console.log("Redis client is already connecting, waiting...");
			return this.connectionPromise;
		}

		this.isConnecting = true;
		this.connectionPromise = this.connectWithRetry();

		try {
			await this.connectionPromise;
		} finally {
			this.isConnecting = false;
			this.connectionPromise = null;
		}
	}

	private async connectWithRetry(retries: number = 5): Promise<void> {
		for (let i = 0; i < retries; i++) {
			try {
				console.log(`Attempting to connect to Redis (Attempt ${i + 1}/${retries})`);
				await this.client.connect();
				console.log("Connected to Redis server successfully");
				return;
			} catch (error) {
				console.error(`Redis connection attempt failed (Attempt ${i + 1}/${retries}):`, error);
				if (i < retries - 1) {
					console.log(`Retrying connection in 2 seconds...`);
					await new Promise((res) => setTimeout(res, 2000));
				} else {
					console.error("Failed to connect to Redis after multiple attempts");
					throw error;
				}
			}
		}
	}

	public getClient(): RedisClientType {
		return this.client;
	}

	public async disconnect(): Promise<void> {
		if (this.client.isOpen) {
			console.log("Disconnecting Redis Client");
			await this.client.disconnect();
			console.log("Redis Client Disconnected");
		} else {
			console.log("Redis Client is already disconnected");
		}
	}
}

export const getRedisClient = async (): Promise<RedisClientType> => {
	const instance = RedisClientSingleton.getInstance();
	await instance.connect();
	return instance.getClient();
};

export const disconnectRedis = async (): Promise<void> => {
	console.log("Disconnecting from Redis");
	await RedisClientSingleton.getInstance().disconnect();
};
