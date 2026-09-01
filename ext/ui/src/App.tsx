import React from "react";
import "./App.css";
import Progress from "./components/progress";
import KsPicker from "./components/kspicker";

// Define state types for the App component (preserve all properties)
interface AppState {
  ksPickerVisible: boolean;
  allKillstreaks: any[];
  selectedKillstreaks: any[];
  showKsButton: boolean;
  timers: any[];
  selectedStep: number;
  notification: null | { title: string; message: string };
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      ksPickerVisible: false,
      allKillstreaks: [],
      selectedKillstreaks: [],
      showKsButton: true,
      timers: [],
      selectedStep: -10,
      notification: null
    };

    this.toggle = this.toggle.bind(this);
    this.getAllKillstreaks = this.getAllKillstreaks.bind(this);
    this.showUi = this.showUi.bind(this);
    this.hideUi = this.hideUi.bind(this);
    this.onSelectedChange = this.onSelectedChange.bind(this);
    this.showKsButton = this.showKsButton.bind(this);
    this.hideKsButton = this.hideKsButton.bind(this);
    this.clearAllTimers = this.clearAllTimers.bind(this);
    this.onTimerComplete = this.onTimerComplete.bind(this);
    this.newTimer = this.newTimer.bind(this);
    this.showNotification = this.showNotification.bind(this);
    this.selectedStep = this.selectedStep.bind(this);
  }

  clearAllTimers() {
    this.setState({ timers: [] });
  }

  onTimerComplete() {
    this.setState((prev) => {
      const hasActive = (prev.timers as any[]).some((t: any) => t.remaining === undefined || t.remaining > 0);
      return hasActive ? { timers: [...prev.timers] } : { timers: [] };
    });
  }

  getTestData() {
    return [
      ["vu-artillerystrike", 65, 150, "Grenades", "Left %NR", "Press F to use"],
      ["vu-artillerystrike", 65, 250, "Health", "Left %NR", "Press F to use"],
      ["vu-artillerystrike", 65, 350, "Ac130", "Left %NR", "Press F to use"],
      ["vu-artillerystrike", 65, 450, "Tactical Missle", "Left %NR", "Press F to use"]
    ];
  }

  toggle(e: any) {
    if (e.key === 'Escape' || e.code === 'Escape') {
      this.setState({ ksPickerVisible: false });
    }
    if (e.key === 'i' || e.key === 'I' || e.code === 'KeyI') {
      this.setState((prev) => ({ ksPickerVisible: !prev.ksPickerVisible }));
    }
  }

  getAllKillstreaks(e: any) {
    try {
      this.setState({ allKillstreaks: JSON.parse(e.detail) });
    } catch (err) {
      console.error("Parse ks error:", err);
    }
  }

  newTimer(e: any) {
    console.log("New Timer: ", e.detail)
  
    /* Fix: create a new array instead of mutating the original */
    this.setState((prevState) => ({
      timers: [
        ...prevState.timers,  /* keep old timers */
        JSON.parse(e.detail)  /* add new timer */
      ]
    }))
  
   console.log("New List", this.state.timers)
  }

  showUi() { this.setState({ ksPickerVisible: true }); }
  hideUi() { this.setState({ ksPickerVisible: false }); }
  showKsButton() { this.setState({ showKsButton: true }); }
  hideKsButton() { this.setState({ showKsButton: false }); }
  selectedStep(e: any) { this.setState({ selectedStep: parseInt(e.detail, 10) }); }

  componentDidMount() {
    if (import.meta.env.DEV) {   // originally process.env.NODE_ENV !== "production"
      this.setState({
        allKillstreaks: this.getTestData(),
        timers: [
          { duration: 50000, text: "test 1", remaining: 50000 },
          { duration: 15, text: "test 2", remaining: 15 }
        ]
      });
      document.addEventListener("keydown", this.toggle, false);
    }

    const events: [string, (e: any) => void][] = [   // add type declaration
      ["Killstreak:UI:getAllKillstreaks", this.getAllKillstreaks],
      ["Killstreak:UI:showSelectScreen", this.showUi],
      ["Killstreak:UI:hideSelectScreen", this.hideUi],
      ["Killstreak:UI:showKsButton", this.showKsButton],
      ["Killstreak:UI:hideKsButton", this.hideKsButton],
      ["Killstreak:UI:newTimer", this.newTimer],
      ["Killstreak:UI:showNotification", this.showNotification],
      ["Killstreak:UI:selectStep", this.selectedStep]
    ];
    events.forEach(([name, handler]) => document.addEventListener(name, handler as any, false));
  }

  componentWillUnmount() {
    if (import.meta.env.DEV) {   // originally process.env.NODE_ENV !== "production"
      document.removeEventListener("keydown", this.toggle, false);
    }
    document.removeEventListener("Killstreak:UI:getAllKillstreaks", this.getAllKillstreaks as any, false);
    document.removeEventListener("Killstreak:UI:showSelectScreen", this.showUi as any, false);
    document.removeEventListener("Killstreak:UI:hideSelectScreen", this.hideUi as any, false);
    document.removeEventListener("Killstreak:UI:showKsButton", this.showKsButton as any, false);
    document.removeEventListener("Killstreak:UI:hideKsButton", this.hideKsButton as any, false);
    document.removeEventListener("Killstreak:UI:newTimer", this.newTimer as any, false);
    document.removeEventListener("Killstreak:UI:showNotification", this.showNotification as any, false);
    document.removeEventListener("Killstreak:UI:selectStep", this.selectedStep as any, false);
  }

  showNotification(e: any) {
    try {
      const obj = JSON.parse(e.detail);
      this.setState({ notification: { title: obj.title, message: obj.message } });
      setTimeout(() => this.setState({ notification: null }), 5000);
    } catch (err) {
      console.error("Parse notify error:", err);
    }
  }

  onSelectedChange(newValues: any) {
    const orig = newValues.map((el: any) => el.original);
    if (import.meta.env.PROD && typeof WebUI !== 'undefined') {   // originally process.env.NODE_ENV === "production"
      WebUI.Call("DispatchEvent", "Killstreak:selectedKillstreaks", JSON.stringify(orig));
    }
    this.setState({ selectedKillstreaks: newValues });
  }

  getOriginalLayoutArray(old: any) {
    return old.map((element: any) => element.original);
  }

  render() {
    const { ksPickerVisible, selectedStep, selectedKillstreaks, showKsButton, timers, notification } = this.state;
    const layout = this.getOriginalLayoutArray(selectedKillstreaks);

    return (
      <div className="overallBackground" style={{ position: 'relative' }}>
        {/* Left progress bar area */}
        <div style={{ 
          width: '30%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          /* Change this to adjust the distance of the entire left UI from the top (in pixels). Increase to move whole UI down, decrease to move up.
             Changed from 150px to 100px to move UI upward, away from the bottom game UI */
          paddingTop: '210px',
          /* Change this to adjust the distance of the entire left UI from the left (in pixels). Increase to move right, decrease to move left */
          marginLeft: '20px'
        }}>
          <Progress
            selectedStep={selectedStep}
            layout={layout}
            showButton={showKsButton}
            showUi={this.showUi}
            style={{ 
              opacity: 0.85,
              paddingLeft: '3%', 
              color: 'white' 
            }}
            timers={timers}
            onCompleted={this.onTimerComplete}
          />
        </div>

        {/* Killstreak picker popup */}
        {ksPickerVisible && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(58, 42, 45, 0.65)', zIndex: 100
          }}>
            <div style={{
              position: 'absolute', top: '25%', left: '25%', width: '50%', height: '50%'
            }}>
              <KsPicker
                killstreaks={this.state.allKillstreaks}
                selectedKillstreaks={selectedKillstreaks}
                onChange={this.onSelectedChange}
                onCloseButton={this.hideUi}
              />
            </div>
          </div>
        )}

        {/* Custom notification layer */}
        {notification && (
          <div className="ksNotification">
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
              {notification.title}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {notification.message}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;