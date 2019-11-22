import sys

inFileName = sys.argv[1]
inFile = open(inFileName)
lines = [line.split(",") for line in inFile.read().split("\n")]
inFile.close()

#store data in column major order
table = {}
for line in lines:
    if not table.has_key(int(line[2])):
        table[int(line[2])]={}
    try:
        table[int(line[2])][int(line[3])]=map(int,line[4:])
    except ValueError:
        table[int(line[2])][int(line[3])]=map(float,line[4:])

outFileName = inFileName+".js"
outFile = open(outFileName, "w")

rows=len(table)
cols=len(table[table.keys()[0]])

out=[]
for i in range(rows):
    out.append(map(table[i].__getitem__,range(cols)))
outFile.write(str(out))
        
    
