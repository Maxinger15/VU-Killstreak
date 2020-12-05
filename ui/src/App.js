import React from "react";
import { Layout } from "antd";

import "antd/dist/antd.css";
import "./App.css";
import Progress from "./components/progress";
import KsPicker from "./components/kspicker"
const { Header, Footer, Sider, Content } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ksPickerVisible : true
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle(e){
    var key =  e.which;
    console.log("change")
    if(key === 69) {
       this.setState({
        ksPickerVisible: !this.state.ksPickerVisible
       },()=>{
         console.log(this.state.ksPickerVisible)
       })
    }
  }

  componentDidMount(){
    document.addEventListener('keydown',this.toggle, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown",this.toggle,false)
  }

  render() {
    return (
      <>
      <Layout style={{ height: "100vh" }} className={"overallBackground"}>
        <Header className={"overallBackground"}></Header>
        <Layout>
          <Sider className={"overallBackground"} width="30%">
            <Progress
              className={"overallBackground"}
              style={{
                height: "100%",
                position: "relative",
                display: "flex",
                alignItems: "center",
                opacity: "0.5",
                fontFamily:"bf3Better"
              }}
            />
          </Sider>
          <Content className={"overallBackground"}></Content>
        </Layout>
      </Layout>
      <div style={{width:"100%",height:"100%",position:"absolute",background:"rgba(58, 42, 45, 0.65)",top:"0px",left:"0px",display: this.state.ksPickerVisible ? "flex" : "hidden"}}>
      <div style={{width:"50%",height:"50%",position: "absolute",top:"22%",left:"25%"}}>
              <KsPicker/>
      </div>
      </div>
      
      </>
    );
  }
}

export default App;
