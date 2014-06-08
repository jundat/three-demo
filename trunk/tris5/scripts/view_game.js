function onReadyGameBtClick(event)
{
	sfs.send( new SFS2X.Requests.System.ExtensionRequest("ready", {}, sfs.lastJoinedRoom));
}

function onStartGameBtClick(event)
{
	sfs.send( new SFS2X.Requests.System.ExtensionRequest("start", {}, sfs.lastJoinedRoom));
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end
	
	sfs.send( new SFS2X.Requests.System.ExtensionRequest("start", {}, sfs.lastJoinedRoom))	
	//Remove Game Popup
	//removeGamePopUp();
	//removeGameMessage();
}
