local conf = nil
local step = -1
local inUse = {false,false,false,false}
local newEvent = true
Events:Subscribe('Extension:Loaded', function()
    NetEvents:Subscribe("Killstreak:Client:getConf",getConf)
    
end)
Events:Subscribe('Player:Connected', function(player)
    NetEvents:SendLocal("Killstreak:newClient",player)
end)

-- Your mod get the following parameters in the Invoke Event:
-- 1. Position of Killstreak 1-4
-- 2. Key who toggle the Killstreak
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
            if InputManager:WentKeyUp(tonumber(v)) and inUse[i] == false and newEvent and i <= step then
                newEvent = false
                print("Dispatched event "..tostring(config[1][i]))
                inUse[i] = true
                Events:Dispatch(config[1][i], i, tonumber(v))
                return
            else
                newEvent = true
            end
        end
    
    end)
end

NetEvents:Subscribe('Killstreak:ScoreUpdate', function(data)
    data = tonumber(data)
    print("Got Data "..tostring(data))
    count = 0
    for _ in pairs(conf[3]) do count = count + 1 end
    for i = 1,count,1 do
        if i == count  then
            break
        end
        if conf[3][i] <= data and data < conf[3][i+1] then
            print("New Step "..tostring(i))
            step = i
            break
        end
    end
    WebUI:ExecuteJS('window.dispatchEvent(new CustomEvent("Killstreak:UpdateScore",{detail:"'.. data ..'"}))')
end)
NetEvents:Subscribe('Killstreak:StepUpdate', function(data)
    step = data
end)

-- invoke this to adjust the points your killstreak costs
-- usedStep = index you got with the Invoke event (parameter 1)
Events:Subscribe("Killstreak:usedStep",function(usedStep)
    converted = json.encode(inUse)
    print("Client recievet step used")
    print("used Step " .. tostring(usedStep))
    print("inUse: " .. converted)
    inUse[usedStep] = false
    NetEvents:SendLocal("Killstreak:notifyServerUsedSteps",usedStep,PlayerManager:GetLocalPlayer())
end)

Events:Subscribe("Killstreak:notUsedStep",function(step)
    inUse[step] = false
end)




