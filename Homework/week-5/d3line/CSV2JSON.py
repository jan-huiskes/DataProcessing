# Jan Huiskes
# 10740929

import csv
import json
# encoding = utf8, for characters that aren't recognized by python
import sys
reload(sys)
sys.setdefaultencoding('utf8')


# source: https://www.knmi.nl/nederland-nu/klimatologie/maandgegevens
month = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


# convert data to json
jsonfile = open('data.json', 'w')
csvfile = open('data.csv', 'r')

jsonfile.write('{')
jsonfile.write('\n')
jsonfile.write('"data" : [{')
i = 0
for row in csvfile:
    if i == 1 or i == 4:
        word = "maxtemp"
    if i == 2 or i == 5:
        word = "mintemp"
    if i == 3 or i == 6:
        word = "gemtemp"
    row = row.strip().split(',')
    if i > 0:
        jsonfile.write('\n')
        if i == 1:
            jsonfile.write('"' + row[1] + '": [{')
        if i < 4:
            jsonfile.write('"' + word + '": [')
            for j in range(12):
                if j != 11:
                    jsonfile.write('\n')
                    jsonfile.write('{"' + month[j] + '": "' + row[2 + j] + '"},')
                else:
                    jsonfile.write('\n')
                    jsonfile.write('{"' + month[j] + '": "' + row[2 + j] + '"}')
                    jsonfile.write('\n')
                    if word != 'gemtemp':
                        jsonfile.write('],')
                    else:
                        jsonfile.write(']')
        if i == 4:
            jsonfile.write('\n')
            jsonfile.write('}],')
            jsonfile.write('\n')
            jsonfile.write('"' + row[1] + '": [{')
        if i > 3:
            jsonfile.write('"' + word + '": [')
            for j in range(12):
                if j != 11:
                    jsonfile.write('\n')
                    jsonfile.write('{"' + month[j] + '": "' + row[2 + j] + '"},')
                else:
                    jsonfile.write('\n')
                    jsonfile.write('{"' + month[j] + '": "' + row[2 + j] + '"}')
                    jsonfile.write('\n')
                    if word != 'gemtemp':
                        jsonfile.write('],')
                    else:
                        jsonfile.write(']')
        if i == 6:
            jsonfile.write('\n')
            jsonfile.write('}]')
            jsonfile.write('\n')
    i += 1
jsonfile.write('}]')
jsonfile.write('\n')
jsonfile.write('}')
jsonfile.close()
csvfile.close()
