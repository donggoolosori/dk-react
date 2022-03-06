import DkReact from '.';

/** @jsx DkReact.createElement */
function App() {
  return <Counter />;
}

function Counter() {
  const [count, setCount] = DkReact.useState(0);
  const onClick = () => {
    setCount((state) => state + 1);
    console.log('test');
  };

  return (
    <div>
      <h1>count : {count}</h1>
      <button onClick={onClick}>+</button>
    </div>
  );
}

const container = document.getElementById('root');
DkReact.render(<App />, container);
