import React from "react";
import { Steps,Button } from "antd";
import KsTimer from "./kstimer/kstimer"
import KsTimerList from "./kstimer/kstimerlist";
const { Step } = Steps;
class Progess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      curStep: 0,
      curPercentage: 0,
      configLoaded: false,
    };
  }

  setLayout() {
    document.dispatchEvent(
      new CustomEvent("Killstreak:getConfig", {
        detail: JSON.stringify([
          [
            "vu-artillerystrike",
            65,
            150,
            "Grenades",
            "Left %NR",
            "F5",
            "Press F to use",
          ],
          [
            "vu-artillerystrike",
            65,
            250,
            "Health",
            "Left %NR",
            "F5",
            "Press F to use",
          ],
          [
            "vu-artillerystrike",
            65,
            350,
            "Ac130",
            "Left %NR",
            "F5",
            "Press F to use",
          ],
          [
            "vu-artillerystrike",
            65,
            450,
            "Tactical Missle",
            "Left %NR",
            "F5",
            "Press F to use",
          ]
        ]),
      })
    );
  }

  updateScoreCallback = (e) => {
    if(e.detail < 0){
      e.detail = 0
    }
    this.setState({
      score: e.detail
    });
  };

  componentDidMount() {
    document.addEventListener("Killstreak:UpdateScore", this.updateScoreCallback);
    if (process.env.NODE_ENV !== "production") {
      //this.setLayout();
    }
  }

  componentWillUnmount() {
    document.removeEventListener(
      "Killstreak:UpdateScore",
      this.updateScoreCallback
    );
  }

  setCurrentStep(score) {
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
        /*eslint-disable no-undef*/
        if (process.env.NODE_ENV === "production") {
          //WebUI.Call("DispatchEvent", "Killstreak:StepUpdate", i);
        }
        /*eslint-enable no-undef*/
        return { step: i, perc: erg };
      }
      if (i === vals.length - 1) {
        /*eslint-disable no-undef*/
        if (process.env.NODE_ENV === "production") {
          //WebUI.Call("DispatchEvent", "Killstreak:StepUpdate", i + 1);
        }
        /*eslint-enable no-undef*/
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
  createDescription(el) {
    let str = el[4];
    if (str == undefined) {
      return "";
    }
    let erg = el[2] - this.state.score;
    //Hier kann Use It Animation eingefügt werden
    if (erg <= 0) {
      erg = 0;
      return el[5];
    }
    return str.replace("%NR", erg);
  }

  getIcon(el,index,step) {
    if (step < index) {
      return (
        <div className={"ant-steps-item-icon"}>
          <div
            className="ant-steps-icon"
            style={{ height: "100%", top: "5px" }}
          >
            <span style={{ top: "-2px" }}>{"F"+(5+index)}</span>
          </div>
        </div>
      );
    } else if (step > index) {
      return (
        <div className={"ant-steps-item-icon ant-steps-item-finish"}>
          <div
            className="ant-steps-icon"
            style={{ height: "100%", top: "6px" }}
          >
            <span style={{ color: "white" }}>
              {"F"+(5+index)}
            </span>
          </div>
        </div>
      );
    } else {
      return <span>{"F"+(5+index)}</span>;
    }
  }

  render() {
    let { step, perc } = this.setCurrentStep(this.state.score);
    return (
      <div style={this.props.style} className={this.props.className}>
          <div
            style={{
              color: "white",
              fontSize: "x-large",
              flexBasis:"100%",
              position:"relative",
              left:"14%"
            }}
          >
            {this.state.score}
          </div>
        {this.props.layout.length > 0 ?
        <Steps
          current={step}
          percent={perc}
          direction="vertical"
          style={{
            color: "white",
            transform: "scale(1.1)",
            width: "auto",
            fontWeight: "100",
            transformOrigin:"0 0",
            marginTop:"5%",
            marginBottom:"5%"
          }}
        >
          {this.props.layout.map((el, index) => {
            return (
              <Step
                icon={this.getIcon(el,index,step)}
                key={index}
                title={el[3]}
                description={this.createDescription(
                  el
                )}
                style={{ color: "white",width:"fit-content" }}
              />
            );
          })}
        </Steps>
        :
        <div className="infoText"> Press the killstreak button in the spawn screen to select your killstreaks</div>
        }
        {this.props.showButton ? 
        <div style={{flexBasis:"100%",alignContent:"center"}}>
          <Button type="ghost" onClick={this.props.showUi} className="ksButton">
            Killstreaks
        </Button>
        </div>
        :
        null}
        <KsTimerList timers={this.props.timers} onCompleted={this.props.onCompleted} />
      </div>
    );
  }
}

export default Progess;
