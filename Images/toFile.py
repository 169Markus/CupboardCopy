import urllib.request
text_file = open("files.txt", "r")
lines = text_file.readlines()
opener = urllib.request.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0')]
urllib.request.install_opener(opener)
for line in lines:
    urllib.request.urlretrieve(line[10:],line[:9] + ".jpg")
