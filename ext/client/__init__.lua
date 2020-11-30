local conf = nil
local step = -1

Events:Subscribe('Extension:Loaded', function()
    NetEvents:Subscribe("Killstreak:Client:getConf",getConf)
    
end)
Events:Subscribe('Player:Connected', function(player)
    NetEvents:SendLocal("Killstreak:newClient",player)
end)
function getConf(config)
    conf = json.decode(config)
    print("Get conf "..config)
    confResend = json.encode(config)
    WebUI:Init()
    WebUI:ExecuteJS('window.dispatchEvent(new CustomEvent("Killstreak:getConfig",{detail:'.. confResend ..'}))')
    WebUI:Show()
    config = json.decode(config)
    Events:Subscribe("Client:UpdateInput", function(delta)
        if config == nil then
            return;
        end
        
        for i,v in pairs(config[2]) do
            if InputManager:WentKeyUp(tonumber(v)) then
                Events:Dispatch(config[1][i], i)
                return
            end
        end
    
    end)
end

NetEvents:Subscribe('Killstreak:ScoreUpdate', function(data)
    WebUI:ExecuteJS('window.dispatchEvent(new CustomEvent("Killstreak:UpdateScore",{detail:"'.. data ..'"}))')
end)
NetEvents:Subscribe('Killstreak:StepUpdate', function(data)
    step = data
end)

-- invoke this to adjust the points your killstreak costs
-- usedStep = index you got with the Invoke event (parameter 1)
Events:Subscribe("Killstreak:usedStep",function(usedStep)
    NetEvents:Dispatch("Killstreak:notifyServerUsedSteps",usedStep,PlayerManager:getLocalPlayer())
end)




