#import os and csv
import os
import csv

#CSV file
pypoll_csv = os.path.join("Resources", "election_data.csv")

count_voters = 0
candidates = []

with open(pypoll_csv) as csvfile:
    csvreader = csv.reader(csvfile)
    if csv.Sniffer().has_header:
        next(csvreader)
    for row in csvreader:
        #The total number of votes in the dataset
        count_voters += 1

print("Election Results")
print("-------------------------")
print(f"Total Votes: {'{:,.0f}'.format(count_voters)}")
print("-------------------------")