"use strict";

var votingMenus = {
	// The main voting menu
	mainMenu: {
		items: [
			{
				title: 'votingGameplay',
				des: 'votingGameplayDes',
				link: 'gameplay'
			},
			{
				title: 'votingBalanceTeams',
				des: 'votingBalanceTeamsDes',
				link: 'balanceTeams'
			},
			{
				title: 'votingChangeOptions',
				des: 'votingChangeOptionsDes',
				link: 'changeOptions'
			},
			{
				title: 'votingGiveup',
				des: 'votingGiveupDes',
				link: 'giveup'
			},
			{
				title: 'votingCloseVoting',
				des: 'votingCloseVotingDes',
				close: true
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
				link: 'changeOptions'
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
			{
				title: 'votingOptionsModifiers',
				des: 'votingOptionsModifiersDes',
				confirmVote: true,
				back: 'changeOptionsSpeed',
				options: [
					{
						title: 'votingOptionsModifiersGoldAmount',
						des: 'votingOptionsModifiersGoldAmountDes',

						fieldName: 'gold',
						sort: 'range',
						step: 1,
						min: 0,
						max: 1000,
						default: 10,
						linkTo: 'lodOptionGameSpeedGoldModifier'
					},
					{
						title: 'votingOptionsModifiersXPAmount',
						des: 'votingOptionsModifiersXPAmountDes',

						fieldName: 'xp',
						sort: 'range',
						step: 1,
						min: 0,
						max: 1000,
						default: 10,
						linkTo: 'lodOptionGameSpeedEXPModifier'
					}
				]
			},
			{
				title: 'votingOptionsBuybackCooldown',
				des: 'votingOptionsBuybackCooldownDes',
				confirmVote: true,
				back: 'changeOptionsSpeed',
				options: [
					{
						title: 'votingOptionsBuybackCooldownAmount',
						des: 'votingOptionsBuybackCooldownAmountDes',

						fieldName: 'amount',
						sort: 'range',
						step: 1,
						min: 0,
						max: 7 * 60,
						default: 7 * 60,
						linkTo: 'lodOptionGameSpeedBuybackCooldown'
					}
				]
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
						max: 5000,
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
						max: 5000,
						default: 1000
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
				title: 'votingBalanceAddBots',
				des: 'votingBalanceAddBotsDes',
				confirmVote: true,
				back: 'balanceTeams',
				options: [
					{
						title: 'votingBalanceAddBotsRadiant',
						des: 'votingBalanceAddBotsRadiantDes',

						fieldName: 'radiant',
						sort: 'range',
						step: 1,
						min: 0,
						max: 10,
						default: 0
					},
					{
						title: 'votingBalanceAddBotsDire',
						des: 'votingBalanceAddBotsDireDes',

						fieldName: 'dire',
						sort: 'range',
						step: 1,
						min: 0,
						max: 10,
						default: 0
					}
				]
			},
			{
				title: 'votingBalanceTeamsSwapSelf',
				des: 'votingBalanceTeamsSwapSelfDes',
				confirmVote: true,
				back: 'balanceTeams'
			},
			{
				title: 'votingBalanceTeamsLevelHeroes',
				des: 'votingBalanceTeamsLevelHeroesDes',
				confirmVote: true,
				back: 'balanceTeams'
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
