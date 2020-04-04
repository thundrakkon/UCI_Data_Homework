#import os and csv
import os
import csv

pybank_csv = os.path.join("Resources", "budget_data.csv")

print("Financial Analysis")
print("----------------------------")

#count months in data
count_months = 0
with open(pybank_csv) as csvfile:
    csvreader = csv.reader(csvfile)
    if csv.Sniffer().has_header:
        next(csvreader)
    for row in csvreader:
        count_months += 1
print(f"Total Months: {count_months}")