//Function to read params from page URL
function getParameterByName(param){
  return new URLSearchParams(window.location.search).get(param);
}

//Function to Use Params and populate pageX
function buildPage() {
	var varProductName = getParameterByName('name'); 
	var varcategory_name = getParameterByName('category_name'); 
	var vardescription = getParameterByName('description'); 
	var varprice = "$" + getParameterByName('price'); 
	var varshipping = "$" + getParameterByName('shipping'); 
	var varmanufacturer = getParameterByName('manufacturer'); 
	var varmodel = getParameterByName('model'); 
	var varimage = getParameterByName('image'); 
	var varTotal = "$" + (parseInt(getParameterByName('price')) + parseInt(getParameterByName('shipping')));
	
	//Populate text
	document.getElementById("ProductName").innerHTML = varProductName;
	document.getElementById("category_name").innerHTML = varcategory_name;
	document.getElementById("description").innerHTML = vardescription;
	document.getElementById("price").innerHTML = varprice;
	document.getElementById("shipping").innerHTML = varshipping;
	document.getElementById("manufacturer").innerHTML = varmanufacturer;
	document.getElementById("model").innerHTML = varmodel;
	document.getElementById("Total").innerHTML = varTotal;
	
	//Load Image
	var pic = document.getElementById("thisimage");
	pic.src = varimage;
	
	//Set Page title
	document.title = varProductName;
}

