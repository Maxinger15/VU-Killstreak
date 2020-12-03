let layout2 = {
    perks: [
        {
            cost: 200,
            title: "Grenades",
            description:"Left %NR",
        },
        {
            cost: 400,
            title: "Health",
            description:"Left %NR",
        },
        {
            cost: 650,
            title: "UAV",
            description:"Left %NR",
        },
        {
            cost: 730,
            title: "AC130",
            description:"Left %NR",
        }
    ]
}

let layout =  [
        [
            "vu-artystrike:Invoke","vu-ac130:Invoke"
        ],
        [
            "InputDeviceKeys.IDK_F5","InputDeviceKeys.IDK_F6"
        ],
        [
            150,250,350,450
        ],
        [
            "Grenades","Health","Airstrike","AC130"
        ],
        [
            "Left %NR","Left %NR","Left %NR","Left %NR"
        ]
    ]

export default layout;