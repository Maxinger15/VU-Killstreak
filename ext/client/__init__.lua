local bindings = require("keybindings.lua")
local conf = nil
local step = -1
local inUse = {false, false, false, false}
local newEvent = true
local keyUpThreshold = 30
local curKeyUpEvents = 0
local selectedKillstreaks = nil
Events:Subscribe(
    "Extension:Loaded",
    function()
        NetEvents:Subscribe("Killstreak:Client:getConf", getConf)
    end
)
Events:Subscribe(
    "Player:Connected",
    function(player)
        NetEvents:SendLocal("Killstreak:newClient", player)
    end
)
Events:Subscribe(
    "Level:Loaded",
    function(levelName, gameMode)
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:showKsButton"))')
    end
)

Events:Subscribe(
    "Level:Finalized",
    function(levelName, gameMode)
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:hideKsButton"))')
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:hideSelectScreen"))')
    end
)

Events:Subscribe(
    "Player:Killed",
    function(player)
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:showKsButton"))')
    end
)

Events:Subscribe(
    "Player:Respawn",
    function(player)
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:hideKsButton"))')
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:hideSelectScreen"))')
    end
)

Events:Subscribe(
    "Killstreak:selectedKillstreaks",
    function(ks)
        test = json.encode(ks)
        print("ks test " .. test)
        NetEvents:SendLocal("Killstreak:updatePlayerKS", test ,PlayerManager:GetLocalPlayer())
        decodeKs = json.decode(ks)
        selectedKillstreaks = decodeKs
    end
)
-- Your mod get the following parameters in the Invoke Event:
-- 1. Position of Killstreak 1-4
-- 2. Key who toggle the Killstreak
Events:Subscribe(
    "Client:UpdateInput",
    function(delta)
        if selectedKillstreaks == nil then
            return
        end
        for i, v in pairs(selectedKillstreaks) do
            if InputManager:WentKeyUp(tonumber(bindings[i])) and inUse[i] == false and newEvent == true then
                if i + 1 <= step then
                    print("Activate")
                    newEvent = false
                    print("Dispatched event " .. tostring(selectedKillstreaks[i][1]))
                    inUse[i] = true
                    Events:Dispatch(selectedKillstreaks[i][1] .. ":Invoke", i, tonumber(v))
                    return
                end
            end
            if InputManager:WentKeyUp(tonumber(bindings[i])) and inUse[i] == true and newEvent == true then
                print("Disable")
                Events:Dispatch(selectedKillstreaks[i][1] .. ":Disable", i)
                inUse[i] = false
                newEvent = false
                return
            end
            if InputManager:WentKeyUp(tonumber(bindings[i])) == false and newEvent == false then
                --if curKeyUpEvents >= keyUpThreshold then
                print("New Event")
                newEvent = true
            -- curKeyUpEvents = 0
            --else
            -- curKeyUpEvents = curKeyUpEvents + 1
            --end
            end
        end
    end
)

function getConf(config)
    print("Get conf " .. config)
    confResend = json.encode(config)
    WebUI:Init()
    WebUI:ExecuteJS(
        'document.dispatchEvent(new CustomEvent("Killstreak:UI:getAllKillstreaks",{detail:' .. confResend .. "}))"
    )
    WebUI:Show()
    config = json.decode(config)
end

NetEvents:Subscribe(
    "Killstreak:ScoreUpdate",
    function(data)
        data = tonumber(data)
        print("Got Data " .. tostring(data))
        count = 0
        for _ in pairs(selectedKillstreaks) do
            count = count + 1
        end
        for i = 1, count, 1 do
            if i == count then
                break
            end
            if selectedKillstreaks[i][3] <= data and data < selectedKillstreaks[i + 1][3] then
                print("New Step " .. tostring(i))
                step = i
                break
            end
        end
        WebUI:ExecuteJS('window.dispatchEvent(new CustomEvent("Killstreak:UpdateScore",{detail:"' .. data .. '"}))')
    end
)
NetEvents:Subscribe(
    "Killstreak:StepUpdate",
    function(data)
        step = data
    end
)

-- invoke this to adjust the points your killstreak costs
-- usedStep = index you got with the Invoke event (parameter 1)
Events:Subscribe(
    "Killstreak:usedStep",
    function(usedStep)
        converted = json.encode(inUse)
        print("Client recievet step used")
        print("used Step " .. tostring(usedStep))
        print("inUse: " .. converted)
        inUse[usedStep] = false
        NetEvents:SendLocal("Killstreak:notifyServerUsedSteps", usedStep, PlayerManager:GetLocalPlayer())
    end
)
