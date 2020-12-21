-- Edit this to add other mods as Killstreaks. The Mod has to have a Invoke event wich only needs to be called without a parameter
-- The second row allows you to modifiy the keys which invoke the killstreak

local conf = {
    {
        "vu-artillerystrike",
        InputDeviceKeys.IDK_F5,
        7000,
        "Artillery",
        "Left %NR",
        "Press F9 to use",
        "Ready to use"
      },
      {
        "vu-ks-grenades",
        65,
        2000,
        "Grenades",
        "Left %NR",
        "Press F9 to use",
        "Ready to use"
      },
      {
        "vu-ks-smokescreen",
        65,
        5500,
        "Smokescreen",
        "Left %NR",
        "Press F9 to use",
        "Ready to use"
      },
      {
        "vu-ks-adrenalinerush",
        65,
        3000,
        "Adrenaline rush",
        "Left %NR",
        "Press F9 to use",
        "Ready to use"
      }
}



return conf
