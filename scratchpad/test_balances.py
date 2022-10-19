import requests


local = requests.get("http://localhost:3003/v1/config").json()
remote = requests.get("https://staging.api.ownthedoge.com/v1/config").json()

print(local)
print(remote)

for address in local.keys():
    local_tokens = local[address]["tokenIds"]
    remote_tokens = remote[address]["tokenIds"]
    print(local_tokens)
    print(remote_tokens)

    for token in local_tokens:
        if token not in remote_tokens:
            raise Exception("OOPS")

    for token in remote_tokens:
        if token not in local_tokens:
            raise Exception("OOPS")




