import React from "react";
import KsPicker from "../kspicker";
import KsTimer from "./kstimer";
import "./kstimerlist.css";
export default class KsTimerList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="timerList">
        {this.props.timers.map((el, index) => {
          if (el.remaining === undefined || el.remaining > 0) {
            return (
              <KsTimer
                key={"timerList"+index}
                index={index}
                obj={el}
                onCompleted={this.props.onCompleted}
              />
            );
          }
        })}
      </div>
    );
  }
}
