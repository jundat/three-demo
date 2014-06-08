<html>
<head>
<script type="text/javascript">
function open_game(url, w, h) {
	
	var game_win = window.open(url, "popup_game", "width=990, height=722, top=0, left=0, scrollbars=0, menubar=0, resizable=0, location=0");
	game_win.moveTo((screen.width-960)/2, (screen.height-680)/2);
	return false;
} 
</script>
</head>
<body>
	<button id = "openPopup" onclick="open_game('http://localhost/tris5/game.php?user_id=khacpm&access_token=123');";>Player 1</button>
	<button id = "openPopup" onclick="open_game('http://localhost/tris5/game.php?user_id=diepnh&access_token=123');";>Player 2</button>
	<button id = "openPopup" onclick="open_game('http://localhost/tris5/game.php?user_id=haihn&access_token=123');";>Player 3</button>
	<button id = "openPopup" onclick="open_game('http://localhost/tris5/game.php?user_id=congvt&access_token=123');";>Player 4</button>
	<button id = "openPopup" onclick="open_game('http://localhost/tris5/index.html');";>Player 4</button>
	
</body>
</html>