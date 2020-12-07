import React from "react";
import { Steps } from "antd";
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
    window.dispatchEvent(
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
    let { step, perc } = this.setCurrentStep(e.detail);
    this.setState({
      score: e.detail,
      curStep: step,
      curPercentage: perc,
    });
  };

  componentDidMount() {
    window.addEventListener("Killstreak:UpdateScore", this.updateScoreCallback);
    if (process.env.NODE_ENV !== "production") {
      //this.setLayout();
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      "Killstreak:UpdateScore",
      this.updateScoreCallback
    );
  }

  setCurrentStep(score) {
    console.log("layout",this.props.layout)
    if (this.props.layout.length === 0) {
      return { step: 0, perc: 0 };
    }
    let vals = this.props.layout[2];
    for (let i = 0; i < this.props.layout[2].length - 1; i++) {
      if (vals[i] <= score && score < vals[i + 1]) {
        let erg = this.setCurrentStepPercentage(i, score);
        /*eslint-disable no-undef*/
        if (process.env.NODE_ENV === "production") {
          WebUI.Call("DispatchEvent", "Killstreak:StepUpdate", i);
        }
        /*eslint-enable no-undef*/
        return { step: i, perc: erg };
      }
      if (i === this.props.layout[2].length - 2) {
        /*eslint-disable no-undef*/
        if (process.env.NODE_ENV === "production") {
          WebUI.Call("DispatchEvent", "Killstreak:StepUpdate", i + 1);
        }
        /*eslint-enable no-undef*/
        let erg = this.setCurrentStepPercentage(i + 1, score);
        return { step: i + 1, perc: erg };
      }
    }
  }

  setCurrentStepPercentage(curStep, score) {
    if (curStep + 1 > this.props.layout[2].length - 1) {
      return 100;
    }
    return parseInt((score * 100) / this.props.layout[2][curStep + 1]);
  }
  createDiscription(el) {
    let str = el[4];
    if (str == undefined) {
      return "";
    }
    let erg = el[2] - this.state.score;
    //Hier kann Use It Animation eingefügt werden
    if (erg <= 0) {
      erg = 0;
      return el[6];
    }
    return str.replace("%NR", erg);
  }

  getIcon(el,index) {
    if (this.state.curStep < index) {
      return (
        <div className={"ant-steps-item-icon"}>
          <div
            className="ant-steps-icon"
            style={{ height: "100%", top: "5px" }}
          >
            <span style={{ top: "-2px" }}>{el[5]}</span>
          </div>
        </div>
      );
    } else if (this.state.curStep > index) {
      return (
        <div className={"ant-steps-item-icon ant-steps-item-finish"}>
          <div
            className="ant-steps-icon"
            style={{ height: "100%", top: "6px" }}
          >
            <span style={{ color: "white" }}>
              {el[5]}
            </span>
          </div>
        </div>
      );
    } else {
      return <span>{el[5]}</span>;
    }
  }

  render() {
    return (
      <div style={this.props.style} className={this.props.className}>
        {this.props.layout.length > 0 && (
          <div
            style={{
              position: "absolute",
              color: "white",
              left: "11%",
              top: "13%",
              fontSize: "x-large",
            }}
          >
            {this.state.score}
          </div>
        )}
        <Steps
          current={this.state.curStep}
          percent={this.state.curPercentage}
          direction="vertical"
          style={{
            color: "white",
            transform: "scale(1.2)",
            left: "5%",
            top: "21%",
            position: "absolute",
            width: "fit-content",
            fontWeight: "100",
          }}
        >
          {this.props.layout.map((el, index) => {
            return (
              <Step
                icon={this.getIcon(el,index)}
                key={index}
                title={el[3]}
                description={this.createDiscription(
                  el
                )}
                style={{ color: "white" }}
              />
            );
          })}
        </Steps>
      </div>
    );
  }
}

export default Progess;
