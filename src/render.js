import createElement from './createElement';

function render(virtualDom, container) {
  const realDom = createElement(virtualDom);

  container.appendChild(realDom);
}

export default render;
