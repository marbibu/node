function Board(canvasTag,w,h,a){
	var that=this;
	s=this;
	s.__C=$('#'+canvasTag);
	s.__w=w;
	s.__h=h;
	s.__grid=new Grid(s.__C,w,h,a);

	this.getC=function(){
		return s.__C;
	}
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

	var board=new Board("page",600,855,15);
	var clientsM=new LoggedClientsMenu();


	socket.emit('getClientsOnline',function(clients){
		clientsM.setClientsOnlineList(clients);
	});

	var point=new Point(board.getC(),50,50,0,0);
	point.create();

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