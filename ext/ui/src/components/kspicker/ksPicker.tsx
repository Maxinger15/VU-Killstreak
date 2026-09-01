import React from "react";

export default class KsPicker extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      options: this.convertLayoutToCards(this.props.killstreaks),
      selected: this.props.selectedKillstreaks,
      maxKillstreaks: 4,
    };
    this.toggleItem = this.toggleItem.bind(this);
  }

  // Check if a skill is already selected
  checkIfSeleted(element: any) {
    let found = false;
    this.props.selectedKillstreaks.forEach((el: any) => {
      if (JSON.stringify(el.original) === JSON.stringify(element)) {
        found = true;
      }
    });
    return found;
  }

  // Convert data from backend into a format displayable by cards
  convertLayoutToCards(values: any) {
    let newList: any[] = [];
    values.forEach((element: any) => {
      newList.push({
        title: element[3],
        description: "Score: " + element[2],
        selected: this.checkIfSeleted(element),
        original: element,
      });
    });
    return newList;
  }

  // Sort by required score ascending
  compare(a: any, b: any) {
    if (a.original[2] < b.original[2]) return -1;
    if (a.original[2] > b.original[2]) return 1;
    return 0;
  }

  // Toggle logic when button is clicked (select/deselect)
  toggleItem(itm: any) {
    if (this.props.selectedKillstreaks.length >= this.state.maxKillstreaks) {
      let newSelected: any[] = [];
      this.props.selectedKillstreaks.forEach((element: any) => {
        if (itm.title !== element.title) {
          newSelected.push(element);
        } else {
          itm.selected = false;
        }
      });
      if (newSelected.length !== this.props.selectedKillstreaks.length) {
        newSelected.sort(this.compare);
        this.setState({ selected: newSelected });
        this.props.onChange(newSelected);
        return;
      }
    }
    if (this.props.selectedKillstreaks.length >= this.state.maxKillstreaks) return;

    let newSelected: any[] = [];
    this.props.selectedKillstreaks.forEach((element: any) => {
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
    this.setState({ selected: newSelected });
    this.props.onChange(newSelected);
  }

  // Pure CSS X icon (no font dependency, 100% compatible)
  renderCloseIcon() {
    return (
      <div style={{ position: "relative", width: "14px", height: "14px" }}>
        <div style={{ position: "absolute", width: "2px", height: "14px", backgroundColor: "white", transform: "rotate(45deg)" }} />
        <div style={{ position: "absolute", width: "2px", height: "14px", backgroundColor: "white", transform: "rotate(-45deg)" }} />
      </div>
    );
  }

  renderCheckIcon() {
    return (
      <div style={{
        position: "relative",
        width: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* Green circle background: diameter 18px, leaving 1px margin around */}
        <div style={{
          position: "absolute",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          border: "2px solid #3bc406",
          backgroundColor: "rgba(59, 196, 6, 0.15)",
          boxSizing: "border-box",
          left: "1px",
          top: "1px"
        }} />

        {/* Standard checkmark: using border-right + border-bottom rotated 45deg, correct orientation, never skewed */}
        <div style={{
          position: "absolute",
          width: "6px",          // horizontal projection width
          height: "10px",        // vertical projection height
          borderRight: "2px solid #3bc406",
          borderBottom: "2px solid #3bc406",
          transform: "rotate(45deg)",
          // Center positioning (align the center of the checkmark with the container center)
          left: "50%",
          top: "50%",
          marginLeft: "-3px",    // half of width
          marginTop: "-5px"      // half of height
        }} />
      </div>
    );
  }

  renderPlusIcon() {
    return (
      <div style={{
        position: "relative",
        width: "20px",
        height: "20px"
      }}>
        {/* Horizontal line */}
        <div style={{
          position: "absolute",
          width: "12px",
          height: "2px",
          backgroundColor: "white",
          top: "9px",
          left: "4px"
        }} />
        {/* Vertical line */}
        <div style={{
          position: "absolute",
          width: "2px",
          height: "12px",
          backgroundColor: "white",
          left: "9px",
          top: "4px"
        }} />
      </div>
    );
  } 
  
  render() {
    return (
      <div className="ks-wrapper">
        {/* Header: title + counter + close button */}
        <div className="ks-header">
          <span>Select your killstreak rewards</span>
          <span>{this.props.selectedKillstreaks.length}/{this.state.maxKillstreaks}</span>
          <button className="ks-close-btn" onClick={this.props.onCloseButton}>
            {this.renderCloseIcon()}
          </button>
        </div>

        {/* Area with 4 skill cards arranged horizontally */}
        <div className="ks-grid">
          {this.state.options.map((itm: any, i: number) => (
            <div
              key={i}
              className={`ks-card ${itm.selected ? "ks-card-selected" : ""}`}
            >
              <div className="ks-card-title">{itm.title}</div>
              <div className="ks-card-desc">{itm.description}</div>
              <button
                className={`ks-btn ${itm.selected ? "ks-btn-selected" : ""}`}
                onClick={() => this.toggleItem(itm)}
              >
                {itm.selected ? this.renderCheckIcon() : this.renderPlusIcon()}
              </button>
            </div>
          ))}
        </div>

        {/* Footer developer credit */}
        <div className="ks-footer">Developed by Maxinger15</div>
      </div>
    );
  }
}