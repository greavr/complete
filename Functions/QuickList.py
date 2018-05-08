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
def doQuery(connection) :
    cur = connection.cursor(buffered=True)

    #Run Query
    cur.execute("select name from products order by quickclicks desc limit 1000;")
    
    #Build Output array
    items = []
    for row in cur:
        items.append({'name':row[0]})
		
	#Only write log if value > 0
    if cur.rowcount > 0 :
        print ("Found " + str(cur.rowcount) + " records moving to next step")
        CreateJson( items, "quickload" )
    else :
        print ("Found " + str(cur.rowcount) + " records for")
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
    print("Uploading file " + fileName + " to gs://"+ targetBucket + "/")
    p = subprocess.Popen('gsutil -h "Content-Type:application/json" -h "Cache-Control:max-age=0" cp '+ fileName +' gs://'+ targetBucket, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    retval = p.wait()
	
# Run Query
print(str(datetime.datetime.now()) + " -- Running batch task to get top 1000 records for default auto complete")
myConnection = mysql.connector.connect( host=hostname, user=username, passwd=password, db=database )
doQuery( myConnection)


#Kill Connection
myConnection.close()

