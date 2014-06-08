<?php 
	$user_id = $_GET['user_id'];
	$access_token = $_GET['access_token'];
	
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<meta name="author" content="Rjgtav">
	<title>Casino 777 LA - 白熱！スリーカード</title>
		
	<!-- Reset styles -->
	<link href="css/reset.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" href="css/style.css">
	
 	<script type="text/javascript" src="libs/jquery-1.7.2.min.js"></script>
	
	<!-- Set custom styles -->
	<link href="css/main.css" rel="stylesheet" type="text/css" />
	
	<!-- Load createJS's required frameworks -->
	<script type="text/javascript" src="libs/createjs-2013.12.12.min.js"></script>	
    <script type="text/javascript" src="libs/tweenjs-0.5.1.min.js"></script>
    <script type="text/javascript" src="libs/soundjs-0.5.2.min.js"></script> <!-- tanlong -->

	<script src="js/jquery.nicescroll.min.js"></script>
	
	<!-- Load SFS2X JS API -->
	<script type="text/javascript" src="libs/SFS2X_API_JS.js"></script>

	<!-- Load main script -->
	<script type="text/javascript" src="scripts/main.js?ver=2014.06.07_1749"></script>
	<script type="text/javascript" src="scripts/i18n.js?ver=2014.06.07_1749"></script>
	<script type="text/javascript" src="scripts/atlas.js?ver=2014.06.07_1749"></script>
	<script type="text/javascript" src="scripts/datatypes/playerstatus.js?ver=2014.06.07_1749"></script>	
	<script type="text/javascript" src="scripts/datatypes/matchstate.js?ver=2014.06.07_1749"></script>
	<script type="text/javascript" src="scripts/datatypes/responsecode.js?ver=2014.06.07_1749"></script>
	<script type="text/javascript" src="scripts/gameplayconfig.js?ver=2014.06.07_1749"></script>
	<script type="text/javascript" src="scripts/TrisGame.js?ver=2014.06.07_1749"></script>
	<script type="text/javascript" src="scripts/view_login.js?ver=2014.06.07_1749"></script>
	<script type="text/javascript" src="scripts/view_lobby.js?ver=2014.06.07_1749"></script>
	<script type="text/javascript" src="scripts/view_game.js?ver=2014.06.07_1749"></script>
	 
	<!-- Initialize user interface -->
	<script type="text/javascript">
<?php
		echo "		var USER_ID = '$user_id';";
		echo "		var ACCESS_TOKEN = '$access_token';";
?>

		$(document).ready(function () {

			$(".scroll").niceScroll();
			//------------------
			// Event Listeners
			//------------------
			
			// Login View
			$("#connectBt").click(onConnectBtClick);
			$("#loginBt").click(onLoginBtClick);
			$("#disconnectBt").click(onDisconnectBtClick);


			//Mode View.
			$("#choose_mode_train").click(onChooseModeTrain);
			$("#choose_mode_real").click(onChooseModeReal);
			
			
			// Lobby View
			$("#sendPublicMsgBt").click(onSendPublicMessageBtClick_Lobby);
			$("#createGameBt").click(onCreateGameBtClick);
			$("#switchBt").click (onSwitchBtnClick);
			$("#logoutBt").click(onLogoutBtClick);

			//tanlong: begin
			//sự kiện enter trong textbox
			$('#publicMsgIn').keydown(function (event) {
			    var keypressed = event.keyCode || event.which;
			    if (keypressed == 13) {
					event.preventDefault();
			        onSendPublicMessageBtClick_Lobby(event);
			    }
			});
			//tanlong: end
			
			// Game View
			$("#sendGameMsgBt").click(onSendPublicMessageBtClick_Room);
			$("#sendGameMsgBt_LB").click(onSendPublicMessageBtClick_LobbyInRoom);
			$("#readyGameBt").click(onReadyGameBtClick);
			$("#startGameBt").click(onStartGameBtClick);

			//tanlong: begin
			//chat dưới trong room
			$('#gameMsgIn_LB').keydown(function (event) {
			    var keypressed = event.keyCode || event.which;
			    if (keypressed == 13) {
					event.preventDefault();
			        onSendPublicMessageBtClick_LobbyInRoom(event);
			    }
			});

			//chat trên trong room
			$('#gameMsgIn').keydown(function (event) {
			    var keypressed = event.keyCode || event.which;
			    if (keypressed == 13) {
					event.preventDefault();
			        onSendPublicMessageBtClick_Room(event);
			    }
			});
			//tanlong: end
			
			// Create new game Popup			
			$("#doCreateGameBt").click(onDoCreateGameBtClick);
			$("#cancelBt").click(onCreateGameWinClose);
			$("#closeCreateWindowBt").click(onCreateGameWinClose);

			//message popup			
			$("#messageGameWin .btn-info").click(function(){
				$("#messageGameWin").hide();
			});

			init();
	    });
	</script>
	
    <script type="text/javascript">                                           
	    var WIDTH = 960 + 20;
	    var HEIGHT = 640 + 20;

	    window.onload = function() {
	    	resizeWindow();

	    }

	    var resizeTimeout = null; 
	    window.onresize = function() {
	        if (resizeTimeout) 
		        clearTimeout(resizeTimeout);
	        resizeTimeout = setTimeout("resizeWindow()", 100);
	    }

	    function resizeWindow() {
	        try {
	            var dx = WIDTH - (window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth));
	            var dy = HEIGHT - (window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight));
	            console.log(dx,dy);
	            window.resizeBy(dx, dy);
	        } catch (e) {
	            //onWindowResize();
	        }
	    }
        window.onbeforeunload = function() 
        {
            return "Are you sure you want to navigate away from this page?";
        }
    </script>
</head>

<body oncontextmenu="return true">
	<!-- HEADER -->
	<div id="header" style="display:none">
	</div>
	
	<!-- CONTENT -->
	<div id="main" class="group">
		<!-- Login View -->
		<div id="login" class="hidden viewStack" style="text-align: center">		
			<div id = "waiting">			
			</div>
			<div id="errorLb" class="error invisible vSep10">&nbsp;</div>		
		</div>
		
		<div id="mode" class="hidden viewStack">
		    <div class="container wp-mode">
		      <div class="mode-btn text-center" style="text-align: center;">
		        <button type="button" id = "choose_mode_train" class="btn btn-training"></button>
		        <button type="button" id = "choose_mode_real" class="btn btn-real"></button>
		      </div><!-- / .mode-btn -->  
		    </div><!-- / .container -->
		</div>
		
		<!-- Lobby View -->
		<div id="lobby" class="hidden viewStack">
			<?php
				include "lobby2.php"; 
			?>			
		</div>
		
		<!-- Game View -->
		<div id="game" class="hidden viewStack">
 			<div id="gameBar">
				<div class="gameBarControls">
					<div id="gameChatAreaPn" style="width:180px;height:200px;overflow: auto;"></div>
					<div class="vSeparateTop">
 						<input type="text" id="gameMsgIn"  style="width: 120px;height: 35px;background-color: transparent;color: white;"class="textInput smaller" disabled="true" placeholder="ここにメッセジーを入力"/> 
 						<input type="button" id="sendGameMsgBt" value="送信"/> 
					</div>
				</div>
				
				<div class="gameBarControls" style="margin-top: 44px;">
					<div id="gameChatAreaPn_LB" style="width:180px;height:200px;overflow: auto;"></div>
					<div class="vSeparateTop">
 						<input type="text" id="gameMsgIn_LB"  style="width: 120px;height: 35px;background-color: transparent;color: white;"class="textInput smaller" disabled="true" placeholder="ここにメッセジーを入力"/> 
 						<input type="button" id="sendGameMsgBt_LB" value="送信"/> 
					</div>
				</div>
			</div>

			<div id="gamebox" class="leftBox">
				<canvas id="gameContainer" width="960" height="640">Your Browser doesn't support Canvas</canvas>
			</div>
		</div>
		
		<!-- POPUP Create -->
		<?php include "popup.php";?>
	
		<!-- Popup Message -->
		<div id="messageGameWin"class="container wp-joinroom">
	      <div class="form-horizontal text-center" role="form" style="text-align: center;">
	        <h2><img src="images/start_logo.png" alt=""></h2> 
	        <h3 class="message">Message Infomationessage Infomationessage Infomationessage Infomationessage Infomationessage Infomationessage Infomationessage Infomationessage Infomationessage Infomationessage Infomationessage Infomation</h3> 
	        <div class="wp-input">
	          <button type="button" class="btn btn-info">OK</button>  
	        </div><!-- / .wp-input -->        
	      </div> 
	    </div>
	    
	    
	    
	</div>
	
	<!-- FOOTER -->
	<div id="footer" style="display:none">
	</div>
	
	<!-- POPUPS -->
	
	<!-- Game Room creation popup window -->
<!--	<div id="createGameWin" style="position:absolute;top:200px; left:200px; width:350px;background: #ccc"> -->
<!-- 		<div id="createGameWinHeader"> -->
<!-- 			<strong>新しいルーム作成</strong>  -->
<!-- 		</div> -->
<!-- 		<div id="createGameWinContent"> -->
<!-- 			<div id="createGameWinTabs"> -->
<!-- 				<div> -->
<!-- 					<div class="item"><label>ルーム名</label><input type="text" id="gameNameIn" class="textInput" value="Three Cards Game"/></div> -->
<!-- 					<div class="item"><label>開始ベット</label><input type="text" id="gameMinBet" class="textInput" value="1"/></div> -->
<!-- 					<div class="item"><label>ルームデポジット</label><input type="text" id="gameMaxBet" class="textInput" value="300"/></div> -->
<!-- 					<div class="item"><label>パスワード</label><input type="password" id="gamePassword" class="textInput" value=""/></div> -->
<!-- 				</div> -->
<!-- 			</div> -->
			
<!-- 			<div id="createGameWinControls" class="popupWinControls"> -->
<!-- 				<input type="button" id="doCreateGameBt" class="leftButton" value="作成"/> -->
<!-- 				<input type="button" id="cancelBt" class="rightButton" value="キャンセル"/> -->
<!-- 			</div> -->
<!-- 		</div> -->
<!-- 	</div> -->
	

	
</body>