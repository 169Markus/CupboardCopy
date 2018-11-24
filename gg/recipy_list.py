#!/usr/bin/python3

import sys
import requests
from bs4 import BeautifulSoup
import re

url = sys.argv[1]

useragent = "Mozilla/5.0 (X11; Linux x86_64; rv:63.0) Gecko/20100101 Firefox/63.0"

headers = {
    "user-agent": useragent
}

r = requests.get(url, headers=headers)

soup = BeautifulSoup(r.text, 'html.parser')

recipes = set()

for atag in soup.find_all('a'):
    link = atag.get('href')
    if re.match("/recipes/[^/]*$", link):
        if link != "/recipes/recipe-binder.html":
            recipes.add(link)

for i in recipes:
    print("https://realfood.tesco.com" + i)
