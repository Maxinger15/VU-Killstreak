-- Edit this to add other mods as Killstreaks. The Mod has to have a Invoke event wich only needs to be called without a parameter
-- The second row allows you to modifiy the keys which invoke the killstreak

local conf  ={
    {
        "vu-artillerystrike","vu-ac130","vu-artystrike","vu-ac130"
    },
    {
        InputDeviceKeys.IDK_F5,InputDeviceKeys.IDK_F6,InputDeviceKeys.IDK_F7,InputDeviceKeys.IDK_F8
    },
    {
        150,250,350,450
    },{
        "Grenades","Health","Airstrike","AC130"
    },{
        "Left %NR","Left %NR","Left %NR","Left %NR"
    },{
        "F5","F6","F7","F8"
    },{
        "Press F to use","Press F to use","Press F to use","Press F to use"
    }
}



return conf