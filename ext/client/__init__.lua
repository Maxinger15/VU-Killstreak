local bindings = require("keybindings.lua")
local conf = nil
local step = -1
local inUse = {false, false, false, false}
local keyUpThreshold = 30
local curKeyUpEvents = 0
local selectedKillstreaks = nil
local score = 0
local disabledAction = false
Events:Subscribe(
    "Extension:Loaded",
    function()
        NetEvents:Subscribe("Killstreak:Client:getConf", getConf)
        NetEvents:SendLocal("Killstreak:newClient", player)
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

-- Invoke this to show a message on the screen.
-- messageObj: {title: string, message: string} as JSON string
Events:Subscribe(
    "Killstreak:showNotification",
    function(messageObjJson)
        messageObjJson = json.encode(messageObjJson)
        WebUI:ExecuteJS(
            'document.dispatchEvent(new CustomEvent("Killstreak:UI:showNotification",{detail:' ..
                messageObjJson .. "}))"
        )
    end
)

NetEvents:Subscribe(
    "Killstreak:showNotification",
    function(messageObjJson)
        messageObjJson = json.encode(messageObjJson)
        print("new message")
        print(messageObjJson)
        WebUI:ExecuteJS(
            'document.dispatchEvent(new CustomEvent("Killstreak:UI:showNotification",{detail:' ..
                messageObjJson .. "}))"
        )
    end
)

Events:Subscribe(
    "Level:Finalized",
    function(levelName, gameMode)
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:hideKsButton"))')
        WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:hideSelectScreen"))')
    end
)

Hooks:Install(
    "UI:PushScreen",
    1,
    function(hook, screen, priority, parentGraph, stateNodeGuid)
        local screen = UIGraphAsset(screen)
        if screen.name == "UI/Flow/Screen/SpawnScreenPC" then
            WebUI:ExecuteJS('document.dispatchEvent(new Event("Killstreak:UI:showKsButton"))')
        end

        if screen.name == "UI/Flow/Screen/KillScreen" then
            disabledAction = true
        end
    end
)

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
        -- print("ks test " .. test)
        NetEvents:SendLocal("Killstreak:updatePlayerKS", json.decode(ks))
        decodeKs = json.decode(ks)
        selectedKillstreaks = decodeKs
        calcStep(score)
        WebUI:ExecuteJS('document.dispatchEvent(new CustomEvent("Killstreak:UpdateScore",{detail:"' .. score .. '"}))')
    end
)
-- timerObjJson: JSON string from the timer object for the frontend {duration: number,text: string}
Events:Subscribe(
    "Killstreak:newTimer",
    function(timerObjJson)
        print(timerObjJson)
        timerObjJson = json.encode(timerObjJson)
        WebUI:ExecuteJS(
            'document.dispatchEvent(new CustomEvent("Killstreak:UI:newTimer",{detail:' .. timerObjJson .. "}))"
        )
    end
)

-- timerObjJson: JSON string from the timer object for the frontend {duration: number,text: string}
NetEvents:Subscribe(
    "Killstreak:newTimer",
    function(timerObjJson)
        print(timerObjJson)
        timerObjJson = json.encode(timerObjJson)
        WebUI:ExecuteJS(
            'document.dispatchEvent(new CustomEvent("Killstreak:UI:newTimer",{detail:' .. timerObjJson .. "}))"
        )
    end
)

-- Your mod get the following parameters in the Invoke Event:
-- 1. Position of Killstreak 1-4
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
            if InputManager:WentKeyUp(tonumber(bindings[i])) and inUse[i] == false then
                print("key detected")
                if i <= step then
                    -- Check if another KS is currently in use
                    used = nil
                    for i, v in pairs(inUse) do
                        if inUse[i] == true then
                            used = i
                        end
                    end
                    if used ~= nil then
                        WebUI:ExecuteJS(
                            'document.dispatchEvent(new CustomEvent("Killstreak:UI:selectStep",{detail:' ..
                                tostring(-10) .. "}))"
                        )
                        -- Disable the aktive KS
                        print("Disable because of a switch")
                        Events:Dispatch(selectedKillstreaks[used][1] .. ":Disable", i)
                        inUse[used] = false
                    end
                    print("Activate")
                    print("Dispatched event " .. tostring(selectedKillstreaks[i][1]))
                    WebUI:ExecuteJS(
                        'document.dispatchEvent(new CustomEvent("Killstreak:UI:selectStep",{detail:' ..
                            tostring(i) .. "}))"
                    )
                    inUse[i] = true
                    Events:Dispatch(selectedKillstreaks[i][1] .. ":Invoke", i)
                    return
                end
            end
            if InputManager:WentKeyUp(tonumber(bindings[i])) and inUse[i] == true then
                print("Disable")
                Events:Dispatch(selectedKillstreaks[i][1] .. ":Disable", i)
                WebUI:ExecuteJS(
                    'document.dispatchEvent(new CustomEvent("Killstreak:UI:selectStep",{detail:' ..
                        tostring(-10) .. "}))"
                )
                inUse[i] = false
                return
            end
        end
    end
)

function getConf(config)
    -- print("Get conf " .. config)
    confResend = json.encode(config)
    WebUI:Init()
    WebUI:ExecuteJS(
        'document.dispatchEvent(new CustomEvent("Killstreak:UI:getAllKillstreaks",{detail:' .. confResend .. "}))"
    )
    WebUI:Show()
    WebUI:DisableKeyboard()
    config = json.decode(config)
end

function calcStep(data)
    count = 1
    tempTable = {}
    if selectedKillstreaks ~= nil then
        tempTable = selectedKillstreaks
    end
    for _ in pairs(tempTable) do
        count = count + 1
    end
    if count == 1 then
        return
    end
    for i = 1, count, 1 do
        if i + 1 == count then
            step = 4
            break
        end

        if i == 1 then
            if tempTable[i][3] > data then
                print("New Step minimal " .. tostring(0))
                step = 0
                break
            end
        end
        if tempTable[i][3] <= data and data < tempTable[i + 1][3] then
            print("New Step " .. tostring(i))
            step = i
            break
        end
        print(tostring(tempTable[i][3]) .. " | " .. tostring(data) .. " | " .. tostring(tempTable[i + 1][3]))
    end
end

NetEvents:Subscribe(
    "Killstreak:ScoreUpdate",
    function(data)
        data = tonumber(data)
        score = data
        WebUI:ExecuteJS('document.dispatchEvent(new CustomEvent("Killstreak:UpdateScore",{detail:"' .. data .. '"}))')
        print("Got Data " .. tostring(data))
        calcStep(data)
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
        WebUI:ExecuteJS(
            'document.dispatchEvent(new CustomEvent("Killstreak:UI:selectStep",{detail:' .. tostring(-10) .. "}))"
        )
        inUse[usedStep] = false
        NetEvents:SendLocal("Killstreak:notifyServerUsedSteps", usedStep)
    end
)
