import React from "react";
import { List, Card, Button, Row, Col } from "antd";
import { PlusOutlined, CheckCircleOutlined } from "@ant-design/icons";
export default class KsPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      selected: [],
      maxKillstreaks: 4,
    };
    this.toggleItem = this.toggleItem.bind(this);
  }
  componentDidMount() {
    if (process.env.NODE_ENV !== "production") {
      this.setState({
        options: this.convertLayoutToCards(this.getTestData()),
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

  convertLayoutToCards(values) {
    let newList = [];
    values.forEach((element, index) => {
      newList.push({
        title: element[3],
        description: "Points: " + element[2],
        id: index,
        selected: false,
      });
    });
    return newList;
  }
  toggleItem(itm) {
    if (this.state.selected.length >= this.state.maxKillstreaks) {
      let newSelected = [];
      this.state.selected.forEach((element) => {
        if (itm.id !== element.id) {
          newSelected.push(element);
        } else {
          itm.selected = false;
        }
      });
      if (newSelected.length !== this.state.selected) {
        this.setState({
          selected: newSelected,
        });
        return;
      }
    }
    if (this.state.selected.length >= this.state.maxKillstreaks) {
      return;
    }
    let newSelected = [];
    this.state.selected.forEach((element) => {
      if (itm.id !== element.id) {
        newSelected.push(element);
      } else {
        itm.selected = false;
      }
    });
    if (newSelected.length === this.state.selected.length) {
      itm.selected = true;
      newSelected.push(itm);
    }
    this.setState({
      selected: newSelected,
    });
    return;
  }

  render() {
    return (
      <div>
        <Row style={{fontSize : "16px",fontWeight:"bolder",color:"white"}}>
          <Col span={12}>Select your Killstreaks</Col>
          <Col span={12} >
            <div style={{textAlign:"right"}} >
              {this.state.selected.length + "/" + this.state.maxKillstreaks}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 4,
                xxl: 4,
              }}
              pagination={{
                position: "bottom",
                hideOnSinglePage: true,
                showSizeChanger: false,
              }}
              dataSource={this.state.options}
              renderItem={(itm, i) => (
                <List.Item>
                  <Card
                    bordered={false}
                    key={i}
                    title={itm.title}
                    headStyle={{
                      textAlign: "center",
                      paddingLeft: "4px",
                      paddingRight: "4px",
                      fontWeight:"bold"
                    }}
                    bodyStyle={{
                      textAlign: "center",
                      padding: "8px 4px 10px 4px",
                    }}
                  >
                    <Row gutter={[8, 8]} justify="center" align="middle">
                      <Col>
                        <span>{itm.description}</span>
                      </Col>
                    </Row>
                    <Row justify="center" align="middle">
                      <Col>
                        <Button
                          type="ghost"
                          style={{ border: "0px" }}
                          shape="circle"
                          icon={
                            itm.selected ? (
                              <CheckCircleOutlined style={{color:"#3bc406"}}/>
                            ) : (
                              <PlusOutlined style={{color:"white"}} />
                            )
                          }
                          onClick={() => {
                            this.toggleItem(itm);
                          }}
                        ></Button>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
