const pdf = require('pdf-parse');
const fileUtils = require('./file.utils');



const extractDataLines = (dataLines, start, end) => {
  let found = false;
  let ongoingLines = [];
  for (const line of dataLines) {
      if (found) {
          const trimmedLine = line.trimEnd();
          if (trimmedLine.endsWith(end)) {
              found = false;
              break;
          } else {
              ongoingLines.push(trimmedLine);
          }
      } else if (line.trim() == start) {
          found = true;
      }
  }
  return removeUnessaryLines(ongoingLines);
}


exports.parseDataFromPrescriptionPDF = async (base64Data) => {
  // Convert base64 string to a buffer
  const data = fileUtils.getFsBuffer(base64Data);

  //parse data from pdf into Array of lines
  return dataLines = pdf(data).then(function (data) {
    return data.text.split('\n');
  }).catch(function (error) {
    throw error;
  });
}


// returns problem list(diseases list)
exports.getProblemList = (dataLines,patient_name) => {
  const lisoofProblems = extractDataLines(dataLines, 'Problem List/Past Medical History:', ';');
  lisoofProblems.shift();
  // remove name and code
  const data =removeNameAndCodeOfPatient(lisoofProblems, patient_name)
  const problemset = new Set(data);
  return Array.from(problemset);
}

exports.getFamilyDetails = (dataLines) => {
  const data = extractDataLines(dataLines, 'History and Physical', 'Code Status:');
  const result = {
    name: '',
    code: '',
    family_contact_info: {
      name: '',
      phone_number: ''
    }
  };
  console.log(data[0])

  // Extract the name and code from the first string
  const nameCodeMatch = data[0].match(/^(.+)\s+-\s+(\d+)$/);
  if (nameCodeMatch) {
    result.name = nameCodeMatch[1];
    result.code = nameCodeMatch[2];
  }

  // Extract the family contact info from the rest of the strings
  let extracting = '';
  data.forEach(line => {
    if (line.startsWith('Name: ')) {
      result.family_contact_info.name = line.replace('Name: ', '');
    } else if (line.startsWith('Phone Number: ')) {
      result.family_contact_info.phone_number = line.replace('Phone Number: ', '');
    } else if (extracting) {
      result[extracting] += (result[extracting] ? ' ' : '') + line;
    }
  });
  return result;
}

exports.getProcedureSurgicalHistory = (dataLines, patient_name) => {
  const data = extractDataLines(dataLines, 'Procedure/Surgical History;', 'Family History;');
  const result = data.map(item => item.replace('• ',''));
  const result1 = removeNameAndCodeOfPatient(result, patient_name);
  return result1;
}

exports.getFamilyHistory = (dataLines, patient_name) => {
  const data = extractDataLines(dataLines, 'Family History;', 'Social History;');
  const result = removeNameAndCodeOfPatient(data, patient_name);
  const colonremove = removesecondoccuranceofcolon(result);
  const res = transformData(colonremove);
  return res;
}

exports.getHomeMedication = (dataLines, patient_name) => {
  const data = extractDataLines(dataLines, 'Home Medications:', 'Physical Exam:');
  const result = removeNameAndCodeOfPatient(data, patient_name);
  return result;
}

exports.getPhysicalExam = (dataLines, patient_name)=> {
  const data = extractDataLines(dataLines, 'Physical Exam:', 'Pertinent Labs:');
  data.shift();
  const result = removeNameAndCodeOfPatient(data, patient_name);
  const res = transformData(result);
  return res;
}

// Update the filter function to correctly remove unnecessary lines
const removeUnessaryLines = (dataLines) => {
  return dataLines.filter(line => {
    const trimmedLine = line.trim();
    return trimmedLine !== '' 
      && !trimmedLine.startsWith('Printed by:') 
      && !trimmedLine.startsWith('Printed on:')
      && !trimmedLine.startsWith('Page')
      && !trimmedLine.startsWith('j,')
      && !trimmedLine.startsWith('History & Physical')
      && !trimmedLine.startsWith('* Final Report *');
  });
}

// remove name and code of patient
const removeNameAndCodeOfPatient = (dataLines, patient_name) => {
  return dataLines.filter(item => !item.trim().includes(patient_name));
}


// Extract the name and value from the first string
function transformData(lines) {
    // merge all lines in a single string
    const mergedLines = lines.join(' ');
   
    // separate each word and make an array
    const words = mergedLines.split(' ');
   
    const pairs = [];
    let name = '';
    let value = '';
    let inName = false;
    for (const word of words) {
        if(word.trim().includes(':')) {
            inName = true;
            name = word;
            continue;
        }if(inName){
           if(!word.trim().includes(':')){
               name = word+' ';
               continue;
           }else{
              pairs.push({ name: name.trim(), value: value.trim() });
              name = word;
           }
        }
    }
    return pairs;
}


// Remove the second occurrence of a colon from each line
const removesecondoccuranceofcolon = (dataLines) => {
  return dataLines.map(line => {
    const colonIndex = line.indexOf(':', line.indexOf(':') + 1);
    if (colonIndex !== -1) {
      return line.slice(0, colonIndex) + line.slice(colonIndex + 1);
    }
    return line;
  });
}
