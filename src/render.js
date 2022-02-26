import createDom from './createDom';

export default function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

let nextUnitOfWork = null;

function workLoop(deadline) {
  let noTime = false;

  while (nextUnitOfWork && !noTime) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    noTime = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  const { children } = fiber.props;

  let index = 0;
  let prevSibling = null;

  while (index < children.length) {
    const { type, props, parent } = children[index];

    const newFiber = {
      type,
      props,
      parent,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
