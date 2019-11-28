with open("irish.txt") as source:
    read = source.read().split()

for line in read:
    print(line)
