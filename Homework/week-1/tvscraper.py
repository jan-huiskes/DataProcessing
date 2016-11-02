#!/usr/bin/env python
# Name: Jan Huiskes
# Student number: 10740929
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM, abs

# for extracting only the number in runtime
import re

# encoding = utf8, for characters that aren't recognized by python 
import sys
reload(sys)
sys.setdefaultencoding('utf8')


TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    # list with lists for each serie
    elements_list = []

    # loop each serie
    for element in dom.body.by_class("lister-item-content"):
        # eacht time a new list for serie
        list1 = []
        # first link is the title
        for title in element.get_elements_by_tagname("a")[0]:
            list1.append(title)
        # first strong tag is rating
        for rating in element.get_elements_by_tagname("strong")[0]:
            list1.append(rating)
        # content of class genre without the whitespace
        for genre in element.get_elements_by_classname("genre"):
            list1.append(genre.content.strip())
        # search for the string Stars in classes
        for act in element.get_elements_by_classname(""):
            if 'Stars' in act:
                # string for names
                names = ""
                # add each name to string (with comma and whitespace)
                for name in act.get_elements_by_tagname("a"):
                    name = name.content
                    names += name + ', '
                # avoid last comma and whitespace
                list1.append(names[:-2])
        # runtime only numbers by findall. This will return a list, where runtime is the only item
        for runtime in element.get_elements_by_classname("runtime"):
            runtime = runtime.content
            runtime = re.findall('\d+', runtime)
            runtime = runtime[0]
            list1.append(runtime)
        # append the list to the list of elements
        elements_list.append(list1)

    return elements_list


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    # loop for each tvserie
    for i in range(len(tvseries)):
        writer.writerow(tvseries[i])


if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
