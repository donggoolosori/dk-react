import DkReact from '.';

/** @jsx DkReact.createElement */
const element = (
  <div id="app">
    <form>
      <input type="text" />
      <button type="submit">추가</button>
    </form>
  </div>
);

const container = document.getElementById('root');
DkReact.render(element, container);
