# AutoComplete

This project is designed to create a scalable largely distribued data platform for autocomplete data. <br />
The goal behind this approach was for the autocomplete portion of the page (which will not be all the page) to be a scalable subset of a site. By placing files in Cloud Storage you are able to have the files accessibly reliably globally repeatably. <br />
It was also assumed that controlling a product catalog of this size is typically done from a Relational Database, although the ideal solution would be a NoSQL solution, so that locking and other update related tasks do not bottle neck and scale easier.

## Key Components
* Cloud SQL
  * MySQL 2nd Gen 5.7
  * Add Public IP
  * 1 vCPU & 3.75GB of RAM & 10GB SSD
* Compute Instance
  * Ubuntu latest LTS
  * n1-standard-1 (1 vCPU, 3.75 GB memory)
  * 10GB Permement SSD
* Cloud Function
  * HTTP Trigger
  * 256 MB
  * 60 Seconds timeout
* Cloud Datastore
  * One bucket
  * Public access all files

## Working Demo
### (Click Here)[https://storage.googleapis.com/rgreaves-mysite/index.html]  

## Basic Overview
Products are stored in a Cloud SQL. Sample site is served out of Cloud Datastore, products are loaded via javascript calling JSON files. A Compute instance does compiling twice a day for all products (CRON Job controlled) and a list of popular products updated hourly. A Cloud Function is used to record which option is selected from the drop down menu and updates a count click total in the Cloud SQL.

## Setup Guide
1. Create Compute Instance
   1. Update the IAM role for the default Computer instance to include permissions for *Cloud Datastore Owner*
   2. Connect to the instance via SSH
   3. Run the following commands to install dependancies: <br />
     `sudo apt update`<br />
	 `apt install python-pip -y && pip install mysql-connector-python`
2. Create Cloud SQL instance using the above specifications
   1. Sample data (in SQL format) can be found in the (/RawData/)[/RawData/] folder. The **Products** list is in a compiled zip folder as it is too big to upload raw
   2. Add the public IP into the *Authorisations* tab using a **/32** CIDR
   3. Create a master DB
   4. Clone the project and follow the setup guide found (/scripts/)[/scripts/]
3. Create a Cloud Function
   1. Copy the files from the (/functions/)[/functions/] into the new project
   2. Follow the setup guide in (/functions/)[/functions/]
4. Copy all the files from the (/Site/)[/Site/] folder to the root of the newly created bucket
   1. Set all the files to public
   2. Configure a CORS policy for the bucket, run these commands on your computer instance:
      `echo '[{"origin": ["*"],"responseHeader": ["Content-Type"],"method": ["GET", "HEAD"],"maxAgeSeconds": 3600}]' > cors-config.json` <br />
	  `gsutil cors set cors-config.json gs://<YOURBUCKET>`
 
  
## Notes
* This solution could be improved upon, using a pub/sub queue for updates to clicks
* Alternative approach would be to store the data in Google Spanner and then have web heads read the data

## Todo
* Switch out computer instance to use MySQL Data Port Proxy per the guide here: (https://cloud.google.com/sql/docs/mysql/connect-compute-engine)
* Put the DB parameters in as environmental variables in (index.js)[/functions/index.js]
* Make the site prettier
* Security is super open right now. This **NEEDS** to be locked down heavily.
* Add something to demonstrate back end process
