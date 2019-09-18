import * as React from "react";
import { render } from "react-dom";
import Example from "./Example";

class App extends React.Component {
  public render(): JSX.Element {
    return (
      <div><Example /></div>
    );
  }
}

render(<App />, document.getElementById("app"));
