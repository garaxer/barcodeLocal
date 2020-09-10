import requests, os


os.environ['NO_PROXY'] = 'localhost'


#test create company
url = "http://localhost:8080/api/companies"

payload = "{\"name\": \"New company\"}"
headers = {
    'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text.encode('utf8'))


#test put request to edit company
url = "http://localhost:8080/api/companies/1"
payload = "{\"name\": \"Surveying QLD Testing\"}"
response = requests.request("PUT", url, headers=headers, data=payload)
#
print(response.text.encode('utf8'))


#test delete company
url = "http://localhost:8080/api/companies/6"
r = requests.delete(url)
print(r.content)