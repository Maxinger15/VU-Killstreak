import React from "react";
import {  Steps } from "antd";
import layout from "../layout/layoutTest"
import CustomStep from "./CustomStep"
const { Step } = Steps;
class Progess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score : 0,
      stepValues : layout[2],
      curStep : 0,
      curPercentage : 0,
      layout : [
        [],
        [],
        [],
        [],
        [],
      ],
      configLoaded : false
    }
    
    
  }


  updateScoreCallback = (e)=>{
    let {step,perc} = this.setCurrentStep(e.detail)
    this.setState({
      score: e.detail,
      curStep : step,
      curPercentage:perc
    })
  }
  getConfigCallback = (e)=>{
    let layout = JSON.parse(e.detail);
    let steps = [0].concat(layout[2])
    this.setState({
      stepValues : steps,
      layout: layout,
      configLoaded: true
    })
  }

  componentDidMount(){
    window.addEventListener('Killstreak:UpdateScore',this.updateScoreCallback)
    window.addEventListener("Killstreak:getConfig",this.getConfigCallback)
  }

  componentWillUnmount(){
    window.removeEventListener('Killstreak:UpdateScore',this.updateScoreCallback)
    window.removeEventListener("Killstreak:getConfig",this.getConfigCallback)
  }

  setCurrentStep(score){
    if(!this.state.configLoaded){
      return {step: 0,perc: 0}
    }
    let vals = this.state.stepValues;
    for(let i= 0; i < this.state.stepValues.length-1;i++){
      if(vals[i] <= score && score < vals[i+1]){
        let erg = this.setCurrentStepPercentage(i,score)
        /*eslint-disable no-undef*/
        WebUI.Call('DispatchEvent', 'Killstreak:StepUpdate', i)
        /*eslint-enable no-undef*/
        return {step: i,perc: erg}
      }
      if(i === this.state.stepValues.length-2){
        /*eslint-disable no-undef*/
        //WebUI.Call('DispatchEvent', 'Killstreak:StepUpdate', i+1)
        /*eslint-enable no-undef*/
        let erg = this.setCurrentStepPercentage(i+1,score);
        return {step: i+1,perc: erg}
      }
    }
  }

  setCurrentStepPercentage(curStep,score){
    if(curStep+1 > this.state.stepValues.length-1){
      return 100;
    }
    return parseInt(score * 100 / this.state.stepValues[curStep+1])

  }
  createDiscription(el,cost){
    let str = el;
    if(str == undefined){
        return "";
    }
    let erg = cost - this.state.score;
    //Hier kann Use It Animation eingefügt werden
    if(erg < 0){
        erg = 0
        return ""
    }
    return  str.replace("%NR",erg)
}

  render() {
    console.log("perc",this.state.curPercentage)
    console.log("step",this.state.curStep)
    return (
      <div style={this.props.style} className={this.props.className}>
         { this.state.configLoaded &&
           <div style={{position:"absolute",color:"white",left:"11%",top:"13%",fontSize:"x-large"}}>
              { this.state.score}
           </div>
        }
          <Steps
            current={this.state.curStep}
            percent={this.state.curPercentage}
            direction="vertical"
            style={{ color: "white", transform: "scale(1.2)",left:"5%",top:"21%",position:"absolute",width:"fit-content",fontWeight:"100"}}
          >
            {this.state.layout[3].map((el,index)=>{
              console.log(this.state.layout[4][index])
              return(
                <Step
                  key={index}
                  title={this.state.layout[3][index]}
                  description={this.createDiscription(this.state.layout[4][index],this.state.layout[2][index])}
                  style={{color:"white"}}
                />
              )
            })}
          </Steps>
          
        </div>
    );
  }
}

export default Progess;
