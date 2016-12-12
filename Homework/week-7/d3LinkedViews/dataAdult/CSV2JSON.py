# Jan Huiskes
# 10740929

import csv
import json
# encoding = utf8, for characters that aren't recognized by python
import sys
reload(sys)
sys.setdefaultencoding('utf8')


# convert data to json
jsonfile = open('adult.json', 'w')
csvfile3 = open('countries2.csv', 'r')
fieldnames = ("country", "id", "adult")
reader = csv.DictReader(csvfile3, fieldnames)
jsonfile.write('{')
jsonfile.write('\n')
jsonfile.write('"data" : [')
jsonfile.write('\n')
i = 0
for row in reader:
    json.dump(row, jsonfile, ensure_ascii=False)
    if i != 239: # number of lines - 1
        jsonfile.write(',\n')
    i += 1

jsonfile.write(']')
jsonfile.write('\n')
jsonfile.write('}')
jsonfile.close()
csvfile3.close()
