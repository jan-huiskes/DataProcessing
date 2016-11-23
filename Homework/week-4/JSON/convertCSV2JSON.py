# Jan Huiskes
# 10740929

import csv
import json
# encoding = utf8, for characters that aren't recognized by python
import sys
reload(sys)
sys.setdefaultencoding('utf8')


# convert data to json
jsonfile = open('data.json', 'w')
csvfile3 = open('weer2.csv', 'r')
fieldnames = ("month", "mm")
reader = csv.DictReader(csvfile3, fieldnames)
jsonfile.write('{')
jsonfile.write('\n')
jsonfile.write('"points" : [')
jsonfile.write('\n')

for row in reader:
    json.dump(row, jsonfile, ensure_ascii=False)
    jsonfile.write(',\n')

jsonfile.write(']')
jsonfile.write('\n')
jsonfile.write('}')
jsonfile.close()
csvfile3.close()
