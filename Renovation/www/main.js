function Point(C,x,y){
	//Dane:
	var that=this;
	this.__C=C;
	this.__x=x;
	this.__y=y;
	return this;
};
Point.prototype.number=0;
Point.prototype.__genTag=function (){
	Point.prototype.number++;
	return "Point_"+Point.prototype.number;
};
Point.prototype.draw=function(){
	this.__C.drawArc({
	  	fillStyle: 'gray',
	  	strokeStyle:'#333333',
	  	width:0.1,
	  	layer:true,
	  	name:this.__tag,
	  	groups:["points"],
	  	x: this.__x,
	  	y: this.__y,
	  	radius:3
	});
};
Point.prototype.create=function(){
	//Dane:
	this.__tag=this.__genTag();
	//Definicje:
	this.draw();
};
Point.prototype.getx=function(){
	return this.__x;
};
Point.prototype.gety=function(){
	return this.__y;
};

function Polygon(C){
	this.__C=C;
	this.__points=[];
	this.draw=function(){
		this.__C.drawLine({
			strokeStyle: "gray",
			fillStyle:"gold",
			groups:['poly'],
			strokeWidth: 0.5,
			layer: true,
			name:'polygon',
			closed:true
		});
	};
	this.__update=function(){//Zwraca liste wspolrzednych polygonu
		var obj={};
		for (var i=0; i<this.__points.length; i+=1) {
		  	obj['x'+(i+1)] = this.__points[i].getx();
		  	obj['y'+(i+1)] = this.__points[i].gety();
		}
		this.__C.setLayer('polygon',obj);
		this.__C.drawLayers();
	};
	this.addPoint=function(x,y){
		var point=new Point(this.__C,x,y);
		point.create();
		this.__points.push(point);
		this.__update();
	};
};
function ParametersMenu(){
	this.setParameters=function(parameters){
		$("#A").html(Math.round(parameters.A*100)/100);
    	$("#Cx").html(Math.round(parameters.Cx*100)/100);
    	$("#Cy").html(Math.round(parameters.Cy*100)/100);
    	$("#Ix").html(Math.round(parameters.Ix*100)/100);
    	$("#Iy").html(Math.round(parameters.Iy*100)/100);
    	$("#Ixy").html(Math.round(parameters.Ixy*100)/100);
	}
}
function CoordsMenu(){
	this.setCoords=function(x,y){
		$("#X").html(Math.round(x/3.0*100)/100);
		$("#Y").html(Math.round(y/3.0*100)/100);
	}
}

function Board(canvasTag,w,h,a,socket,paramMenu,coordsMenu){
	that=this;
	this.__C=$('#'+canvasTag);
	this.__w=w;
	this.__h=h;
	this.__grid=new Grid(this.__C,w,h,a);
	this.__socket=socket;
	this.__paramMenu=paramMenu;
	this.__coordsMenu=coordsMenu;
	this.__polygon=new Polygon(this.__C);
	this.__polygon.draw();

	this.getC=function(){
		return this.__C;
	};
	this.getCurrentX=function(event){
		return event.pageX-this.__C.position().left-15;
	};
	this.getCurrentY=function(event){
		return event.pageY-this.__C.position().top-15;
	};
	this.__bind=function(){
		this.__C.mousemove(function(event){
		  	that.__coordsMenu.setCoords(
		  		that.getCurrentX(event),
		  		that.getCurrentY(event)
		  		);
		});
		this.__C.click(function(event){
			var obj={
				x:that.getCurrentX(event),
				y:that.getCurrentY(event)
			}
		  	that.__socket.emit('sendPoint',obj,function(data,parameters,permission){
		  		if(permission){
		  			that.__polygon.addPoint(data.x,data.y);
		  			that.__paramMenu.setParameters(parameters);
		  		}
		  	});
		});
	};
	this.__bind();
};

function LoggedClientsMenu(){
	//Funkcja, ktora zarzadza menu wyswietlajacym zalogowanych klientow
	this.__tag=$("#clientsOnlineMenu");
	this.setClientsOnlineList=function(nicks){
		var i=0;
		var str="";
		for(i;i<nicks.length;i++){
			str+="<div class='onlineUser'>"+nicks[i]+"</div>";
		}
		this.__tag.html(str);
	}
}





$(document).ready(function (){

	var socket = io.connect();
	var paramMenu=new ParametersMenu();
	var coordsMenu=new CoordsMenu();
	var board=new Board("page",600,855,15,socket,paramMenu,coordsMenu);
	var clientsM=new LoggedClientsMenu();


	socket.emit('getClientsOnline',function(clients){
		clientsM.setClientsOnlineList(clients);
	});

	socket.on('updateClientsOnline',function(clients){
		// if($('#clientsOnlineMenu').length == 0) {
		// 	alert("nie istnieje...");
		// }
		clientsM.setClientsOnlineList(clients);
	});


	
	// socket.on('getClientsOnlineInfo',function(){
	// 	clientsM.setClientsOnlineList(clients);
	// });


	// var board=new Board("page",600,855,15);
	// var point=new Point(board.getC(),50,50,0,0);
	// point.create();

	// new LoginForm("");

});