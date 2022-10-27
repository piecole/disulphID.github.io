function removeRegEx(input){
	return input.replaceAll(" ", "")
				.replaceAll("_", "")
				.replaceAll("-", "")
				.replaceAll(".", "");
}

function myFunction() {
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
  
};

function clearheads(){
	heads = document.getElementsByClassName("head");
	for (i = 0; i < heads.length; i++){
			heads[i].innerText = heads[i].innerText.replace(" ^","");
			heads[i].innerText = heads[i].innerText.replace(" v","");
		};
}

function actualSort(col){
	var $divs = $(".search a");
	var column = ".col" + col.toString();
	var head = "head col" + col.toString();
	head = document.getElementsByClassName(head)[0];
	var numerical = true
	if(["7"].includes(col.toString())){
		numerical = false;
	}
	if(head.innerHTML.includes("^")){
		clearheads();
		head.innerHTML += " v";	
		var alphabeticallyOrderedDivs = $divs.sort(function(a, b){
			return $(b).find(column).text().replace("nan", 0).localeCompare($(a).find(column).text().replace("nan", 0), undefined, {numeric : numerical});
		});
	}else if(head.innerHTML.includes("v")){
		clearheads();
		var alphabeticallyOrderedDivs = $divs.sort(function(a, b){
			return $(a).find(column).text().replace("nan", 100000000000).localeCompare($(b).find(column).text().replace("nan", 100000000000), undefined, {numeric : numerical});
		});
		head.innerHTML += " ^";
	}else{
		clearheads();	
		var alphabeticallyOrderedDivs = $divs.sort(function(a, b){
			return $(b).find(column).text().replace("nan", 0).localeCompare($(a).find(column).text().replace("nan", 0), undefined, {numeric : numerical});
		});
		head.innerHTML += " v";
	};
	$(".search").html(alphabeticallyOrderedDivs);
	document.getElementsByClassName('search')[0].style.display = "";
	document.getElementsByClassName('loading')[0].style.display = "none";
	
	//loadMessage.style.display = "none";
};

function sortA(col){
	loadMessage = document.getElementsByClassName('loading')[0];
	loadMessage.style.display = "block";
	search = document.getElementsByClassName('search')[0];
	search.style.display = "none";
	setTimeout( function (){ actualSort(col);}, 0);
	
}

var details = document.getElementsByClassName("struc")[0].innerText;
details = details.split(" ")

var toggled = false;

$(function() {
  let element = $('#viewer');
  let config = {backgroundColor: 'white' };
  let viewer = $3Dmol.createViewer( element, config );
  
  $3Dmol.download("pdb:" + details[0],viewer,{},function(){
	  viewer.setClickable({},true,function(target,viewer,event,container) {
		  if(target.label){
			  viewer.removeLabel(target.label);
			  delete target.label;
		  }else{
			viewer.addLabel(target.resn+target.resi+" - "+target.atom,{position: target, backgroundColor: 'gray', backgroundOpacity: 0.8});
					/*viewer.center({target}, 1000);*/
		  }
		  });;
  /*viewer.setClickable({},true,function(atom,viewer,event,container){
	try {
	if (toggled == false){
		alert("worked");
		viewer.setStyle({chain:details[1]},{cartoon:{colorscheme:'greenCarbon',thickness:0.5}});
		viewer.setStyle({chain:details[3]},{cartoon:{colorscheme:'blueCarbon',thickness:0.5}});
		toggled = true;
		alert(toggled)
	}else{
		alert("worked");
		viewer.setStyle({chain:details[1]},{stick:{colorscheme:'greenCarbon',thickness:0.5}});
		viewer.setStyle({chain:details[3]},{stick:{colorscheme:'blueCarbon',thickness:0.5}});
		toggled = false;
		alert(toggled)
	};
	}catch(error){
		console.error(error);
  };
  });*/
  viewer.setStyle({},{cartoon:{colorscheme:'grayCarbon'}});
  viewer.setStyle({chain:details[1]},{cartoon:{colorscheme:'greenCarbon'}});
  viewer.setStyle({chain:details[3]},{cartoon:{colorscheme:'blueCarbon'}});
  /*viewer.setStyle({chain:'B',invert:true},{cartoon:{}});*/
  viewer.addStyle({chain:details[1],resn:"CYS"},{stick:{colorscheme:"brownCarbon",thickness:1.0}});
  viewer.addStyle({chain:details[3],resn:"CYS"},{stick:{colorscheme:"brownCarbon",thickness:1.0}});
  /*viewer.setStyle({chain:details[1],resi:details[2]},{stick:{colorscheme:"brownCarbon",thickness:1.0}});
  viewer.setStyle({chain:details[3],resi:details[4]},{stick:{colorscheme:"brownCarbon",thickness:1.0}});*/
  viewer.addLabel("Cys " + details[2],{backgroundColor: 'darkgreen', backgroundOpacity: 0.8, alignment : "bottomRight"},{chain:details[1],resi:details[2]});
  viewer.addLabel("Cys " + details[4],{backgroundColor: 'darkblue', backgroundOpacity: 0.8, alignment : "bottomRight"},{chain:details[3],resi:details[4]});
  viewer.center({chain:details[1],resi:details[2]});
  viewer.addSurface({}, {opacity:0.5, color: "gray"});
  
  one = viewer.selectedAtoms({chain:details[1],resi:details[2], atom:["SG"]})
  two = viewer.selectedAtoms({chain:details[3],resi:details[4], atom:["SG"]})
  var one = [one[0].x, one[0].y, one[0].z]
  var two = [two[0].x, two[0].y, two[0].z]
  var central = [(one[0] + two[0])/2, (one[1] + two[1])/2, (one[2] + two[2])/2]
  
  viewer.addCylinder({
                      start: {x:one[0], y:one[1], z:one[2]},
                      end: {x:two[0], y:two[1], z:two[2]},
                      radius: 0.1,
					  dashed:true,
					  fromCap: 1,
					  toCap:1
                  });
  
  
  /*viewer.addLine({x:one[0].x, y:one[0].y, z:one[0].z}, {x:two[0].x, y:two[0].y, z:two[0].z});*/
  
  var m = viewer.addModel();
  m.addAtoms([{elem:'DISULPH', x:central[0], y:central[1], z:central[2]}])
  //m.setStyle({},{sphere:{}});
  viewer.center({elem:["DISULPH"]})
  
  //disulphide = viewer.selectedAtoms({chain:details[1],resi:details[2]}) + viewer.selectedAtoms({chain:details[3],resi:details[4]});
  //viewer.center({x:central[0], y:central[1], z:central[2]}, 1000);
  //viewer.center({chain:details[1],resi:details[2]});
  /*view = viewer.getView();
  view[0] = central[0];
  view[1] = central[1];
  view[2] = central[2];
  //view[4] = 80.88
  viewer.setView(view);*/
  //alert(viewer.getView());
  /*viewer.addLine({dashed:true,start:{chain:details[1],resi:details[2]},end:{chain:details[3],resi:details[4]}})*/
  //viewer.zoom(5);
  viewer.zoom(5);
  viewer.render();

});
});