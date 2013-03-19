(function() {
	var items = document.querySelectorAll('.parts li');
	var el = null;
	var del = document.querySelector('.delete');
	var addPart = document.querySelector('.addPart');
	var drawLine = document.querySelector('.drawLine');
	//var exportD = document.querySelector('.export');
	//var load = document.querySelector('.load');
	//var save = document.querySelector('.save');
	var newD = document.querySelector('.new');
	var clear = document.querySelector('.clear');
	var deleteFirst = document.querySelector('.deleteFirst');
	//var save = document.querySelector('.save');
	var renderImage = document.querySelector('.renderImage');
	var ul = document.querySelector('ul');
	var pForm = document.querySelector('form.partsForm');
	var cForm = document.querySelector('form.connectionForm');
	var posCounter=0
	var shapes = []
	var connections = []
	var interactions = []
	var intermediates = []
	var interhelper = []
	var shapeshelper = []
	var counter = 0

	newD.addEventListener('click', newDStart, false);
	deleteFirst.addEventListener('click', deleteF, false);
	clear.addEventListener('click', newDStart, false);
	renderImage.addEventListener('click', renderGraph, false);
	addPart.addEventListener('click', addItem, false);
	drawLine.addEventListener('click', drawLineX, false);
	//save.addEventListener('click', saveD, false);
	//load.addEventListener('click', loadStart, false);
	//exportD.addEventListener('click', exportStart, false); 

	var dragger = function () {
    this.ox = this.type == "rect" || "image" || "ellipse"? this.attr("x") : this.attr("cx");
    this.oy = this.type == "rect" || "image" || "ellipse"? this.attr("y") : this.attr("cy");
    this.animate({"fill-opacity": .2}, 500);
    }

    move = function (dx, dy) {
            var att = this.type == "rect" || "image" || "ellipse"? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
            this.attr(att);
            for (var i = connections.length; i--;) {
                r.connection(connections[i]);
            }
            r.safari();
    }

    up = function () {
            this.animate({"fill-opacity": 0}, 500);
        }

	function addItem(e) {
		e.preventDefault();
		var newItem = document.createElement('li');
		var title = pForm.elements['part'].value;
		if (title === '') {
			return false;
		}
		var partTypeIndex = pForm.elements['part Type'].selectedIndex;
		var partType = pForm.elements['part Type'].options[partTypeIndex].value;
		var colorIndex = pForm.elements['Color'].selectedIndex;
		var Color = pForm.elements['Color'].options[colorIndex].value;
		var newContent = title + ' <img src = "img/'+partType+'.png">';
		newItem.innerHTML = newContent;
		newItem.setAttribute('style', 'color:'+Color);
		newItem.setAttribute('partType', partType);
		ul.appendChild(newItem);
		items = document.querySelectorAll('.parts li');
	}
	function drawLineX(e) {
		e.preventDefault();
		if (cForm.elements['indexA'].value === '' || cForm.elements['indexB'].value === '') {
			return false;
		}
		addConnection (parseInt(cForm.elements['indexA'].value),parseInt(cForm.elements['indexB'].value),cForm.elements['interType'].value.toString());
	}

	function newDStart() {
		if (typeof r != 'undefined'){
     	 r.remove();
     	}
	}
	/*function loadStart() {
		console.log('load design');
	}

	function exportStart() {
		console.log('export start');
	}

	function saveD() {
		console.log('save design');
		localStorage.setItem('Design',ul);
	}*/
	function deleteF() {
            var listItems = ul.getElementsByTagName ("li");
            ul.removeChild(listItems[0]);
	}

    function renderGraph() {
     	if (typeof r != 'undefined'){
     	 r.remove();
     	}
     	r = Raphael("holder", 900, 225);
     	r.clear();
     	shapes=[];
     	for (var i=0, ii = ul.childNodes.length; i < ii; i++) {
     		if (ul.childNodes.length > 0 && ul.childNodes[i+1] != undefined) {
     		partType=ul.childNodes[i+1].getAttribute("partType");
			shapes.push(r.image('img/'+partType+'.png', 50+70*i, 75, 40, 40));
        	}
    	}
    	for (var i = 0, ii = shapes.length; i < ii; i++) {
    		var color = Raphael.getColor();
        	shapes[i].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
        	shapes[i].drag(move, dragger, up);
        	if (i != 0) {
        		connections.push(r.connection(shapes[i-1], shapes[i], "#000"))}
    		}
    	for (var i = 0, ii = intermediates; i < ii; i++) {
        	intermediates[i].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
        	intermediates[i].drag(move, dragger, up);
    	}
    	for (var i=0, ii = intermediates.length; i < ii; i++) {
     		partType=ul.childNodes[i+1].getAttribute("partType");
			shapes.push(r.image('img/'+interhelper[i]+'.png', intermediates[i].attrs.cx, intermediates[i].attrs.cy, 10, 10));
			shapeshelper.push(i+ul.childNodes.length-1);
    	}
    	for (var i = 0, ii = shapes.length; i < ii; i++) {
    		var color = Raphael.getColor();
        	shapes[i].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
        	shapes[i].drag(move, dragger, up);
    		}
    	for (var i = 0, ii = interactions.length; i < ii; i++) {
        	connections.push(r.connection(shapes[interactions[i][0][0]],shapes[shapeshelper[i]],interactions[i][0][2]));
        	connections.push(r.connection(shapes[shapeshelper[i]],shapes[interactions[i][1][1]],interactions[i][1][2]));
    	}
    }

    function addConnection (indexA,indexB, type) {
    	renderGraph();
    	if (indexA <= shapes.length && indexB <= shapes.length && indexA != indexB){
    		if (type == "Promoter") {
    			color="green";
    			intermediates.push(r.ellipse(shapes[indexA].attrs.x/2 + shapes[indexB].attrs.x/2, 150+5*counter));
    			interhelper.push("arrow");
    		} else {
    			color="red";
    			intermediates.push(r.ellipse(shapes[indexA].attrs.x/2 + shapes[indexB].attrs.x/2, 50-5*counter));
    			interhelper.push("line");
    		}
    		interactions.push([[indexA,intermediates[counter],color],[intermediates[counter],indexB,color]]);
    		counter=counter+1}
    	renderGraph();
    }

    function toggleNext(el) {
		 var next=el.nextSibling;
		 while(next.nodeType != 1) next=next.nextSibling;
		 next.style.display=((next.style.display=="none") ? "block" : "none");
		}

		function toggleNextByTagName(tname) {
		 var ccn="clicker";
		 var clickers=document.getElementsByTagName(tname);
		 for (i=0; i<clickers.length; i++) {
		 clickers[i].className+=" "+ccn;
		 clickers[i].onclick=function() {toggleNext(this)}
		 toggleNext(clickers[i]);
		 }
		}
		window.onload=function(){toggleNextByTagName('h3')}

 	$(function() {
    	$( "#sortable" ).sortable();
    	$( "#sortable" ).disableSelection();
  		});
})();