// Import necessary libraries
import { parseStringPromise } from 'xml2js';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { readFileSync, writeFileSync } from 'fs';

// Function to read and parse the XML file
async function parseXmlFile(filePath: string) {
  const xml = readFileSync(filePath, 'utf-8');
  const result = await parseStringPromise(xml);
  return result;
}

// Function to extract relevant data and convert it to CSV format
async function convertToCsv(xmlFilePath: string, csvFilePath: string) {
  const data = await parseXmlFile(xmlFilePath);
  const records = data.HealthData.Record;
  const formattedData = records
    .filter((record: any) => record.$.type === 'HKQuantityTypeIdentifierBodyMass')
    .map((record: any) => ({
      date: new Date(record.$.startDate).toLocaleDateString('en-GB'), // Converts to DD/MM/YYYY format
      weight: record.$.value,
    }));

  const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
      { id: 'date', title: 'DATE' },
      { id: 'weight', title: 'WEIGHT' },
    ],
  });

  await csvWriter.writeRecords(formattedData);
  console.log('CSV file has been written');
}

// Replace 'export.xml' and 'weight.csv' with your actual file paths
convertToCsv('export.xml', 'weight.csv').catch(console.error);
