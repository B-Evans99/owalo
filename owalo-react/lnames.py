import json

with open("irish.txt") as source:
    read = source.read().upper().split()

totals = {}

for line in read:
    for i in range(len(line)-2):
        if(line[i] not in totals):
            totals[line[i]] = {}
        if(line[i+1] not in totals[line[i]]):
            totals[line[i]][line[i+1]] = 0
        totals[line[i]][line[i+1]] += 1
    if(line[len(line)-1] not in totals):
        totals[line[len(line)-1]] = {}
    if(" " not in totals[line[len(line)-1]]):
        totals[line[len(line)-1]][" "] = 0
    totals[line[len(line)-1]][" "] += 1

for k in totals:
    count = 0
    for sk in totals[k]:
        count += totals[k][sk]
    for sk in totals[k]:
        totals[k][sk] = totals[k][sk]/count

# print(totals)
print(json.dumps(totals))
