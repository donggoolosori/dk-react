const state = [
  { id: 1, completed: false, content: 'todo list item 1' },
  { id: 2, completed: true, content: 'todo list item 2' },
];

const vm = (
  <div id="app">
    <ul>
      {state.map(({ completed, content }) => {
        <li class={completed ? 'completed' : null}>
          <input type="checkbox" class="toggle" checked={completed} />
          {content}
          <button class="remove">삭제</button>
        </li>;
      })}
    </ul>
    <form>
      <input type="text" />
      <button type="submit">추가</button>
    </form>
  </div>
);

const $root = document.body.querySelector('#root');

$root.innerHTML = `
  <pre>${JSON.stringify(vm, null, 2)}</pre>
`;
