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
	}
	this.addClient=function(socket,nickname){
		if (this.__validation.validate(nickname)){
			this.__nicks.push(nickname);
			socket.nickname=nickname;
			return true;
		}else{
			return false;
		}
	}
	this.delClient=function(nickname){
		this.__nicks.splice(this.__nicks.indexOf(nickname),1)
	}
	this.getNicks=function(){
		return this.__nicks;
	}
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

	socket.on('disconnect',function(){
		if(socket.nickname===undefined){
        } else{
        clientM.delClient(socket.nickname);
        io.sockets.emit('updateClientsOnline',clientM.getNicks());
        console.log("Client with nickname: "+socket.nickname+" logged out");
        }
	});


});