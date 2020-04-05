#import os and csv
import os
import csv

#CSV file
pybank_csv = os.path.join("Resources", "budget_data.csv")

with open(pybank_csv) as csvfile:
    csvreader = csv.reader(csvfile)
    header_skip = next(csvreader)
    count_months = 0
    sum_amt = 0

    for row in csvreader:
        #The total number of months included in the dataset
        count_months += 1
        #The net total amount of "Profit/Losses" over the entire period
        add_amt = float(row[1])
        sum_amt += add_amt

print("Financial Analysis")
print("----------------------------")
print(f"Total Months: {count_months}")
print(f"Total Profit/Losses: {'${:,.0f}'.format(sum_amt)}")

#Outputing results to text file
f = open("PyBank-Results.txt", "a")
f.truncate(0)
print("Financial Analysis", file=f)
print("----------------------------", file=f)
print(f"Total Months: {count_months}", file=f)
print(f"Total Profit/Losses: {'${:,.0f}'.format(sum_amt)}", file=f)

with open(pybank_csv) as csvfile:
    csvreader = csv.reader(csvfile)
    header_skip = next(csvreader)
    firstrow = next(csvreader)
    pre_num = float(firstrow[1])
    chg_diff = 0    
    chg_amt = 0
    chg_list = []

    for row in csvreader:
        #The average of the changes in "Profit/Losses" over the entire period
        chg_row = float(row[1])
        chg_diff = chg_row - pre_num
        chg_amt += chg_diff
        chg_list.append(chg_diff)
        pre_num = chg_row

        #The greatest increase in profits (date and amount) over the entire period
        profit_max = max(chg_list)
        #The greatest decrease in losses (date and amount) over the entire period
        loss_min = min(chg_list)

        if chg_diff == profit_max:
            date_max = row[0]
        elif chg_diff == loss_min:
            date_min = row[0]

print(f"Average Change: {'${:,.2f}'.format(chg_amt/(int(count_months) -1))}")
print(f"Greatest Increase in Profits: {date_max} ({'${:,.0f}'.format(profit_max)})")
print(f"Greatest Decrease in Profits: {date_min} ({'${:,.0f}'.format(loss_min)})")

#Output text file
print(f"Average Change: {'${:,.2f}'.format(chg_amt/(int(count_months) -1))}", file=f)
print(f"Greatest Increase in Profits: {date_max} ({'${:,.0f}'.format(profit_max)})", file=f)
print(f"Greatest Decrease in Profits: {date_min} ({'${:,.0f}'.format(loss_min)})", file=f)
f.close()