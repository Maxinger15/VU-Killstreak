import React from "react";
import RadialRender from "./RadialRender";
import { Button } from "antd";
import "./radial.css";
import { RightCircleFilled } from "@ant-design/icons";
export default class RadialMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  getCurrentStep(score) {
    if (this.props.layout.length === 0) {
      return { step: 0, perc: 0 };
    }
    let vals = [0];
    this.props.layout.forEach(el =>{
      vals.push(el[2])
    })
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] <= score && score < vals[i + 1]) {
        let erg = this.setCurrentStepPercentage(i, score- vals[i],vals);
        return { step: i, perc: erg };
      }
      if (i === vals.length - 1) {
        if(score >= vals[i]){
        return { step: i, perc:100 };
        }
        let erg = this.setCurrentStepPercentage(0, score-vals[i],vals);
        return { step: 0, perc: erg };
      }
    }
  }

  setCurrentStepPercentage(curStep, score,vals) {
    if (curStep > vals.length - 1) {
      return 100;
    }
    if(curStep > 0){
      let erg = parseInt((score * 100) / (vals[curStep+1]-vals[curStep]));
      return erg
    }else{
      return parseInt((score * 100) / vals[curStep+1]);
    }
    
  }
  render() {
    let curStep = this.getCurrentStep(this.props.score)
    return (
      <RadialRender r={65}>
        {this.props.killstreaks.map((el,index) => {
          return (
            <Button
              type={index >= curStep.step? "link" : "primary"}
              style={index === 1 || index === 3 ? { border: "0px", width: "100%",right:"50%"} : { border: "0px", width: "100%" }}
              key={"radial"+index}
              //onClick={()=>{this.props.onKillstreakSelectedCallback(index)}}
            >
              {el.title}
            </Button>
          );
        })}
      </RadialRender>
    );
  }
}
