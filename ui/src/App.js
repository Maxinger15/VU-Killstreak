import React from "react";
import { Layout,Button } from "antd";

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
      selectedKillstreaks: []
    };
    this.toggle = this.toggle.bind(this);
    this.getAllKillstreaks = this.getAllKillstreaks.bind(this)
    this.showUi = this.showUi.bind(this)
    this.hideUi = this.hideUi.bind(this)
    this.onSelectedChange = this.onSelectedChange.bind(this)
  }
  getTestData() {
    return [
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
      ],
      [
        "vu-artillerystrike",
        65,
        550,
        "Big big boom",
        "Left %NR",
        "F5",
        "Press F to use",
      ],
      [
        "vu-artillerystrike",
        65,
        650,
        "low boom",
        "Left %NR",
        "F5",
        "Press F to use",
      ],
      [
        "vu-artillerystrike",
        65,
        750,
        "walking speed increase",
        "Left %NR",
        "F5",
        "Press F to use",
      ],
      [
        "vu-artillerystrike",
        65,
        850,
        "more health",
        "Left %NR",
        "F5",
        "Press F to use",
      ],
      [
        "vu-artillerystrike",
        65,
        850,
        "more health",
        "Left %NR",
        "F5",
        "Press F to use",
      ],
    ];
  }

  toggle(e) {
    var key = e.which;
    if (key === 69) {
      this.setState(
        {
          ksPickerVisible: !this.state.ksPickerVisible,
        },
        () => {
          console.log(this.state.ksPickerVisible);
        }
      );
    }
  }

  getAllKillstreaks(e){
    console.log("ks Event",JSON.parse(e.detail))
    this.setState({
      allKillstreaks: JSON.parse(e.detail)
    })
  }
  showUi(){
    this.setState({
      ksPickerVisible : true,
    })
  }
  hideUi(){
    this.setState({
      ksPickerVisible: false
    })
  }

  componentDidMount() {
    if(process.env.NODE_ENV !== "production"){
      document.addEventListener("keydown", this.toggle, false);
      this.setState({
        allKillstreaks: this.getTestData()
      })
    }
    
    document.addEventListener("Killstreak:UI:getAllKillstreaks", this.getAllKillstreaks, false)
    document.addEventListener("Killstreak:UI:showSelectScreen", this.showUi, false)
    document.addEventListener("Killstreak:UI:hideSelectScreen", this.hideUi, false)
    
  }
  componentWillUnmount() {
    if(process.env.NODE_ENV !== "production"){
      document.removeEventListener("keydown", this.toggle, false);
    }
    document.removeEventListener("keydown", this.toggle, false);
    document.removeEventListener("Killstreak:UI:getAllKillstreaks",this.getAllKillstreaks, false)
    document.removeEventListener("Killstreak:UI:showSelectScreen", this.showUi, false)
    document.removeEventListener("Killstreak:UI:hideSelectScreen", this.hideUi, false)
  }
  onSelectedChange(newValues){
    console.log("new Values",newValues)
    let orig = []
    newValues.forEach(el =>{
      orig.push(el.original)
    })
    /*eslint-disable no-undef*/
    if (process.env.NODE_ENV === "production") {
      WebUI.Call("DispatchEvent", "Killstreak:selectedKillstreaks", JSON.stringify(orig));
    }
    /*eslint-enable no-undef*/
    this.setState({
      selectedKillstreaks : newValues
    })
  }

  getOriginalLayoutArray(old){
    let newArr = [];
    old.forEach(element => {
       newArr.push(element.original)
    });
    return newArr;
  }

  render() {
    console.log(this.state)
    return (
      <>
        <Layout style={{ height: "100vh" }} className={"overallBackground"}>
          <Header className={"overallBackground"}></Header>
          <Layout>
            <Sider className={"overallBackground"} width="30%">
              <Progress
                layout={ this.getOriginalLayoutArray(this.state.selectedKillstreaks)}
                className={"overallBackground"}
                style={{
                  height: "100%",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  opacity: "0.5",
                  fontFamily: "bf3Better",
                }}
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
              <KsPicker killstreaks={this.state.allKillstreaks} selectedKillstreaks={this.state.selectedKillstreaks} onChange={(newValues)=>{this.onSelectedChange(newValues)}} onCloseButton={this.hideUi}/>
            </div>
          </div>
        ) : 
        <Button type="ghost" onClick={this.showUi} className="ksButton">Killstreaks</Button>
        
        }
      </>
    );
  }
}

export default App;
