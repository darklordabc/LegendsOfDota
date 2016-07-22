"use strict";

var votingMenus = {
	// The main voting menu
	mainMenu: {
		items: [
			{
				title: 'votingChangeOptions',
				des: 'votingChangeOptionsDes',
				link: 'changeOptions'
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
	changeOptions: {
		items: [
			{
				title: 'votingGoBack',
				des: 'votingGoBackDes',
				link: 'mainMenu'
			},
			{
				title: 'votingChangeOptionsSpeed',
				des: 'votingChangeOptionsSpeedDes',
				link: 'changeOptionsSpeed'
			}
		]
	},
	changeOptionsSpeed: {
		items: [
			{
				title: 'votingGoBack',
				des: 'votingGoBackDes',
				link: 'mainMenu'
			},
			{
				title: 'votingOptionsRespawnTime',
				des: 'votingOptionsRespawnTimeDes',
				confirmVote: true,
				back: 'changeOptionsSpeed',
				options: [
					{
						title: 'votingOptionsRespawnTimePercentage',
						des: 'votingOptionsRespawnTimePercentageDes',

						fieldName: 'percentage',
						sort: 'range',
						step: 1,
						min: 0,
						max: 100,
						default: 100,
						linkTo: 'lodOptionGameSpeedRespawnTimePercentage'
					},
					{
						title: 'votingOptionsRespawnTimeConstant',
						des: 'votingOptionsRespawnTimeConstantDes',

						fieldName: 'constant',
						sort: 'range',
						step: 1,
						min: 0,
						max: 120,
						default: 0,
						linkTo: 'lodOptionGameSpeedRespawnTimeConstant'
					}
				]
			},
			{
				title: 'votingOptionsGoldTickRate',
				des: 'votingOptionsGoldTickRateDes',
				confirmVote: true,
				back: 'changeOptionsSpeed',
				options: [
					{
						title: 'votingOptionsGoldTickRateAmount',
						des: 'votingOptionsGoldTickRateAmountDes',

						fieldName: 'amount',
						sort: 'range',
						step: 1,
						min: 0,
						max: 25,
						default: 1,
						linkTo: 'lodOptionGameSpeedGoldTickRate'
					}
				]
			},
		]
	},
	balanceTeams: {
		items: [
			{
				title: 'votingGoBack',
				des: 'votingGoBackDes',
				link: 'mainMenu'
			},
			{
				title: 'votingBalanceTeamsSwapSelf',
				des: 'votingBalanceTeamsSwapSelfDes',
				confirmVote: true,
				back: 'balanceTeams'
			},
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
			{
				title: 'votingGameplayAddXP',
				des: 'votingGameplayAddXPDes',
				confirmVote: true,
				back: 'gameplay',
				options: [
					{
						title: 'votingGameplayAddXPAmount',
						des: 'votingGameplayAddXPAmountDes',

						fieldName: 'amount',
						sort: 'range',
						step: 1,
						min: 1,
						max: 505000,
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
