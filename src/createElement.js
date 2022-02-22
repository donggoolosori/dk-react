import createTextElement from './createTextElement';

export default function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
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
