class 'Killstreak'

function Killstreak:__init()
    print("Initializing server module")
    self.playerScores = {}
    self.playerKillstreakScore = {}

    Events:Subscribe('Level:Loaded', self, self.OnLoad)
    Events:Subscribe('Level:Destroy', self, self.ResetState)
    Events:Subscribe('Player:Left', self, self.OnPlayerLeft)
end

function Killstreak:__gc()
    Events:Unsubscribe('Player:Update')
    NetEvents:Unsubscribe()
end

function Killstreak:OnLoad()
    Events:Unsubscribe('Player:Update')

    NetEvents:Unsubscribe()

    self:ResetState()

    Events:Subscribe("Player:Update",self,self.OnPlayerUpdate)
end

function Killstreak:ResetState()
    self.playerKillstreakScore = {}
    self.playerScores = {}
end

function Killstreak:OnPlayerLeft()
    return
end

function Killstreak:OnPlayerUpdate(player, deltaTime)
    if not player.alive or not player.hasSoldier then
        return
    end
    modified = false
    if self.playerScores[player.id] == nil then
        self.playerScores[player.id] = player.score
        self.playerKillstreakScore[player.id] = player.score
        modified = true
    end
    print(tostring(self.playerScores[player.id]) .. " | " .. tostring(player.score))
    if self.playerScores[player.id] > player.score then
        self.playerKillstreakScore[player.id] = self.playerKillstreakScore[player.id] + (player.score - self.playerScores[player.id])
        self.playerScores[player.id] = player.score
        modified = true
    end
    if modified then
        print("Player " .. tostring(player.name) .. " has new Ingame-Score: " .. tostring(player.score) .. " and a new KillStreak-Score: " .. tostring(self.playerKillstreakScore[player.id]))
        NetEvents:SendTo("killstreak:ScoreUpdate",player,json.encode(self.playerKillstreakScore[player.id]))
    end
end

g_KillStreakServer = Killstreak()