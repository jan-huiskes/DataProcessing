# Jan Huiskes
# 10740929
# converst countries to countries2

import csv
import json
# encoding = utf8, for characters that aren't recognized by python
import sys
reload(sys)
sys.setdefaultencoding('utf8')

import os

csvfile1 = open('countries.csv', 'r')
jsonfile = open('data.json', 'w')
f = open('countries2.csv', 'wb')
csvfile2 = csv.writer(f)

# write a csv file with europe countries
for row in csvfile1:
    row = row.replace('"', '').split(';')
    if row[4] == 'Europe':
        row = str(row[0]), str(row[6])
        csvfile2.writerow(row)
csvfile1.close()
f.close
