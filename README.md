# AutoComplete

This project is designed to create a scalable largely distribued data platform for autocomplete data.

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
 

  
## Notes
* This solution
## Todo
* Add data validation on input
* If scale is larger put update in a pub/sub que so updates can be more scalabe.