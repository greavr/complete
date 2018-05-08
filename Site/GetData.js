//Build the autocomplete function
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  var replaced = false;
  var Requested = false;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
		  //Check if text is too long, if so truncate
		  if (arr[i].length > 60) {
			b.innerHTML += arr[i].substr(val.length, 	57) + "...";
		  }  else {
			  b.innerHTML += arr[i].substr(val.length, arr[i].length);
		  }
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
			  //Item Selected Make Call To Update ClickCount
			  RecordClick();
          });
          a.appendChild(b);
		  a.appendChild(document.createElement("BR"));
        }
		
		// Rebuild Array for next time
		if (val.length == 3) {
			//Load new file
			if (!Requested) {
				ReloadAutoSearch(val);
				Requested = true;
			}
			replaced = true;
		} else if (replaced && (val.length < 3)){
			//Default back to top 1000 products
			replaced = false;
			autocomplete(document.getElementById("theInput"), quickProducts);
		}
	}
	  
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

//Function To load JSON to array
function quickLoad(whichFile) {
	
	//Create a Query to load JSON File
	request = new XMLHttpRequest();
	request.open('GET', whichFile, true);
	//Results array
	var arr = [];

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400){
		// Success!
		var data = JSON.parse(request.responseText);

		//Convert to array
		for(var x in data){
		  arr.push(data[x].name);
		}
		console.log(data);
	  } else {
		// Die quietly for now
		console.log ("Bad Status" + request.status);
	  }
	};

	request.onerror = function() {
	  // Die quietyl for now
	  console.log ("Request Error");
	};

	request.send();
	
	//Return Value
	return (arr);
}

//Function to dynamically load the relative product fileCreatedDate
function ReloadAutoSearch(InputVar) {
		//This function rebuilds the auto-complete list based on first character selected
		
		//If the user has less than 3 values selected then re-use quickProducts
		if (InputVar.Length < 3) {
			autocomplete(document.getElementById("theInput"), quickProducts);
		} else {
			// Load the values for the alphabet letter choosen
			var AllProducts = quickLoad(releventProducts(InputVar));
			autocomplete(document.getElementById("theInput"), AllProducts);
		}
}

//Validate input
function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

//Work out which file to load
function releventProducts(InputCharacters) {
		// This function will return the full product listing by letter selected
		InputCharacters = InputCharacters.toLowerCase();
		var LoadUrl = "https://storage.googleapis.com/rgreaves-mysite/quickload.json";;
		
		//Will Logic Check for characters and go from there:
		if (isNumber (InputCharacters)) {
			LoadUrl = "https://storage.googleapis.com/rgreaves-mysite/pre-compiled/1.json";
		} else if (!!InputCharacters) {
			LoadUrl = "https://storage.googleapis.com/rgreaves-mysite/pre-compiled/" + InputCharacters.substr(0,1) + ".json";
		} 
		
		//Return Value
		return LoadUrl;
}

//Call Cloud Function To Update Record
function RecordClick() {
	var SelectedValue = document.getElementById('theInput').value;
	var jsonedValue = JSON.stringify({message: SelectedValue});
	console.log(jsonedValue);
	
	//Make a call to log the value
	var http = new XMLHttpRequest();
	var url = "<ADD CLOUD FUNCTION URL HERE>";
	http.onreadystatechange = callbackFunction(http);
	http.open('POST', url, true);
	http.setRequestHeader('Content-Type', 'application/json');
	http.setRequestHeader("Access-Control-Allow-Origin", "*");
    http.setRequestHeader("Access-Control-Allow-Credentials", "true");
    http.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    http.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	http.onreadystatechange = callbackFunction(http);
	http.send(jsonedValue);
	
	console.log(http.status);
	
}

function callbackFunction(xmlhttp) 
{
    //alert(xmlhttp.responseXML);
}