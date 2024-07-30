const redis = require('redis');
const logger = require('./logger');
const db = require('../models/index');
const cacheClient = redis.createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });

cacheClient.on('error', (err) => {
    logger.info('Redis error: ' + err);
});

const initRedisClient = async () => {
    await cacheClient.connect();
    logger.info('Connected to Redis');
};

const addCached = async () => {
    try {
        // Fetch from db
        const masterModelList = await db.MasterModel.findAll({
            order: [['preferred_code', 'ASC']]
          });
        if(masterModelList){
            logger.info('data fetched from db...', masterModelList.length);
        }
        // Store into redis
        cacheClient.set('master_mapping', JSON.stringify(masterModelList));
        logger.info('cached successfully...');
    } catch (err) {
        logger.error('error while adding data to redis:' + err);
    }
};

const deleteCached = async () => {
    try {
        await cacheClient.flushAll();
        logger.info('caching deleted...');
    } catch (err) {
        logger.error('error while deleting data from redis:' + err);
    }
};

const addItemCached = async (newData) => {
    try {
        // Fetch from cache
        const data = await cacheClient.get("master_mapping");
        let cacheJsonData = JSON.parse(data);

        // add new Data to the cacheJsonData
        cacheJsonData.push(newData);

        // delete cache
        await deleteCached();

        // Re-Store new data to the cache into redis
        cacheClient.set('master_mapping', JSON.stringify(cacheJsonData));
        logger.info('update cached successfully...');
    } catch (err) {
        logger.error('error while updating data to redis:' + err);
    }
}

const addMultipleItemCached = async (newData) => {
    try {
        // Fetch from cache
        const data = await cacheClient.get("master_mapping");
        let cacheJsonData = JSON.parse(data);

        // add new Data to the cacheJsonData
        newData.map(item => {
            cacheJsonData.push(item);
        })
        
        // delete cache
        await deleteCached();

        // Re-Store new data to the cache into redis
        cacheClient.set('master_mapping', JSON.stringify(cacheJsonData));
        logger.info('update cached successfully...');
    } catch (err) {
        logger.error('error while updating data to redis:' + err);
    }
}

const deleteItemCached = async (itemId) => {
    try {
        // Fetch from cache
        const data = await cacheClient.get("master_mapping");
        let cacheJsonData = JSON.parse(data);

        // delete single cache item from cache cacheJsonData where id == itemId
        cacheJsonData = cacheJsonData.filter(item => item.id !== itemId);

        // delete cache
        await deleteCached();

        // Re-Store new data to the cache into redis
        cacheClient.set('master_mapping', JSON.stringify(cacheJsonData));
        logger.info('delete item from cached successfully...');
        
    }catch (err) {
        logger.error('error while deleting single data from redis:' + err);
    }
}

const updateItemCached = async (newData, itemId) => {
    try {
        // Fetch from cache
        const data = await cacheClient.get("master_mapping");
        let cacheJsonData = JSON.parse(data);

        //replace data where id == itemId
        cacheJsonData = cacheJsonData.map(item => item.id === itemId ? newData : item);

        // delete cache
        await deleteCached();

        // Re-Store new data to the cache into redis
        cacheClient.set('master_mapping', JSON.stringify(cacheJsonData));
        logger.info('update item cached successfully...');

    }catch(err){
        logger.error('error while updating data to redis:' + err);
        console.log(err);
    }
} 


module.exports = { 
    initRedisClient,
    addCached,
    addItemCached,
    deleteItemCached,
    addMultipleItemCached,
    updateItemCached,
    cacheClient,
    deleteCached
};
