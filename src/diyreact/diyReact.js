const TEXT_ELEMENT = 'TEXT_ELEMENT';

function createElement(type, props, ...children) {
  props = Object.assign({}, props);
  props.children = [].concat(...children)
    .filter(child => child != null & child !== false)
    // .map(child => child instanceof Object ? child : createTextElement(child));
    .map(child => child instanceof Object ? child : child);

  return { type, props };
}

let rootInstance = null;
function render(element, parentDom) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(parentDom, prevInstance, element);
  rootInstance = nextInstance;
}

function instantiate(element) {
  const { type, props = {} } = element;
  const isDomElement = typeof type === 'string';
  const isTextElement = (typeof element === 'string') || (typeof element === 'number');
  if (isDomElement || isTextElement) {
    const dom = isTextElement ? document.createTextNode(element) : document.createElement(type);

    updateDomProperties(dom, [], element.props);
    const children = props.children || [];
    const childInstances = children.map(instantiate);
    const childDoms = childInstances.map(childInstance => childInstance.dom);
    childDoms.forEach(childDom => dom.appendChild(childDom));
    const instance = { element, dom, childInstances };
    return instance;

  } else {
    const instance = {};
    const publicInstance = createPublicInstance(element, instance);
    const childElement = publicInstance.render();
    const childInstance = instantiate(childElement);
    Object.assign(instance, { dom: childInstance.dom, element, childInstance, publicInstance });
    return instance;
  }
}
let specialKeys = ['children', 'ref'];
let eventKeys = ['onClick'];

function updateDomProperties(dom, c, props) {

  for (var k in props) {
    if (specialKeys.indexOf(k) === -1) {
      if (eventKeys.indexOf(k) > -1) {
        dom[k.toLowerCase()] = props[k];
      } else {
        dom.setAttribute(k, props[k]);
      }
    }
  }
}

function createPublicInstance(element, instance) {
  let newInstance = new element.type();
  newInstance.props = element.props;
  Object.assign(newInstance, {instance});
  return newInstance;
}

function reconcile(parentDom, instance, element) {
  if (instance === null) {
    const newInstance = instantiate(element);
    // componentWillMount
    newInstance.publicInstance
      && newInstance.publicInstance.componentWillMount
      && newInstance.publicInstance.componentWillMount();
    parentDom.appendChild(newInstance.dom);
    // componentDidMount
    newInstance.publicInstance
      && newInstance.publicInstance.componentDidMount
      && newInstance.publicInstance.componentDidMount();
    return newInstance;
  } else if (element === null) {
    // componentWillUnmount
    instance.publicInstance
      && instance.publicInstance.componentWillUnmount
      && instance.publicInstance.componentWillUnmount();
    parentDom.removeChild(instance.dom);
    return null;
  } else if (instance.element.type !== element.type) {
    const newInstance = instantiate(element);
    // componentDidMount
    newInstance.publicInstance
      && newInstance.publicInstance.componentDidMount
      && newInstance.publicInstance.componentDidMount();
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  } else if (typeof element.type === 'string') {
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    if (instance.publicInstance
      && instance.publicInstance.shouldcomponentUpdate) {
      if (!instance.publicInstance.shouldcomponentUpdate()) {
        return;
      }
    }
    // componentWillUpdate
    instance.publicInstance
      && instance.publicInstance.componentWillUpdate
      && instance.publicInstance.componentWillUpdate();
    instance.publicInstance.props = element.props;
    const newChildElement = instance.publicInstance.render();
    const oldChildInstance = instance.childInstance;
    const newChildInstance = reconcile(parentDom, oldChildInstance, newChildElement);
    // componentDidUpdate
    instance.publicInstance
      && instance.publicInstance.componentDidUpdate
      && instance.publicInstance.componentDidUpdate();
    instance.dom = newChildInstance.dom;
    instance.childInstance = newChildInstance;
    instance.element = element;
    return instance;
  }
}

function reconcileChildren(instance, element) {
  const { dom, childInstances } = instance;
  const newChildElements = element.props.children || [];
  const count = Math.max(childInstances.length, newChildElements.length);
  const newChildInstances = [];
  for (let i = 0; i < count; i++) {
    newChildInstances[i] = reconcile(dom, childInstances[i], newChildElements[i]);
  }
  return newChildInstances.filter(instance => instance !== null);
}

class Component {
  setState(newData) {
    debugger;
    this.state = { ...this.state, ...newData };
    const newJsx = this.render();
    const parentDom = this.instance.dom.parentNode;
    reconcile(parentDom, this.instance, newJsx);
  }
}
export default {
  render,
  Component,
  createElement,
}

