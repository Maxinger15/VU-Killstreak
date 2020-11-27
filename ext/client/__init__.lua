Events:Subscribe('Extension:Loaded', function()
    WebUI:Init()
end)

NetEvents:Subscribe('Killstreak:ScoreUpdate', function(data)
    WebUI:ExecuteJS('window.dispatchEvent(new CustomEvent("Killstreak:UpdateScore",{detail:"'.. data ..'"}))')
end)