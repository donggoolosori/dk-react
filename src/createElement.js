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

export default createElement;
