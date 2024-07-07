let phone = false;
const searchButton = document.getElementById('search_enter')

function hideSearchButton(){
	"use strict";
	if(searchButton){
		searchButton.style.display = "none";
	}
	phone = false;
}
function showSearchButton(){
	"use strict";
	if(searchButton){
		searchButton.style.display = "block";
	}
	phone = true;
}
// If window is < 500 px show the bar
if (window.innerWidth < 500){
	showSearchButton();
}
// Listen for resize
window.addEventListener("resize", function(){
	if (window.innerWidth > 500){
		hideSearchButton();
	}else{
		showSearchButton();
	}
});

// Activate search bar once page loaded
const search_text = "Search by name, UniProt accession, or function."
const search_box = document.getElementById('myInput');
// Change search placeholder
if (search_box){
	search_box.setAttribute("placeholder", search_text);
	// Remove disabled tag from search box
	search_box.removeAttribute("disabled");
}


function removeRegEx(input) {
	return input.replaceAll(" ", "")
		.replaceAll("_", "")
		.replaceAll("-", "")
		.replaceAll(".", "")
		.replaceAll("(", "")
		.replaceAll(")", "");
}

function searchFunction(){
	// Declare variables
	var input, filter, ul, li, a, i, txtValue;
	input = document.getElementById('myInput');
	filter = removeRegEx(input.value.toUpperCase());
	ul = document.getElementsByClassName('main')[0];
	li = ul.getElementsByClassName('item');

	// Loop through all list items, and hide those who don't match the search query
	for (i = 0; i < li.length; i++) {
		a = li[i];
		txtValue = a.textContent || a.innerText;
		if (removeRegEx(txtValue).toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		}
	}
}

function myFunction(event) {
	// Triggered on key up of the search bar
	
	if (phone === false || event.key === "Enter"){
		searchFunction();
	}

}

function clearheads() {
	var heads = document.getElementsByClassName("head");
	for (var i = 0; i < heads.length; i++) {
		heads[i].innerText = heads[i].innerText.replace(" ^", "");
		heads[i].innerText = heads[i].innerText.replace(" v", "");
	}
}

function actualSort(col) {
	var $divs = $(".search a");
	var column = ".col" + col.toString();
	var head = "head col" + col.toString();
	head = document.getElementsByClassName(head)[0];
	var li = document.getElementsByClassName("head");
	for (var i = 0; i < li.length; i++) {
		li[i].classList.remove("selected");
	}
	head.classList.add("selected");
	var numerical = true;
	//if(["7"].includes(col.toString())){
	//	numerical = false;
	//}
	if (head.innerHTML.includes("^")) {
		clearheads();
		head.innerHTML += " v";
		var alphabeticallyOrderedDivs = $divs.sort(function (a, b) {
			return $(b).find(column).text().replace("nan", 0).localeCompare($(a).find(column).text()
			.replace("nan", 0), undefined, { numeric: numerical });
		});
	} else if (head.innerHTML.includes("v")) {
		clearheads();
		var alphabeticallyOrderedDivs = $divs.sort(function (a, b) {
			return $(a).find(column).text().replace("nan", 100000000000).localeCompare($(b).find(column)
			.text().replace("nan", 100000000000), undefined, { numeric: numerical });
		});
		head.innerHTML += " ^";
	} else {
		clearheads();
		var alphabeticallyOrderedDivs = $divs.sort(function (a, b) {
			return $(b).find(column).text().replace("nan", 0).localeCompare($(a).find(column)
			.text().replace("nan", 0), undefined, { numeric: numerical });
		});
		head.innerHTML += " v";
	}
	$(".search").html(alphabeticallyOrderedDivs);
	document.getElementsByClassName('search')[0].style.display = "";
	document.getElementsByClassName('loading')[0].style.display = "none";

	//loadMessage.style.display = "none";
}

function sortA(col) {
	var loadMessage = document.getElementsByClassName('loading')[0];
	loadMessage.style.display = "block";
	var search = document.getElementsByClassName('search')[0];
	search.style.display = "none";
	setTimeout(function () { actualSort(col); }, 0);
}


/*function checkWindowSize() {
	let longs = document.getElementsByClassName("long").length;
	if (window.innerWidth < 600) {
		for (let i = 0; i < longs; i++) {
			document.getElementsByClassName("long")[i].classList.add("longhidden");
		}
	}else {
		for (let i = 0; i < longs; i++) {
		document.getElementsByClassName("long")[i].classList.remove("longhidden");
		};
	};
	let longs2 = document.getElementById("long2").length;
	if(window.innerWidth < 1000){
		for (let i = 0; i < longs2; i++){
			document.getElementsByClassName("long2")[i].classList.add("long2hidden");
		}
	}else{
		for (let i = 0; i < longs2; i++){
			document.getElementsByClassName("long2")[i].classList.remove("long2hidden");
		}
	}
}
checkWindowSize();*/

//window.addEventListener("resize", (event) => {
//	checkWindowSize();
//});

//var toggled = false;


var structurePage = false;
try {
	var detailsList = []
	let details = ""
	for (let structure of document.getElementsByClassName("struc")){
		details = structure.innerText;
		details = details.split(" ");
		detailsList.push(details)
		structurePage = true;
	}
} catch {

}



let viewers = {};
function loadStructure(structureIndex){
	let structures = document.querySelectorAll('.viewer');
	let viewer = false;
	i = structureIndex;
	document.addEventListener('DOMContentLoaded', function() {
		let element = structures[i];
		let config = { backgroundColor: 'white' };
		console.log(element);
		viewers[i] = $3Dmol.createViewer(element, config);
		viewer = viewers[i];
		console.log("downloading structure:", "pdb:" + detailsList[i][0])
		$3Dmol.download("pdb:" + detailsList[i][0], viewers[i], {}, async function () {
				
			//	Enable ability to click a residue to label it with details
			viewer.setClickable({}, true, function (target, viewer, event, container) {
				if (target.label) {
					viewers[i].removeLabel(target.label);
					delete target.label;
				} else {
					viewers[i].addLabel(target.resn + target.resi + " - " + target.atom,
					{ position: target, backgroundColor: 'gray', backgroundOpacity: 0.8 });
					/* viewer.center({target}, 1000); // Wanted to be able to center it on a clickable one, 
					but couldn't work it */
					//	Would be good to turn cysteines that come up in the screen into links that take you
					//	to their page
				}
			});
			//	Set cartoon structures for the peptide chains
			console.log("Setting cartoon structure")
			viewers[i].setStyle({}, { cartoon: { colorscheme: 'grayCarbon' } });
			viewers[i].setStyle({ chain: detailsList[i][3] }, { cartoon: { colorscheme: 'blueCarbon' } });
			viewers[i].setStyle({ chain: detailsList[i][1] }, { cartoon: { colorscheme: 'greenCarbon' } });
			/*viewer.setStyle({chain:'B',invert:true},{cartoon:{}});*/
			
			// Make metal ions visible
			var metalColors = {
				"ZN": { color: "lightBlue" },
				"FE": { color: "red" },
				"MG": { color: "lightGreen" },
				"CA": { color: "purple" },
				"MN": { color: "pink" },
				"CU": { color: "orange" },
				"CO": { color: "black" },
				"NI": { color: "yellow" },
				"CD": { color: "brown" },
				"NA": { color: "cyan" },
				"K": { color: "magenta" }
			};
			for (var metal in metalColors) {
				viewers[i].addStyle({ resn: metal }, { sphere: metalColors[metal] });
			}
			//	Make ligands visible
			viewers[i].addStyle({ hetflag: true }, { stick: { radius: 0.3 } });

			//	Turn cysteines into gray sticks
			viewers[i].addStyle({ resn: "CYS" }, { stick: { color: "gray", thickness: 1.0 } });
			//	Turn relevent cysteines into red sticks
			viewers[i].addStyle({ chain: detailsList[i][1], resn: "CYS" }, { stick: { colorscheme: "brownCarbon", thickness: 1.0 } });
			viewers[i].addStyle({ chain: detailsList[i][3], resn: "CYS" }, { stick: { colorscheme: "brownCarbon", thickness: 1.0 } });

			//	Label the relevent cysteines
			viewers[i].addLabel("Cys " + detailsList[i][4], { backgroundColor: 'darkblue', backgroundOpacity: 0.8, alignment: "bottomRight" }, { chain: detailsList[i][3], resi: detailsList[i][4] });
			viewers[i].addLabel("Cys " + detailsList[i][2], { backgroundColor: 'darkgreen', backgroundOpacity: 0.8, alignment: "bottomRight" }, { chain: detailsList[i][1], resi: detailsList[i][2] });
			//viewers[i].center({ chain: detailsList[i][1], resi: detailsList[i][2] });
			//	Add a surface
			//viewer.addSurface({}, { opacity: 0.5, color: "gray" }); 
			//	Removed since very computer intensive, but would be good to add a button that does it  

			//	Find where the camera should be centered, between the relevent thiols
			let one = await viewers[i].selectedAtoms({ chain: detailsList[i][1], resi: detailsList[i][2], atom: ["SG"] });
			let two = await viewers[i].selectedAtoms({ chain: detailsList[i][3], resi: detailsList[i][4], atom: ["SG"] });
			one = [one[0].x, one[0].y, one[0].z];
			two = [two[0].x, two[0].y, two[0].z];
			var central = [(one[0] + two[0]) / 2, (one[1] + two[1]) / 2, (one[2] + two[2]) / 2];

			//	Add a dotted line between thiols
			console.log("Adding dots")
			viewers[i].addCylinder({
				start: { x: one[0], y: one[1], z: one[2] },
				end: { x: two[0], y: two[1], z: two[2] },
				radius: 0.1,
				dashed: true,
				fromCap: 1,
				toCap: 1
			});

			//	Center the camera between the two thiols by creating and centering on an invisibile atom
			var m = viewers[i].addModel();
			m.addAtoms([{ elem: 'DISULPH', x: central[0], y: central[1], z: central[2] }]);
			//m.setStyle({},{sphere:{}});
			viewers[i].center({ elem: ["DISULPH"] });
			
			//	Change the zoom and render
			viewers[i].zoom(4);
			viewers[i].render();
			console.log("rendered")

		});
	});
};

let loaded = {};  // Lower the value, older the structure
let structureDate = 0;
var currentStructureNum = 0;

function tabClick(tabNumber){
	
	//	Set the current structure that is loaded
	currentStructureNum = tabNumber;
	
	//	Check whether a structure has loaded, otherwise load it
	console.log("checking whether structure is loaded")
	if (Object.keys(loaded).includes(String(tabNumber)) == false){
		console.log("loading structure")
		loadStructure(tabNumber);
		loaded[tabNumber] = structureDate;
		structureDate++;

		//	If there are more than 4 structures delete the oldest from loaded so it will be reloaded
		if (Object.keys(loaded).length > 4){
			let earliestBirthday = Math.min.apply(Math, Object.values(loaded));
			for (let loadedStruc in loaded){
				if (loaded[loadedStruc] == earliestBirthday){
					delete loaded[loadedStruc];
				}
			}
		}
	}

	// Hide/show/highlight intended tab/tab links
	for (let tab of document.getElementsByClassName("tab")){
		tab.classList.add("hidden"); // Hide all tabs
	}
	for (let current of document.getElementsByClassName("current")){
		current.classList.remove("current"); // Remove .current
	}
	document.getElementsByClassName("tab")[tabNumber].classList.remove("hidden"); //Show intended tab
	document.getElementsByClassName("tablink")[tabNumber].classList.add("current"); // Add .current to clicked tab link 
};



function remove(el){
	var element = el;
	element.remove();
}

document.querySelectorAll('.tablink').forEach((element, index) => {
    element.addEventListener('click', function() {
        tabClick(index);
    });
});

	
if (structurePage == true) {
	if(window.location.hash){
		let hash = window.location.hash.substring(1)
		tabClick(hash);
	}else{
		tabClick(0);
	}
};

//	Allow region cards to be clicked to reveal their position in the structure
document.querySelectorAll(".region_info").forEach(regionInfo => {
    regionInfo.addEventListener("click", function(e) {
		
		//	Toggle .current_region on the region card
		this.parentNode.classList.toggle("current");
		
		//	Reset the styles
		//	Set cartoon structures for the peptide chains
		viewers[currentStructureNum].setStyle({}, { cartoon: { colorscheme: 'grayCarbon' } });
		viewers[currentStructureNum].setStyle({ chain: detailsList[currentStructureNum][3] }, { cartoon: { colorscheme: 'blueCarbon' } });
		viewers[currentStructureNum].setStyle({ chain: detailsList[currentStructureNum][1] }, { cartoon: { colorscheme: 'greenCarbon' } });
		//	Turn cysteines into gray sticks
		viewers[currentStructureNum].addStyle({ resn: "CYS" }, { stick: { color: "gray", thickness: 1.0 } });
		//	Turn relevent cysteines into red sticks
		viewers[currentStructureNum].addStyle({ chain: detailsList[currentStructureNum][1], resn: "CYS" }, { stick: { colorscheme: "brownCarbon", thickness: 1.0 } });
		viewers[currentStructureNum].addStyle({ chain: detailsList[currentStructureNum][3], resn: "CYS" }, { stick: { colorscheme: "brownCarbon", thickness: 1.0 } });

		//	Iterate through every region card that has .current and .region
		for (let current of document.querySelectorAll(".region.current")){
			
			//	Read the entire region as an array of words
			let regionText = []
			for (let info of current.querySelectorAll(".region_info")){
				regionText.push(info.innerHTML);
			};
					
			//	Get the locations of the positions
			//	If indexOf() finds nothing, then it returns -1, this is useful in the next section, because the these will be saved as 0.
			let beginPos = regionText.indexOf("begin") + 1;
			let endPos = regionText.indexOf("end") + 1;
			let positionPos = regionText.indexOf("position") + 1;
			let chainPos = regionText.indexOf("chain") + 1
			
			//	Use the locations of the positions to set the begin/end and chain
			if (parseInt(beginPos) + parseInt(endPos) > 0){
				var begin = parseInt(regionText[beginPos]);
				var end = parseInt(regionText[endPos]);
			} else if (positionPos > 0){
				var begin = parseInt(regionText[positionPos]);
				var end = parseInt(begin);
			}
			let chain = regionText[chainPos];
			
			//	Color the region of the structure
			for (let i = begin; i <= end; i++){
				console.log(i)
				try{
					//	If the region is small then add sticks
					if (end - begin < 20){					
						viewers[currentStructureNum].addStyle({ chain: chain, resi: i }, { stick: { colorscheme: "orangeCarbon", thickness: 1.0 } });
					}
					//	Colour the region purple no matter what
					viewers[currentStructureNum].addStyle({ chain: chain, resi: i }, { cartoon: { colorscheme: "orangeCarbon"} });
				}catch{
					console.log("failed to add " + chain + " " + i);
				};
			}
		};
		viewers[currentStructureNum].render()
		
	});

});