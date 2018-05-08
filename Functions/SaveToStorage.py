#!/usr/bin/python

### Import Modules
import os
import datetime
import json
import mysql.connector
import string
import subprocess
from subprocess import call

targetBucket = 'rgreaves-mysite';
hostname = '35.224.221.233'
username = 'data_reader'
password = 'Set2=$u^qV4#5);*'
database = 'bestbuy'

# Query the DB for each character
def doQuery(connection,searchChar=0) :
    cur = connection.cursor(buffered=True)

    #Run Query
    if searchChar != 0:
       cur.execute("SELECT distinct(name) FROM products WHERE name like '" + searchChar + "%'")
    else:
       cur.execute( "SELECT distinct(name) FROM products WHERE name REGEXP '^[0-9]+'" )
       searchChar = "1"
    #Build Output array
    items = []
    for row in cur:
        items.append({'name':row[0]})
	
    #Only write log if value > 0
    if cur.rowcount > 0 :
        print ("Found " + str(cur.rowcount) + " records for " + searchChar + ", moving to next step")
        CreateJson( items, searchChar )
    else :
        print ("Found " + str(cur.rowcount) + " records for " + searchChar + ", moving to next char")

    cur.close()

# Query To Write to Temp local file
def CreateJson( ArrayOfData, FileName ) :
    FileName+= ".json"
    with open(FileName, 'w') as outfile:
      json.dump(ArrayOfData, outfile)
    
    #Upload file
    upload_files(FileName)
    #Remove file
    print("Removing Old File " + FileName)
    os.remove(FileName)
    
    return FileName

# Upload to Google Cloud Store
def upload_files(fileName):
    print("Uploading file " + fileName + " to gs://"+ targetBucket + "/pre-compiled/")
    p = subprocess.Popen('gsutil -h "Content-Type:application/json" cp '+ fileName +' gs://'+ targetBucket + '/pre-compiled/', shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    retval = p.wait()

# Run Against Alaphabet
print(str(datetime.datetime.now()) + " -- Running batch task to pre-compile to first letter based JSON files")
myConnection = mysql.connector.connect( host=hostname, user=username, passwd=password, db=database )
for val in string.ascii_lowercase:
    doQuery( myConnection, val )
#Once more for none Alphabet characters
doQuery( myConnection )

#Kill Connection
myConnection.close()

