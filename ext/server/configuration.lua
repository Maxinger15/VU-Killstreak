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

local conf2 = {
    {
        "vu-artillerystrike",
        InputDeviceKeys.IDK_F5,
        150,
        "Grenades",
        "Left %NR",
        "F5",
        "Press F to use",
      },
      {
        "vu-artillerystrike",
        65,
        250,
        "Health",
        "Left %NR",
        "F5",
        "Press F to use",
      },
      {
        "vu-artillerystrike",
        65,
        350,
        "Ac130",
        "Left %NR",
        "F5",
        "Press F to use",
      },
      {
        "vu-artillerystrike",
        65,
        450,
        "Tactical Missle",
        "Left %NR",
        "F5",
        "Press F to use",
      },
      {
        "vu-artillerystrike",
        65,
        550,
        "Big big boom",
        "Left %NR",
        "F5",
        "Press F to use",
      },
      {
        "vu-artillerystrike",
        65,
        650,
        "low boom",
        "Left %NR",
        "F5",
        "Press F to use",
      },
      {
        "vu-artillerystrike",
        65,
        750,
        "walking speed increase",
        "Left %NR",
        "F5",
        "Press F to use",
      },
      {
        "vu-artillerystrike",
        65,
        850,
        "more health",
        "Left %NR",
        "F5",
        "Press F to use",
      },
      {
        "vu-artillerystrike",
        65,
        850,
        "more health 2",
        "Left %NR",
        "F5",
        "Press F to use",
      },
}



return conf2