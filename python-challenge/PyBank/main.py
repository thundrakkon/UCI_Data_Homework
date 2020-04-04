#import os and csv
import os
import csv

pybank_csv = os.path.join("Resources", "budget_data.csv")

with open(pybank_csv) as csvfile:
    csvreader = csv.reader(csvfile, delimiter=",")