import React from "react";
import KsTimer from "./kstimer";
import "./kstimerlist.css";

// Define props types (preserve original attributes)
interface KsTimerListProps {
  timers: any[];
  onCompleted?: (timerKey: string) => void;
}

// Define state types
interface KsTimerListState {
  completedKeys: Set<string>;
}

export default class KsTimerList extends React.Component<KsTimerListProps, KsTimerListState> {
  constructor(props: KsTimerListProps) {
    super(props);
    /* Locally record completed timer keys to hide even if parent component does not clean up */
    this.state = {
      completedKeys: new Set()
    };
  }

  /* Wrapper onCompleted: mark completion before calling parent callback */
  handleCompleted = (timerKey: string) => {
    this.setState((prev) => {
      const newSet = new Set(prev.completedKeys);
      newSet.add(timerKey);
      return { completedKeys: newSet };
    });
    /* Still call the original onCompleted from parent */
    if (this.props.onCompleted) {
      this.props.onCompleted(timerKey);
    }
  };

  render() {
    /* Display only timers that are still counting down (remaining > 0 or undefined) */
    const activeTimers = this.props.timers.filter(
      (el: any) => (el.remaining === undefined || el.remaining > 0)
    );

    return (
      <div className="timerList">
        {activeTimers.map((el: any, index: number) => {
          /* Use a unique key containing timestamp to prevent React from reusing */
          const timerKey = `timer_${el.text}_${el.duration}_${index}`;
          
          /* If already marked as completed, do not render */
          if (this.state.completedKeys.has(timerKey)) {
            return null;
          }
          
          return (
            <KsTimer
              /* 🔑 Use unique key to prevent React from caching old circles */
              key={timerKey}
              index={index}
              obj={el}
              /* 🆕 Pass wrapped completion callback */
              onCompleted={() => this.handleCompleted(timerKey)}
            />
          );
        })}
      </div>
    );
  }
}