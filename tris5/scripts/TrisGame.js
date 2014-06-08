//------------------------------------
// Constants
//------------------------------------
var BOARD_WIDTH = 960;
var BOARD_HEIGHT = 640;

var PLAYER_WIDTH = 150;
var PLAYER_HEIGHT = 25;

var FPS = 40;


//------------------------------------
// Vars
//------------------------------------
var inited = false;
var canvas;
var stage;
var board;

var lastUpdateState = 0;
var matchState = MatchState.WAIT_MORE_PLAYERS;

var playerConts = [];

//tanlong: begin
var RUN_BLINK = true;
var BLINK_TIME_OFF = 200;
var BLINK_TIME_ON = 300;
//
var READY_COUNTER_TIME = 3;
var bgBlur;
var lbReadyCounter;
var circleTimer;
//
var BAD_FACE_FRAMERATE = 0.1;
//
var BLINK_BET_FRAMERATE = 200;
//tanlong: end

var statusTF;

var disabler;
var currentPopUp;

var gameStarted = false;
var iAmSpectator = false;

var matchNote;
var minBet = 0;
var maxBet = 0;


var myPlayerId; //1,2,3,4 :: id cua nguoi choi :: neu nguoi choi//vi du id =2 , thi vi tri tuong ung la. 2,3,4,1
var playedPlayers = [null,null,null,null]; //4 nguoi tuong ung id = 1234
var dealedCards = [];
var maxCards = [];
var playerBets = [0,0,0,0];
var playerStatus = [
    PlayerStatus.BET_NONE, 
    PlayerStatus.BET_NONE, 
    PlayerStatus.BET_NONE, 
    PlayerStatus.BET_NONE];

var playerInTurn;

var CARD_SPRITE_SHEET;
var TIPS_SPRITE_SHEET;
var BUTTONS_SPRITE_SHEET;

//thuantq:begin
var chipsDisable=[];
var oldMoneyRemain=0;
var effectTimeOut=null;
var percentRemainCash=0;

var oldTotalBet=0;
var effectTotalBet=null;
var percentTotal=0;
//thuantq:end
//tanlong: begin
//------------------------------------
// Sounds
//------------------------------------

function onPreloadCompleted (event) {
	console.log("onPreloadCompleted: ", event.id, event.src);

	if (event.id == "BGM") {
		createjs.Sound.play("BGM");
	};
}

function preloadSounds () {

	//music
	createjs.Sound.registerSound({id:"BGM", src:"sounds/BGM.mp3"});

	//effect
	createjs.Sound.registerSound({id:"bet_fail", src:"sounds/bet_fail.mp3"});
	createjs.Sound.registerSound({id:"bet1", src:"sounds/bet1.mp3"});
	createjs.Sound.registerSound({id:"bet3", src:"sounds/bet3.mp3"});
	createjs.Sound.registerSound({id:"chia_bai", src:"sounds/chia bai.mp3"});
	createjs.Sound.registerSound({id:"click", src:"sounds/click.mp3"});
	createjs.Sound.registerSound({id:"equal", src:"sounds/equal.mp3"});
	createjs.Sound.registerSound({id:"lose", src:"sounds/lose.mp3"});
	createjs.Sound.registerSound({id:"open_card", src:"sounds/open card.mp3"});
	createjs.Sound.registerSound({id:"quit", src:"sounds/quit.mp3"});
	createjs.Sound.registerSound({id:"ready", src:"sounds/ready.mp3"});
	createjs.Sound.registerSound({id:"surrender", src:"sounds/surrender.mp3"});
	createjs.Sound.registerSound({id:"up", src:"sounds/up.mp3"});
	createjs.Sound.registerSound({id:"win", src:"sounds/win.mp3"});


	createjs.Sound.addEventListener("fileload", onPreloadCompleted);
}

preloadSounds();
//tanlong: end

//------------------------------------
// Main Game
//------------------------------------

/**
 * Initialize the game
 */
function initGame(){
	if(inited == false)
	{
		inited = true;
		
		//Stage
		canvas = document.getElementById("gameContainer");
		stage = new createjs.Stage(canvas);
		stage.mouseEventsEnabled = true;
		stage.enableMouseOver(10); 
		
		//init config spritesheet
		CARD_SPRITE_SHEET = new createjs.SpriteSheet(CARD_ATLAS);
		console.log("CARD_SPRITE_SHEET",  CARD_SPRITE_SHEET);
		preload = new createjs.Sprite(CARD_SPRITE_SHEET, "1_Hhearts/heart1");
		preload.x = 2000;
		preload.y = 2000;
		stage.addChild(preload);
		
		
		TIPS_SPRITE_SHEET = new createjs.SpriteSheet(TIPS_ATLAS);
		
		BUTTONS_SPRITE_SHEET = new createjs.SpriteSheet(BUTTONS_ATLAS);
		
		//Ticker
		createjs.Ticker.setFPS(FPS);		
		createjs.Ticker.addEventListener("tick", _onTick);
		
		
		//Board
		buildGameUI();
	}
		
	gameStarted = false;
	changeState(MatchState.WAIT_MORE_PLAYERS);
	// Register to SmartFox events	

	resetGameBoard();	
	
	//xac dinh me.
	myPlayerId = sfs.mySelf.getPlayerId(sfs.lastJoinedRoom);
	for (var i = 0; i < playedPlayers.length; i++)
	{
		playedPlayers[i] = null;
	}	
	for(var i=0;i<5;i++)
    {
        chipsDisable[i].visible=true;
    }
    //thuantq :reset variable
    if(effectTimeOut!=null)
        clearInterval(effectTimeOut);
    oldMoneyRemain=0;
    var oldTotalBet=0;
    if(effectTotalBet!=null)
        clearInterval(effectTotalBet);
    var percentTotal=0;
    //thuantq +end
    //render danh sach cac user trong rom.
	var users = sfs.lastJoinedRoom.getUserList();
	for (var i = 0; i < users.length; i++)
	{
		console.log("Update GUI for " + users[i]);
		updatePlayerUI(users[i]);
	}
    for (var i = 0; i < 4; i++)
    {
        var playerCont = playerConts[i];
        playerCont.crownKing.visible = false;
    }
	//hien man hinh doi.
	//showGamePopUp("wait", "他のプレイヤーの参加を待ってます。");
	showGameMessage("他のプレイヤーの参加を待ってます。", "", null, false);
	//kiem tra du nguoi thi cho vo.
	checkUserEnough();

	console.log(sfs.lastJoinedRoom.getVariables());
	minBet = sfs.lastJoinedRoom.getVariable("minBet").value;
	maxBet = sfs.lastJoinedRoom.getVariable("maxBet").value;
	
	updateMatchBetUI();

}

function calcCard(id)
{
	var nameIndex = Math.floor(id/10);
	var typeIndex = id%10;
	var name  = getCardName(nameIndex);
	var type = CARD_TYPES[typeIndex];
	return {
		"nameId" : nameIndex,
		"typeId" : typeIndex,
		"name":name, 
		"type":type
	};
}

function getCardName(cardId)
{
	return CARD_IDS[cardId*2];
}

/***
 * trả về vị trí trên bàn của ngươi chơi 
 * @param playerId
 */
function getPlayerPos(playerId)
{	
	return (playerId - myPlayerId + 4) %4;	
}


/**
 * Thay đổi trạng thái của trận đấu.
 * @param newState
 */
function changeState(newState)
{
	//tanlong: begin
	//kiểm tra có phải mới bắt đầu ván đấu
	//start 3,2,1 ReadyCounter
	if (matchState == MatchState.WAIT_PLAYERS_READY && newState == MatchState.BET) {


		bgBlur.visible = true;
		lbReadyCounter.visible = true;
		circleTimer.visible = true;

		var timerCallback = function () {
			lbReadyCounter.time -= 1;
			lbReadyCounter.text = "" + lbReadyCounter.time;
			if (lbReadyCounter.time > 0) {
				setTimeout(function() {
					timerCallback();
				}, 1000);
			} else {
				bgBlur.visible = false;
				lbReadyCounter.visible = false;
				circleTimer.visible = false;
			}
		}

		setTimeout(function() {
			timerCallback();
		}, 1000);

	};
	//tanlong: end


	lastUpdateState = new Date().getTime();
	matchState = newState;
}

//ham tra ve config cua match..
function updateMatchBetUI()
{
	
	for (var i = 0; i < playerBets.length; i++)
	{
		playerBets[i] = minBet;
	}

	matchNote.roomName.text = sfs.lastJoinedRoom.name;
	matchNote.minBet.text = "開始ベット : " +minBet + "$";
	matchNote.maxBet.text = "ルームデポジット: " +maxBet + "$";
	
	updateDefaultBet();
}

function updatePlayerUI(sfsPlayer)
{
	playerId = sfsPlayer.getPlayerId(sfs.lastJoinedRoom);
	//lay player ra.
	var pos = getPlayerPos(playerId);
	console.log(playerId, pos);
	
	var name = sfsPlayer.getVariable("displayname").value;
	var avatar = sfsPlayer.getVariable("avatar").value;
	
	playerConts[pos].name.text = name;	
	changeAvatar(playerConts[pos], avatar, 200);
	
	//checkUserEnough();
}

function changeAvatar(playerCont, newImg, size)
{
	var newImage = new createjs.Bitmap(newImg);
	playerCont.avatar.image = newImage.image;
	playerCont.avatar.regX = size/2;
	playerCont.avatar.regY = size/2;	
	playerCont.avatar.scaleX = 54.0/size;
	playerCont.avatar.scaleY = 54.0/size;
}

//khiem tra da du user chua de bat dau.
function checkUserEnough()
{
	if(sfs.lastJoinedRoom.getUserList().length >= 2 && matchState == MatchState.WAIT_MORE_PLAYERS)
	{
		changeState(MatchState.WAIT_PLAYERS_READY);		
		//removeGamePopUp();
		//removeGameMessage();
		
		//chi co owner moi hien ra.
       	if (myPlayerId == 1) {
			//showGamePopUp("start", "sẵn sàng");
			showGameMessage("Click for start game", "start", onStartGameBtClick, true);
		} else {
			showGameMessage("Waiting owner start game.", null, null, true);
		}
		
	} else {
		console.log("Phai cho vi matchState : " + matchState + " & users : " + sfs.lastJoinedRoom.getUserList().length);
	}
}
var cardNameOrders ={
		"3":0, "4":1, "5":2,
		"6":3, "7":4, "8":5,
		"9":6, "10":7, "j":8,
		"q":9, "k":10, "a":11,
		"2":12
};

function buildCard()
{
	console.log("buildCard");
	
	//làm nhiệm vụ hỗ trợ rotate.
	var cardContainer = new createjs.Container();

	//mat up
	cardContainer.downSide = new createjs.Container();
	
	//background
	backgroundCardUp = new createjs.Bitmap("images/new_2/self_card_reverse_side.png");
	cardContainer.downSide.addChild(backgroundCardUp);
	cardContainer.downSide.regX = 276/2;
	cardContainer.downSide.regY = 368/2;
	cardContainer.addChild(cardContainer.downSide);

	//mat ngua.
	cardContainer.upSide = new createjs.Sprite(CARD_SPRITE_SHEET, "1_Hhearts/heart1");
	cardContainer.upSide.gotoAndStop("1_Hhearts/heart1");
	cardContainer.upSide.regX = 276/2;
	cardContainer.upSide.regY = 368/2;
	cardContainer.addChild(cardContainer.upSide);

	//scale
	cardContainer.scaleX = 0.25;
	cardContainer.scaleY = 0.25;
	
	cardContainer.upSide.visible = false;
	cardContainer.downSide.visible = true;
	
	return cardContainer;
}

/***
 * side : "up" or "down"
 */
function swipeCard(cardContainer, cardNameId, cardTypeId, side)
{
	if(side == "up")
	{
		cardContainer.upSide.visible = true;
		cardContainer.downSide.visible = false;
		
		//cardName
		var cardSpriteName = getSpriteName_Card (cardNameId, cardTypeId);
		cardContainer.upSide.gotoAndStop(cardSpriteName);
	} else {
		cardContainer.upSide.visible = false;
		cardContainer.downSide.visible = true;
	}
	
}

function hideCards(playerCont){
	playerCont.cards.visible = false;
}

function dealCard(tween, playerId, turn, cardInfo){
	
	var pos = getPlayerPos(playerId);
	playerCont = playerConts[pos];
	
	var cardChildName = 'card'+(turn+1);
	var cardSprite = playerCont.cards[cardChildName];
	var from = {x:0,y:0};
	var to =cardSprite.localToLocal(0,0,board);
	tween.wait(100);
	tween.to({visible: true},0);
	tween.to(from, 0);
	tween.to(to, 300);
	tween.call(tweenCallback,[cardSprite]);
	if (playerId == myPlayerId) {
		tween.call(swipeCard,[cardSprite,cardInfo.nameId, cardInfo.typeId, "up" ]);
	}
	
	tween.to({visible:false}, 0);
	
//	playerCont.cards[cardChildName].visible = true;
	
}
function tweenCallback(card)
{
	card.visible = true;

	//tanlong: begin
	//sound
	createjs.Sound.play("chia_bai");
	//tanlong: end
}

function showCards_down(playerCont)
{
	for(var i = 0; i < 3; i++)
	{
		var cardBitmap = playerCont.cards['card'+(i+1)];
		swipeCard(cardBitmap, 0, 0, "down");
	}
}
//function showCard(card, nameId, typeId)
//{
//	swipeCard(cardBitmap,nameId, typeId, "up");
//}
function showCards(playerCont, cards, score, maxCard){
	console.log("showCards", cards);
	playerCont.cards.visible = true;
	//lat bai.
	
	for(var i = 0; i < 3; i++)
	{
		var cardBitmap = playerCont.cards['card'+(i+1)];
		swipeCard(cardBitmap, cards[i].nameId, cards[i].typeId, "up");
	}
	//console.log ("player " + playerCont.name.name + " dc " + score + " diem!" );
	
	if(score != null){		
		playerCont.showPoint(Math.floor(maxCard/10), maxCard%10, score);
	}	
}

var dialog;
function buildDialog(){
	var dialogCont = new createjs.Container();
	
	//hinh nen cua ung dung.
	var bg = new createjs.Bitmap("images/dialog/popup_base.png");
	bg.regX = 450/2;
	bg.regY = 300/2;
	dialogCont.addChild(bg);
	
	//icon thuong hieu.
	var brand = new createjs.Bitmap("images/dialog/start_logo.png");
	brand.y = -150;
	brand.regX = 208/2;
	brand.regY = 146/2;
	dialogCont.addChild(brand);
		
	//thong cao bao chi!
	dialogCont.message = new createjs.Text("NỘi dung rỗng", "bold 24px Verdana", "#ffffff");
	dialogCont.message.y = -80;
	dialogCont.message.textAlign = "center";
	dialogCont.message.lineWidth = 400;
	dialogCont.addChild(dialogCont.message);
	
	//button de start.
	var buttonOk = new createjs.Sprite(BUTTONS_SPRITE_SHEET);
	buttonOk.x = 0;
	buttonOk.y =90;
	buttonOk.name = "surrender";
	buttonOk.addEventListener("click", onClickDialog);	
	buttonOk.helper = new createjs.ButtonHelper(
			buttonOk, "start", "start", "start_pushed");
	dialogCont.addChild(buttonOk);
	
	dialogCont.button = buttonOk;

	return dialogCont;
}

var _onClickButton = null;
function onClickDialog()
{
	if (_onClickButton != null)
		_onClickButton.apply();
	removeGameMessage();
		
}
function removeGameMessage(){
	disabler.visible = false;
	createjs.Tween
		.get(dialog)
		.to({scaleX: 0, scaleY: 0}, 500)
		.call(function(){dialog.visible = false;});
}
function showGameMessage(message, buttonType, onButtonClick, anim)
{
	disabler.visible = true;
	dialog.visible = true;
	if (anim) {
		dialog.scaleX = dialog.scaleY = 0;
		createjs.Tween.get(dialog).to({scaleX: 1, scaleY: 1}, 500);
	} else {
		dialog.scaleX = dialog.scaleY = 1;
	}
	
	//button
	if (buttonType == null || buttonType == "")
		dialog.button.visible = false;
	else
		dialog.button.visible = true;

	//button callback
	_onClickButton = onButtonClick;
	
	//message
	dialog.message.text = message;
	
}

/**
 * Add game's elements to the canvas
 */
function buildGameUI(){
	board = new createjs.Container();

    //Background
	var boardBG = new createjs.Bitmap("images/new_2/table.png");
	boardBG.regX = BOARD_WIDTH/2
	boardBG.regY = BOARD_HEIGHT/2;
	
	board.addChild(boardBG);
	
//	var ban4nguoi = new createjs.Bitmap("images/new/ban4nguoi.png");
//	ban4nguoi.regX = 570/2;
//	ban4nguoi.regY = 360/2;
//	board.addChild(ban4nguoi);
	
	matchNote = new createjs.Container();
	matchNote.x = -960/2 + 10;
	matchNote.y = -640/2+ 10;
	//matchNote.rotation = 15;
	board.addChild(matchNote);
	
	//room name!
	matchNote.roomName = new createjs.Text("Đại chiến AKOta", "normal 14px Verdana", "#E39D3B");
	//matchNote.roomName.textAlign = "center";
	matchNote.roomName.x = 0;
	matchNote.roomName.y = 0;	
	matchNote.addChild(matchNote.roomName);
	
	//max bet!
	matchNote.maxBet = new createjs.Text("Max: 10$", "normal 14px Verdana", "#E39D3B");
	//matchNote.maxBet.textAlign = "center";
	matchNote.maxBet.x = 300;
	matchNote.maxBet.y = 0;
	matchNote.addChild(matchNote.maxBet); 


	//min bet!
	matchNote.minBet = new createjs.Text("Min: 10$", "normal 14px Verdana", "#E39D3B");
	//matchNote.minBet.textAlign = "center";
	matchNote.minBet.x = 600;
	matchNote.minBet.y = 0;
	matchNote.addChild(matchNote.minBet); 
	

	//counting - down status.
	countDownStatus = new createjs.Text("20", "bold 40px Verdana", "#DDDDDD");
	countDownStatus.textAlign = "center";
	countDownStatus.y = -15;
	board.addChild(countDownStatus);


	//chips.	
	chips = new createjs.Container();
	for(var i = 0; i < CHIPS.length; i++)
	{
		var chipName = 'chip'+(i);
		chips[chipName] = new createjs.Container();
		chips[chipName].x = (i-2)* 65;
		
		var chipVal = CHIPS[i];
		
		var chipSpriteName = "tip_"+chipVal;
		var up = chipSpriteName;
		var over = chipSpriteName + "_2"; 
		var down = chipSpriteName + "_3";
		console.log(up, over, down);
		//hinh anh
		chips[chipName].graphic = new createjs.Sprite(TIPS_SPRITE_SHEET, chipSpriteName);
		chips[chipName].helper = new  createjs.ButtonHelper(
				chips[chipName].graphic, up, over, over);
		
		
		
		chips[chipName].graphic.chipIdx = i;
		chips[chipName].graphic.regX = 62/2;
		chips[chipName].graphic.regY = 62/2;
		chips[chipName].addChild(chips[chipName].graphic);

		chips.addChild(chips[chipName]);
		
		chips[chipName].graphic.addEventListener("click", onClickChips);
	}

	chips.x = -80;
	chips.y = 280; 	
	board.addChild(chips);


	//them 3 cai button 
	betbuttons = new createjs.Container();
	
	//(1) surrender.
	
	betbuttons.surrenderSprite = new createjs.Sprite(BUTTONS_SPRITE_SHEET);
	betbuttons.surrenderSprite.x = 0;
	betbuttons.surrenderSprite.y = 0;
	betbuttons.surrenderSprite.name = "surrender";
	betbuttons.surrenderSprite.addEventListener("click", onClickBetButtons);
	betbuttons.surrenderHelper = new createjs.ButtonHelper(
			betbuttons.surrenderSprite, "giveup_nomal", "giveup_nomal_over", "giveup_nomal_push");
	betbuttons.addChild(betbuttons.surrenderSprite);

	//(2) bet.
	betbuttons.betSprite= new createjs.Sprite(BUTTONS_SPRITE_SHEET);
	betbuttons.betSprite.name = "bet";
	betbuttons.betSprite.addEventListener("click", onClickBetButtons);
	betbuttons.betHelper = new createjs.ButtonHelper(
			betbuttons.betSprite, "submit_nomal", "submit_nomal_over", "submit_nomal_push");
	betbuttons.betSprite.y = 70;
	betbuttons.addChild(betbuttons.betSprite);
	
	
	//(3)reset-bet.
	betbuttons.resetBetSprite = new createjs.Sprite(BUTTONS_SPRITE_SHEET);
	betbuttons.resetBetSprite.x = 0;
	betbuttons.resetBetSprite.y = 145;	
	betbuttons.resetBetSprite.name = "resetBet";
	betbuttons.resetBetSprite.addEventListener("click", onClickBetButtons);
	betbuttons.resetBetHelper = new createjs.ButtonHelper(
			betbuttons.resetBetSprite, "betreset_nomal", "betreset_nomal_over", "betreset_nomal_push");
	betbuttons.resetBetSprite.x = 0;
	betbuttons.addChild(betbuttons.resetBetSprite);
		
	//(4) follow!
	betbuttons.followSprite= new createjs.Sprite(BUTTONS_SPRITE_SHEET);
	betbuttons.followSprite.name = "follow";
	betbuttons.followSprite.addEventListener("click", onClickBetButtons);
	betbuttons.followHelper = new createjs.ButtonHelper(
			betbuttons.followSprite, "follow_nomal", "follow_nomal_over", "follow_nomal_push");
	betbuttons.followSprite.x = -85;
	betbuttons.followSprite.y = 145;
	betbuttons.addChild(betbuttons.followSprite);
	
	
	betbuttons.x = 220;
	betbuttons.y = 140;
	board.addChild(betbuttons);
	
	
	//another button.
	//(4) help!
	
	ruleSprite= new createjs.Sprite(BUTTONS_SPRITE_SHEET);
	ruleSprite.name = "rule";
	ruleSprite.addEventListener("click", onClickBtnRule);
	ruleHelper = new createjs.ButtonHelper(
			ruleSprite, "rule_nomal", "rule_nomal_over", "rule_nomal_push");
	ruleSprite.x = 960/2 - 145;
	ruleSprite.y = -640/2 + 30;
	board.addChild(ruleSprite);
	
	//(5) exit!
	leaveSprite= new createjs.Sprite(BUTTONS_SPRITE_SHEET);	
	leaveSprite.name = "leave";
	leaveSprite.addEventListener("click", onClickBtnLeave);
	leaveHelper = new createjs.ButtonHelper(
			leaveSprite, "exit_nomal", "exit_nomal_over", "exit_nomal_push");
	leaveSprite.x = 960/2 - 50;
	leaveSprite.y = -640/2 + 30;
	board.addChild(leaveSprite);
	
	board.x = 960/2;
	board.y = 640/2;
	stage.addChild(board);
	
	
	//(9) VUNG CENTER
	var centerBg = new createjs.Bitmap("images/new_2/total-bet.png");
	centerBg.regX = 324/2;
	centerBg.regY = 108/2;
	board.addChild(centerBg);

    //thuantq : begin
    //var cardOnDealCenter = new createjs.Bitmap("images/new_2/player_card_reverse_side.png");
    //cardOnDealCenter.regX = -93;
    //cardOnDealCenter.regY = 61/2;
    //cardOnDealCenter.betValue.textAlign = "center";
    //board.cardOnDealCenter.visible = false;
    //board.addChild(cardOnDealCenter);
    //thuantq : end
	
	board.totalBet = new createjs.Container();
	board.totalBet.x = 50;
	board.addChild(board.totalBet);
	
	/*var totalBetLabel = new createjs.Bitmap("images/new_2/table_center_text.png");
	totalBetLabel.regX = 120/2+30;
	totalBetLabel.regY = 29/2;
	totalBetLabel.y = -20;
	board.totalBet.addChild(totalBetLabel);*/
	
	
	board.totalBet.betValue = new createjs.Text("20 $", "bold 40px Verdana", "#8B008B");
	board.totalBet.betValue.textAlign = "center";
	board.totalBet.betValue.y = -5;
    board.totalBet.betValue.x -= 30;
	board.totalBet.addChild(board.totalBet.betValue);
	
	board.cardOnDeal = new createjs.Bitmap("images/new_2/player_card_reverse_side.png");
	board.cardOnDeal.regX = -93;
	board.cardOnDeal.regY = 61/2-1;
	board.cardOnDeal.visible = false;
	board.addChild(board.cardOnDeal);




	//vung thong tin ca nhan.
	
	board.myCash = new createjs.Container();
	board.myCash.x = -350;
	board.myCash.y = 220;
	board.addChild(board.myCash);
	
	//bg
	var myCashBG = new createjs.Bitmap("images/new_2/self_status_back_img.png");
	myCashBG.regX = 218/2;
	myCashBG.regY = 182/2;
	board.myCash.addChild(myCashBG)
	
	
	//total label
	var totalLabel = new createjs.Text(I18n['total'], "normal 20px Verdana", "#FFFFFF");
	//totalLabel.textAlign = "center";
	totalLabel.x = -100;
	totalLabel.y = -40 - 30;
	board.myCash.addChild(totalLabel);
	
	//total text.
	board.myCash.total = new createjs.Text("20 $", "bold 24px Verdana", "#FFFF00");
	board.myCash.total.textAlign = "center";
	board.myCash.total.x = 50;
	board.myCash.total.y = -40;
	board.myCash.addChild(board.myCash.total);
	
	//remain label
	var remainLabel = new createjs.Text(I18n['remain'], "normal 20px Verdana", "#FFFFFF");
	//remainLabel.textAlign = "center";
	remainLabel.x = -100;
	remainLabel.y = 40 - 30;
	board.myCash.addChild(remainLabel);
	
	//remain text.
	board.myCash.remain = new createjs.Text("20 $", "bold 24px Verdana", "#FFFF00");
	board.myCash.remain.textAlign = "center";
	board.myCash.remain.x = 50;
	board.myCash.remain.y = 40;
	board.myCash.addChild(board.myCash.remain);
	
	
	//vung chat.	
	var gameChat = new createjs.Container();
	
	var gameChatBG = new createjs.Bitmap("images/new_2/Chat/chatback.png");
	gameChatBG.regX = 188/2;
	gameChatBG.regY = -30;
	gameChat.addChild(gameChatBG);
	
	var gameChatHeader = new createjs.Bitmap("images/new_2/Chat/game_chat_header.png");
	gameChatHeader.regX = 183/2;
	//gameChatHeader.regY = 30/2;
	gameChat.addChild(gameChatHeader);
	

	//button
//	var sendSpriteSheet = new createjs.SpriteSheet(
//		{
//		    images: [			             
//		             "images/new_2/Chat/send_chat_nomal.png",
//		             "images/new_2/Chat/send_chat_pushed.png",
//		             "images/new_2/Chat/send_chat_disable.png",
//		             ],
//		    frames: { width: 44, height: 30, regX: 22, regY: 0},    
//		    animations: { normal: [0], push: [1], disable: [2] }
//		}
//	);
//	sendSprite= new createjs.Sprite(sendSpriteSheet);	
//	sendSprite.name = "send";
//	sendSprite.addEventListener("click", onClickBtnSend);
//	sendSprite.helper = new createjs.ButtonHelper(
//			sendSprite, "normal", "normal", "push");
//	sendSprite.y = 240;
//	sendSprite.x = 70;
//	gameChat.addChild(sendSprite);
	
	
	gameChat.x = 380;
	gameChat.y = -270; 
	board.addChild(gameChat);
	
	
	//lobbyChat
	var lobbyChat = new createjs.Container();
	var lobbyChatBG = new createjs.Bitmap("images/new_2/Chat/chatback.png");
	lobbyChatBG.regX = 188/2;
	lobbyChatBG.regY = -30;
	lobbyChat.addChild(lobbyChatBG);
	
	var lobbyChatHeader = new createjs.Bitmap("images/new_2/Chat/room_chat_header.png");
	lobbyChatHeader.regX = 183/2;
	
	//gameChatHeader.regY = 30/2;
	lobbyChat.addChild(lobbyChatHeader);
	lobbyChat.x = 380;
	lobbyChat.y = 20; 
	board.addChild(lobbyChat);
	
	
	buildPlayerProfile();
	

	//--------------------------
	// Status TextField
	//--------------------------
	statusTF = new createjs.Text("", "bold 14px Verdana", "#000000");
	statusTF.textAlign = "center";
	statusTF.x = 289;
	statusTF.y = 70;
	stage.addChild(statusTF);
	
	//--------------------------
	// Disabler
	//--------------------------
	disabler = new createjs.Shape();
	//chan cac su kien click.
	disabler.addEventListener("click", clickBB);
		disabler.graphics.beginFill("#000000");
		disabler.graphics.drawRect(0, 0, canvas.width - 200, canvas.height);
		disabler.alpha = 0.5;
		disabler.visible = false;
		
	stage.addChild(disabler);
	
	//add dialgo
	dialog = buildDialog();
	dialog.x = canvas.width/2;
	dialog.y = canvas.height/2;
	stage.addChild(dialog);

	//tanlong: begin
	//--------------------------
	// Counter
	//--------------------------
	bgBlur = new createjs.Shape();
	bgBlur.graphics.beginFill("rgba(0,0,0,0.6)").drawRect(0, 0, 960, 960);
	bgBlur.visible = false;
	stage.addChild(bgBlur);

	circleTimer = new createjs.Bitmap("images/circleTimer.png");
	circleTimer.regX = 153;	
	circleTimer.regY = 106;
	circleTimer.x = 480;
	circleTimer.y = 320; 
	circleTimer.visible = false;
	stage.addChild(circleTimer);

	lbReadyCounter = new createjs.Text("3", "bold 200px Verdana", "fff600");
	lbReadyCounter.textAlign = "center";
	lbReadyCounter.x = 480;
	lbReadyCounter.y = 190;
	lbReadyCounter.time = READY_COUNTER_TIME;
	lbReadyCounter.visible = false;
	stage.addChild(lbReadyCounter);
	//tanlong: end
//thuantq:begin and disable button
    for(var i = 0; i < CHIPS.length; i++)
    {
        chipsDisable[i] = new createjs.Container();
        var chipName = 'chip'+(i);
        chipsDisable[i][chipName] = new createjs.Container();
        chipsDisable[i][chipName].x = (i-2)* 65;

        var chipVal = CHIPS[i];

        var chipSpriteName = "tip_"+chipVal;
        var down = chipSpriteName + "_3";
        //hinh anh
        chipsDisable[i][chipName].graphic = new createjs.Sprite(TIPS_SPRITE_SHEET, chipSpriteName);
        chipsDisable[i][chipName].helper = new  createjs.ButtonHelper(
            chipsDisable[i][chipName].graphic, down, down, down);


        chipsDisable[i][chipName].graphic.chipIdx = i;
        chipsDisable[i][chipName].graphic.regX = 62/2;
        chipsDisable[i][chipName].graphic.regY = 62/2;
        chipsDisable[i][chipName].addChild(chipsDisable[i][chipName].graphic);

        chipsDisable[i].addChild(chipsDisable[i][chipName]);

        chipsDisable[i].x = -80;
        chipsDisable[i].y = 280;
        chipsDisable[i].visible=true;
        board.addChild(chipsDisable[i]);
    }

    //thuantq:end
}
function clickBB(){};


var D330 = 350;
function buildPlayerProfile()
{

	var POSITIONS = [
            {x:BOARD_WIDTH * -1/2 * 0.5 - 120, y:BOARD_HEIGHT *  1/2 * 0.4},		//bottom
            {x:BOARD_WIDTH * -1/2 * 0.5 - 100, y:BOARD_HEIGHT * -1/2 * 0.75},		//left        
            {x:BOARD_WIDTH *  0/2 * 0.5 - 100, y:BOARD_HEIGHT * -1/2 * 0.75},		//top                
            {x:BOARD_WIDTH *  1/2 * 0.5 - 100, y:BOARD_HEIGHT * -1/2 * 0.75}		//right
    ];
	
	
	console.log(POSITIONS);


	for (var i = 0; i < 4; i++)
	{
		var playerCont = new createjs.Container();
		
		//baground avatar. index value = 0. in the bottom
		var avatarBG2 = new createjs.Bitmap("images/new_2/other_player_amount_base.png");
		avatarBG2.regX = 144/2;
		avatarBG2.regY = 25/2;
		playerCont.addChild(avatarBG2);


        playerCont.crownKing = new createjs.Bitmap("images/new_2/owner_crown.png");
        playerCont.crownKing.regX = 144 / 2 + 20;
        playerCont.crownKing.regY = 54;
        playerCont.crownKing.visible = false;
        playerCont.addChild(playerCont.crownKing);


		var avatarCont = new createjs.Container();
		avatarCont.x = -50;
		playerCont.addChild(avatarCont);
		
		var avatarBG = new createjs.Bitmap("images/new_2/Profiles/profile_computer_54.png");
		avatarBG.regX = 54/2;
		avatarBG.regY = 54/2;
		avatarCont.addChild(avatarBG);
		
		
		//avatar
		playerCont.avatar = new createjs.Bitmap("images/new_2/Profiles/profile_man.png");
		playerCont.avatar.regX = 54/2;
		playerCont.avatar.regY = 54/2;
		avatarCont.addChild(playerCont.avatar);
		
		//avatar mask.
		var starMask = new createjs.Shape();
		starMask.graphics.beginStroke("#FF0").setStrokeStyle(5).drawCircle(0,0,48/2).closePath();
		playerCont.avatar.mask = starMask;
			
		//Name
		playerCont.name = new createjs.Text("casinomagic123", "bold 14px Verdana", "#FFFFFF");
		playerCont.name.textAlign = "center";
		playerCont.name.regY = 7;
		playerCont.name.x = 25;
		playerCont.addChild(playerCont.name);
		
		
		//button ready.
		playerCont.ready = new createjs.Bitmap("images/new/game-common/ready.png");
		playerCont.ready.regX = 26/2;
		playerCont.ready.regY = 26/2;
		playerCont.ready.x = 70;
		playerCont.ready.y = -10;
		playerCont.addChild(playerCont.ready);
		

		//RESULT: win lose		
		var matchResultSpritesheet = new createjs.SpriteSheet({
			images:["images/new_2/Win.png", "images/new_2/lose.png"],
			frames: {
					width: 180,
					height: 60,
					regX: 90,
					regY: 30,
				},
			animations : {win:[0], lose:[1]}
		});
		playerCont.result = new createjs.Sprite(matchResultSpritesheet, "win");
		playerCont.result.gotoAndStop("win");
		playerCont.result.y = -30;
		playerCont.result.x = 30;
		playerCont.addChild(playerCont.result);

		
		
		//PROGRESS Bet
		playerCont.betStatus = new createjs.Container();
		playerCont.betStatus.x = i==0?D330:0;
		playerCont.betStatus.y = i==0?-10:115;
		playerCont.addChild(playerCont.betStatus);
				
		var betBG = new createjs.Bitmap("images/new_2/other_player_amount_base.png");
		betBG.regX = 144/2;
		betBG.regY = 25/2;		
		playerCont.betStatus.addChild(betBG);
		
		//var betS
		var betIconSpriteSheet =  new createjs.SpriteSheet(
				{
				    "images": [
				             "images/new_2/status/none.png",
				             "images/new_2/status/follow.png", 
				             "images/new_2/status/up.png",
				             "images/new_2/status/drop.png",				             
				             "images/new_2/status/drop_white.png"
				             ],
				             
				    "frames": { "width": 50, "height": 50, "regX": 50/2, "regY": 50/2},    
				    "animations": { "none": [0], "follow": [1], "up": [2], "drop": [3, 4, "drop", BAD_FACE_FRAMERATE] }
				}
			);
		playerCont.betStatus.icon = new createjs.Sprite(betIconSpriteSheet, "follow");
		
		//tanlong: begin
		playerCont.betStatus.icon.framerate = 2;
		//tanlong: end

		playerCont.betStatus.icon.setStatus = function(playerStatus, up)
		{
			var mapStatus = {};
			mapStatus[PlayerStatus.BET_NONE] = "none";
			mapStatus[PlayerStatus.BET_FOLLOW] = "follow";
			mapStatus[PlayerStatus.BET_SURRENDER] = "drop";
			mapStatus[PlayerStatus.BET_NO_FOLLOW] = "drop";
			
			if(mapStatus.hasOwnProperty(playerStatus))
			{
				var animName = mapStatus[playerStatus];
				if (playerStatus == PlayerStatus.BET_FOLLOW && up == true)
					animName = "up";
				
				this.gotoAndPlay(animName);
			}


//			BET_NONE : 3,
//			BET_FOLLOW : 4,			// da theo
//			BET_SURRENDER : 5,		// da dau hang, ko choi tiep
//			BET_NO_FOLLOW : 6,		// khong lua chon, bi force la no_follow
		};
		playerCont.betStatus.icon.x = -72;
		playerCont.betStatus.addChild(playerCont.betStatus.icon);
		
		
		//Bet text.
		playerCont.betStatus.bet = new createjs.Text("1$", "bold 14px Verdana", "#FFFF00");
		playerCont.betStatus.bet.textAlign = "center";
		playerCont.betStatus.bet.x = 20;
		playerCont.betStatus.bet.y = -10;
		playerCont.betStatus.addChild(playerCont.betStatus.bet);

		//tanlong: begin
		playerCont.betStatus.bet.updateBlink = function () {
			var t = new Date().getTime();
			if (this.blinkTime == undefined) {
				this.blinkTime = t;	
			} else {
				if (t - this.blinkTime > BLINK_BET_FRAMERATE) {
					this.visible = ! this.visible;
					this.blinkTime = t;
				}
			};
		}		
		//tanlong: end

		playerCont.setBet = function(amount, status, color){
			var higher = 0;
			var equaler = 0;
			for (var i = 0; i < playerBets.length; i++)
			{
				if (playerBets[i] > amount)
				{
					higher ++;
				}
				if (playerBets[i] == amount)
				{
					equaler ++;
				}
			}
			var playerBetMax = (higher == 0 && equaler == 1);
							
			this.betStatus.visible = true;			
			this.betStatus.icon.setStatus(status, playerBetMax );
			this.betStatus.bet.text = amount + " $";
			this.betStatus.bet.color = color;
		}
		
		//Add Progress Bar. //DIEPNH: NHUNG DONG CODE THAN THANH.
//		playerCont.progress = new createjs.Shape(); 		
//		playerCont.progress.graphics.beginStroke("#C33").drawRect(-50,-10,100,20);
//		playerCont.progress.graphics.beginFill("#C33").drawRect(-50,-10,0,20);
//		playerCont.progress.y = 45;
//		playerCont.addChild(playerCont.progress);
//		
//		playerCont.progress.setProgress = function(percent){
//			this.graphics.clear();
//			this.graphics.beginStroke("#C33").drawRect(-50,-10,100,20);
//			this.graphics.beginFill("#C33").drawRect(-50,-10,100 * percent,20);
//		}
//		
		playerCont.progress = new createjs.Container();
		playerCont.progress.x = i==0?D330:0;
		playerCont.progress.y = i==0?-35:140;
		playerCont.addChild(playerCont.progress);
		
		//background
		var progressBG = new createjs.Bitmap("images/new_2/progressbar/progress_bg.png");
		progressBG.regX = 142/2;
		progressBG.regY = 16/2;
		playerCont.progress.addChild(progressBG);
		
		
		//bar.
		playerCont.progress.bar = new createjs.Bitmap("images/new_2/progressbar/progress_progress.png");
		playerCont.progress.bar.regX = 142/2;
		playerCont.progress.bar.regY = 16/2;
		playerCont.progress.addChild(playerCont.progress.bar);
		
		playerCont.progress.percent =  new createjs.Shape();
		playerCont.progress.percent.graphics
				.beginStroke("#C33")
				.beginFill("#C33")
				.drawRect(-71,-8,142 * 0.5,16);
//		playerCont.progress.bar.mask = playerCont.progress.percent; 
		
		playerCont.progress.setProgress = function(percent){
//			this.percent.graphics.clear();
//			this.percent.graphics
//				.beginStroke("#C33")
//				.beginFill("#C33")
//				.drawRect(-71,-8,142 * percent,16);
			//bmp.sourceRect = new createjs.Rectangle(10,10,80,80);
			this.bar.sourceRect = new createjs.Rectangle(0,0,142 * percent,15);
			
		};
		
		//PLAYER CARDS.
		var cardCap = new createjs.Container();
		for (var x = 1; x <= 3; x++){
			var cardAttName = 'card'+x;
			cardCap[cardAttName] = buildCard();
			cardCap[cardAttName].x = (x - 2) * 75;
			cardCap.addChild(cardCap[cardAttName]);
		}
				
		cardCap.x = i==0?D330:0; 
		cardCap.y = 65;
		cardCap.scaleX = cardCap.scaleY = i==0?1:0.7;
		playerCont.addChild(cardCap);
		playerCont.cards = cardCap;

		//add to stage.
		playerCont.x = POSITIONS[i].x ;
		playerCont.y = POSITIONS[i].y ;
		board.addChild(playerCont);
		
		
		
		// RESULT:  point
		pointCont = new createjs.Container();
		pointCont.x = i==0?D330:0;
		pointCont.y = 70;
		playerCont.addChild(pointCont);
		
		playerCont.point = pointCont;
		
		//bg
		var pointBG = new createjs.Bitmap("images/new_2/pointDisplay/Blank.png");
		pointBG.regX = 205/2;
		pointBG.regY = 40/2;
		pointCont.addChild(pointBG);
		
		//maxcardName
		playerCont.maxCardName = new createjs.Text("J", "bold 24px Verdana", "#000000");
		//playerCont.maxCardName.textAlign = "center";
		playerCont.maxCardName.x = (-205/2) + 25;
		playerCont.maxCardName.y = -15;
		pointCont.addChild(playerCont.maxCardName);
		
		//maxCardType
		
		var cardSpriteSheet = new createjs.SpriteSheet(CARD_ATLAS);		
		playerCont.maxCardType = new createjs.Sprite(cardSpriteSheet, "Clover");
		playerCont.maxCardType.x = (-205/2) + 15;
		playerCont.maxCardType.regX = 56/2;
		playerCont.maxCardType.regY = 61/2;
		playerCont.maxCardType.scaleX = 0.5;
		playerCont.maxCardType.scaleY = 0.5;
		playerCont.maxCardType.gotoAndStop("Clover");
		pointCont.addChild(playerCont.maxCardType);
		
		//score.
		
		//1> normal Point
		playerCont.normalPoint = new createjs.Container();
		playerCont.normalPoint.x = 25;
		pointCont.addChild(playerCont.normalPoint);
		
		//1.1> normal point . text.
		var textPoint = new createjs.Bitmap("images/new_2/pointDisplay/text_point.png");
		textPoint.regX = 80/2;
		textPoint.regY = 32/2;
		playerCont.normalPoint.addChild(textPoint);

		//2.2 normal point . val.
		var valPoint = new createjs.Text("3", "bold 20px Verdana", "#000");
		valPoint.textAlign = "center";
		valPoint.x = -47;
		valPoint.y = -13;		
		playerCont.normalPoint.addChild(valPoint);
		playerCont.normalPoint.point = valPoint;
		
		//2> holy point
		playerCont.holyPoint = new createjs.Bitmap("images/new_2/pointDisplay/text_holy.png");
		playerCont.holyPoint.x = 25;
		playerCont.holyPoint.regX = 130/2;
		playerCont.holyPoint.regY = 32/2;
		pointCont.addChild(playerCont.holyPoint);

		//tanlong: begin
		pointCont.white = new createjs.Bitmap("images/new_2/pointDisplay/Blank_White.png");
		pointCont.white.regX = 205/2;
		pointCont.white.regY = 40/2;
		pointCont.white.visible = false;
		pointCont.addChild(pointCont.white);
		//tanlong: end
		
		playerCont.hidePoint = function() {
			this.point.visible = false;
		};
		playerCont.showPoint = function(maxCardNameId, maxCardTypeId, point){			
			this.point.visible = true;
			
			var cardName = getCardName(maxCardNameId);
			this.maxCardName.text = cardName.toUpperCase();
			
			var spriteNameType = getSpriteName_CardType(maxCardTypeId);
			this.maxCardType.gotoAndStop(spriteNameType);
			
			if (point == 10) //tam tien.
			{
				this.holyPoint.visible = true;
				this.normalPoint.visible = false;				
			} else {
				this.holyPoint.visible = false;
				this.normalPoint.visible = true;
				this.normalPoint.point.text = ""+point;
			}
		};
		
				
		//store.
		playerConts.push(playerCont);
	}
}


var betMore = 0;
/***
 * click mua chip.
 */
function onClickChips(evt)
{	
	//log.
	console.log("type: "+evt.type+" target: "+evt.target+" stageX: "+evt.stageX);
	console.log(evt.target);
	console.log(evt.target.chipIdx);

	//tanlong: begin
	//blink cái số tiền bet
	var oldBetMore = betMore;
	var timerCallback = function () {
		console.log("BET MORE: " + betMore);

		if (betMore > 0) {
			setTimeout(function () {
				timerCallback();
			}, 500);
		}
	};
	//tanlong: end
	
	//abc.
	var chipVal = CHIPS[evt.target.chipIdx];
	
	if (betMore + chipVal +playerBets[myPlayerId-1] > maxBet)
	{
		//tanlong: begin
		//sound
		createjs.Sound.play("bet_fail");
		//tanlong: end

		return;
	}	
	betMore += chipVal;
	updateBet();


	//tanlong: begin
	//sound
	createjs.Sound.play("bet1");
	if (betMore > 0 && oldBetMore == 0) {
		setTimeout(function () {
			timerCallback();
		}, 500);
	}
	//tanlong: end
}

function onClickBtnSend (event)
{
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end
	
	console.log("click send" );
}

function onClickBetButtons(evt)
{
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end
	
	switch(evt.target.name)
	{
		case "surrender":
			console.log("surrender");
			sfs.send( new SFS2X.Requests.System.ExtensionRequest("surrender", {}, sfs.lastJoinedRoom) );
			
			break;
		case "bet":
			
			console.log("bet");
			//check valid// phai lon hon tat ca moi nguoi.
			var maxBet = Math.max(playerBets[0], 
					playerBets[1],
					playerBets[2],
					playerBets[3]);
			var myBet = playerBets[myPlayerId-1] + betMore;
			
			if (myBet < maxBet )
			{
				console.log("must bet >= " + maxBet);
				return;
			}
			
			data = {};
			data['totalBet'] = myBet;
			sfs.send( new SFS2X.Requests.System.ExtensionRequest("bet", data, sfs.lastJoinedRoom) )
			betMore = 0;

			break;
		case "resetBet":
			betMore = 0;
			updateBet();
			console.log("rebet");
			break;
		case "follow":
			
			var maxBet = Math.max(playerBets[0], 
					playerBets[1],
					playerBets[2],
					playerBets[3]);
			
			betMore = maxBet - playerBets[myPlayerId -1];
			betMore = Math.max(0,betMore);
			console.log("follow ", maxBet, betMore);
			updateBet();
			break;
	}
}

//click button leave room!
function onClickBtnLeave(event)
{
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end

	RUN_BLINK = false;

	leaveRoom();
}

function onClickBtnRule(event)
{
	//tanlong: begin
	createjs.Sound.play("click");
	//tanlong: end
}


/**
 * Update the canvas
 */
function _onTick() {
	var currentTimestamp = new Date().getTime();
//	console.log('ontick');
    stage.update();
    
    switch (matchState)
    {
    	case MatchState.BET:
    		var elapsed = (currentTimestamp - lastUpdateState);
    		var roundedElapsed = Math.floor(elapsed/1000);
    		var countdown = Math.max(0,BET_TIME_IN_SECONDS - roundedElapsed);
    		if(countdown == 0)
    		{
    			countDownStatus.visible = false;
    			    			
    		} else {
    			countDownStatus.visible = true;
    			var playerInTurnPos = getPlayerPos(playerInTurn);        		
    			playerConts[playerInTurnPos].progress.setProgress(1 - elapsed/1000/BET_TIME_IN_SECONDS);
    			countDownStatus.text = countdown;

    			//tanlong: begin
    			// for (var i = 0; i < playerConts.length; i++) {
    			// 	playerConts[i].betStatus.bet.visible = true;
    			// };

    			playerConts[playerInTurnPos].betStatus.bet.updateBlink();
    			//tanlong: end
    		}
    		break;
    	case MatchState.SHOW_RESULT:
        	break;
        	
    }
}

/**
 * Destroy the game instance
 */
function destroyGame(){
//	sfs.removeEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse);
//	sfs.removeEventListener(SFS2X.SFSEvent.SPECTATOR_TO_PLAYER, onSpectatorToPlayer);
	
	//Remove PopUp
	//removeGamePopUp();
	//removeGameMessage();
}

/**
 * Start the game
 */
function startGame(params){
	//start game, start game!
	console.log("call to start game");
	
	
	// Reset the game board
	resetGameBoard();
		
	// Remove the "waiting for other player..." popup
	//removeGamePopUp();
	removeGameMessage();

	
	gameStarted = true;
}

function resetPlayerUI(playerCont){
	playerCont.cards.visible = false;
	
	playerCont.name.text = "";
	changeAvatar(playerCont, "images/new_2/Profiles/profile_woman.png",54);
	
	playerCont.ready.visible = false;
	
	playerCont.betStatus.visible = false;
	
	showCards_down(playerCont);
	
	playerCont.hidePoint();
	
	playerCont.progress.visible = false;
	playerCont.result.visible = false;
}

/**
 * Clear the game board
 */
function resetGameBoard(){
	console.log("resetGameBoard");
	
	for (var i = 0; i < playerConts.length; i++)
	{
		var playerCont = playerConts[i];
		resetPlayerUI(playerCont);
	}
	
	board.totalBet.visible = false;
	board.myCash.visible = false;

	//tanlong: begin
	bgBlur.visible = false;
	lbReadyCounter.visible = false;
	circleTimer.visible = false;

	lbReadyCounter.text = "3";
	lbReadyCounter.time = 3;
	//tanlong: end
}


/**
 * Enable board click
 */
function enableBoard(enable){
//	if(iAmSpectator == false && sfs.mySelf.getPlayerId(sfs.lastJoinedRoom) == whoseTurn)
//	{
//		for(var i = 0; i<9; i++){
//			var square = squares[i];
//			
//			if(square.ball.currentFrame == 0)
//			{
//				if(enable)
//					square.onClick = makeMove;
//				else
//					square.onClick = null;
//			}
//		}
//	}
}

/**
 * On board click, send move to other players
 */
//function makeMove(evt){
//	var square = evt.target;
//	square.ball.gotoAndStop(sfs.mySelf.getPlayerId(sfs.lastJoinedRoom));
//	square.onClick = null;
//	
//	enableBoard(false);
//	
//	var x = square.id % 3 + 1;
//	var y = Math.floor(square.id / 3) + 1;
//	
//	var obj = {};
//		obj.x = x;
//		obj.y = y;
//	
//	sfs.send( new SFS2X.Requests.System.ExtensionRequest("move", obj, sfs.lastJoinedRoom) )
//}
//
///**
// * Handle the opponent move
// */
//function moveReceived(params){
//	var movingPlayer = params.t;
//	whoseTurn = (movingPlayer == 1) ? 2 : 1;
//	
//	if(movingPlayer != sfs.mySelf.getPlayerId(sfs.lastJoinedRoom))
//	{
//		var square = squares[(params.y-1) * 3 + (params.x-1)];
//		square.ball.gotoAndStop(movingPlayer);
//	}
//	
//	setTurn();
//	enableBoard(true);
//}

/**
 * Restart the game
 */
function restartGame()
{
	//removeGamePopUp();
	//removeGameMessage();
	sfs.send( new SFS2X.Requests.System.ExtensionRequest("restart", {}, sfs.lastJoinedRoom) )
}

function endGame()
{
	//removeGamePopUp();
	//removeGameMessage();
	setView("lobby", true);
}

function leaveRoom()
{
	
	if (sfs.lastJoinedRoom.groupId  == GAME_ROOMS_GROUP_NAME){
		var isInRoom = false;
		//neu van con o trong room.
		var rooms = sfs.getJoinedRooms();
		for (var i = 0; i < rooms.length; i++)
		{
			if (rooms[i].id == sfs.lastJoinedRoom.id)
				isInRoom = true;
		}
		if (isInRoom)
			sfs.send(new SFS2X.Requests.System.LeaveRoomRequest());
	}

	//removeGamePopUp();
	//removeGameMessage();
	setView("lobby", true);
}

/**
 * If a spectator enters the game room and the match isn't started yet,
 * he can click the join button
 */
function spectatorJoinGame()
{
	sfs.send( new SFS2X.Requests.System.SpectatorToPlayerRequest() );
}

//------------------------------------
// Game Popup
//------------------------------------
/**
 * Show the Game PopUp
 */
function showGamePopUp(id, message){
	if(currentPopUp != undefined)
		removeGamePopUp();
	
	disabler.visible = true;
	
	currentPopUp = $("#"+id+"GameWin");
	
	currentPopUp.jqxWindow("open");
	currentPopUp.jqxWindow("move", (canvas.width/2) - (currentPopUp.jqxWindow("width") / 2) + canvas.offsetLeft, (canvas.height/2) - (currentPopUp.jqxWindow("height") / 2) + canvas.offsetTop);
	currentPopUp.children(".content").children("#firstRow").children("#message").html(message);
}

/**
 * Hide the Game PopUp
 */
function removeGamePopUp(){
	if(currentPopUp != undefined){
		disabler.visible = false;
		
		currentPopUp.jqxWindow("close");
		currentPopUp = undefined;
	}
}

//------------------------------------
// SFS EVENT HANDLERS
//------------------------------------

function onExtensionResponse (evt){
	var params = evt.params;
	var cmd = evt.cmd;
	
	console.log("> Received Extension Response: "+cmd)
	
	switch(cmd){
//		case "owner_stop": //chu room thoat roi!
//			userLeft();
//			break;
		case "move":
			moveReceived(params);
			break;
		case "ready_response":
			console.log("ready_response");
			responsePlayerReady(params);
			break;
		case "deal":
			console.log("deal");
			responseDealCards(params);
			break;
		case "show_card":
			responseShowcards(params);
			break;
		case "player_bet":
			responsePlayerBet(params);
			break;
		case "player_surrender":
			responsePlayerSurrender(params);
			break;
		case "beginTurn":
			console.log("beginTurn");
			responseBeginTurn(params);
			break;
		case "createThreeCardRoom_response":			
			//TODO: show message create game error.
			responseCreateThreeCardRoom(params);
			break;
		case "joinThreeCardRoom_response":
			responseJoinThreeCardRoom(params);
			break;
	}
}

function responseJoinThreeCardRoom(response){
	if (response.error == 0)
		return;
	var message = "join room failed!";
	//de day no ngoi woai ah.
	switch (response.error)
	{
		case ResponseCode.ERR_MATCH_BEGAN:			
			message = "join room failed because room started game!";
			break;
		case ResponseCode.ERR_NOT_ENOUGH_MONEY:
			message = "join room failed because you not enough money!";
			break;
		case ResponseCode.ERR_ROOM_NOT_FOUND:
			//message = "";
			break;
	}
	showMessage(message);
}
function responseCreateThreeCardRoom(response)
{	
	if (response.error == 0)
		return;
	var message = "Create room fail!";
	//de day no ngoi woai ah.
	switch (response.error)
	{
		case ResponseCode.ERR_SFS_API_FAIL:			
			break;
		case ResponseCode.ERR_PLATFORM_API_FAIL:			
			break;
		case ResponseCode.ERR_NOT_ENOUGH_MONEY:
			message = "Create room fail because you not enough money!";
			break;
		case ResponseCode.ERR_ROOM_NOT_FOUND:
			//message = "";
			break;
	}
	showMessage(message);
}
function responseBeginTurn(response)
{
	console.log(response);
	playerInTurn = response.playerInTurn;
	
	console.log("--------------------------------------------------------------------");
	console.log("TURN " + playerInTurn);

	//cap nhat dong ho dem nguoc.
	changeState(MatchState.BET);
	
	updatePlayerTurnUI();
}

function updatePlayerTurnUI()
{
	var playerInTurnPos = getPlayerPos(playerInTurn);
	//tat progress bar
	for (var i  = 0; i < 4; i++)
	{
		if (i == playerInTurnPos)
			playerConts[i].progress.visible = true;
		else
			playerConts[i].progress.visible = false;
	}
	
	//cap nhat giao dien cua nguoi choi, neu den luot.
	if (playerInTurn == myPlayerId)
	{
		betbuttons.visible = true;
	} else {
		betbuttons.visible = false;
	}	
}

function responsePlayerBet(response)
{
	//tanlong: begin
	//sound
	switch(response.status) {
		case PlayerStatus.BET_SURRENDER:
		case PlayerStatus.BET_NO_FOLLOW:
			createjs.Sound.play("surrender");
		break;

		case PlayerStatus.BET_NONE:
		case PlayerStatus.BET_FOLLOW:
			createjs.Sound.play("bet3");
		break;
	}
	//tanlong: end

	console.log(response);
	var playerId = response.playerId;
	var status = response.status;	
	var totalBet = response.totalBet;	 
	playerBets[playerId-1] = totalBet;
	playerStatus[playerId-1] = status;
	updateBet();
	changeState(MatchState.BET);
}

function updateDefaultBet()
{
	for(var i = 0; i < playerConts.length; i++)
	{
		playerConts[i].betStatus.bet.text = ""+minBet + "$";
	}
}

function updateBet()
{
	//cap nhat so tien toi thieu tren ban moi nguoi.
	var users = playedPlayers;
	for (var i = 0; i < users.length; i++)
	{
		var user = users[i];
		if (user != null){
			var playerId = user.getPlayerId(sfs.lastJoinedRoom);
			var pos = getPlayerPos(playerId);
			var playerBet = playerBets[playerId-1];
			var betting = false;
			if(playerId == myPlayerId && betMore > 0)
			{
				playerBet += betMore;
				betting = true;
			}		
			
			var colorText =  "#FFFF00";
			if(betting == true)
			{
				colorText = "#00FF00";
			}
			
			console.log("updateBet " + pos + " " + playerBet);
			playerConts[pos].setBet(playerBet, playerStatus[playerId-1],colorText );
		}

	}
	updateTotalBet();
}

function responseShowcards(response)
{
	console.log("responseShowcards", response);
	countDownStatus.visible = false;
	
	changeState(MatchState.SHOW_RESULT);
	
	var cards = response.cards;
	var scores = response.scores;
	var winner = response.winner;

	//tanlong: begin
	//sound
	if (myPlayerId == winner) { 		//win
		createjs.Sound.play("win");
	} else { 							//lose
		createjs.Sound.play("lose");
	};
	//tanlong: end


	//tanlong: begin
	RUN_BLINK = true;

	var timerCallback = function () {

		if (RUN_BLINK == true) {
			for (var i = 0; i < playerConts.length; i++) {
				playerConts[i].point.white.visible = ! playerConts[i].point.white.visible;
			}

			stage.update();

			if (playerConts[0].point.white.visible) {
				setTimeout(function () {
					timerCallback();
				}, BLINK_TIME_OFF);
			} else {
				setTimeout(function () {
					timerCallback();
				}, BLINK_TIME_ON);
			};
		}
	}

	setTimeout(function () {
		timerCallback();
	}, 200);
	//tanlong: end
	
	for (var i = 0; i < 4; i++)
	{
		dealedCards[i] = [];
		maxCards[i] = 99999999;
		for (var j = 0; j < 3; j++)
		{
			var cardId = cards[i*3+j];
			maxCards[i] = Math.min(cardId, maxCards[i]);
			dealedCards[i].push(calcCard(cardId));
		}
	}	
	
	var sfsWinner = null;
	var users = playedPlayers;
	for (var i = 0; i < users.length; i++)
	{
		if (users[i] != null){
			var playerId = users[i].getPlayerId(sfs.lastJoinedRoom);
			var pos = getPlayerPos(playerId);
			showCards(playerConts[pos], dealedCards[playerId-1],scores[playerId-1], maxCards[playerId-1]);
			playerConts[pos].result.visible = true;
			if(playerId == winner){
				sfsWinner = users[i];
				playerConts[pos].result.gotoAndStop("win");
			} else {
				playerConts[pos].result.gotoAndStop("lose");
			}
		}
	}	
	
	console.log("Winner la ", sfsWinner);
	//showGamePopUp("end", "Winner is " + sfsWinner.getVariable("displayname").value);
}

function calcTotalBet(){
	var total = 0;
	for(var i = 0; i < playedPlayers.length; i++)
	{
		if (playedPlayers[i] != null)
			total += playerBets[i];
	}
	return total;
}

function updateTotalBet(){
	var totalBet = calcTotalBet();
	//board.totalBet.betValue.text = "" + totalBet + "$";
	
	//update myself bet.
	board.myCash.total.text = "" +maxBet +"$";
    var _remainCash=(maxBet - playerBets[myPlayerId-1] - betMore);
	//board.myCash.remain.text = "" + _remainCash + "$";
    LockChipBig(_remainCash);

    if(effectTimeOut!=null)
        clearInterval(effectTimeOut);
    percentRemainCash=0;
    var value1=oldMoneyRemain;
    var value2=_remainCash;
    if(value1!=value2)
    {
        effectTimeOut=setInterval(function(){EffectMoney(value1,value2)},20);
    }
    //effect total
    if(effectTotalBet!=null)
        clearInterval(effectTotalBet);
    percentTotal=0;
    var value3=oldTotalBet;
    var value4=totalBet;
    if(value3!=value4)
    {
        effectTotalBet=setInterval(function(){EffectTotalBet(value3,value4)},20);
    }
}
//thuantq: begin effect text

function EffectTotalBet(value3,value4)
{
    if(percentTotal>100)
        percentTotal=100;
    oldTotalBet=Math.floor(value3+((value4-value3)*percentTotal)/100);
    board.totalBet.betValue.text= "" + oldTotalBet + "$";
    if(percentTotal<99)
    {
        percentTotal+=10;
    }
    else
    {
        clearInterval(effectTotalBet);
    }
}
function EffectMoney(value1,value2)
{
    if(percentRemainCash>100)
        percentRemainCash=100;
    oldMoneyRemain=Math.floor(value1+((value2-value1)*percentRemainCash)/100);
    board.myCash.remain.text = "" + oldMoneyRemain + "$";
    if(percentRemainCash<99)
    {
        percentRemainCash+=10;
    }
    else
    {
        clearInterval(effectTimeOut);
    }
}
function LockChipBig(_remainCash)
{
    var lockIndex=0;
    if(_remainCash<5)
    {
        lockIndex=0;
    }
    else if(_remainCash<10)
    {
        lockIndex=1;
    }
    else if(_remainCash<25)
    {
        lockIndex=2;
    }

    else if(_remainCash<50)
    {
        lockIndex=3;
    }

    else if(_remainCash<100)
    {
        lockIndex=4;
    }
    else
    {
        lockIndex=5;
    }
    for(var i=0;i<5;i++)
    {
        if(i>=lockIndex)
        {
            chipsDisable[i].visible=true;
        }
        else
        {
            chipsDisable[i].visible=false;
        }
    }
}
//thuantq:end
function responseDealCards(response)
{
	removeGameMessage();
	//removeGamePopUp();
	//show bieu tuong deal card.
	countDownStatus.visible = true;
	//duyet qua cac user va phat bai cho user.
	console.log("responseDealCards", response);
	
	
	//console.log(response.cards);
	var users = sfs.lastJoinedRoom.getUserList();
	for (var i = 0; i < users.length; i++)
	{
		var playerId = users[i].getPlayerId(sfs.lastJoinedRoom);



		playedPlayers[playerId-1] = users[i];		
		playerStatus[playerId-1] = PlayerStatus.BET_NONE;		
		
		var pos = getPlayerPos(playerId);
		var playerCont = playerConts[pos];
        if(playerId==1)
        {
            playerCont.crownKing.visible=true;
        }
        else
        {
            playerCont.crownKing.visible=false;
        }
		//show card
		playerCont.cards.visible = true;
		playerCont.cards.card1.visible = false;
		playerCont.cards.card2.visible = false;
		playerCont.cards.card3.visible = false;
		
		//show trang thai bet
		playerCont.betStatus.visible = true;
		//playerCont.setBet(playerBets[playerId-1], playerStatus[playerId-1], "#FFFF00");
		
	}
	
	//tien hanh deal cards.	
	board.totalBet.visible = true;	
	board.myCash.visible = true;
	updateBet();
	//updateTotalBet();
	
	console.log(response.cards);
	//mo bai cua user.
	var playerCards = [];
	for (var i = 0; i < response.cards.length; i++)
	{
		playerCards.push(calcCard( response.cards[i]));
	}
	
//	var pos = getPlayerPos(myPlayerId);
//	showCards(playerConts[pos], playerCards);
	//phat bai
	var tweenObject = createjs.Tween.get(board.cardOnDeal);
	for (var round  = 0; round < 3; round++)
	{
		for (var i = 0; i < playedPlayers.length; i++)
		{		
			if (playedPlayers[i]!= null)
			{
				var playerId = i+1;				
				var cardInfo = null;
				if (playerId == myPlayerId)
					cardInfo = playerCards[round];
						
				dealCard(tweenObject, playerId, round, cardInfo);
				
			}
		}
	}
}

function responsePlayerReady(params)
{
	console.log("onPlayerReady", params);
	var player = params.player;
	var pos = getPlayerPos(player);
	playerConts[pos].ready.visible = true;
}

function onUserVarsUpdate(evtParams)
{
	var changedVars = evtParams.changedVars;
	var user = evtParams.user;
	console.log("onUserVarsUpdate", evtParams);	
	
	if (user == sfs.mySelf){	
		updateLobby();
	}
}

