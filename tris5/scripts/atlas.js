var CARD_ATLAS = {
	"images" : [ "images/atlas/cards.png" ],
	"frames" : [

	[ 2226, 1112, 276, 368 ], [ 2781, 1112, 275, 368 ],
			[ 2780, 1482, 275, 368 ], [ 2504, 1112, 275, 368 ],
			[ 2503, 1482, 275, 368 ], [ 2504, 742, 276, 368 ],
			[ 2226, 742, 276, 368 ], [ 1948, 1482, 276, 368 ],
			[ 1948, 1112, 276, 368 ], [ 1948, 742, 276, 368 ],
			[ 2504, 372, 276, 368 ], [ 2226, 372, 276, 368 ],
			[ 2226, 1482, 275, 368 ], [ 1948, 372, 276, 368 ],
			[ 1670, 1482, 276, 368 ], [ 1670, 1112, 276, 368 ],
			[ 1670, 742, 276, 368 ], [ 1670, 372, 276, 368 ],
			[ 2504, 2, 276, 368 ], [ 2226, 2, 276, 368 ],
			[ 1948, 2, 276, 368 ], [ 1670, 2, 276, 368 ],
			[ 1392, 1482, 276, 368 ], [ 1392, 1112, 276, 368 ],
			[ 1392, 742, 276, 368 ], [ 1392, 372, 276, 368 ],
			[ 1392, 2, 276, 368 ], [ 1114, 1482, 276, 368 ],
			[ 1114, 1112, 276, 368 ], [ 1114, 742, 276, 368 ],
			[ 1114, 372, 276, 368 ], [ 1114, 2, 276, 368 ],
			[ 836, 1482, 276, 368 ], [ 836, 1112, 276, 368 ],
			[ 836, 742, 276, 368 ], [ 836, 372, 276, 368 ],
			[ 836, 2, 276, 368 ], [ 558, 1482, 276, 368 ],
			[ 558, 1112, 276, 368 ], [ 558, 742, 276, 368 ],
			[ 558, 372, 276, 368 ], [ 558, 2, 276, 368 ],
			[ 280, 1482, 276, 368 ], [ 280, 1112, 276, 368 ],
			[ 280, 742, 276, 368 ], [ 280, 372, 276, 368 ],
			[ 280, 2, 276, 368 ], [ 2, 1482, 276, 368 ], [ 2, 1112, 276, 368 ],
			[ 2, 742, 276, 368 ], [ 2, 372, 276, 368 ], [ 2, 2, 276, 368 ],
			[ 2956, 2, 56, 61 ], [ 2898, 2, 56, 61 ], [ 2840, 2, 56, 61 ],
			[ 2782, 2, 56, 61 ] ],
	"animations" : {

		"1_Hhearts/heart1" : [ 0 ],
		"1_Hhearts/heart10" : [ 1 ],
		"1_Hhearts/heart11" : [ 2 ],
		"1_Hhearts/heart12" : [ 3 ],
		"1_Hhearts/heart13" : [ 4 ],
		"1_Hhearts/heart2" : [ 5 ],
		"1_Hhearts/heart3" : [ 6 ],
		"1_Hhearts/heart4" : [ 7 ],
		"1_Hhearts/heart5" : [ 8 ],
		"1_Hhearts/heart6" : [ 9 ],
		"1_Hhearts/heart7" : [ 10 ],
		"1_Hhearts/heart8" : [ 11 ],
		"1_Hhearts/heart9" : [ 12 ],
		"2_Diamonds/Diamond1" : [ 13 ],
		"2_Diamonds/Diamond10" : [ 14 ],
		"2_Diamonds/Diamond11" : [ 15 ],
		"2_Diamonds/Diamond12" : [ 16 ],
		"2_Diamonds/Diamond13" : [ 17 ],
		"2_Diamonds/Diamond2" : [ 18 ],
		"2_Diamonds/Diamond3" : [ 19 ],
		"2_Diamonds/Diamond4" : [ 20 ],
		"2_Diamonds/Diamond5" : [ 21 ],
		"2_Diamonds/Diamond6" : [ 22 ],
		"2_Diamonds/Diamond7" : [ 23 ],
		"2_Diamonds/Diamond8" : [ 24 ],
		"2_Diamonds/Diamond9" : [ 25 ],
		"3_Clovers/clover1" : [ 26 ],
		"3_Clovers/clover10" : [ 27 ],
		"3_Clovers/clover11" : [ 28 ],
		"3_Clovers/clover12" : [ 29 ],
		"3_Clovers/clover13" : [ 30 ],
		"3_Clovers/clover2" : [ 31 ],
		"3_Clovers/clover3" : [ 32 ],
		"3_Clovers/clover4" : [ 33 ],
		"3_Clovers/clover5" : [ 34 ],
		"3_Clovers/clover6" : [ 35 ],
		"3_Clovers/clover7" : [ 36 ],
		"3_Clovers/clover8" : [ 37 ],
		"3_Clovers/clover9" : [ 38 ],
		"4_Spades/spade1" : [ 39 ],
		"4_Spades/spade10" : [ 40 ],
		"4_Spades/spade11" : [ 41 ],
		"4_Spades/spade12" : [ 42 ],
		"4_Spades/spade13" : [ 43 ],
		"4_Spades/spade2" : [ 44 ],
		"4_Spades/spade3" : [ 45 ],
		"4_Spades/spade4" : [ 46 ],
		"4_Spades/spade5" : [ 47 ],
		"4_Spades/spade6" : [ 48 ],
		"4_Spades/spade7" : [ 49 ],
		"4_Spades/spade8" : [ 50 ],
		"4_Spades/spade9" : [ 51 ],
		"Clover" : [ 52 ],
		"Diamond" : [ 53 ],
		"Herart" : [ 54 ],
		"Spade" : [ 55 ]
	}
};

function getSpriteName_Card(nameId, typeId)
{
	var CardTypeMap1 = ["1_Hhearts", "2_Diamonds", "3_Clovers", "4_Spades"];
	var CardTypeMap2 = ["heart", "Diamond", "clover", "spade"];
	var nameTextId = 13 - nameId; //1,2,3,...13
					 //12,.......0.
	return CardTypeMap1[typeId] + "/" + CardTypeMap2[typeId] + nameTextId;
	
}
function getSpriteName_CardType(typeId)
{
	var CardTypeMap = ["Herart", "Diamond", "Clover", "Spade"];
	return CardTypeMap[typeId];
}


var TIPS_ATLAS = {
	"images": ["images/atlas/tips.png"],
	"frames": [

	    [257, 130, 61, 62], 
	    [194, 66, 62, 62], 
	    [130, 130, 62, 62], 
	    [130, 66, 62, 62], 
	    [194, 130, 61, 62], 
	    [194, 2, 62, 62], 
	    [130, 2, 62, 62], 
	    [66, 130, 62, 62], 
	    [66, 66, 62, 62], 
	    [258, 66, 61, 62], 
	    [66, 2, 62, 62], 
	    [2, 130, 62, 62], 
	    [2, 66, 62, 62], 
	    [258, 2, 61, 62], 
	    [2, 2, 62, 62]
	],
	"animations": {
	    
	        "tip_10":[0], 
	        "tip_100":[1], 
	        "tip_100_2":[2], 
	        "tip_100_3":[3], 
	        "tip_10_2":[4], 
	        "tip_10_3":[5], 
	        "tip_25":[6], 
	        "tip_25_2":[7], 
	        "tip_25_3":[8], 
	        "tip_5":[9], 
	        "tip_50":[10], 
	        "tip_50_2":[11], 
	        "tip_50_3":[12], 
	        "tip_5_2":[13], 
	        "tip_5_3":[14]
	}
}


var BUTTONS_ATLAS = 
{
	"images": ["images/atlas/Btn.png"],
	"frames": [

	           [374, 104, 100, 100], 
	           [374, 2, 100, 100], 
	           [236, 398, 100, 100], 
	           [368, 368, 100, 100], 
	           [476, 166, 78, 28], 
	           [454, 236, 78, 28], 
	           [374, 236, 78, 28], 
	           [454, 206, 78, 28], 
	           [368, 266, 100, 100], 
	           [2, 384, 100, 100], 
	           [134, 354, 100, 100], 
	           [134, 252, 100, 100], 
	           [470, 348, 80, 80], 
	           [470, 266, 80, 80], 
	           [476, 84, 80, 80], 
	           [476, 2, 80, 80], 
	           [374, 206, 78, 28], 
	           [418, 470, 78, 28], 
	           [338, 470, 78, 28], 
	           [104, 456, 78, 28], 
	           [2, 127, 238, 123], 
	           [2, 2, 238, 123], 
	           [236, 266, 130, 130], 
	           [2, 252, 130, 130], 
	           [242, 134, 130, 130], 
	           [242, 2, 130, 130]
	       ],
	       "animations": {
	           
	               "betreset_nomal":[0], 
	               "betreset_nomal_disable":[1], 
	               "betreset_nomal_over":[2], 
	               "betreset_nomal_push":[3], 
	               "exit_nomal":[4], 
	               "exit_nomal_disable":[5], 
	               "exit_nomal_over":[6], 
	               "exit_nomal_push":[7], 
	               "follow_nomal":[8], 
	               "follow_nomal_disable":[9], 
	               "follow_nomal_over":[10], 
	               "follow_nomal_push":[11], 
	               "giveup_nomal":[12], 
	               "giveup_nomal_disable":[13], 
	               "giveup_nomal_over":[14], 
	               "giveup_nomal_push":[15], 
	               "rule_nomal":[16], 
	               "rule_nomal_disable":[17], 
	               "rule_nomal_over":[18], 
	               "rule_nomal_push":[19], 
	               "start":[20], 
	               "start_pushed":[21], 
	               "submit_nomal":[22], 
	               "submit_nomal_disable":[23], 
	               "submit_nomal_over":[24], 
	               "submit_nomal_push":[25]
	       },
};

// makecenter.

for (var i = 0; i < BUTTONS_ATLAS.frames.length; i++)
{
	var frame = BUTTONS_ATLAS.frames[i];
	frame.push(0);
	frame.push(frame[2]/2);
	frame.push(frame[3]/2);	
}