const MiniSearch = require('minisearch');
const { cacheClient } = require('./redis.cache');
const logger  = require('./logger');

const minisearchArr = new MiniSearch({
    fields: ["icd_code", "icd_description", "main_category", "clinical_category","comorbidity_description"],
    storeFields: ["id", "main_category", "icd_code", "icd_description", "rxcc_cc", "clinical_category",
        "comorbidity_description",  "impact_snf_care_plan", "preferred_code"],
    searchOptions: {
        boost: {
            icd_description: 1,
            main_category: 2,
            clinical_category: 3,
            icd_code: 4,
            comorbidity_description: 5
        },
        prefix: true
    }
});;

const addMiniSearch = async() => {
     // get redis dataset
     const data = await cacheClient.get("master_mapping");
     const cacheJsonData = JSON.parse(data);
     // add data to minisearch
     minisearchArr.removeAll();
     minisearchArr.addAll(cacheJsonData);
    logger.info("minisearch started...");
}



module.exports = { minisearchArr, addMiniSearch }