	var COLUMN = [
	              //"id",
	              "name",
	              "owner",
	              "minBet",
	              "maxBet",
	              "player",
	              "status",
	              "join"
	              ];
	
	function TB_clearRooms()
	{
		var rows = $("#tblRoom tr");
		for (var i = rows.length - 1 ; i > 0; i--)
		{
			rows[i].remove();
		}
	}
	function TB_removeRoom(id)
	{
		var room = document.getElementById("room_"+id);
		room.remove();
	}
	function TB_updateRoom(id, field, newVal)
	{
		var room_id = "#room_"+id;
		var room = document.getElementById("room_"+id);
		if (room == null){
			console.log("ko thay room");
			return;
		}
			
		
		var index = COLUMN.indexOf(field);
		if (index >= 0)
		{
			console.log(room.cells[index].innerHTML, newVal);
			room.cells[index].innerHTML = newVal;
		}
		
	}
	function TB_addRoom(id, name, owner, minBet, maxBet, maxPlayer, currentPlayer, status){
		var view = {};
		//view['id'] = id;
		view['name'] = name;
		view['owner'] = owner;
		view['minBet'] = minBet;
		view['maxBet'] = maxBet;
		view['player'] = "{0}/{1}".format( currentPlayer, maxPlayer);
		view['status'] = status; //waiting... / playing...
		view['join'] = "";
		if (status == "waiting")
		{
			view['join'] = "<a href='#' onclick=clickJoinRoom({0})>プレイ</a>".format(id);
		}
		var table = document.getElementById("tblRoom").getElementsByTagName('tbody')[0];;
		var row = table.insertRow(0);
		row.id = "room_" + id;
		
		for(var i = 0; i < COLUMN.length; i++)
		{
			var columnName = COLUMN[i];
			var cell = row.insertCell(i);
			cell.innerHTML = view[columnName];
		}
		
	}	
	
	function getSFSLobbyRoom()
{
	var lobbyRoom = null;
	var joinedRooms = sfs.getJoinedRooms();
	for (var i = 0; i < joinedRooms.length; i++)
	{
		if (joinedRooms[i].name == LOBBY_ROOM_NAME) {
			lobbyRoom = joinedRooms[i];
			break;
		}
	}
	return lobbyRoom;
}

/**
 * Public message send button click handler.
 * Send a public message, which will be displayed in the chat area (see onPublicMessage event).
 */
function onSendPublicMessageBtClick_LobbyInRoom(event)
{
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end
	
	if ($("#gameMsgIn_LB").val() != "")
	{
		//check neu van o trong lobby.
		var lobbyRoom = getSFSLobbyRoom();
		if (lobbyRoom != null){
			var isSent = sfs.send(new SFS2X.Requests.System.PublicMessageRequest($("#gameMsgIn_LB").val(), null, lobbyRoom));
			
			if (isSent)
				$("#gameMsgIn_LB").val("");
		}
	}
	
}

function onSendPublicMessageBtClick_Lobby(event)
{
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end

	console.log("onSendPublicMessageBtClick", event);

	if ($("#publicMsgIn").val() != "")
	{
		var lobbyRoom = getSFSLobbyRoom();
		if (lobbyRoom != null){
			var isSent = sfs.send(new SFS2X.Requests.System.PublicMessageRequest($("#publicMsgIn").val(), null, lobbyRoom));
			
			if (isSent)
				$("#publicMsgIn").val("");
			console.log("onSendPublicMessageBtClick SEND");
		}
	}
}

function onSendPublicMessageBtClick_Room(event)
{	
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end

	if ($("#gameMsgIn").val() != "")
	{
		var isSent = sfs.send(new SFS2X.Requests.System.PublicMessageRequest($("#gameMsgIn").val()));
		
		if (isSent)
			$("#gameMsgIn").val("");
	} 
}

function onDeselectUserBtClick(event)
{
	enablePrivateChat(-1);
}

/**
 * When a room is selected in the room list, the "Play" and "Watch" buttons are enabled
 */
//function onRoomSelected(event)
//{
//	var doEnable = event != undefined;
//	
//	if (!doEnable)
//	{
//		selectedRoom = null;
//		$("#roomList").jqxListBox("clearSelection");
//	}
//	
//	enableButton("#playGameBt", doEnable);
//	enableButton("#deselectGameBt", doEnable);
//}

function clickJoinRoom(room_id)
{
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end

	var password = "";
	var params =  {"room_id":room_id, "password": password};
	sfs.send( new SFS2X.Requests.System.ExtensionRequest("joinThreeCardRoom",params));		
	
}

//function onPlayGameBtClick(event)
//{
//	if ($("#roomList").jqxListBox("selectedIndex") > -1)
//	{
//		// Join selected room
//		var room = $("#roomList").jqxListBox("getSelectedItem").originalItem.roomObj;
//		var password = "";
//		//sfs.send(new SFS2X.Requests.System.JoinRoomRequest(room, password, -1));
//		var params =  {"room_id":room.id, "password": password};
//		sfs.send( new SFS2X.Requests.System.ExtensionRequest("joinThreeCardRoom",params));		
//	}
//}

function onDeselectGameBtClick(event)
{
	//onRoomSelected(null);
}


/**
 * Create game button click handler.
 * Shows the game room creation panel.
 */
function onCreateGameBtClick(event)
{
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end

	console.log("onCreateGameBtClick");
	if(sfs != null && sfs.mySelf != null)
	{
		var sub = sfs.mySelf.getVariable("displayname").value;
		var now = new Date();
		var timestamp = "" + now.getHours() + now.getMinutes() + now.getSeconds();
		if(sub.length > 12)
			sub = sub.substr(sub.length-10);
		var room_name = "{0}さんは{1}のルームオーナーです。".format(sub, timestamp);
		var room_name = "{0}-{1}".format(sub, timestamp); 
		$("#gameNameIn").val(room_name);
	} 
	$("#gameMinBet").val(DEFAULT_MIN_BET);
	$("#gameMaxBet").val(DEFAULT_MAX_BET);
	$("#gamePassword").val("");

	// Show create game window
	//$("#createGameWin").jqxWindow("open");
	$("#createGameWin").show();

}

/**
 * When the game creation panel is closed, all the form items it contains are reset to default values.
 */
function onCreateGameWinClose(event)
{
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end

	//reset cac gia tri.
	$("#createGameWin").hide();
}

/**
 * Create game button click event listener (create game panel).
 * Create a new game using the parameters entered in the game creation popup window. 
 */
function onDoCreateGameBtClick(event)
{
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end
	
	if ($("#gameNameIn").val() != "")
	{
		var gameName = $("#gameNameIn").val();
		var gameMinBet = $("#gameMinBet").val();
		var gameMaxBet = $("#gameMaxBet").val();
		var gamePassword = $("#gamePassword").val();
		var maxPlayer = 4;
		var intGameMinBet = parseInt(gameMinBet);
		var intGameMaxBet = parseInt(gameMaxBet);
		if(0 <= intGameMinBet && intGameMinBet <= intGameMaxBet)
		{
			
		} else {
			//TODO: bao loi.
			return;
		}
		var roomSettings  = {
				"room_name" : gameName,
				"min_bet" : parseInt(gameMinBet),
				"max_bet" : parseInt(gameMaxBet),
				"password": gamePassword,
				"play_mode" : PLAY_MODE,
				"max_player" : maxPlayer
		};
		
		var isSent = sfs.send( new SFS2X.Requests.System.ExtensionRequest("createThreeCardRoom", roomSettings));		
		// Close panel
		if (isSent){
			//$("#createGameWin").jqxWindow("closeWindow");
			$("#createGameWin").hide();
		}
		
	}
}

function updateLobby(){
	$(".info_name b").text(sfs.mySelf.getVariable("displayname").value);
	
	if (PLAY_MODE == 1)
	{
		$("#game_mode").removeClass("mode-training")	
		$("#game_mode").addClass("mode-real")
	} else {
		$("#game_mode").addClass("mode-training")	
		$("#game_mode").removeClass("mode-real")
	}
	
	var balance = 0;
	if (PLAY_MODE == 1) {	
		balance = sfs.mySelf.getVariable("balance").value;
		$(".info_balance b").text(balance + "$");
	}
	else {
		balance = sfs.mySelf.getVariable("tutorial_balance").value;
		$(".info_balance b").text(balance + "$ (fake)");
	}	
	
}

function onSwitchBtnClick(event)
{
	
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end
	
//	PLAY_MODE = PLAY_MODE == 1 ? 0 : 1;
//	
//	updateLobby();
//	
//	populateRoomsList();
	setView("mode",true);
}