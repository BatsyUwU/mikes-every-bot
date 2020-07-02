const { ShardingManager } = require("discord.js");
require("dotenv").config();
const manager = new ShardingManager("./index.js", { token: process.env.BOT_TOKEN, totalShards: 6})

manager.spawn();
manager.on("shardCreate", shard => console.log(`Launched shard ${shard.id}`));
