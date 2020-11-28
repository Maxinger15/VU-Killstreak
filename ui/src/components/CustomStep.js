import React from "react";
import {  Steps,StepProps } from "antd";
const { Step } = Steps;
class CustomStep extends React.Component<StepProps> {


    createDiscription(){
        let str = this.props.description;
        if(str == undefined){
            return "";
        }
        let erg = this.props.cost - this.props.playerScore;
        //Hier kann Use It Animation eingefügt werden
        if(erg < 0){
            erg = 0
        }
        return  str.replace("%NR",erg)
    }


    render(){
        return (
            <Step
                  key={this.props.key}
                  title={this.props.title}
                  description={this.createDiscription()}
                  style={this.props.style}
            />
        )
    }

}
export default CustomStep;