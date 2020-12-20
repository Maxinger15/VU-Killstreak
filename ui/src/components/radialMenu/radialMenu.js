import React from "react";
import RadialRender from "./RadialRender"
import {Button} from "antd"

export default class RadialMenu extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return (

            <div>
                <RadialRender r={70}>
                <Button
                          type="ghost"
                          style={{ border: "0px" ,width:"100%"}}
                          
                        > 1 </Button>
                        <Button
                          type="ghost"
                          style={{ border: "0px" ,width:"100%"}}
                          
                        > 2 </Button>
                        <Button
                          type="ghost"
                          style={{ border: "0px" ,width:"100%"}}
                          
                        > 3 </Button>
                        <Button
                          type="ghost"
                          style={{ border: "0px" ,width:"100%"}}
                          
                        > 4 </Button>
                </RadialRender>
            </div>
        )
    }
}