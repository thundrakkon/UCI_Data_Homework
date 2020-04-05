#import os and csv
import os
import csv

#CSV file
pypoll_csv = os.path.join("Resources", "election_data.csv")

with open(pypoll_csv) as csvfile:
    csvreader = csv.reader(csvfile)
    #Skip the header row
    header_skip = next(csvreader)
    count_voters = 0
    candidates = []
    
    for row in csvreader:
        #The total number of votes in the dataset
        count_voters += 1

        #A complete list of candidates who received votes
        candidates.append(row[2])
        my_set = set(candidates)
        candidate_list = list(my_set)

print("Election Results")
print("-------------------------")
print(f"Total Votes: {'{:,.0f}'.format(count_voters)}")
print("-------------------------")

#Outputing results to text file
f = open("PyPoll-Results.txt", "a")
f.truncate(0)
print("Election Results", file=f)
print("-------------------------", file=f)
print(f"Total Votes: {'{:,.0f}'.format(count_voters)}", file=f)
print("-------------------------", file=f)

#The total number of votes each candidate won
candidate_count = len(candidate_list)
voter_can = []

for x in range(0, candidate_count):
    candidate_vote = candidates.count(candidate_list[x])
    #The percentage of votes each candidate won
    print(f"{candidate_list[x]} : {'{:.3%}'.format(candidate_vote/count_voters)} ({candidate_vote})")
    print(f"{candidate_list[x]} : {'{:.3%}'.format(candidate_vote/count_voters)} ({candidate_vote})", file=f)

    #The winner of the election based on popular vote.
    voter_can.append(candidate_vote)
    top_vote = max(voter_can)

    if candidate_vote == top_vote:
        winner = candidate_list[x]

print("-------------------------")
print(f"Winner: {winner}")
print("-------------------------")

print("-------------------------", file=f)
print(f"Winner: {winner}", file=f)
print("-------------------------", file=f)