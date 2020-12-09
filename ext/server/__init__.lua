local conf = require("configuration.lua")
local settings = require("settings.lua")
local outputs = 0
class "Killstreak"

function Killstreak:__init()
    print("Initializing server module")
    self.playerScores = {}
    self.playerKillstreakScore = {}
    self.playerKillstreaks = {}
    self.playerScoreDisabled = {}
    Events:Subscribe("Level:Loaded", self, self.OnLoad)
    Events:Subscribe("Level:Destroy", self, self.ResetState)
    Events:Subscribe("Player:Left", self, self.OnPlayerLeft)
    NetEvents:Subscribe("Killstreak:newClient", self, self.sendConfToNewClient)
    NetEvents:Subscribe("Killstreak:notifyServerUsedSteps", self, self.usedSteps)
    NetEvents:Subscribe("Killstreak:updatePlayerKS", self, self.updatePlayerKS)

    if settings.resetOnDeath then
        Events:Subscribe("Player:Killed", self, self.resetScore)
    end
    if settings.ignoreScoreInVehicle then
        Events:Subscribe("Vehicle:Enter", self, self.disableScore)
        Events:Subscribe("Vehicle:Exit", self, self.enableScore)
    end
end

function Killstreak:disableScore(vehicle, player)
    print("Disabled score for " .. tostring(player.name))
    self.playerScoreDisabled[player.id] = true
end

function Killstreak:enableScore(vehicle, player)
    print("Enabled score for " .. tostring(player.name))
    self.playerScoreDisabled[player.id] = false
end

function Killstreak:resetScore(player, punisher, position, weapon, isRoadKill, isHeadShot, wasVictimInREviveState)
    if self.playerKillstreakScore[player.id] ~= 0 then
        print("Player " .. tostring(player.name) .. " is dead. Reseting Points")
        self.playerKillstreakScore[player.id] = 0
        NetEvents:SendTo("Killstreak:ScoreUpdate", player, tostring(self.playerKillstreakScore[player.id]))
    end
end

function Killstreak:__gc()
    Events:Unsubscribe("Player:Update")
    Events:Unsubscribe("Level:Loaded")
    Events:Unsubscribe("Level:Destroy")
    Events:Unsubscribe("Player:Killed")
    Events:Unsubscribe("Vehicle:Exit")
    Events:Unsubscribe("Vehicle:Enter")
    NetEvents:Unsubscribe()
end

function Killstreak:OnLoad()
    Events:Unsubscribe("Player:Update")

    Events:Subscribe("Player:Update", self, self.OnPlayerUpdate)
end

function Killstreak:sendConfToNewClient(player)
    print("New Player " .. player.name .. "with conf " .. json.encode(conf))
    if self.playerKillstreaks[player.id] == nil then
        self.playerKillstreaks[player.id] = {}
    end
    if self.playerScoreDisabled[player.id] == nil then
        self.playerScoreDisabled[player.id] = false
    end
    NetEvents:SendTo("Killstreak:Client:getConf", player, json.encode(conf))
end

function Killstreak:updatePlayerKS(player, ks)
    self.playerKillstreaks[player.id] = ks
end
function Killstreak:ResetState()
    print("reset state")
    self.playerKillstreakScore = {}
    self.playerScores = {}
end

function Killstreak:OnPlayerLeft(player)
    self.playerKillstreaks[player.id] = nil
    return
end

function Killstreak:usedSteps(playerObj, usedStep)
    print("used: " .. tostring(usedStep))
    print("p ks" .. json.encode(self.playerKillstreaks[playerObj.id]))
    print("cost: " .. tostring(self.playerKillstreaks[playerObj.id][usedStep][3]))
    self.playerKillstreakScore[playerObj.id] =
        self.playerKillstreakScore[playerObj.id] - self.playerKillstreaks[playerObj.id][usedStep][3]
    print(
        "Player " ..
            tostring(playerObj.name) ..
                " used Killstreaknr. " ..
                    tostring(usedStep) ..
                        " and a new KillStreak-Score: " .. tostring(self.playerKillstreakScore[playerObj.id])
    )
    NetEvents:SendTo("Killstreak:ScoreUpdate", playerObj, tostring(self.playerKillstreakScore[playerObj.id]))
end

function Killstreak:OnPlayerUpdate(player, deltaTime)
    if not player.hasSoldier then
        return
    end
    if self.playerScores[player.id] ~= nil and self.playerScoreDisabled[player.id] then
        if player.score > self.playerScores[player.id] then
            
            self.playerScores[player.id] = player.score
            print("new player score: ".. tostring(self.playerScores[player.id]))
        end
        return
    end
    modified = false

    if self.playerScores[player.id] == nil then
        self.playerScores[player.id] = player.score
        self.playerKillstreakScore[player.id] = player.score
        modified = true
    end

    if player.score > self.playerScores[player.id] and not modified then
        self.playerKillstreakScore[player.id] =
            self.playerKillstreakScore[player.id] + (player.score - self.playerScores[player.id])
        self.playerScores[player.id] = player.score
        modified = true
    end

    if modified and self.playerKillstreakScore[player.id] ~= nil then
        print(
            "Player " ..
                tostring(player.name) ..
                    " has new Ingame-Score: " ..
                        tostring(player.score) ..
                            " and a new KillStreak-Score: " .. tostring(self.playerKillstreakScore[player.id])
        )
        NetEvents:SendTo("Killstreak:ScoreUpdate", player, tostring(self.playerKillstreakScore[player.id]))
    end
end

g_KillStreakServer = Killstreak()
