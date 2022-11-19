const redis = require("redis");
const client = redis.createClient();

client.connect().then(() => {
    console.log("Redis Client running on port 6379");
})


module.exports = client
