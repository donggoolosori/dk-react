/** @jsx h */
function h(type, props, ...children) {
  return { type, props, children: children.flat() };
}

const createElement = (node) => {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const $el = document.createElement(node.type);

  Object.entries(node.props ?? {}).forEach(([attr, value]) =>
    $el.setAttribute(attr, value)
  );

  node.children.map((child) => $el.appendChild(createElement(child)));

  return $el;
};

const state = [
  { id: 1, completed: false, content: 'todo list item 1' },
  { id: 2, completed: true, content: 'todo list item 2' },
];

const virtualDom = (
  <div id="app">
    <ul>
      {state.map(({ completed, content }) => (
        <li className={completed ? 'completed' : null}>
          <input type="checkbox" className="toggle" checked={completed} />
          {content}
          <button className="remove">삭제</button>
        </li>
      ))}
    </ul>
    <form>
      <input type="text" />
      <button type="submit">추가</button>
    </form>
  </div>
);

const realDom = createElement(virtualDom);

document.body.appendChild(realDom);
