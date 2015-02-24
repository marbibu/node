function Point(x,y){
	this.x=x;
	this.y=y;
}

function Polygon(){
    this.__points=[];
    this.__len=this.__points.length;
    this.A=this.__area();
};
Polygon.prototype.addPoint=function(x,y){
	var point=new Point(x,y);
	if(this.__checkPoint(point)){
		this.__points.push(point);
	    this.__len=this.__points.length;
	    this.A=this.__area();
	    return true;
	}else{
		return false;
	}
};
Polygon.prototype.__area=function(){
	if (this.__len >= 3){
        var result = 0,
            i = 0,
            p = this.__points;
        for (i; i < this.__len - 1; i ++) {
            result += p[i].x * p[i + 1].y - p[i + 1].x * p[i].y;
        }
        return 0.5 * Math.abs(result);
    } else {
        return 0;
    }
};
Polygon.prototype.__cx=function(){
	if (this.__len >= 3){
        var result = 0,
            i = 0,
            p = this.__points;
        for (i; i < this.__len - 1; i += 1) {
            result += (p[i].x + p[i + 1].x) * (p[i].x * p[i + 1].y - p[i + 1].x * p[i].y);
        }
        return result / (6.0 * this.A);
    } else {
        return 0;
    }
};
Polygon.prototype.__cy = function () {
    if (this.__len >= 3){
        var result = 0,
            i = 0,
            p = this.__points;
        for (i; i < this.__len - 1; i += 1) {
            result += (p[i].y + p[i + 1].y) * (p[i].x * p[i + 1].y - p[i + 1].x * p[i].y);
        }
        return result / (6.0 * this.A);
    } else {
        return 0;
    }
};
Polygon.prototype.__Ix = function () {
    if (this.__len >= 3){
        var result = 0,
            i = 0,
            p = this.__points;
        for (i; i < this.__len - 1; i += 1) {
            result += (Math.pow(p[i].y, 2) + p[i].y * p[i + 1].y + Math.pow(p[i + 1].y, 2)) * (p[i].x * p[i + 1].y - p[i + 1].x * p[i].y);
        }
        return result / 12.0;
    } else {
        return 0;
    }
};
Polygon.prototype.__Iy = function () {
    if (this.__len >= 3){
        var result = 0,
            i = 0,
            p = this.__points;
        for (i; i < this.__len - 1; i += 1) {
            result += (Math.pow(p[i].x, 2) + p[i].x * p[i + 1].x + Math.pow(p[i + 1].x, 2)) * (p[i].x * p[i + 1].y - p[i + 1].x * p[i].y);
        }
        return result / 12.0;
    } else {
        return 0;
    }
};
Polygon.prototype.__Ixy = function () {
    if (this.__len >= 3){
        var result = 0,
            i = 0,
            p = this.__points;
        for (i; i < this.__len - 1; i += 1) {
            result += (p[i].x * p[i + 1].y + 2 * p[i].y * p[i].y + 2 * p[i + 1].x * p[i + 1].y + p[i + 1].x * p[i].y) * (p[i].x * p[i + 1].y - p[i + 1].x * p[i].y);
        }
        return result / 24.0;
    } else {
        return 0;
    }
};
Polygon.prototype.__ccw=function(A,B,C){
	return (C.y-A.y)*(B.x-A.x) > (B.y-A.y)*(C.x-A.x);
};
Polygon.prototype.__intersect=function(A,B,C,D){
	if(this.__ccw(A,C,D)!==this.__ccw(B,C,D)){
	 	if(this.__ccw(A,B,C) !== this.__ccw(A,B,D)){
	 		return true;
	 	}
	}
	return false;
};
Polygon.prototype.__checkSegmentLast=function(A,B){
	var i=0;
	for(i;i<this.__len-2;i++){
		var C=this.__points[i];
		var D=this.__points[i+1];
		if(this.__intersect(A,B,C,D)){
			return false;
		}
	}
	return true;
}
Polygon.prototype.__checkSegmentFirst=function(A,B){
	var i=1;
	for(i;i<this.__len-1;i++){
		var C=this.__points[i];
		var D=this.__points[i+1];
		if(this.__intersect(A,B,C,D)){
			return false;
		}
	}
	return true;
}
Polygon.prototype.__checkPoint=function(point){
	if(this.__len<3){
		return true;
	}else{
		// var A=;
		// var B=point;
		
		// console.log("probuje dodac punkt"+(this.__len-2));
		
		var p=this.__checkSegmentLast(this.__points[this.__len-1],point);
		var q=this.__checkSegmentFirst(this.__points[0],point);
		return p && q;


		// if (a>0){
			// return false;
		// }
		// else{
			// return true;
		// }
		// return true;
		// console.log("przecina sie "+a+"razy");
		// return true;
	}
};

Polygon.prototype.getParameters=function(){
    return {A: this.__area(),
            Cx: this.__cx(),
            Cy: this.__cy(),
            Ix: this.__Ix(),
            Iy: this.__Iy(),
            Ixy: this.__Ixy()
           };
};

function ClientManager(validation){
	//Zarzadza
	this.__validation=validation;
	this.__nicks=[];
	this.clientExists=function(nickname){
		if(this.__nicks.indexOf(nickname)!=-1){
			return true;
		}else{
			return false
		}
	};
	this.addClient=function(socket,nickname){
		if (this.__validation.validate(nickname)){
			this.__nicks.push(nickname);
			socket.nickname=nickname;
			socket.polygon=new Polygon();
			return true;
		}else{
			return false;
		}
	};
	this.delClient=function(nickname){
		this.__nicks.splice(this.__nicks.indexOf(nickname),1)
	};
	this.getNicks=function(){
		return this.__nicks;
	};
	this.addPoint=function(x,y){
		socket.polygon.addPoint(x,y);
	};
}
function ClientValidation(){
	/*funkcja, ktora przeprowadza walidacje podanego nicku*/
	//ten fragment moze byc rozwijany
	this.__validations=[];
	this.addValidation=function(validation){
		this.__validations.push(validation);
	};
	this.validate=function(nickname){
		var i=0;
		for(i;i<this.__validations.length;i++){
			if (this.__validations[i].validate(nickname)){
			}else{
				return false;
			}
		}
		return true;
	}
};
//funkcje walidacyjne nicku
function IsNotExisting(clientM){
	//sprawdza czy nick nie istnieje juz
	this.__clientM=clientM;
	this.validate=function(nickname){
		return !this.__clientM.clientExists(nickname);
	}
}
function IsNotEmpty(){
	//Sprawdza czy nick nie jest pusty
	this.validate=function(nickname){
		return nickname!="";
	}
}

// def __det(s,A,B,C):
// 	return A.x*(B.y-C.y)+B.x*(C.y-A.y)+C.x*(A.y-B.y)
// def __ccw(s,A,B,C):
// 	return (C.y-A.y)*(B.x-A.x) > (B.y-A.y)*(C.x-A.x)
// def intersect(s,A,B,C,D):
// 	if s.__ccw(A,C,D) != s.__ccw(B,C,D) and s.__ccw(A,B,C) != s.__ccw(A,B,D):
// 		print "przecina sie"
// 	else:
// 		print "nie przecina sie"


var express = require('express'),
	app = express(),
	socketIo = require('socket.io');

var server = app.listen(3000,'0.0.0.0'),
	bodyParser = require('body-parser');
var io = socketIo.listen(server);



app.use(express.static(__dirname + '/www'));
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());


console.log("Start serwera http://127.0.0.1:"+3000+"\n...");






var clientV=new ClientValidation();
var clientM=new ClientManager(clientV);
clientV.addValidation(new IsNotExisting(clientM));
clientV.addValidation(new IsNotEmpty());

app.get('/', function(request,response){
	response.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection', function(socket){

	socket.on('login',function(data,callback){
		if (clientM.addClient(socket,data)){
			console.log("New client with nick: "+data+" has logged.")
			callback(true,data.substr(0,1).toUpperCase()+data.substr(1,data.length));
			io.sockets.emit('updateClientsOnline',clientM.getNicks());
		}else{
			console.log("Someone was trying to log as "+data+", without success...")
			callback(false);
		}
	});
	socket.on('getClientsOnline',function(callback){
		callback(clientM.getNicks());
	});


	socket.on('sendPoint',function(data,callback){
		console.log(socket.nickname+" chce umiescic punkt ("+data.x+", "+data.y+").");
        // var polygon=socket.poly;
        // //tu trzeba bedzie sprawdzic czy punkt mozna wstawic...
        var permission=socket.polygon.addPoint(data.x,data.y);

        console.log("czy moge postawic punkt? "+permission);
        callback(data,permission);




        // if(polygon.checkPoint(data.x,data.y)){
        //     polygon.addPoint(data.x,data.y);
        //     var newData=polygon.createObject();
        //     callback(newData,true);
        // } else{
        //     callback(null,false);
        // }
    });

	socket.on('disconnect',function(){
		if(socket.nickname===undefined){
        } else{
        clientM.delClient(socket.nickname);
        io.sockets.emit('updateClientsOnline',clientM.getNicks());
        console.log("Client with nickname: "+socket.nickname+" logged out");
        }
	});
});