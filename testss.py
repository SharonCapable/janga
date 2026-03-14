import json, base64
with open('path/to/service-account.json') as f:
    d = json.load(f)
print(base64.b64encode(d['private_key'].encode()).decode())