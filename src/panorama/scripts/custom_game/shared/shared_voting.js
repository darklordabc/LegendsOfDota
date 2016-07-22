"use strict";

var votingMenus = {
	// The main voting menu
	mainMenu: {
		items: [
			{
				title: 'votingChangeOptions',
				des: 'votingChangeOptionsDes'
			},
			{
				title: 'votingBalanceTeams',
				des: 'votingBalanceTeamsDes',
				link: 'balanceTeams'
			},
			{
				title: 'votingGameplay',
				des: 'votingGameplayDes',
				link: 'gameplay'
			},
			{
				title: 'votingGiveup',
				des: 'votingGiveupDes',
				link: 'giveup'
			}
		]
	},
	balanceTeams: {
		items: [
			{
				title: 'votingGoBack',
				des: 'votingGoBackDes',
				link: 'mainMenu'
			}
		]
	},
	gameplay: {
		items: [
			{
				title: 'votingGoBack',
				des: 'votingGoBackDes',
				link: 'mainMenu'
			},
			{
				title: 'votingGameplayAddGold',
				des: 'votingGameplayAddGoldDes',
				confirmVote: true,
				back: 'gameplay',
				options: [
					{
						title: 'votingGameplayAddGoldAmount',
						des: 'votingGameplayAddGoldAmountDes',

						fieldName: 'amount',
						sort: 'range',
						step: 1,
						min: 1,
						max: 100000,
						default: 1000
					}
				]
			},
		]
	},
	giveup: {
		items: [
			{
				title: 'votingGoBack',
				des: 'votingGoBackDes',
				link: 'mainMenu'
			},
			{
				title: 'votingGiveupCallGG',
				des: 'votingGiveupCallGGDes',
				confirmVote: true,
				back: 'giveup'
			},
			{
				title: 'votingGiveupCallDraw',
				des: 'votingGiveupCallDrawDes',
				confirmVote: true,
				back: 'giveup'
			}
		]
	}
};

// Export it
Game.shared.votingMenus = votingMenus;
