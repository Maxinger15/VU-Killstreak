local bindings = require("keybindings.lua")
local conf = nil
local step = -1
local inUse = {false, false, false, false}
local newEvent = true
local keyUpThreshold = 30
local curKeyUpEvents = 0
local selectedKillstreaks = nil
local score = 0
local disabledAction = false
Events:Subscribe(
    "Extension:Loaded",
    function()
        NetEvents:Subscribe("Killstreak:Client:getConf", getConf)
    end
)
Events:Subscribe(
    "Player:Connected",
    function(player)
        if player.id == PlayerManager:GetLocalPlayer().id then
            NetEvents:SendLocal("Killstreak:newClient", player)
        end
    end
)
Events:Subscribe(
    "Level:Loaded",
    function(levelName, gameMode)
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:showKsButton"))')
    end
)

NetEvents:Subscribe(
    "Killstreak:hideAll",
    function()
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:hideKsButton"))')
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:hideSelectScreen"))')
    end
)

NetEvents:Subscribe(
    "Killstreak:hideButton",
    function()
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:hideKsButton"))')
    end
)

NetEvents:Subscribe(
    "Killstreak:showButton",
    function()
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

Hooks:Install('UI:PushScreen', 1, function(hook, screen, priority, parentGraph, stateNodeGuid)
    local screen = UIGraphAsset(screen)
    if screen.name == 'UI/Flow/Screen/SpawnScreenPC' then
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:showKsButton"))')
    end

    if screen.name == "UI/Flow/Screen/KillScreen" then
        disabledAction = true
    end
end)

Events:Subscribe(
    "Player:Respawn",
    function(player)
        if player.id == PlayerManager:GetLocalPlayer().id then
            WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:hideKsButton"))')
            WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:hideSelectScreen"))')
            disabledAction = false
        end
    end
)

Events:Subscribe(
    "Killstreak:selectedKillstreaks",
    function(ks)
        test = json.encode(ks)
        print("ks test " .. test)
        NetEvents:SendLocal("Killstreak:updatePlayerKS", json.decode(ks))
        decodeKs = json.decode(ks)
        selectedKillstreaks = decodeKs
        WebUI:ExecuteJS('window.dispatchEvent(new CustomEvent("Killstreak:UpdateScore",{detail:"' .. score .. '"}))')
    end
)
-- timerObjJson: JSON string from the timer object for the frontend {duration: number,text: string}
Events:Subscribe(
    "Killstreak:newTimer",
    function(timerObjJson)
        WebUI:ExecuteJS('window.dispatchEvent(new CustomEvent("Killstreak:UI:newTimer",{detail:"' .. timerObjJson .. '"}))')
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
        if disabledAction then
            return
        end
        for i, v in pairs(selectedKillstreaks) do
            if InputManager:WentKeyUp(tonumber(bindings[i])) and inUse[i] == false and newEvent == true then
                if i <= step then
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
    WebUI:DisableKeyboard()
    config = json.decode(config)
end

NetEvents:Subscribe(
    "Killstreak:ScoreUpdate",
    function(data)
        data = tonumber(data)
        score = data
        print("Got Data " .. tostring(data))
        count = 0
        tempTable = {}
        if selectedKillstreaks ~= nil then
            tempTable = selectedKillstreaks
        end
        for _ in pairs(tempTable) do
            count = count + 1
        end
        for i = 1, count, 1 do
            if i == count then
                step = 0
                break
            end
            -- if i == 1 then
            --    print(tostring(selectedKillstreaks[i][3]) .. " | " .. tostring(data))
            --    if data <= selectedKillstreaks[i][3] then
            --        print("New Step " .. tostring(i))
            --        step = i
            --        break
            --    end
            -- else
            print(
                tostring(selectedKillstreaks[i][3]) ..
                    " | " .. tostring(data) .. " | " .. tostring(selectedKillstreaks[i + 1][3])
            )
            if selectedKillstreaks[i][3] <= data and data < selectedKillstreaks[i + 1][3] then
                print("New Step " .. tostring(i))
                step = i
                break
            end
            -- end
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
        NetEvents:SendLocal("Killstreak:notifyServerUsedSteps", usedStep)
    end
)
