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
	var input, filter, searchContainer, parentAnchors, i, txtValue;
	input = document.getElementById('myInput');
	filter = removeRegEx(input.value.toUpperCase());
    searchContainer = document.querySelector('.main .search'); // Target search div
    if (!searchContainer) return; // Exit if not found

	parentAnchors = searchContainer.querySelectorAll(':scope > a'); // Get anchors inside search

	// Loop through parent <a> tags, hide those whose inner item doesn't match
	for (i = 0; i < parentAnchors.length; i++) {
		let anchor = parentAnchors[i];
        // Get text from the inner div.item for matching
		let itemDiv = anchor.querySelector('div.item');
        txtValue = itemDiv ? (itemDiv.textContent || itemDiv.innerText) : '';
		if (removeRegEx(txtValue).toUpperCase().indexOf(filter) > -1) {
			anchor.style.display = ""; // Set style on the anchor
		} else {
			anchor.style.display = "none"; // Set style on the anchor
		}
	}
	limitVisibleEntries();
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
    // 1. Get the SEARCH container (inside main)
    const searchContainer = document.querySelector('.main .search'); // More specific selector
    if (!searchContainer) {
         console.error("actualSort: '.search' container not found inside '.main'.");
         document.getElementsByClassName('loading')[0].style.display = "none"; // Hide loading
         return;
    }
    const mainContainer = document.querySelector('.main'); // Keep reference if needed elsewhere

    // 2. Get direct child <a> elements WITHIN the search container
    const anchorNodeList = searchContainer.querySelectorAll(':scope > a'); // Get direct children <a>
    if (anchorNodeList.length === 0) {
        console.warn("actualSort: No direct child <a> elements found inside '.search'.");
        document.getElementsByClassName('loading')[0].style.display = "none";
        searchContainer.style.display = ""; // Ensure search container itself is visible
        return;
    }
    console.log("actualSort: Anchors found for sorting:", anchorNodeList.length);

    // 3. Create an array of these parent <a> elements
    let parentAnchorArray = Array.from(anchorNodeList);

    // 4. Perform Sorting Logic (on the parent <a> array)
    var columnSelector = ".col" + col.toString();
	var head = "head col" + col.toString();
	head = document.getElementsByClassName(head)[0];
	var li = document.getElementsByClassName("head");
	for (var i = 0; i < li.length; i++) { li[i].classList.remove("selected"); }
	head.classList.add("selected");
    
    let sortOrder; // Determine sort order based on current state BEFORE toggling arrows

    if (head.innerHTML.includes(" v")) {
        // Currently shows 'v' (descending), so this click should sort ASCENDING
        sortOrder = 'asc';
        clearheads();
        head.innerHTML += " ^"; // Update arrow for next click (now shows ascending)
    } else if (head.innerHTML.includes(" ^")) {
        // Currently shows '^' (ascending), so this click should sort DESCENDING
        sortOrder = 'desc';
        clearheads();
        head.innerHTML += " v"; // Update arrow for next click (now shows descending)
    } else {
        // No arrow present (first click), default to DESCENDING sort
        sortOrder = 'desc';
        clearheads();
        head.innerHTML += " v"; // Update arrow for next click (now shows descending)
    }
    console.log("actualSort: Determined sortOrder:", sortOrder); // Add log

    // Sort using the determined order
    parentAnchorArray.sort(function (a, b) {
        // Find the column text WITHIN the div.item child of the anchor
        const itemDivA = a.querySelector('div.item');
        const itemDivB = b.querySelector('div.item');
        const textAElement = itemDivA ? itemDivA.querySelector(columnSelector) : null;
        const textBElement = itemDivB ? itemDivB.querySelector(columnSelector) : null;
        const textA = textAElement ? (textAElement.textContent || '') : '';
        const textB = textBElement ? (textBElement.textContent || '') : '';
        let valA = textA.toLowerCase().replace("nan", sortOrder === 'asc' ? 'zzzzzz' : '-1');
        let valB = textB.toLowerCase().replace("nan", sortOrder === 'asc' ? 'zzzzzz' : '-1');
        let comparison = 0;
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
        if (!isNaN(numA) && !isNaN(numB)) { comparison = numA - numB; } else { comparison = valA.localeCompare(valB); }
        return sortOrder === 'asc' ? comparison : -comparison;
    });
	console.log("actualSort: Parent anchors after sorting logic:", parentAnchorArray.length);

    // 5. Rebuild the innerHTML of the SEARCH container
    const sortedHtml = parentAnchorArray.map(anchor => anchor.outerHTML).join('');
    searchContainer.innerHTML = sortedHtml; // Replace content of .search, not .main
	console.log("actualSort: Rebuilt innerHTML of .search with sorted items.");

    // 6. Re-apply the current search filter (inside .search, targeting <a>)
    setTimeout(() => {
        var currentInput = document.getElementById('myInput');
        let filter = '';
        // Re-select anchors within the updated searchContainer
        const sortedAnchors = searchContainer.querySelectorAll(':scope > a');
        if (currentInput && currentInput.value) {
            filter = removeRegEx(currentInput.value.toUpperCase());
            console.log("actualSort (post-innerHTML): Re-applying search filter:", filter);
            sortedAnchors.forEach(anchor => {
                let txtValue = anchor.querySelector('div.item') ? (anchor.querySelector('div.item').textContent || anchor.querySelector('div.item').innerText) : '';
                if (filter && removeRegEx(txtValue).toUpperCase().indexOf(filter) === -1) {
                     anchor.style.display = "none";
                } else {
                     anchor.style.display = "";
                }
            });
        } else {
             // Ensure all are visible if no filter
             sortedAnchors.forEach(anchor => { anchor.style.display = ""; });
        }

        // 7. Apply the 100-item limit (inside .search, targeting <a>)
        limitVisibleEntries(); 
        console.log("actualSort (post-innerHTML): Filter and Limit applied.");

        // Hide loading message & ensure search container is visible
	    document.getElementsByClassName('loading')[0].style.display = "none";
        searchContainer.style.display = ""; // Ensure search container is visible

    }, 0);
}

function sortA(col) {
	var loadMessage = document.getElementsByClassName('loading')[0];
	loadMessage.style.display = "block";
	var searchContainer = document.querySelector('.main .search'); // Get the search container
    if (searchContainer) {
        searchContainer.style.display = "none"; // Hide it before sorting
    }
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

function overrideSG(input){
	// If 'SG' is in the input, replace it with 'S'
	if (input.includes("SG")){
		return "S";
	}else{
		return input;
	}
}

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

let viewers = {};
function loadStructure(structureIndex){
	let structures = $('.viewer');
	let viewer = false;
	i = structureIndex;
	$(function () {
		let element = structures[i];
		let config = { backgroundColor: 'white' };
		viewers[i] = $3Dmol.createViewer(element, config);
		viewer = viewers[i];
		$3Dmol.download("pdb:" + detailsList[i][0], viewers[i], {}, async function () {
				
			//	Enable ability to click a residue to label it with details
			viewer.setClickable({}, true, function (target, viewer, event, container) {
				if (target.label) {
					viewers[i].removeLabel(target.label);
					delete target.label;
				} else {
					viewers[i].addLabel(target.resn + target.resi + " - " + overrideSG(target.atom),
					{ position: target, backgroundColor: 'gray', backgroundOpacity: 0.8 });
					/* viewer.center({target}, 1000); // Wanted to be able to center it on a clickable one, 
					but couldn't work it */
					//	Would be good to turn cysteines that come up in the screen into links that take you
					//	to their page
				}
			});
			//	Set cartoon structures for the peptide chains
			viewers[i].setStyle({}, { cartoon: { colorscheme: 'grayCarbon' } });
			viewers[i].setStyle({ chain: detailsList[i][3] }, { cartoon: { colorscheme: 'blueCarbon' } });
			viewers[i].setStyle({ chain: detailsList[i][1] }, { cartoon: { colorscheme: 'greenCarbon' } });
			/*viewer.setStyle({chain:'B',invert:true},{cartoon:{}});*/
			
			for (var metal in metalColors) {
				viewers[i].addStyle({ resn: metal }, { sphere: metalColors[metal] });
			}
			//	Make ligands visible
			viewers[i].addStyle({ hetflag: true }, { stick: { radius: 0.3 } });

			// Turn cysteines into gray sticks (side-chain only)
			viewers[i].addStyle({ 
				resn: "CYS", 
				atom: ["CA", "CB", "SG"] 
			}, { 
				stick: { 
					color: "gray", 
					thickness: 1.0 
				} 
			});
			// Turn relevant cysteines into red sticks (side-chain only)
			viewers[i].addStyle({ 
				chain: detailsList[i][1], 
				resn: "CYS", 
				atom: ["CA", "CB", "SG"] 
			}, { 
				stick: { 
					colorscheme: "brownCarbon", 
					thickness: 1.0 
				} 
			});
			viewers[i].addStyle({ 
				chain: detailsList[i][3], 
				resn: "CYS", 
				atom: ["CA", "CB", "SG"]  
			}, { 
				stick: { 
					colorscheme: "brownCarbon", 
					thickness: 1.0 
				} 
			});
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
			viewers[i].addCylinder({
				start: { x: one[0], y: one[1], z: one[2] },
				end: { x: two[0], y: two[1], z: two[2] },
				radius: 0.1,
				dashed: true,
				fromCap: 1,
				toCap: 1
			});

			//	Center the camera between the two thiols but creating and centering on an invisibile atom
			var m = viewers[i].addModel();
			m.addAtoms([{ elem: 'DISULPH', x: central[0], y: central[1], z: central[2] }]);
			//m.setStyle({},{sphere:{}});
			viewers[i].center({ elem: ["DISULPH"] });
			
			//	Change the zoom and render
			viewers[i].zoom(4);
			viewers[i].render();


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
	if (Object.keys(loaded).includes(String(tabNumber)) == false){
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

	// Limit entries when a tab is clicked initially if needed (optional, depends on tab setup)
	// limitVisibleEntries();
}



function remove(el){
	var element = el;
	element.remove();
}

$(".tablink").click(function(){
	tabClick($(".tablink").index(this))
});

//	Allow region cards to be clicked to reveal their position in the structure
$(".region_info").click(function(e){
	
	//	Toggle .current_region on the region card
	$(this).parent().toggleClass("current");
	
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
	//	Make metals visible
	for (var metal in metalColors) {
		viewers[currentStructureNum].addStyle({ resn: metal }, { sphere: metalColors[metal] });
	}
	//	Make ligands visible
	viewers[currentStructureNum].addStyle({ hetflag: true }, { stick: { radius: 0.3 } });

	viewers[currentStructureNum].surfaceID = null;

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

document.addEventListener('DOMContentLoaded', function() {
    if (structurePage == true) {
        console.log("Loading structure...");
		// Wait 2 seconds before executing
		setTimeout(function(){
			if (window.location.hash) {
				let hash = window.location.hash.substring(1);
				tabClick(hash);
			} else {
				tabClick(0);
			}
		}, 2000);
    }
    // Apply the limit on initial page load IF the search container exists
    const searchContainer = document.querySelector('.main .search');
    if (searchContainer) {
        limitVisibleEntries();
    }
});

// Function to change cartoon style
function changeCartoonStyle(style) {
	viewers[currentStructureNum].setStyle({}, { cartoon: { style: style, color: 'spectrum' } });
	viewers[currentStructureNum].render();
}

let surfaces = new Set()
// Function to add or change the opacity of the surface representation
function changeOpacity(opacity) {
	
	// Check that number isnt in surfaces
	if (!surfaces.has(currentStructureNum)){
		viewers[currentStructureNum].surfid = viewers[currentStructureNum].addSurface({}, { opacity: opacity, color: "gray" });
		surfaces.add(currentStructureNum);
	}
	viewers[currentStructureNum].setSurfaceMaterialStyle(viewers[currentStructureNum].surfid, {
		color: 0x00ff00,   // Change color to green
		opacity: opacity,      // Set opacity to 50%
		transparent: true  // Enable transparency
	});
    viewers[currentStructureNum].render();
}

function exportImage() {
    // Define the desired resolution multiplier
    const resolutionMultiplier = 2;

    // Get the original dimensions
    const originalWidth = viewers[currentStructureNum].container.clientWidth;
    const originalHeight = viewers[currentStructureNum].container.clientHeight;

    // Calculate the new dimensions
    const newWidth = originalWidth * resolutionMultiplier;
    const newHeight = originalHeight * resolutionMultiplier;

    // Get the image data URL at the specified dimensions
    const imageURL = viewers[currentStructureNum].pngURI(newWidth, newHeight);

    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = "viewer_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function toggleControls() {
    const controls = document.getElementById('controlsContainer');
    const toggleButton = event.target;  // The button that was clicked
    
    if (controls.style.display === 'none') {
        // Show the controls
        controls.style.display = 'block';
        toggleButton.textContent = 'Hide Structure Controls';
    } else {
        // Hide the controls
        controls.style.display = 'none';
        toggleButton.textContent = 'Show Structure Controls';
    }
}

function limitVisibleEntries() {
    const searchContainer = document.querySelector('.main .search'); // Target search div
	if (!searchContainer) return;

	// Get the parent <a> tags inside the search container
    const parentAnchors = searchContainer.querySelectorAll(':scope > a');
	let visibleCount = 0;
	const limit = 100;

	// Iterate through parent <a> tags
	for (let i = 0; i < parentAnchors.length; i++) {
        let anchor = parentAnchors[i];
		// Check the anchor's display style
		if (anchor.style.display !== "none") {
			if (visibleCount < limit) {
				anchor.style.display = ""; // Ensure visible
				visibleCount++;
			} else {
				anchor.style.display = "none"; // Hide extras
			}
		}
	}
}
