import React from "react";
import KsTimerList from "./kstimer/kstimerlist";

class Progress extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      score: 0,
      configLoaded: false,
    };
  }

  setLayout() {
    document.dispatchEvent(
      new CustomEvent("Killstreak:getConfig", {
        detail: JSON.stringify([
          ["vu-artillerystrike", 65, 150, "Grenades", "Left %NR", "F5", "Press F to use"],
          ["vu-artillerystrike", 65, 250, "Health", "Left %NR", "F5", "Press F to use"],
          ["vu-artillerystrike", 65, 350, "Ac130", "Left %NR", "F5", "Press F to use"],
          ["vu-artillerystrike", 65, 450, "Tactical Missle", "Left %NR", "F5", "Press F to use"],
        ]),
      })
    );
  }

  updateScoreCallback = (e: any) => {
    this.setState({
      score: e.detail < 0 ? 0 : e.detail,
    });
  };

  componentDidMount() {
    document.addEventListener("Killstreak:UpdateScore", this.updateScoreCallback);
    if (import.meta.env.DEV) {   // originally process.env.NODE_ENV !== "production"
      // this.setLayout();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("Killstreak:UpdateScore", this.updateScoreCallback);
  }

  setCurrentStep(score: number) {
    if (!this.props.layout || this.props.layout.length === 0) {
      return { step: 0, perc: 0 };
    }
    let vals: number[] = [0];
    this.props.layout.forEach((el: any) => vals.push(el[2]));
    
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] <= score && score < vals[i + 1]) {
        return { step: i, perc: this.setCurrentStepPercentage(i, score - vals[i], vals) };
      }
      if (i === vals.length - 1) {
        if (score >= vals[i]) {
          return { step: i, perc: 100 };
        }
        return { step: 0, perc: this.setCurrentStepPercentage(0, score - vals[i], vals) };
      }
    }
    return { step: 0, perc: 0 };
  }

  setCurrentStepPercentage(curStep: number, score: number, vals: number[]) {
    if (curStep > vals.length - 1) return 100;
    const denominator = curStep > 0 ? vals[curStep + 1] - vals[curStep] : vals[curStep + 1];
    return denominator > 0 ? parseInt(String((score * 100) / denominator)) : 0;
  }

  createDescription(el: any, index: number) {
    if (this.props.selectedStep - 1 === index) return el[5];
    if (el[4] === undefined) return "";
    const erg = el[2] - this.state.score;
    return erg <= 0 ? el[6] : el[4].replace("%NR", erg);
  }

  getIconEl(index: number, step: number) {
    const isActive = this.props.selectedStep - 1 === index;
    const isFinished = step > index;
    
    return (
      <div style={{
        width: "38px",       // Change this to adjust the size of the F5/F6 circle (in pixels). Increase to make circle bigger, decrease to make it smaller
        height: "38px",      // Change this to adjust the size of the F5/F6 circle (in pixels). Must be the same as width for a perfect circle
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",    // Change this to adjust the font size inside the F5/F6 circle (in pixels). Increase to make text larger, decrease to make it smaller
        fontWeight: "bold",
        color: "white",
        backgroundColor: isActive ? "#a30000" : isFinished ? "#2e8b57" : "#555", // Change this to adjust the circle background color
        border: isActive ? "2px solid #ff4444" : "2px solid white", // Change this to adjust the circle border thickness and color
      }}>
        {"F" + (5 + index)}
      </div>
    );
  }

  render() {
    const { step } = this.setCurrentStep(this.state.score);
    const layout = this.props.layout || [];

    return (
      /* 📍 Overall left-right movement control: increase paddingLeft to move entire UI right, decrease to move left. Default is 12px */
      <div style={{ ...this.props.style, paddingLeft: "12px" }}>
        
        {/* Point 3: Score display area (the number above the F5 circle) */}
        <div style={{ 
          fontSize: "20px",        // Change this to adjust the font size of the score (in pixels). Increase to enlarge, decrease to shrink
          fontWeight: "bold", 
          paddingLeft: "5px",      // Change this to adjust the horizontal position of the score (in pixels). Increase moves right, decrease moves left
          marginBottom: "15px",    // Change this to adjust the vertical position of the score (in pixels). Increase moves down (farther from F5 circle), decrease moves up (closer to F5 circle)
          opacity: 0.9
        }}>
          {parseInt(String(this.state.score))}
        </div>

        {/* Progress step list */}
        {layout.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", width: "auto" }}>
            {layout.map((el: any, index: number) => {
              const isFinished = step > index;
              
              return (
                <React.Fragment key={index}>
                  {/* Point 2: F5 circle row container */}
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    marginBottom: "0px", // Change this to adjust vertical spacing between F5 circles (in pixels). Decrease to narrow gap, increase to widen
                    paddingLeft: "0px"   // Change this to adjust the horizontal position of the entire F5 circle row (in pixels). Increase moves row right, decrease moves left
                  }}>
                    {/* F5 icon circle */}
                    {this.getIconEl(index, step)}
                    
                    {/* Text content */}
                    <div style={{ 
                      marginLeft: "10px", // 📍 Change this to adjust horizontal spacing between F5 circle and the text on its right (in pixels). Increase moves text away from circle, decrease moves it closer
                      lineHeight: "1.3",
                      display: "flex",
                      flexDirection: "column"
                    }}>
                      <div style={{ fontSize: "16px", fontWeight: "bold" }}>{el[3]}</div>
                      <div style={{ fontSize: "13px", opacity: 0.85 }}>
                        {this.createDescription(el, index)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector line (not displayed for the last step) */}
                  {index < layout.length - 1 && (
                    <div style={{
                      width: "2px",         // Change this to adjust the thickness of the vertical line (in pixels)
                      height: "16px",       // Change this to adjust the height of the vertical line (in pixels)
                      backgroundColor: isFinished ? "rgba(5, 57, 97, 1)" : "rgba(255,255,255,0.3)", // Line color
                      marginLeft: "18px",   // Change this to adjust the horizontal position of the vertical line (in pixels). Increase moves line right, decrease moves left. Ensure it aligns with the center of the F5 circle
                      marginBottom: "0px",  // Change this to adjust the spacing below the vertical line (in pixels)
                    }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div style={{ 
            fontSize: "16px", 
            padding: "8px 0", 
            paddingLeft: "12px", 
            opacity: 0.9,
            lineHeight: "0.8"  /* Change this to adjust the spacing between two lines of text. Increase to widen line height, decrease to make it more compact */
            }}>
            Select your killstreak rewards after respawn<br/> {/* line break here */}
          </div>
        )}

      {this.props.showButton ? (
        <button
          onClick={this.props.showUi}
          style={{
            /* Control the "thickness" of the box: decrease numbers to reduce inner padding, making the box immediately smaller */
            padding: "8px 16px",  /* Order: default is 8px 16px */
      
            /* Control the width of the box: decrease to narrow horizontally. auto means it stretches with text */
            width: "250px",       
      
            /* Control the font size inside: decrease to make text smaller, the box will also shrink */
            fontSize: "14px",    /* Originally 16px. 12px would be more compact */
      
            /* Control the overall position: increase moves down/right, decrease moves up/left */
            marginTop: "8px",    /* Spacing from the element above. Decrease to move it up */
            marginLeft: "8px",   /* Spacing from the left element. Decrease to move it left */
      
            /* Background and border (do not affect size, only appearance) */
            background: "rgba(41, 69, 95, 0.75)",
            color: "white",
            border: "1px solid white",
            cursor: "pointer",
            fontFamily: "bf3Better",
            opacity: 0.9
          }}
        >
        Select killstreaks
        </button>
      ) : null}

        {/* Timer list */}
        <KsTimerList timers={this.props.timers} onCompleted={this.props.onCompleted} />
      </div>
    );
  }
}

export default Progress;