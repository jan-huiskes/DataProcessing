# Jan Huiskes
# 10740929
# converst countries to countries2
# source: http://data.worldbank.org/indicator/SP.POP.TOTL
import csv
import json
# encoding = utf8, for characters that aren't recognized by python
import sys
reload(sys)
sys.setdefaultencoding('utf8')

import os

csvfile1 = open('countries.csv', 'r')
f = open('countries2.csv', 'wb')
csvfile2 = csv.writer(f)

# write a csv file with europe countries
for row in csvfile1:
    row = row.replace('"', '').split(',')
    if len(row[1]) == 3 and str(row[59]) != '' :
        row = str(row[1]), str(round(float(row[59]), 1))
        csvfile2.writerow(row)
    elif len(row[2]) == 3 and str(row[59]) != '' :
        row = str(row[2]), str(round(float(row[59]), 1))
        csvfile2.writerow(row)
csvfile1.close()
f.close
