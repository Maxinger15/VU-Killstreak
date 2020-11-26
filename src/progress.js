import React from "react";
import { Spin, Steps } from "antd";
const { Step } = Steps;
class Progess extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={this.props.style} className={this.props.className}>
          <Steps
            current={1}
            percent={60}
            direction="vertical"
            style={{ color: "white", transform: "scale(1.2)",left:"80px",position:"absolute"}}
            size={200}
          >
            <Step
              title="Granaten"
              description="Left: 0"
              style={{ color: "white" }}
            />
            <Step
              title="Health"
              description="Left: 500"
              style={{ color: "white" }}
            />
            <Step
              title="Bots"
              description="Left 3100"
              style={{ color: "white" }}
            />
            <Step
              title="AC130"
              description="Left 6100"
              style={{ color: "white" }}
            />
          </Steps>
        </div>
    );
  }
}

export default Progess;
