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
csvfile3 = open('countries2.csv', 'r')


jsonfile.write('{"data" : {')
jsonfile.write('\n')
i = 0
for row in csvfile3:
    row = row.replace('"', '').split(',')
    jsonfile.write('"' + row[0] + '": {')
    if int(row[1]) >= 10**9:
        jsonfile.write('"fillKey": "high",')
        jsonfile.write('\n')
        jsonfile.write('"population": ' + str(row[1]) + '}')
    if int(row[1]) >= 10**8 and int(row[1]) < 10**9:
            jsonfile.write('"fillKey": "mid5",')
            jsonfile.write('\n')
            jsonfile.write('"population": ' + row[1] + '}')
    if int(row[1]) >= 6*10**7  and int(row[1]) < 10**8:
            jsonfile.write('"fillKey": "mid4",')
            jsonfile.write('\n')
            jsonfile.write('"population": ' + row[1] + '}')
    if int(row[1]) >= 3*10**7 and int(row[1]) < 6*10**7:
            jsonfile.write('"fillKey": "mid3",')
            jsonfile.write('\n')
            jsonfile.write('"population": ' + row[1] + '}')
    if int(row[1]) >= 10**7 and int(row[1]) < 3*10**7:
            jsonfile.write('"fillKey": "mid2",')
            jsonfile.write('\n')
            jsonfile.write('"population": ' + row[1] + '}')
    if int(row[1]) >= 5*10**6 and int(row[1]) < 10**7:
            jsonfile.write('"fillKey": "mid1",')
            jsonfile.write('\n')
            jsonfile.write('"population": ' + row[1] + '}')
    if int(row[1]) < 5*10**6:
        jsonfile.write('"fillKey": "low",')
        jsonfile.write('\n')
        jsonfile.write('"population": ' + row[1] + '}')
    if i != 261:
        jsonfile.write(',\n')
    else:
        jsonfile.write('\n')
    i += 1
jsonfile.write('\n')
jsonfile.write('}}')
jsonfile.close()
csvfile3.close()
