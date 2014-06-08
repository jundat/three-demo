var MatchState = {
	WAIT_MORE_PLAYERS: 0, 
	//wait forever! 				 
	//---PLAYER 2 JOIN--->	
	WAIT_PLAYERS_READY: 1,
	//wait 20 second. kick all user not ready!   
	//---DEAL--->
	BET: 2,
	//wait 20 second for cheking.
	//----TIMEOUT or ACCEPT ALL-->
	SHOW_RESULT: 3
	//wait 5 seconds.					              
	//QUIT--->
}