function Grid(C,w,h,a){
	/*Ta funkcja bedzie uzyta tylko raz przez
	klienta nie trzeba uzywac propagate*/
	this.__init__=function(C,w,h,a){
		this.__C=C;
		this.__line5color='#000000';
		this.__lineDefaultColor='#000000';
		this.__a=a*1.0;
		this.__m=this.__getM(w);
		this.__n=this.__getN(h);
		this.__drawGrid(w,h);
	};
	this.__gridLine = function(x1,y1,x2,y2,color,width){
		this.__C.drawLine({
			strokeStyle: color,
			strokeWidth: width,
			layer: true,
			x1:x1,
			y1:y1,
			x2:x2,
			y2:y2
		});
	};
	this.__getM=function(w){
		return w/this.__a;
	};
	this.__getN=function(h){
		return h/this.__a;
	};
	this.__drawGrid=function(){
		var i=0;
		for(i;i<=this.__n;i+=1){
			this.__drawGridLine("w",i);
		}
		i=0;
		for(i;i<=this.__m;i+=1){
			this.__drawGridLine("h",i);
		}
	};
	this.__drawGridLine=function(orient,i){
		var l=i*this.__a;
		if(orient==='w'){
			this.__gridLine(0,l,w,l,this.__line5color,0.1);
		} else if(orient==='h'){
			this.__gridLine(l,0,l,h,this.__line5color,0.1);
		}
	};
	this.__init__(C,w,h,a);
};

function Point(C,x,y){
	var s=this;
	s.__C=C;
	s.__x=x;
	s.__y=y;
	return this;
}

// Point.prototype.number=0;
// Point.prototype.__genTag=function (){
// 	Point.prototype.number++;
// 	return "Point_"+Point.prototype.number;
// };
// Point.prototype.__draw=function(){
// 	s.__C.drawArc({
// 	  	fillStyle: 'brown',
// 	  	strokeStyle:'orange',
// 	  	width:0.1,
// 	  	layer:true,
// 	  	name:s.__tag,
// 	  	groups:["points"],
// 	  	x: s.__x,
// 	  	y: s.__y,
// 	  	radius:6
// 	});
// };
// Point.prototype.create=function(){
// 	s.__tag=s.__genTag();
// 	s.draw();
// }



// Point.prototype.getx=function(){
// 	return this.__x;
// };
// Point.prototype.gety=function(){
// 	return this.__y;
// };
// Point.prototype.getX=function(){
// 	return this.__X;
// };
// Point.prototype.getY=function(){
// 	return this.__Y;
// };

function LoggedNickDisplay(){
	//Funkcja, ktora zarzadza wyswietlaniem nazwy zalogowango klienta
	this.__tag=$("#topBar>span");
	this.setNickname=function(nickname){
		this.__tag.html("User: "+nickname);
	}
}





$(document).ready(function (){
	var socket = io.connect();

	var loggedNick=new LoggedNickDisplay();
	
	$("#logForm").submit(function(event){//wprowadzenie nazwy uzytkownika
	    event.preventDefault();
		socket.emit('login',$('#nickname').val(),function(data,nickname){
			if (data){
				$('#optionBar').load("/dock.html");
				$('#mainContent').load("/main.html");
				loggedNick.setNickname(nickname);
			} else{
				$('#comment').html("Such nickname already exists. Please try another.")
			}
		});
	});

	// socket.on('updateClientsOnline',function(clients){
		// if($('#clientsOnlineMenu').length == 0) {
		// 	alert("nie istnieje...");
		// }
		// alert("hej2");
		// clientsM.setClientsOnlineList(clients);
	// });
});







