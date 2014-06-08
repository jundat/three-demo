
	//--------------------
	// Login View
	//--------------------

/**
 * Connect button click handler.
 * Connects to a SFS2X instance.
 */
function onConnectBtClick()
{
	// Connect to SFS
	// As no parameters are passed, the config object is used
	sfs.connect();
	
	// Hide any previous error
	$("#errorLb").hide();
	
	// Disable button
	enableButton("#connectBt", false);
}

/**
 * Login button click handler.
 * Performs the login, which in turn (see onLogin event) makes the view switch to the lobby.
 */
function onLoginBtClick(user_name, token)
{
	// Hide any previous error
	$("#errorLb").hide();
	
	// Perform login
	var uName = $("#usernameIn").val();
	if(user_name != null)
		var isSent = sfs.send(new SFS2X.Requests.System.LoginRequest(user_name, "", {"access_token":token} , "Casino"));
	else 
		var isSent = sfs.send(new SFS2X.Requests.System.LoginRequest(uName, "", {"access_token":token} , "Casino"));
	
	if (isSent)
	{
		// Disable interface
		enableTextField("#usernameIn", false);
		enableButton("#loginBt", false);
	}
}

/**
 * Disconnect button click handler.
 * Disconnects the client from the SFS2X instance.
 */
function onDisconnectBtClick()
{
	// Disconnect from SFS
	sfs.disconnect();
	
	// Hide any previous error
	$("#errorLb").hide();
	
	// Disable button
	enableButton("#disconnectBt", false);
}

/**
 * Logout button click handler.
 * Performs the logout, which in turn (see onLogout event) makes the view switch to the login box.
 */
function onLogoutBtClick()
{
	var isSent = sfs.send(new SFS2X.Requests.System.LogoutRequest());
	
	if (isSent)
		enableButton("#logoutBt", false);
}