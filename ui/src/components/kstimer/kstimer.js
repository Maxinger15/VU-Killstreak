import React from "react";
import { CountdownCircleTimer, Animated } from "react-countdown-circle-timer";




export default class KsTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        playing: true
    }
  }

  render() {
    return (
      <div style={{display:"flex",flexDirection:"row",alignItems:"center",paddingTop:"3%"}}>
      <CountdownCircleTimer
        onComplete={() => {
            this.props.onCompleted()
          return [false, 1500]; // repeat animation in 1.5 seconds
        }}
        strokeWidth={4}
        strokeLinecap="square"
        size="38"
        isPlaying
        initialRemainingTime={this.props.obj.remaining != undefined? this.props.obj.remaining : undefined}
        duration={this.props.obj.duration}
        colors={[
            ['#004777', 0.4],
            ['#004777', 0.3],
            ['#004777', 0.1],
            ['#A30000', 0.2],
          ]}
      >
           {({ remainingTime }) => {
           this.props.obj.remaining = remainingTime
           return(
            <div style={{color:"white",fontSize:"xxl",fontFamily:"bf3Better",position:"relative",top:"-3px"}}>{remainingTime}</div>
           )
           }}
      </CountdownCircleTimer>
      <div style={{color:"white",position:"relative",top:"-12.5%",paddingLeft:"10px",paddingBottom:"10%"}}>{this.props.obj.text}</div>
      
      
      </div>
    );
  }
}
