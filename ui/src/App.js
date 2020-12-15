import React from "react";
import { Layout, Button } from "antd";

import "antd/dist/antd.css";
import "./App.css";
import Progress from "./components/progress";
import KsPicker from "./components/kspicker";
const { Header, Sider, Content } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ksPickerVisible: false,
      allKillstreaks: [],
      selectedKillstreaks: [],
      showKsButton: true,
      timers: [],
    };
    this.toggle = this.toggle.bind(this);
    this.getAllKillstreaks = this.getAllKillstreaks.bind(this);
    this.showUi = this.showUi.bind(this);
    this.hideUi = this.hideUi.bind(this);
    this.onSelectedChange = this.onSelectedChange.bind(this);
    this.showKsButton = this.showKsButton.bind(this);
    this.hideKsButton = this.hideKsButton.bind(this);
    this.clearAllTimers = this.clearAllTimers.bind(this);
    this.onTimerComplete = this.onTimerComplete.bind(this);
    this.newTimer = this.newTimer.bind(this)
  }

  clearAllTimers() {
    this.setState({
      timers: [],
    });
  }

  onTimerComplete() {
    let notFinished = false;
    this.state.timers.forEach((element) => {
      if (element.remaining === undefined || element.remaining > 0) {
        notFinished = true;
      }
    });
    if (!notFinished) {
      this.clearAllTimers()
    }else{
      this.setState({
        timers: this.state.timers,
      });
    }
    
  }

  getTestData() {
    return [
      [
        "vu-artillerystrike",
        65,
        150,
        "Grenades",
        "Left %NR",
        "Press F to use",
      ],
      [
        "vu-artillerystrike",
        65,
        250,
        "Health",
        "Left %NR",
        "Press F to use",
      ],
      [
        "vu-artillerystrike",
        65,
        350,
        "Ac130",
        "Left %NR",
        "Press F to use",
      ],
      [
        "vu-artillerystrike",
        65,
        450,
        "Tactical Missle",
        "Left %NR",
        "Press F to use",
      ],
      [
        "vu-artillerystrike",
        65,
        550,
        "Big big boom",
        "Left %NR",
        "Press F to use",
      ],
      [
        "vu-artillerystrike",
        65,
        650,
        "low boom",
        "Left %NR",
        "Press F to use",
      ],
      [
        "vu-artillerystrike",
        65,
        750,
        "walking speed increase",
        "Left %NR",
        "Press F to use",
      ],
      [
        "vu-artillerystrike",
        65,
        850,
        "more health",
        "Left %NR",
        "Press F to use",
      ],
      [
        "vu-artillerystrike",
        65,
        850,
        "more health",
        "Left %NR",
        "Press F to use",
      ],
    ];
  }

  toggle(e) {
    var key = e.which;
    if (key === 27) {
      this.setState({
        ksPickerVisible: false,
      });
    }
    if (key === 73) {
      this.setState({
        ksPickerVisible: !this.state.ksPickerVisible,
      });
    }
  }

  getAllKillstreaks(e) {
    this.setState({
      allKillstreaks: JSON.parse(e.detail),
    });
  }

  newTimer(e){
    let timersN = this.state.timers;
    timersN.push(JSON.parse(e.detail))
    console.log("new List",timersN)
    this.setState({
      timers: timersN
    })
  }

  showUi() {
    this.setState({
      ksPickerVisible: true,
    });
  }

  hideUi() {
    this.setState({
      ksPickerVisible: false,
    });
  }

  showKsButton() {
    this.setState({
      showKsButton: true,
    });
  }

  hideKsButton() {
    this.setState({
      showKsButton: false,
    });
  }

  componentDidMount() {
    if (process.env.NODE_ENV !== "production") {
      this.setState({
        allKillstreaks: this.getTestData(),
        timers: [
          {
            duration: 50000,
            text: "test 1",
          },
          {
            duration: 15,
            text: "test 2",
          },
        ],
      });
      document.addEventListener("keydown", this.toggle, false);
    }

    document.addEventListener(
      "Killstreak:UI:getAllKillstreaks",
      this.getAllKillstreaks,
      false
    );
    document.addEventListener(
      "Killstreak:UI:showSelectScreen",
      this.showUi,
      false
    );
    document.addEventListener(
      "Killstreak:UI:hideSelectScreen",
      this.hideUi,
      false
    );
    document.addEventListener(
      "Killstreak:UI:showKsButton",
      this.showKsButton,
      false
    );
    document.addEventListener(
      "Killstreak:UI:hideKsButton",
      this.hideKsButton,
      false
    );
    document.addEventListener(
      "Killstreak:UI:newTimer",
      this.newTimer,
      false
    );
  }

  componentWillUnmount() {
    if (process.env.NODE_ENV !== "production") {
      document.removeEventListener("keydown", this.toggle, false);
    }

    document.removeEventListener(
      "Killstreak:UI:getAllKillstreaks",
      this.getAllKillstreaks,
      false
    );
    document.removeEventListener(
      "Killstreak:UI:showSelectScreen",
      this.showUi,
      false
    );
    document.removeEventListener(
      "Killstreak:UI:hideSelectScreen",
      this.hideUi,
      false
    );
    document.removeEventListener(
      "Killstreak:UI:showKsButton",
      this.showKsButton,
      false
    );
    document.removeEventListener(
      "Killstreak:UI:hideKsButton",
      this.hideKsButton,
      false
    );
    document.removeEventListener(
      "Killstreak:UI:newTimer",
      this.newTimer,
      false
    );
  }

  onSelectedChange(newValues) {
    let orig = [];
    newValues.forEach((el) => {
      orig.push(el.original);
    });
    /*eslint-disable no-undef*/
    if (process.env.NODE_ENV === "production") {
      WebUI.Call(
        "DispatchEvent",
        "Killstreak:selectedKillstreaks",
        JSON.stringify(orig)
      );
    }
    /*eslint-enable no-undef*/
    this.setState({
      selectedKillstreaks: newValues,
    });
  }

  getOriginalLayoutArray(old) {
    let newArr = [];
    old.forEach((element) => {
      newArr.push(element.original);
    });
    return newArr;
  }

  render() {
    return (
      <>
        <Layout style={{ height: "100vh" }} className={"overallBackground"}>
          <Header className={"overallBackground"} style={{height:"15%"}}></Header>
          <Layout>
            <Sider className={"overallBackground"} width="30%">
              <Progress
                layout={this.getOriginalLayoutArray(
                  this.state.selectedKillstreaks
                )}
                showButton={this.state.showKsButton}
                showUi={this.showUi}
                className={"overallBackground"}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  opacity: "0.5",
                  fontFamily: "bf3Better",
                  left: "3%",
                }}
                timers={this.state.timers}
                onCompleted={this.onTimerComplete}
              />
            </Sider>
            <Content className={"overallBackground"}></Content>
          </Layout>
        </Layout>
        {this.state.ksPickerVisible ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              background: "rgba(58, 42, 45, 0.65)",
              top: "0px",
              left: "0px",
            }}
          >
            <div
              style={{
                width: "50%",
                height: "50%",
                position: "absolute",
                top: "22%",
                left: "25%",
              }}
            >
              <KsPicker
                killstreaks={this.state.allKillstreaks}
                selectedKillstreaks={this.state.selectedKillstreaks}
                onChange={(newValues) => {
                  this.onSelectedChange(newValues);
                }}
                onCloseButton={this.hideUi}
              />
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

export default App;
