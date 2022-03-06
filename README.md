# About The Project
react의 일부 기능들을 vanila js로 구현한 프로젝트입니다.

### createElement
jsx를 JavaScript 객체로 변환하는 함수입니다.
```js
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
```
jsx가 트랜스파일링 될 때 React.createElement가 아닌 DkReact.createElement를 사용하도록 합니다.
```js
/** @jsx DkReact.createElement */
const element = (
  <div id="app">
    <form>
      <input type="text" />
      <button type="submit">추가</button>
    </form>
  </div>
);
```
### render
렌더링 작업은 requestIdleCallback으로 Idle한 시간에만 수행됩니다.
workLoop에서 requestIdleCallback을 재귀적으로 호출합니다.
```js
function workLoop(deadline) {
  let noTime = false;

  while (nextUnitOfWork && !noTime) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    noTime = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}
```

render 함수에서 nextUnitOfWork 값을 할당합니다.
그러면 workLoop에서 performUnitOfWork 함수가 호출되며 렌더링이 작업이 진행됩니다.
```js
export default function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };

  deletions = [];
  nextUnitOfWork = wipRoot;
}
```
### performUnitOfWork
performUnitOfWork가 실제 렌더링 작업을 수행하는 함수입니다. 
자식 element 들의 재조정을 위한 reconcileChildren 함수를 호출하고,
다음 작업을 return 합니다.
여기서 fiber는 element 하나를 나타냄과 동시에 하나의 작업 단위를 의미합니다.
fiber들은 트리 형태로 서로 연결돼있습니다.
```js
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;

  reconcileChildren(fiber, elements);

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
```

### reconcileChildren
재조정을 수행해주는 함수입니다.
각 fiber들은 alternate라는 프로퍼티를 갖습니다.
alternate는 최근에 렌더링이 완료된 이전 fiber를 의미합니다. 
현재 fiber와 이전 fiber를 비교하고, fiber 리스트를 갱신하여 재조정을 수행합니다.

```js
function reconcileChildren(wipFiber, elements) {
  let prevSibling = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let index = 0;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];

    let newFiber = null;

    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }

    if (oldFiber && !sameType) {
      (oldFiber.effectTag = 'DELETION'), deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
```
