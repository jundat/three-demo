//------------------------------------
// Constants
//------------------------------------
var LOBBY_ROOM_NAME = "The Lobby";
var GAME_ROOMS_GROUP_NAME = "games";

//------------------------------------
// Vars
//------------------------------------
var sfs = null;

var inGame = false;

var PLAY_MODE = 1;

function init()
{
	trace("Application started");
	
	var parameters = getSearchParameters();
	
	// Create configuration object
	var config = {};
	config.host = "127.0.0.1";
	config.port = 8888;
	
	//neu dang chay tren domain widocom
	if (parameters['env'] != null 
			&& parameters['env'] == 'prod' 
				&& document.URL.indexOf("widocom.com") != -1) //neu chay tren host widocom
	{
		config.host = "202.181.101.106";
		config.port = 8889;
	}
	console.log("connect to ", config.host, config.port);
	
	//config.zone = "BasicExamples";
	config.debug = false;
	
	// Create SmartFox client instance
	sfs = new SmartFox(config);
	
	// Add event listeners
	sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);
	sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost, this);
	sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError, this);
	sfs.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin, this);
	sfs.addEventListener(SFS2X.SFSEvent.LOGOUT, onLogout, this);
	sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, onRoomJoinError, this);
	
	//khi usser join vo mot room
	sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, onRoomJoin, this);
	sfs.addEventListener(SFS2X.SFSEvent.PUBLIC_MESSAGE, onPublicMessage, this);
	//sfs.addEventListener(SFS2X.SFSEvent.PRIVATE_MESSAGE, onPrivateMessage, this);
    sfs.addEventListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, onUserVarsUpdate, this);
    sfs.addEventListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, onRoomVarsUpdate, this);
	
	//khi co nguoi khac enter vo room.
	sfs.addEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, onUserEnterRoom, this);
	sfs.addEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, onUserExitRoom, this);	
	sfs.addEventListener(SFS2X.SFSEvent.USER_COUNT_CHANGE, onUserCountChange, this);
	
	sfs.addEventListener(SFS2X.SFSEvent.ROOM_REMOVE, onRoomRemove, this);
	sfs.addEventListener(SFS2X.SFSEvent.ROOM_ADD, onRoomAdd, this);
	sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse);
	
	trace("SmartFox API version: " + sfs.version);
	
	// Show LOGIN view
	setView("login", true);
	//setView("lobby", true);
	//setView("game", true);
	//initGame();
	
	//connnect.
	onConnectBtClick();
}

//------------------------------------
// SFS EVENT HANDLERS
//------------------------------------

function onConnection(event)
{
	// Reset view
	setView("login", false);
	
	if (event.success)
	{
		trace("Connected to SmartFoxServer 2X!");
		
		onLoginBtClick(USER_ID, ACCESS_TOKEN);
	}
	else
	{
		var error = "Connection failed: " + (event.errorMessage ? event.errorMessage + " (code " + event.errorCode + ")" : "Is the server running at all?");
		showError(error);
	}
}

function onConnectionLost(event)
{
	// Reset view
	setView("login", true);
	
	//onRoomSelected(null);
	
	//Remove Game Popup
	//removeGamePopUp();
	//removeGameMessage();
	
	// Show disconnection reason
	if (event.reason != SFS2X.Utils.ClientDisconnectionReason.MANUAL && event.reason != SFS2X.Utils.ClientDisconnectionReason.UNKNOWN)
	{
		var error = "You have been disconnected; reason is: " + event.reason;
		showError(error);
	}
	else
	{
		trace("You have been disconnected; reason is: " + event.reason);
	}
}

function onLoginError(event)
{
	// Reset view
	setView("login", true);
	
	// Show error
	var error = "Login error: " + event.errorMessage + " (code " + event.errorCode + ")";
	showError(error);
}

function onLogin(event)
{
	trace("Login successful!" +
		  "\n\tZone: " + event.zone +
		  "\n\tUser: " + event.user +
		  "\n\tData: " + event.data);
	
	// Set user name
	// NOTE: this always a good practice, in case a custom login procedure on the server side modified the username
	$("#usernameIn").val(event.user.name);
	
	// Join lobby room
	joinLobbyRoom();
}

function joinLobbyRoom()
{
	if (sfs.lastJoinedRoom == null || sfs.lastJoinedRoom.name != LOBBY_ROOM_NAME)
		sfs.send(new SFS2X.Requests.System.JoinRoomRequest(LOBBY_ROOM_NAME));
}

function onLogout(event)
{
	window.onbeforeunload = null;
	window.close();
	setView("login", true);
}

function onRoomJoinError(event)
{
	//trace("Room join error: " + event.errorMessage + " (code: " + event.errorCode + ")", true);
	
	// Reset roomlist selection
	//onRoomSelected(null);
}

function onRoomJoin(event)
{
	trace("Room joined: " + event.room);
	
	// Switch view
	if (event.room.name == LOBBY_ROOM_NAME)
	{
		inGame = false;
		
		setView("mode", true);
		//setView("lobby", true);
		
		//writeToLobbyChatArea("<em>You entered the '"+event.room.name+"'</em>");
		
		// Remove Game Popup
		//removeGamePopUp();
		//removeGameMessage();
	}
	else
	{
		console.log("JOIN ROOME GAME");
		inGame = true;
		
		setView("game", true);
		
		//writeToGameChatArea("<em>You entered the '"+event.room.name+"'</em>");
		
		// Initialize the game
		initGame();
		
		// Reset roomlist selection
		//onRoomSelected(null);
	}
}

function onPublicMessage(event)
{
	var sender = (event.sender.isItMe ? "あなたの発言" : event.sender.getVariable("displayname").value +"さんの発言" );
	var msg = "<b>" + sender + ":</b><br/>" + event.message;
	
	if (event.room.name == LOBBY_ROOM_NAME)
		writeToLobbyChatArea(msg);
	else
		writeToGameChatArea(msg);
}


function onUserEnterRoom(event)
{
	if (event.room.name == LOBBY_ROOM_NAME)
	{
		//writeToLobbyChatArea("<em>" + event.user.getVariable("displayname").value + "(" + event.user.id + ")さんはThe Lobbyに入りました。</em>");
	}
	else
	{
		console.log(event.user);
		//writeToGameChatArea("<em>User " + event.user.getVariable("displayname").value + " (" + event.user.id + ") entered the room</em>");
		
		updatePlayerUI(event.user);
		checkUserEnough();
	}
}

function onUserExitRoom(event)
{
	if (event.room.name == LOBBY_ROOM_NAME)
	{
//		if (!event.user.isItMe)
//			writeToLobbyChatArea("<em>User " + event.user.getVariable("displayname").value + " (" + event.user.id + ") left the room</em>");
	}
	else
	{		
		//writeToGameChatArea("<em>User " + event.user.getVariable("displayname").value + " (" + event.user.id + ") left the room</em>");
		if ( matchState == MatchState.WAIT_MORE_PLAYERS 
				|| matchState == MatchState.WAIT_PLAYERS_READY)
		{
			if (event.user.isItMe) {
				//hien thong bao la tran dau da bi huy.
				//console.log("show man hinh end gam.e : TRAN DAU DA BI HUY");
				showGameMessage("The room is canceled by Owner", "ok", function(){
					leaveRoom();					
				}, true);
			} else {
				//xoa nguoi do di.
				var playerId = event.user.getPlayerId(sfs.lastJoinedRoom);
				var pos = getPlayerPos(playerId);
				
				console.log(event.user);
				resetPlayerUI(playerConts[pos]);
			}
		} else {
			//do nothing
		}		
	}
}
function onRoomVarsUpdate(room, changeVars)
{
	console.log("onRoomVarsUpdate", room);
	populateRoomsList();
}
function onUserCountChange(event)
{
	// For example code simplicity we rebuild the full roomlist instead of just updating the specific item
	populateRoomsList();
}


function onRoomRemove(event)
{
	trace("Room removed: " + event.room);
	
	// For example code simplicity we rebuild the full roomlist instead of just removing the item
	populateRoomsList();	
}

function onRoomAdd(event)
{
	trace("Room added: " + event.room);
	
	// For example code simplicity we rebuild the full roomlist instead of just adding the new item
	populateRoomsList();
}

//------------------------------------
// OTHER METHODS
//------------------------------------

function trace(txt, showAlert)
{
	console.log(txt);
	
	if (showAlert)
		alert(txt);
}

function showError(text)
{
	trace(text);
	$("#errorLb").html("<b>ATTENTION</b><br/>" + text);
	$("#errorLb").toggle();
}

function setView(viewId, doSwitch)
{
	$("#createGameWin").hide();
	$("#messageGameWin").hide();
	$("#passwordGameWin").hide();
	// Check connection/login status to enable interface elements properly
	if (viewId == "login")
	{
		// Connect and disconnect buttons
		enableButton("#connectBt", !sfs.isConnected());
		enableButton("#disconnectBt", sfs.isConnected());
		
		// Login textinput and button
		enableTextField("#usernameIn", (sfs.isConnected() && sfs.mySelf == null));
		enableButton("#loginBt", (sfs.isConnected() && sfs.mySelf == null));
		
		// Hide create game window if open
//		$("#createGameWin").jqxWindow("closeWindow");

	}
	else if (viewId == "lobby")
	{
		// Logout button
		enableButton("#logoutBt", (sfs.isConnected() && sfs.mySelf != null));
		
		// Chat area
		enableChatArea((sfs.isConnected() && sfs.lastJoinedRoom != null), doSwitch);
		
		if (sfs.isConnected() && sfs.mySelf != null)
		{
			updateLobby();
			// Populate room & user lists
			populateRoomsList();
		}
		else
		{
			// Clear room & user lists
//			$("#roomList").jqxListBox("clear");
//			$("#userList").jqxListBox("clear");
			clearRooms();
		}		
	}
	else if (viewId == "game")
	{
		// Chat area
		enableChatArea((sfs.isConnected() && sfs.lastJoinedRoom != null), doSwitch);
	}
	
	// Switch view
	if (doSwitch)
		switchView(viewId);
}

function switchView(viewId)
{
	if ($("#" + viewId).length <= 0)
		return;
	
	$('.viewStack').each(function(index)
	{
		if ($(this).attr("id") == viewId)
		{
			$(this).show();
			$(this).css({opacity:1}); // Opacity attribute is used on page load to hide the views because display:none causes issues to the NavigationBar widget
		}
		else
		{
			$(this).hide();
		}
	});
}

function enableButton(id, doEnable)
{
	//$(id).jqxButton({disabled:!doEnable});
}

function enableTextField(id, doEnable)
{
	if (doEnable)
		$(id).removeAttr("disabled");
	else
		$(id).attr("disabled", true);
}

function enableChatArea(doEnable, clear)
{
	if(inGame == false)
	{
		if (clear)
		{
			//$("#publicChatAreaPn").jqxPanel("clearcontent");
			$("#publicChatAreaPn").text("");
			$("#publicMsgIn").val("");
		}
	
//		$("#publicChatAreaPn").jqxPanel({disabled:!doEnable});
		
		enableTextField("#publicMsgIn", doEnable);
		enableButton("#sendPublicMsgBt", doEnable);
	}
	else
	{
		//Ingame ne
		if (clear)
		{
			//$("#gameChatAreaPn").jqxPanel("clearcontent");
			$("#gameChatAreaPn").text("");
			
			$("#gameMsgIn").val("");
		}
	
		//$("#gameChatAreaPn").jqxPanel({disabled:!doEnable});
		
		enableTextField("#gameMsgIn", doEnable);
		enableButton("#sendGameMsgBt", doEnable);
		
		
		//lobby ne`.
		if (clear)
		{
			//$("#gameChatAreaPn_LB").jqxPanel("clearcontent");
			$("#gameChatAreaPn_LB").text("");
			$("#gameMsgIn_LB").val("");
		}
	
		//$("#gameChatAreaPn_LB").jqxPanel({disabled:!doEnable});
		
		enableTextField("#gameMsgIn_LB", doEnable);
		enableButton("#sendGameMsgBt_LB", doEnable);
	}
}



function writeToLobbyChatArea(text)
{
	console.log(text);
	$("#publicChatAreaPn").append("<p class='chatAreaElement'>" + text + "</p>");
	
	//scroll.
	var objDiv = document.getElementById("publicChatAreaPn");
	objDiv.scrollTop = objDiv.scrollHeight;
	
	
//	$("#publicChatAreaPn").jqxPanel("append", "<p class='chatAreaElement'>" + text + "</p>");
//	
//	// Set chat area scroll position
//	$("#publicChatAreaPn").jqxPanel("scrollTo", 0, $("#publicChatAreaPn").jqxPanel("getScrollHeight"));
	
	writeToGameChatArea_LB(text);
}


function writeToGameChatArea(text)
{
	$("#gameChatAreaPn").append("<p class='chatAreaElement'>" + text + "</p>");
	//$("#gameChatAreaPn").jqxPanel("append", "<p class='chatAreaElement'>" + text + "</p>");
	
	// Set chat area scroll position
	var objDiv = document.getElementById("gameChatAreaPn");
	objDiv.scrollTop = objDiv.scrollHeight;
	//$("#gameChatAreaPn").jqxPanel("scrollTo", 0, $("#gameChatAreaPn").jqxPanel("getScrollHeight"));
}

function writeToGameChatArea_LB(text)
{
	$("#gameChatAreaPn_LB").append("<p class='chatAreaElement'>" + text + "</p>");
	//$("#gameChatAreaPn_LB").jqxPanel("append", "<p class='chatAreaElement'>" + text + "</p>");
	
	// Set chat area scroll position
	var objDiv = document.getElementById("gameChatAreaPn_LB");
	objDiv.scrollTop = objDiv.scrollHeight;
	//$("#gameChatAreaPn_LB").jqxPanel("scrollTo", 0, $("#gameChatAreaPn").jqxPanel("getScrollHeight"));
}
function isOnLobby()
{
	var rooms = sfs.getJoinedRooms();
	for (var i = 0; i < rooms.length; i++)
	{
		if (rooms[i].name == LOBBY_ROOM_NAME)
			return true;
	}
	return false;
}

function clearSearch()
{
	$("#filter_name").val("");
	$("#filter_owner").val("");
	
	$("#filter_minBet_begin").val("");
	$("#filter_minBet_end").val("");
	
	$("#filter_maxBet_begin").val("");
	$("#filter_maxBet_end").val("");
		
	
	
	filterMinBet_begin = 0;
	filterMinBet_end = 0;
	filterMaxBet_begin = 0;
	filterMaxBet_end = 0;
	filterName = "";
	filterOwner = "";
	
	populateRoomsList();
}
function applySearch()
{
	console.log("apply search");
	
	filterMinBet_begin = parseInt($("#filter_minBet_begin").val());
	filterMinBet_end = parseInt($("#filter_minBet_end").val());
	
	filterMaxBet_begin = parseInt($("#filter_maxBet_begin").val());
	filterMaxBet_end = parseInt($("#filter_maxBet_end").val());
	
	filterName = $("#filter_name").val();
	filterOwner = $("#filter_owner").val();
		
	populateRoomsList();
}

var filterMinBet_begin = 0;
var filterMinBet_end = 0;//1<<30;
var filterMaxBet_begin = 0;
var filterMaxBet_end = 0;//1<<30;
var filterName = "";
var filterOwner = "";
function filterRoom(minBet, maxBet, name, owner)
{
	if (minBet < filterMinBet_begin)
		return false;
	if (minBet > filterMinBet_end && filterMinBet_end > 0)
		return false;
	if (maxBet < filterMaxBet_begin)
		return false;
	if (maxBet > filterMaxBet_end && filterMaxBet_end > 0)
		return false;
	if (filterName != null && filterName.length  > 0)
	{
		if (name.indexOf(filterName) == -1)
			return false;
	}
	if (filterOwner != null && filterOwner.length  > 0)
	{
		if (owner.indexOf(filterOwner) == -1)
			return false;
	}
	return true;	
}

function populateRoomsList()
{
	var rooms = sfs.roomManager.getRoomList();
	var source = [];
	
//	var selectedRoom = ($("#roomList").jqxListBox("selectedIndex") > -1 ? $("#roomList").jqxListBox("getSelectedItem").originalItem.roomObj.id : null);
//	var selectedIndex;
	var index = 0;
	TB_clearRooms();
	if (isOnLobby())
	{	
		for (var r in rooms)
		{
			var room = rooms[r];

			//!room.isPasswordProtected
			if (room.isGame  && !room.isHidden)
			{
				if (room.getVariable("playMode") != null)
				{
					if (room.getVariable("playMode").value != PLAY_MODE)
						continue;
				}
				var players = room.getUserCount();
				var maxPlayers = room.maxUsers;
				var spectators = room.getSpectatorCount();
				var maxSpectators = room.maxSpectators;
				
				var id = room.id;
				var name = room.name;
				var owner =  room.getVariable("owner").value;
				var minBet = room.getVariable("minBet").value;
				var maxBet = room.getVariable("maxBet").value;
				var maxPlayer = room.maxUsers;
				var currentPlayer = room.getUserCount();
				var statusVar =  room.getVariable("state").value;
				var status = "playing";
				if (statusVar == MatchState.WAIT_MORE_PLAYERS 
						|| statusVar == MatchState.WAIT_PLAYERS_READY){
					status = "waiting";
				}
				var locked = room.isPasswordProtected;
				
				if (filterRoom(minBet, maxBet, name, owner))
					TB_addRoom(id, name, owner, minBet, maxBet, maxPlayer, currentPlayer, status, locked);
				else 
					console.log("khong show vi ko du dieu kien bo loc!");
//				var item = {};
//				item.html = "<div><p class='itemTitle game'> <strong>" + room.name + "</strong></p>" +
//							"<p class='itemSub'>Players: " + players + "/" + maxPlayers + 
//							" | Spectators: " + spectators + "/" + maxSpectators + "</p></div>"
//				item.title = room.name;
//				item.roomObj = room;
//		
//				source.push(item);
//				
//				if (room.id == selectedRoom)
//					selectedIndex = index;
//				
//				index ++;
				
			}
		}
	}
	
	
//	$("#roomList").jqxListBox({source: source});
//	
//	// Set selected index
//	$("#roomList").jqxListBox("selectedIndex", selectedIndex);
}


function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
  }
  return params;
}

function showMessage(msg)
{
	
}
if (!String.prototype.format) {
	  String.prototype.format = function() {
	    var args = arguments;
	    return this.replace(/{(\d+)}/g, function(match, number) { 
	      return typeof args[number] != 'undefined'
	        ? args[number]
	        : match
	      ;
	    });
	  };
};
//var params = getSearchParameters();


function onChooseModeTrain()
{
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end

	console.log("onChooseModeTrain");
	PLAY_MODE = 0;
	setView("lobby", true);
}

function onChooseModeReal()
{
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end

	console.log("onChooseModeReal");
	PLAY_MODE = 1;
	setView("lobby", true);
}

function showMessage(msg){
	$("#messageGameWin .message").text(msg);
	$("#messageGameWin").show();
}