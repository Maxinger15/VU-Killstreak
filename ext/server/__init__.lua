class 'Killstreak'

function Killstreak:__init()
    print("Initializing server module")
    self.playerScores = {}
    self.playerKillstreakScore = {}
    self.lastOutput = 0
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

    self.lastOutput = self.lastOutput + 1
    if self.lastOutput == 30 then
        print("Name |  score | kills | deaths | playerScores | playerKillstreakScore")
        print(tostring(player.name).." | "..tostring(player.score).." | "..tostring(player.kills).." | "..tostring(player.deaths).." | "..tostring(self.playerScores[player.id]).." | "..tostring(self.playerKillstreakScore[player.id]))
        self.lastOutput = 0
    end

    if player.score > self.playerScores[player.id] then
        self.playerKillstreakScore[player.id] = self.playerKillstreakScore[player.id] + (player.score - self.playerScores[player.id])
        self.playerScores[player.id] = player.score
        modified = true
    end 

    if modified and self.playerKillstreakScore[player.id] ~= 0 then
        print("Player " .. tostring(player.name) .. " has new Ingame-Score: " .. tostring(player.score) .. " and a new KillStreak-Score: " .. tostring(self.playerKillstreakScore[player.id]))
        NetEvents:SendTo("Killstreak:ScoreUpdate",player,tostring(self.playerKillstreakScore[player.id]))
    end
end

g_KillStreakServer = Killstreak()