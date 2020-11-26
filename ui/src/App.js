import React from 'react';
import { Layout } from 'antd';
import "./App.css"
import 'antd/dist/antd.css';
import Progress from "./progress"
const { Header, Footer, Sider, Content } = Layout;

class App extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return (
      
      <Layout style={{height:"100vh"}} className={"overallBackground"}>
      <Header className={"overallBackground"}></Header>
      <Layout>
      
        <Content className={"overallBackground"}>
        </Content>
        <Sider className={"overallBackground"} width="30%">
          <Progress className={"overallBackground"} style={{height:"100%",position:"relative",display:"flex",alignItems:"center"}}/>
        </Sider>
      </Layout>
    </Layout>
    );
  }
  
}

export default App;
