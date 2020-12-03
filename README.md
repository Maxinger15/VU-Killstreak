# VU-Killstreak
Core mod for Killstreaks in Battlefield 3.

This mod adds the UI and the logic to interact with killstreaks.
The UI is made with React. To develop you need NodeJS and npm installed on you System.
On first use go into the UI Folder and type in the command line "npm install" to install all dependencies
then you can run the UI on your local System with "npm run start"

> Killstreaks will be provided as extra mods. See here how you [create one](#develop-killstreaks)
<img src="./github_styles/killstreak.gif" width="600" height="400"/>

## Available killstreaks:
- [Artillery Strike](https://github.com/Maxinger15/vu-artillerystrike)
- [Tactical Missle WIP](https://github.com/Maxinger15/vu-tactical-missle)

## Develop killstreaks:

### Defaults:
The default keys to trigger the killstreaks are F5,F6 ,F7 ,F8.
It is possible to change this in the configuration.lua but it would be more instinctively to keep the defaults.
The default key to trigger the killstreak if it has a UI (for example when you can place it at a location) the
default key should be F.

### Events:
Your killstreak needs the following Events at the client side to be used by the core mod.

The <your mod name in mod.json>:Invoke event is triggerd when the User has the points to use your killstreak
and pressed the declared button in the configuration.lua
Parameters:
- stepNr: The number of your killstreak (1-4 including)
- keyboardKey: The key the user pressed to invoke your killstreak
> ```lua
>Events:Subscribe("vu-artillerystrike:Invoke",function(stepNr,keyboardKey)
>	-- Killstreak enabled. Enable UI if available
>    Do things the killstreak should do
>end)
> ```

The <your mod name in mod.json>:Disable event is only necessary if you have a step between
invoke killstreak and actually use it. A UI where you can select a place for example. See [this](https://github.com/Maxinger15/vu-artillerystrike)
> ```lua
> Events:Subscribe("vu-artillerystrike:Disable",function(stepNr)
>	-- Killstreak not Used. Disable UI....
> end)
>```
  
Dispatch this event when the killstreak was used.
This decreases the points of the player and adjusts the UI
Parameter:
- stepNr: the stepNr you got with the invoke event.
> ```lua
> Events:Dispatch("Killstreak:usedStep",stepNr)
> ```

## Configuration.lua
In the server folder you can find a file called Configuration.lua.
In this file you define which killstreak mods are available, how many points they cost, change the selection keys (not recommended!)
Currently only 4 killstreaks at the same time are supportet!!! Not more not less!
The file looks like that:
>```lua
>local conf  ={
>    {
>        "vu-artillerystrike","vu-ac130","vu-artystrike","vu-ac130" -- Change this to the name in the mod.json of your killstreaks
>    },
>    {
>        InputDeviceKeys.IDK_F5,InputDeviceKeys.IDK_F6,InputDeviceKeys.IDK_F7,InputDeviceKeys.IDK_F8 -- Select keys (don't change for usability purposes)
>    },
 >   {
>        150,250,350,450 -- The cost of the killstreaks (can/should be changed)
>    },{
>        "Grenades","Health","Airstrike","AC130" -- The name that is shown in the UI
>    },{
 >       "Left %NR","Left %NR","Left %NR","Left %NR" -- The description that is shown in the UI. 
>        
 >   }
>}
>```

Fancy thing: %NR will be replaced by the UI with the points left to unlock the killstreak. "Left: %NR Points" -> "Left: 150 Points"
