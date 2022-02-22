function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

console.log(
  JSON.stringify(
    createElement('h1', { class: 'title' }, createElement('p', null, 'hi')),
    null,
    2
  )
);

export default createElement;
