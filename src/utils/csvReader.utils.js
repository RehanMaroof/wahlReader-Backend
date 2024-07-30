
const { parse } = require("csv-parse");


exports.readCSVFile = async(stream) =>{
   return new Promise((resolve,reject)=>{
       let data = [];
       stream.pipe(
        parse({
          delimiter: ",",
          columns: true,
          ltrim: true,
        })
      )
      .on("data", function (row) {
        // This will push the object row into the array
        data.push(row);
      })
      .on("error", function (error) {
        reject(error);
      })
      .on("end", function () {
        resolve(data);
      });
   })     
}

exports.dxDataMapper = async(jsonData) =>{
    let formatedResult=[];
    jsonData.map((item) => {
        const resultItem = {};
        Object.keys(item).forEach(key => {
            if (key.toLowerCase().includes('icd') && key.toLowerCase().includes('code') && !key.toLowerCase().includes('description')) {
                resultItem['icd_code'] = item[key];
            }
            else if(key.toLowerCase().includes('icd') && key.toLowerCase().includes('code') && key.toLowerCase().includes('description')){
                resultItem['icd_description'] = item[key];
            }
            else if(key.toLowerCase().includes('clinical') && key.toLowerCase().includes('category')){
                resultItem['clinical_category'] = item[key];
            }else if(key.toLowerCase().includes('snf') && key.toLowerCase().includes('procedure') && key.toLowerCase().includes('care')){
                resultItem['impact_snf_care_plan'] = item[key];
            }
        });
        formatedResult.push(resultItem);
    })
    return formatedResult;
}

exports.slpDataMapper = async(jsonData) =>{
    let formatedResult=[];
    jsonData.map((item) => {
        const resultItem = {};
        Object.keys(item).forEach(key => {
            if (key.toLowerCase().includes('icd') && key.toLowerCase().includes('code') && !key.toLowerCase().includes('description')) {
                resultItem['icd_code'] = item[key];
            }
            else if(key.toLowerCase().includes('icd') && key.toLowerCase().includes('code') && key.toLowerCase().includes('description')){
                resultItem['icd_description'] = item[key];
            }
            else if(key.toLowerCase().includes('comorbidity') && key.toLowerCase().includes('description')){
                resultItem['comorbidity_description'] = item[key];
            }
        });
        formatedResult.push(resultItem);
    })
    return formatedResult;
}

exports.ntaDataMapper = async(jsonData) =>{
    let formatedResult=[];
    jsonData.map((item) => {
        const resultItem = {};
        Object.keys(item).forEach(key => {
            if (key.toLowerCase().includes('icd') && key.toLowerCase().includes('code') && !key.toLowerCase().includes('description')) {
                resultItem['icd_code'] = item[key];
            }
            else if(key.toLowerCase().includes('icd') && key.toLowerCase().includes('code') && key.toLowerCase().includes('description')){
                resultItem['icd_description'] = item[key];
            }
            else if (key.toLowerCase().includes('rxcc') && key.toLowerCase().includes('cc')) {
                resultItem['rxcc_cc'] = item[key];
            }
            else if(key.toLowerCase().includes('comorbidity') && key.toLowerCase().includes('description')){
                resultItem['comorbidity_description'] = item[key];
            }
        });
        formatedResult.push(resultItem);
    })
    return formatedResult;
}