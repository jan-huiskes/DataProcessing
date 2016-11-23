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
month = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
csvfile1 = open('weer.csv', 'r') # source https://cdn.knmi.nl/knmi/map/page/klimatologie/gegevens/maandgegevens/mndgeg_260_rh24.txt and I took only year 2015
f = open('weer2.csv', 'wb')
csvfile2 = csv.writer(f)
reader = csv.reader(csvfile1, skipinitialspace=True,delimiter=',', quoting=csv.QUOTE_NONE)
# write a csv file with europe countries
for row in reader:
    for i in range(12):
        rows = month[i], row[i + 2]
        csvfile2.writerow(rows)
csvfile1.close()
f.close
