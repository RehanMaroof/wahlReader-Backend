const { minisearchArr } = require('./mini-search');
exports.filterdiagnosisData1 = (query,filter) =>{
    let main_category = filter?.main_category;
    let clinical_categories_is = filter?.clinical_categories?.is || []; 
    let clinical_categories_isNot = filter?.clinical_categories?.isNot || []; 
    let icd_description_is = filter?.icd_description?.is || []; 
    let icd_description_isNot = filter?.icd_description?.isNot || []; 
    let result = minisearchArr.search(query).map((item) => {
        delete item.score;
        delete item.terms;
        delete item.queryTerms;
        delete item.match;
        let flagForMainCat = false;
        let flagForClinicalCatInclude = false;
        let flagForClinicalCatExclude = false;
        let flagForIcdDescInclude = false;
        let flagForIcdDescExclude = false;
        if((main_category === null || main_category === undefined) && clinical_categories_is.length == 0 && clinical_categories_isNot.length == 0
        && icd_description_is.length == 0 && icd_description_isNot.length == 0){
            return item;
        }else{
            if((main_category !== null || main_category !== undefined) && item.main_category === main_category){
                flagForMainCat = true;
            }
            if(clinical_categories_is && clinical_categories_is.length > 0){
                if(clinical_categories_is.some(cat => item.clinical_category && item.clinical_category.toLowerCase().includes(cat.toLowerCase()))){
                    flagForClinicalCatInclude = true;
                }
            }
            if(clinical_categories_isNot && clinical_categories_isNot.length > 0){
                if(!clinical_categories_isNot.some(cat => item.clinical_category && item.clinical_category.toLowerCase().includes(cat.toLowerCase()))){
                    flagForClinicalCatExclude = true;
                }
            }
            if(icd_description_is && icd_description_is.length > 0){
                if(icd_description_is.some(icd => item.icd_description && item.icd_description.toLowerCase().includes(icd.toLowerCase()))){
                    flagForIcdDescInclude =true;
                }
            }
            if(icd_description_isNot && icd_description_isNot.length > 0){
                if(!icd_description_isNot.some(icd => item.icd_description && item.icd_description.toLowerCase().includes(icd.toLowerCase()))){
                    flagForIcdDescExclude = true;
                }
            }
            if(main_category === null || main_category === undefined){
                flagForMainCat = true;
            }
            if(clinical_categories_is.length == 0){
                flagForClinicalCatInclude = true;
            }
            if(clinical_categories_isNot.length == 0){
                flagForClinicalCatExclude = true;
            }
            if(icd_description_is.length == 0){
                flagForIcdDescInclude = true;
            }
            if(icd_description_isNot.length == 0){
                flagForIcdDescExclude = true;
            }
        }
        if(flagForClinicalCatExclude && flagForClinicalCatInclude && flagForIcdDescExclude && flagForIcdDescInclude && flagForMainCat){
            return item;
        }else{
            return null;  
        }
    })
    return result.filter(item => item !== null).sort((a, b) => a.preferred_code - b.preferred_code);
}

exports.filterdiagnosisData = (query, filter) => {
  
    const {
        main_category,
        clinical_categories = {},
        icd_description = {}
    } = filter || {};

    const {
        is: clinical_categories_is = [],
        isNot: clinical_categories_isNot = []
    } = clinical_categories;

    const {
        is: icd_description_is = [],
        isNot: icd_description_isNot = []
    } = icd_description;

    const hasNoFilter = !main_category && !clinical_categories_is.length && !clinical_categories_isNot.length && !icd_description_is.length && !icd_description_isNot.length;

    return minisearchArr.search(query).map(item => {
        delete item.score;
        delete item.terms;
        delete item.queryTerms;
        delete item.match;
        const {
            main_category: itemMainCategory,
            clinical_category: itemClinicalCategory = '',
            icd_description: itemIcdDescription = ''
        } = item;

        if (hasNoFilter) return item;

        const isMatch = (
            (!main_category || itemMainCategory === main_category) &&
            (clinical_categories_is.length === 0 || clinical_categories_is.some(cat => itemClinicalCategory.toLowerCase().includes(cat.toLowerCase()))) &&
            (clinical_categories_isNot.length === 0 || !clinical_categories_isNot.some(cat => itemClinicalCategory.toLowerCase().includes(cat.toLowerCase()))) &&
            (icd_description_is.length === 0 || icd_description_is.some(icd => itemIcdDescription.toLowerCase().includes(icd.toLowerCase()))) &&
            (icd_description_isNot.length === 0 || !icd_description_isNot.some(icd => itemIcdDescription.toLowerCase().includes(icd.toLowerCase())))
        );

        return isMatch ? item : null;
    }).filter(Boolean).sort((a, b) => b.preferred_code - a.preferred_code);
};
