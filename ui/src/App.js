import React from "react";
import { Layout } from "antd";

import "antd/dist/antd.css";
import "./App.css";
import Progress from "./progress";
const { Header, Footer, Sider, Content } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
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
              }}
            />
          </Sider>
          <Content className={"overallBackground"}></Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;
