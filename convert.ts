import { createReadStream } from 'fs';
import { Parser } from 'node-expat';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

// Function to stream XML and convert it to CSV
function streamXmlToCsv(xmlFilePath: string, csvFilePath: string) {
  const stream = createReadStream(xmlFilePath);
  const parser = new Parser();

  const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
      { id: 'date', title: 'DATE' },
      { id: 'weight', title: 'WEIGHT' },
    ],
  });

  let isRecord = false;
  let recordAttrs: any = {};
  let records: Array<{ date: string; weight: string }> = [];

  parser.on('startElement', (name, attrs) => {
    if (name === 'Record' && attrs.type === 'HKQuantityTypeIdentifierBodyMass') {
      isRecord = true;
      recordAttrs = attrs;
    }
  });

  parser.on('endElement', (name) => {
    if (isRecord && name === 'Record') {
      const record = {
        date: new Date(recordAttrs.startDate).toLocaleDateString('en-GB'), // Converts to DD/MM/YYYY format
        weight: recordAttrs.value,
      };
      records.push(record);
      isRecord = false;
      recordAttrs = {};
    }
  });

  parser.on('end', async () => {
    await csvWriter.writeRecords(records)
      .then(() => console.log('CSV file has been written'));
  });

  stream.pipe(parser).on('error', (error) => {
    console.error('Error processing XML with node-expat:', error);
  });
}

async function main() {
  try {
    await streamXmlToCsv('export.xml', 'weight.csv');
  } catch (error) {
    console.error(error);
  }
}

main();
