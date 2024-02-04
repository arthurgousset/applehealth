# Apple Health Data Converter (`.xml` to `.csv`)

Convert XML health data from Apple's Health app to csv.

You can export health data from [Apple's Health app](https://www.apple.com/ios/health/). 
Unfortunately, the exported health data comes in XML format.
This script reads the health data (in `.xml`) and produces a new file for you (in `.csv`).

## Usage

```sh
# Clone the repository
$ git clone

# Navigate to the project directory
$ cd applehealth

# Install the dependencies
$ yarn install
```

Copy the Apple Health file you exported (`export.xml`) to the project directory.

```sh
# Run the script
$ yarn ts-node convert.ts 
```

## How it works

The script reads the `export.xml` file and parses a subset of the records that match a filter.

I'm looking for records of type `HKQuantityTypeIdentifierBodyMass` (i.e. weight records):

```
 <Record type="HKQuantityTypeIdentifierBodyMass" sourceName="Shortcuts" sourceVersion="1083.2" unit="kg" creationDate="2020-07-24 10:37:35 +0000" startDate="2020-07-24 10:37:00 +0000" endDate="2020-07-24 10:37:00 +0000" value="81.9"/>
```

That means the script will only parse records of type `HKQuantityTypeIdentifierBodyMass` and convert them into a csv format. You can change the filter to match other types of records.

The script produces a new `weight.csv` file with two columns, "date", and "weight". 

For each row in the csv:
- the `date` value is set to the `startDate` value from the XML record (in DD/MM/YYYY format), 
- the `weight` value is set to the `value` value of the XML record in the same format.

## How to export health data from Apple's Health app

Source: [Share your data in Health on iPhone](https://support.apple.com/en-gb/guide/iphone/iph5ede58c3d/ios)
 
> You can export all of your health and fitness data from Health in XML format, which is a common format for sharing data between apps.
> 
> 1. Tap your picture or initials at the top right.
> 
>    If you don’t see your picture or initials, tap Summary or Browse at the bottom of the screen, then scroll to the top of the screen.
> 
> 2. Tap Export All Health Data, then choose a method for sharing your data.