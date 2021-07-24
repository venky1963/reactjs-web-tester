import React from 'react';
import 'assets/scss/App.scss';
import reactLogo from 'assets/img/react_logo.svg';
import RazorPayButton from "./RazorPayButton";

class WelcomePage extends React.Component {
  render() {
    return (
      <div>
        <RazorPayButton amount={1500} bidId={18266} loanId={18264} purpose={"Fee for processing bid 18266"} />
        <h1>Hello World!</h1>
        <p>Foo good to the bar</p>
        <img src={reactLogo} height="480" />
      </div>
    );
  }
}

export default WelcomePage;
