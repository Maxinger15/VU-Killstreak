local conf = nil
local step = -1

Events:Subscribe('Extension:Loaded', function()
    NetEvents:Subscribe("Killstreak:Client:getConf",getConf)
    
end)
Events:Subscribe('Player:Connected', function(player)
    NetEvents:SendLocal("Killstreak:newClient",player)
end)
function getConf(conf)
    conf = json.encode(conf)
    print("Get conf "..conf)
    conf = json.decode(conf)
    WebUI:Init()
    WebUI:ExecuteJS('window.dispatchEvent(new CustomEvent("Killstreak:getConfig",{detail:"'.. conf ..'"}))')
    WebUI:Show()
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
    --WebUI:ExecuteJS('window.dispatchEvent(new CustomEvent("Killstreak:UsedKillstreak",{detail:"'.. usedStep ..'"}))')
    NetEvents:Dispatch("Killstreak:notifyServerUsedSteps",usedStep,PlayerManager:getLocalPlayer())
end)



Events:Subscribe("Client:UpdateInput", function(delta)
    if conf == nil then
        return;
    end
    for k,v in conf[1] do
        if InputManager:WentKeyUp(v) then
            Events:Dispatch(conf[0][k], k)
            return
        end
    end

end)
