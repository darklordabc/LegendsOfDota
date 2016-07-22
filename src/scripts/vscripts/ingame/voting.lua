-- Imports
local notifications = require('ingame.notifications')
local Timers = require('easytimers')
local network = require('network')
local OptionManager = require('optionmanager')

-- Options
local maxVoteDuration = 30			-- How long a vote lasts for
local voteShowTimeAfterFinished = 5	-- How long to show the vote for after the vote finishes
local failedVoteWaitPeriod = 120	-- How long a player has to wait if their current vote fails

-- Define the clas
local lodVoting = class({})

-- Init function
function lodVoting:init()
	-- Setup stores
	self.activeVote = false	-- Is there an active vote already?
	self.lastVotes = {}		-- The last times someone created an unsuccessful vote (stops spamming)
	self.totalVotes = 0		-- Stores the total number of votes that have been created

	-- Add network hooks
	self:addNetworkHooks()
end

-- Adds the network hooks
function lodVoting:addNetworkHooks()
	local this = self

	-- Creating a vote
	CustomGameEventManager:RegisterListener('lodVoteCreate', function(eventSourceIndex, args)
        this:onPlyVoteCreate(eventSourceIndex, args)
    end)

    -- Casting a vote
    CustomGameEventManager:RegisterListener('lodVoteCastVote', function(eventSourceIndex, args)
        this:onPlyVoteCast(eventSourceIndex, args)
    end)
end

-- Called when a player tries to create a vote
function lodVoting:onPlyVoteCreate(eventSourceIndex, args)
	-- Grab data
    local playerID = args.PlayerID
    local ply = PlayerResource:GetPlayer(playerID)

    -- Is there an active vote already?
    if self.activeVote then
    	-- Tell the player
    	notifications:send(ply, {
    		sort = 'lodDanger',
    		text = 'votingErrorVoteInProgress'
    	})
    	return
    end

    -- Ensure the player has waited long enough before making another vote
    if self.lastVotes[playerID] then
    	local timeLeft = self.lastVotes[playerID] + failedVoteWaitPeriod - Time()

    	if timeLeft > 0  then
    		-- Tell the player
	    	notifications:send(ply, {
	    		sort = 'lodDanger',
	    		text = 'votingErrorVoteFailedVote',
	    		params = {
	            	['timeLeft'] = math.ceil(timeLeft)
	        	}
	    	})
	    	return
    	end
    end

    -- Pull the stuff
    local voteInfo = args.info or {}
    local voteData = args.data or {}

    local voteTitle = voteInfo.title

    -- Validate that options are correct and build vote structure
    local theVote = {
    	voteTitle = voteTitle,
    	voteDuration = maxVoteDuration,
    	endTime = Time() + maxVoteDuration,
    	playerID = playerID,
    	maxNo = 0
	}

	-- Check vote info
	local res = self:checkVoteOptions(theVote, voteInfo, voteData)
	if res then
		-- Tell the player
    	notifications:send(ply, {
    		sort = 'lodDanger',
    		text = 'votingErrorVoteInvalid',
    		params = {
    			['error'] = res
    		}
    	})
    	return
	end

	-- Vote must be valid, try to create it
	self:createVote(theVote)

    -- Vote was successfully created
    notifications:send(ply, {
		sort = 'lodSuccess',
		text = 'votingMessageVoteCreated'
	})
end

-- Checks if a given vote is valid
function lodVoting:checkVoteOptions(theVote, voteInfo, voteData)
	-- Grab the players team
	local playerID = theVote.playerID
	local plyTeam = PlayerResource:GetCustomTeamAssignment(playerID)

	local this = self

	local votingPrepare = {
		--[[
			CHANGING OPTIONS
		]]

		votingOptionsRespawnTime = function()
			-- Ensure we are in a match
			if GameRules:State_Get() < DOTA_GAMERULES_STATE_PRE_GAME then return 'voteErrorNotInMatch' end

			local percentage = voteData.percentage
			local constant = voteData.constant

			if type(percentage) ~= 'number' then return 'voteErrorInvalidData' end
			if math.floor(percentage) ~= percentage then return 'voteErrorInvalidData' end
            if percentage < 0 or percentage > 100 then return 'voteErrorInvalidData' end

            if type(constant) ~= 'number' then return 'voteErrorInvalidData' end
			if math.floor(constant) ~= constant then return 'voteErrorInvalidData' end
            if constant < 0 or constant > 120 then return 'voteErrorInvalidData' end

            -- Add description
            theVote.voteDes = 'votingOptionsRespawnTimeDesArgs'
            theVote.voteDesArgs = {
            	percentage = percentage,
            	constant = constant
        	}

            -- Callback
            theVote.callback = function()
            	-- Adjust the respawn times
            	OptionManager:SetOption('respawnModifierPercentage', percentage)
	    		OptionManager:SetOption('respawnModifierConstant', constant)

	    		-- Update options
            	GameRules.pregame:updateOption('lodOptionGameSpeedRespawnTimePercentage', percentage)
            	GameRules.pregame:updateOption('lodOptionGameSpeedRespawnTimeConstant', constant)
        	end
		end,

		votingOptionsGoldTickRate = function()
			-- Ensure we are in a match
			if GameRules:State_Get() < DOTA_GAMERULES_STATE_PRE_GAME then return 'voteErrorNotInMatch' end

			-- Ensure we have some valid vote data
			local amount = voteData.amount

			if type(amount) ~= 'number' then return 'voteErrorInvalidData' end
			if math.floor(amount) ~= amount then return 'voteErrorInvalidData' end
            if amount < 0 or amount > 25 then return 'voteErrorInvalidData' end

            -- Add the description
            theVote.voteDes = 'votingOptionsGoldTickRateAmountDesArgs'
            theVote.voteDesArgs = {
            	amount = amount
        	}

            -- Callback
            theVote.callback = function()
            	-- Change the tick rate
            	GameRules:SetGoldPerTick(amount)

            	-- Update options
            	GameRules.pregame:updateOption('lodOptionGameSpeedGoldTickRate', amount)
        	end
		end,

		--[[
			GAMEPLAY
		]]

		votingGameplayAddGold = function()
			-- Ensure we are in a match
			if GameRules:State_Get() < DOTA_GAMERULES_STATE_PRE_GAME then return 'voteErrorNotInMatch' end

			-- Ensure we have some valid vote data
			local amount = voteData.amount

			if type(amount) ~= 'number' then return 'voteErrorInvalidData' end
			if math.floor(amount) ~= amount then return 'voteErrorInvalidData' end
            if amount < 1 or amount > 100000 then return 'voteErrorInvalidData' end

            -- Add the description
            theVote.voteDes = 'votingGameplayAddGoldDesArgs'
            theVote.voteDesArgs = {
            	amount = amount
        	}

            -- Callback
            theVote.callback = function()
            	-- Allocate the extra gold
            	local maxPlayers = 24
            	for i=0,maxPlayers-1 do
            		PlayerResource:SetGold(i, PlayerResource:GetReliableGold(i) + amount, true)
            	end
        	end
		end,

		votingGameplayAddXP = function()
			-- Ensure we are in a match
			if GameRules:State_Get() < DOTA_GAMERULES_STATE_PRE_GAME then return 'voteErrorNotInMatch' end

			-- Ensure we have some valid vote data
			local amount = voteData.amount

			if type(amount) ~= 'number' then return 'voteErrorInvalidData' end
			if math.floor(amount) ~= amount then return 'voteErrorInvalidData' end
            if amount < 1 or amount > 505000 then return 'voteErrorInvalidData' end

            -- Add the description
            theVote.voteDes = 'votingGameplayAddXPDesArgs'
            theVote.voteDesArgs = {
            	amount = amount
        	}

            -- Callback
            theVote.callback = function()
            	-- Allocate the extra gold
            	local maxPlayers = 24
            	for i=0,maxPlayers-1 do
            		local hero = PlayerResource:GetSelectedHeroEntity(i)

            		if IsValidEntity(hero) then
            			hero:AddExperience(amount, false, false)
            		end
            	end
        	end
		end,

		--[[
			BALANCE TEAMS
		]]

		-- Swapping yourself onto another team
		votingBalanceTeamsSwapSelf = function()
			-- Ensure we are in a match
			if GameRules:State_Get() < DOTA_GAMERULES_STATE_PRE_GAME then return 'voteErrorNotInMatch' end

			-- Check number of players on other team
			local enemyTeam = DOTA_TEAM_BADGUYS
			if plyTeam == DOTA_TEAM_BADGUYS then
				enemyTeam = DOTA_TEAM_GOODGUYS
			end

			local totalEnemies = 0
			local maxPlayers = 24
			for i=0,maxPlayers-1 do
				local state = PlayerResource:GetConnectionState(i)

				-- Are they are bot, or a CONNECTED player?
				if state == 1 or state == 2 then
					if PlayerResource:GetCustomTeamAssignment(i) == enemyTeam then
						totalEnemies = totalEnemies + 1
					end
				end
			end

			if totalEnemies >= DOTA_MAX_TEAM_PLAYERS then
				return 'voteErrorNoPlayerSlots'
			end

			theVote.voteDes = 'votingBalanceTeamsSwapSelfDesArgs'

			theVote.voteDesArgs = {
				plyName = PlayerResource:GetPlayerName(playerID)
			}

			theVote.callback = function()
				GameRules.ingame:balancePlayer(playerID, enemyTeam)
			end
		end,

		--[[
			GIVING UP
		]]

		-- Calling GG
		votingGiveupCallGG = function()
			-- Are we pregame?
			if GameRules:State_Get() < DOTA_GAMERULES_STATE_GAME_IN_PROGRESS then
				return 'voteErrorPregame'
			end

			-- Team only vote
			theVote.team = plyTeam

			-- Add the description
			theVote.voteDes = 'votingGiveupCallGGDes'

			-- Callback
			theVote.callback = function()
				-- Call GG
				this:callGG(theVote.team)
			end
		end,

		-- Calling a draw
		votingGiveupCallDraw = function()
			-- Are we pregame?
			if GameRules:State_Get() < DOTA_GAMERULES_STATE_GAME_IN_PROGRESS then
				return 'voteErrorPregame'
			end

			-- Add the description
			theVote.voteDes = 'votingGiveupCallDrawDes'

			-- Callback
			theVote.callback = function()
				-- Call GG
				GameRules:SetGameWinner(0)
			end
		end
	}

	-- Ensure it is has a callback
	if not votingPrepare[theVote.voteTitle] then
		return 'voteErrorUnknownVote'
	end

	-- Prepare the vote
	local res = votingPrepare[theVote.voteTitle]()
	if res then
		return res
	end
end

-- Creates a new vote
function lodVoting:createVote(activeVoteInfo)
	-- Ensure there isn't already an active vote
	if self.activeVote then return end

	local this = self

	-- Create a new voteID for this vote
	self.totalVotes = self.totalVotes + 1
	local voteID = self.totalVotes
	activeVoteInfo.voteID = voteID

	-- There is now an active vote
	self.activeVote = true

	-- Reset who has voted
	activeVoteInfo.plyVotes = {}
	activeVoteInfo.totalYes = 0
	activeVoteInfo.totalNo = 0

	-- Store the active vote info
	self.activeVoteInfo = activeVoteInfo

	-- Create a timer to check the status of this vote
	Timers:CreateTimer(function()
		-- Checks the progress of a vote
        this:checkVoteProgress(voteID)
    end, DoUniqueString('createVote'), activeVoteInfo.voteDuration)

    -- Casts our vote
    self.activeVoteInfo.plyVotes[self.activeVoteInfo.playerID] = true
    self.activeVoteInfo.totalYes = self.activeVoteInfo.totalYes + 1

    -- Check the progress of the vote
    self:checkVoteProgress()
end

-- Checks the progress of a vote
function lodVoting:checkVoteProgress(voteID)
	-- Is this a relevant check?
	if not self.activeVote or not self.activeVoteInfo or (voteID ~= nil and self.activeVoteInfo.voteID ~= voteID) then
		-- Not valid, break
		return
	end

	-- Check votes and percentages for early vote kill
	if self.activeVoteInfo.totalNo > self.activeVoteInfo.maxNo then
		-- Got too many no, end it
		self:endVote()
		return
	end

	-- How many people are playing?
	local totalPeople = 0
	for i=0,24 do
		if PlayerResource:GetConnectionState(i) == 2 then
			totalPeople = totalPeople + 1
		end
	end

	-- Has everyone voted?
	if self.activeVoteInfo.totalYes + self.activeVoteInfo.totalNo >= totalPeople then
		-- Everyone has voted
		self:endVote()
		return
	end

	-- Is the vote over?
	if voteID ~= nil then
		self:endVote()
		return
	end

	-- Update networking
	network:updateVoteInfo(self.activeVoteInfo)
end

-- end the vote
function lodVoting:endVote()
	if not self.activeVote then return end
	if not self.activeVoteInfo then return end

	-- Vote is over, end it
	self.activeVote = false

	-- Calculate the winner
	local passed = true

	-- No yeses?
	if self.activeVoteInfo.totalYes == 0 then
		passed = false
	end

	-- Too many nos?
	if self.activeVoteInfo.totalNo > self.activeVoteInfo.maxNo then
		passed = false
	end

	-- Update it
	self.activeVoteInfo.finished = true
	self.activeVoteInfo.hideTime = Time() + voteShowTimeAfterFinished
	self.activeVoteInfo.passed = passed
	network:updateVoteInfo(self.activeVoteInfo)

	-- Did the vote pass?
	if passed then
		-- Run a callback if one exists
		local callback = self.activeVoteInfo.callback
		if callback then
			callback(self.activeVoteInfo)
		end
	else
		-- Stop the player from making another vote anytime soon
		self.lastVotes[self.activeVoteInfo.playerID] = Time()
	end
end

-- Called when a player tries to cast a vote
function lodVoting:onPlyVoteCast(eventSourceIndex, args)
	-- Grab data
    local playerID = args.PlayerID
    local ply = PlayerResource:GetPlayer(playerID)

    -- Is there an active vote?
    if not self.activeVote then return end
    if not self.activeVoteInfo then return end

    -- Has this player already cast their vote?
    if self.activeVoteInfo.plyVotes[playerID] then return end

    -- Is this a team vote?
    if self.activeVoteInfo.team ~= nil then
    	-- Check the team
    	if PlayerResource:GetCustomTeamAssignment(playerID) ~= self.activeVoteInfo.team then return end
    end

    -- This player has now cast their vote
    self.activeVoteInfo.plyVotes[playerID] = true

    -- Add to the totals
    if args.vote == 'yes' then
    	self.activeVoteInfo.totalYes = self.activeVoteInfo.totalYes + 1
    else
    	self.activeVoteInfo.totalNo = self.activeVoteInfo.totalNo + 1
    end

    -- Check if we can kill it
    self:checkVoteProgress()
end

-- Call GG
function lodVoting:callGG(losingTeam)
	if losingTeam == DOTA_TEAM_BADGUYS then
		GameRules:SetGameWinner(DOTA_TEAM_GOODGUYS)
	elseif losingTeam == DOTA_TEAM_GOODGUYS then
		GameRules:SetGameWinner(DOTA_TEAM_BADGUYS)
	end
end

-- Return an instance of this class
return lodVoting()
