# Scripts

These files are designed to be ran on a batch basis from one node. This does not need to scale regardless of the amount of users.
*Consideration should be given* if the product catalog is becoming larger in regards to a specific first letter.

## What it does
There is two scripts:
- [SaveToStorage.py](SaveToStorage.py)
  - This Script connects to the primary DB and does a full pull of distinct products based on *name*. It then compiles to grouped JSON files based on the letters of the alphabet. The script uploads them to a Google Cloud Storage bucket using the cli.
- [QuickList.py](QuickList.py)
  - This script connects to the primary DB and does a pull of the top 1000 distinct products based on the number value in the *quickclicks* column, desc.

## Setup Guide
1. Clone project to a folder on the local server `git clone https://github.com/greavr/AutoComplete.git`
2. Install the required dependencies `sudo apt install python-pip -y && pip install mysql-connector-python`
3. Set the permissions `chmod +x AutoComplete\Functions\*`
4. Create two cron tasks
  1. One for the twice daily task to rebuild product list : `echo "00 */12 * * * ~/AutoComplete/Functions/SaveToStorage.py" >> mycron && crontab mycron && rm mycron`
  2. Second one for the hourly update task of the most popular click `echo "00 * * * * ~/AutoComplete/Functions/QuickList.py" >> mycron && crontab mycron && rm mycron`
5. You will need to update the parameters in both files for MySQL to use, following commands will do it:
  1. `sed -i -e 's/<YOUR BUCKET>/rgreaves-mysite/g' *.py`
  2. `sed -i -e 's/<DB IP>/1.2.3.4/g' *.py`
  3. `sed -i -e 's/<DB USER>/myuser/g' *.py`
  4. `sed -i -e 's/<DB PWD>/supersecret/g' *.py`
  5. `sed -i -e 's/<DB>/bestbuy/g' *.py`
  
## Notes
* Distinct is used due to the way that BestBuy lists the same product multiple times in their product catalog under different categories