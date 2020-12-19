import React from "react";
import { List, Card, Button, Row, Col } from "antd";
import {
  PlusOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
export default class KsPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.convertLayoutToCards(this.props.killstreaks),
      selected: this.props.selectedKillstreaks,
      maxKillstreaks: 4,
    };
    this.toggleItem = this.toggleItem.bind(this);
  }

  checkIfSeleted(element) {
    let found = false;
    this.props.selectedKillstreaks.forEach((el) => {
      if (JSON.stringify(el.original) === JSON.stringify(element)) {
        found = true;
      }
    });
    return found;
  }

  convertLayoutToCards(values) {
    let newList = [];
    values.forEach((element, index) => {
      newList.push({
        title: element[3],
        description: "Points: " + element[2],
        selected: this.checkIfSeleted(element),
        original: element,
      });
    });
    return newList;
  }

  convertCardToLayout(cards) {
    let old = [];
    cards.forEach((el) => {
      old.push(el.original);
    });
    return old;
  }

  compare(a, b) {
    if (a.original[2] < b.original[2]) {
      return -1;
    }
    if (a.original[2] > b.original[2]) {
      return 1;
    }
    return 0;
  }

  toggleItem(itm) {
    if (this.props.selectedKillstreaks.length >= this.state.maxKillstreaks) {
      let newSelected = [];
      this.props.selectedKillstreaks.forEach((element) => {
        if (itm.title !== element.title) {
          newSelected.push(element);
        } else {
          itm.selected = false;
        }
      });
      if (newSelected.length !== this.props.selectedKillstreaks) {
        newSelected.sort(this.compare);
        this.setState({
          selected: newSelected,
        });
        this.props.onChange(newSelected);
        return;
      }
    }
    if (this.props.selectedKillstreaks.length >= this.state.maxKillstreaks) {
      return;
    }
    let newSelected = [];
    this.props.selectedKillstreaks.forEach((element) => {
      if (itm.title !== element.title) {
        newSelected.push(element);
      } else {
        itm.selected = false;
      }
    });
    if (newSelected.length === this.props.selectedKillstreaks.length) {
      itm.selected = true;
      newSelected.push(itm);
    }
    newSelected.sort(this.compare);
    this.setState({
      selected: newSelected,
    });
    this.props.onChange(newSelected);
    return;
  }

  render() {
    return (
      <div>
        <Row style={{ fontSize: "16px", fontWeight: "bolder", color: "white",borderBottom:" 1.5px solid white",marginBottom:"5px" }}>
          <Col span={8}>Select your Killstreaks</Col>
          <Col span={8}>
            <div style={{ textAlign: "center" }}>
              {this.props.selectedKillstreaks.length +
                "/" +
                this.state.maxKillstreaks}
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: "right" }}>
              <Button type="ghost" style={{ border: "0px", width:"10%" }} icon={<CloseOutlined />} onClick={this.props.onCloseButton}></Button>
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
                      color:"white",
                      fontSize:"18px"
                    }}
                    bodyStyle={{
                      textAlign: "center",
                      padding: "8px 4px 10px 4px",
                      color:"white",
                      fontSize: "13px"
                    }}
                  >
                    <Row gutter={[8, 8]} justify="center" align="middle">
                      <Col>
                        <span>{itm.description}</span>
                      </Col>
                    </Row>
                    <Row justify="center" align="middle">
                      <Col span={24}>
                        <Button
                          type="ghost"
                          style={{ border: "0px" ,width:"100%"}}
                          icon={
                            itm.selected ? (
                              <CheckCircleOutlined
                                style={{ color: "#3bc406" }}
                              />
                            ) : (
                              <PlusOutlined style={{ color: "white" }} />
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
            <Row>
              <Col span={6} style={{color: "white",fontSize:14}} ><div>Developed by Maxinger15</div></Col>
              <Col span={18}></Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
