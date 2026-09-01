import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default class KsTimer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { playing: true };
  }

  render() {
    // Ensure text content is not empty (if empty, display placeholder to avoid height collapse)
    const displayText = this.props.obj.text || " ";
    
    return (
      <div style={{
        display: "flex",
        flexDirection: "row",      // horizontal layout
        alignItems: "center",      // vertical center alignment
        paddingTop: "12px",
        marginRight: "0px",
        opacity: 0.9,
        // Ensure parent container does not compress children
        flexWrap: "nowrap",
        minHeight: "38px",         // consistent with circle height
      }}>
        {/* Timer circle */}
        <CountdownCircleTimer
          onComplete={() => {
            this.props.onCompleted();
            return [false, 0];
          }}
          strokeWidth={4}
          strokeLinecap="square"
          size={38}
          isPlaying
          initialRemainingTime={this.props.obj.remaining}
          duration={this.props.obj.duration}
          colors={[
            ["#004777", 0.4],
            ["#004777", 0.3],
            ["#004777", 0.1],
            ["#A30000", 0.2],
          ]}
        >
          {({ remainingTime }: any) => (
            <div style={{
              color: "white",
              fontSize: "18px",
              fontFamily: "bf3Better, Arial, sans-serif",
              position: "relative",
              top: "-3px",
            }}>
              {Math.ceil(remainingTime)}
            </div>
          )}
        </CountdownCircleTimer>

        {/* Right-side text area - independent from the circle */}
        <div style={{
          color: "white",
          fontSize: "14px",          // appropriate size
          fontFamily: "bf3Better, Arial, sans-serif",
          marginLeft: "10px",
          lineHeight: 1.2,
          // Force as an independent block-level element but not occupying its own line
          display: "flex",
          // Ensure minimum width and height to prevent collapse
          minWidth: "50px",
          minHeight: "20px",
          // Temporary semi-transparent background and border for debugging (to confirm element exists)
          backgroundColor: "rgba(0,0,0,0.3)",
          padding: "2px 4px",
          borderRadius: "4px",
          whiteSpace: "nowrap",      // no line wrapping
        }}>
          {displayText}
        </div>
      </div>
    );
  }
}