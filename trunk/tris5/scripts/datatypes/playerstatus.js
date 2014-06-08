var PlayerStatus = {
	NULL : 0,
	JOIN : 1,			// da join game.
	READY : 2,			// trang thai da san sang.
	BET_NONE : 3,
	BET_FOLLOW : 4,			// da theo
	BET_SURRENDER : 5,		// da dau hang, ko choi tiep
	BET_NO_FOLLOW : 6,		// khong lua chon, bi force la no_follow
};