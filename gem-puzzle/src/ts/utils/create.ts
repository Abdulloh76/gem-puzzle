/**
 * @param {String} el
 * @param {String} classNames
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @param  {...array} dataAttr
 */

export default function create(
  el: string,
  classNames: string,
  child: any,
  parent: HTMLElement,
  ...dataAttr: any
) {
  let element: any = null;

  try {
    element = document.createElement(el);
  } catch (error) {
    throw new Error('Unable to create HTMLElement! Give a proper tag name');
  }

  if (classNames) element.classList.add(...classNames.split(' '));

  if (child && Array.isArray(child)) {
    child.forEach(
      (childElement) => childElement && element.append(childElement),
    );
  } else if (child && typeof child === 'object') {
    element.append(child);
  } else if (child && typeof child === 'string') {
    element.innerHTML = child;
  }

  if (parent) parent.append(element);

  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]:Array<string>) => {
      if (attrValue === '') element.setAttribute(attrName, '');

      if (attrName.match(/value|id|placeholder|cols|rows|autocorrect|spellcheck/)) {
        element.setAttribute(attrName, attrValue);
      } else {
        element.dataset[attrName] = attrValue;
      }
    });
  }

  return element;
}
