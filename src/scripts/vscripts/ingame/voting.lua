-- Imports
local notifications = require('ingame.notifications')

-- Define the clas
local lodVoting = class({})

-- Init function
function lodVoting:init()
	-- Setup stores
	self.activeVote = false	-- Is there an active vote already?
	self.lastVotes = {}		-- The last times someone created an unsuccessful vote (stops spamming)

	-- Add network hooks
	self:addNetworkHooks()
end

-- Adds the network hooks
function lodVoting:addNetworkHooks()
	print('hello!')

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

    -- Vote was successfully created
    notifications:send(ply, {
		sort = 'lodSuccess',
		text = 'votingMessageVoteCreated'
	})
end

-- Called when a player tries to cast a vote
function lodVoting:onPlyVoteCast(eventSourceIndex, args)
	-- Grab data
    local playerID = args.PlayerID
    local ply = PlayerResource:GetPlayer(playerID)

    -- Is there an active vote?
    if not self.activeVote then return end
    
end

-- Return an instance of this class
return lodVoting()
