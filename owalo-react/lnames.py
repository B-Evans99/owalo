import json
import sys

try:
    fname = sys.argv[1]

    with open(fname) as source:
        read = source.read().upper().split()

    totals = {}

    for line in read:
        if(" " not in totals):
            totals[" "] = {}
        if(line[0] not in totals[" "]):
            totals[" "][line[0]] = 0
        totals[" "][line[0]] += 1
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

    f = open(fname[:-4]+"Flavour.json", "w", encoding='utf-8', )
    f.write(json.dumps(totals))

except Exception as e:
    print("Please provide a file as an argument.")
    print(e)
