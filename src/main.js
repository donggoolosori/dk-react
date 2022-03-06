import DkReact from '.';

/** @jsx DkReact.createElement */
function App(props) {
  return <h1>Hi! {props.name}</h1>;
}

const container = document.getElementById('root');
DkReact.render(<App name="dk" />, container);
