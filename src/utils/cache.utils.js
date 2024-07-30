const { addMiniSearch, clearMiniSearchData} = require("./mini-search");
const {  initRedisClient, addCached, deleteCached  } = require("./redis.cache");

const initServerCache= async() => {
    // init redis client
    await initRedisClient();
    // add cache to redis
    await addCached();
    // add cache to MiniSearch
    await addMiniSearch();
}

const refreshServerCache = async() => {
    // delete redis cache
    await deleteCached();
    // add cache to redis
    await addCached();
    // add cache to MiniSearch
    await addMiniSearch();
}

const updateServerCache = async(redisOperation) =>{
    // do the nessary operation
    await redisOperation();
    // add cache to MiniSearch
    await addMiniSearch();
}


module.exports = {initServerCache, refreshServerCache, updateServerCache};