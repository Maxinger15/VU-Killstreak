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
      stepValues : this.createStepValues(layout),
      curStep : 0,
      curPercentage : 0,
      layout : layout
    }
    
    
  }

  createStepValues(layout){
    let list = [0]
    layout.perks.forEach(element => {
      list.push(element.cost)
    });
    return list;
  }

  updateScoreCallback = (e)=>{
    let {step,perc} = this.setCurrentStep(e.detail)
    this.setState({
      score: e.detail,
      curStep : step,
      curPercentage:perc
    })
  }

  componentDidMount(){
    window.addEventListener('Killstreak:UpdateScore',this.updateScoreCallback)
  }

  componentWillUnmount(){
    window.removeEventListener('Killstreak:UpdateScore',this.updateScoreCallback)
  }

  setCurrentStep(score){
    let vals = this.state.stepValues;
    for(let i= 0; i < this.state.stepValues.length-1;i++){
      if(vals[i] <= score && score < vals[i+1]){
        let erg = this.setCurrentStepPercentage(i,score)
        return {step: i,perc: erg}
      }
      if(i === this.state.stepValues.length-2){
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
  createDiscription(el){
    let str = el.description;
    if(str == undefined){
        return "";
    }
    let erg = el.cost - this.state.score;
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
        <div style={{position:"absolute",color:"white",left:"11%",top:"13%",fontSize:"x-large"}}>
          {this.state.score}
        </div>
          <Steps
            current={this.state.curStep}
            percent={this.state.curPercentage}
            direction="vertical"
            style={{ color: "white", transform: "scale(1.2)",left:"5%",top:"21%",position:"absolute",width:"fit-content",fontWeight:"100"}}
          >
            {this.state.layout.perks.map((el,index)=>{
              return(
                <Step
                  key={index}
                  title={el.title}
                  description={this.createDiscription(el)}
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
