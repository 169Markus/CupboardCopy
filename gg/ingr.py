#!/usr/bin/python3

import sys
import requests
import re
import json
import time

useragent = "Mozilla/5.0 (X11; Linux x86_64; rv:63.0) Gecko/20100101 Firefox/63.0"

headers = {
    "user-agent": useragent,
    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJpYXQiOjE1NDMwNjY3MjIsImQiOnsidXNlcklkIjoiZjE3MzNlODYtMjNhYS00NWU3LWFkMGEtYzgzNTBkNmU2YmNkIiwiYXV0aGVudGljYXRlZCI6ZmFsc2V9fQ.7Qbt4C5EMRNzVS1oJwJuLT-uGK43kDBKx8V_pLbZxnk",
}

url = "https://list.whisk.com/api/storeitemlist/stateless"

output = []

for tesco_url in sys.stdin.readlines():
    tesco_url = tesco_url[:-1]

    params = {
        "inventory": "GB:Tesco",
        "recipeUrl": tesco_url,
    }
    r = requests.get(url, headers=headers, params=params)
    js = r.json()

    items = []
    for i in js["items"]:
        item = i["siDecision"]["item"]
        items.append({
            "text": i["key"]["text"],
            "sku": item["sku"],
            "name": item["name"],
        })

    recipe = js["recipes"][0]["data"]
    obj = {
        "url": tesco_url,
        "name": recipe["name"],
        "image": recipe["image"]["url"],
        "ingredients": items,
    }
    output.append(obj)

    sys.stderr.write(tesco_url + "\n")
    time.sleep(0.5)

print(json.dumps(output,indent=2))
