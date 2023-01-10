function generateGlossary(element) {}

/**
 * Generate a glossary for all replacements present in element.
 * @param {HTMLElement} element
 */
function generateGlossaryList(element) {
  // Sort replacements and filter by the new (replaced) version of a word, e.g.
  // jiějie
  const map = new Map(
      Array.from(element.querySelectorAll('.tone-mark'))
          .sort(
              (a, b) =>
                  getReplacementText(a).localeCompare(getReplacementText(b)))
          .map(
              (replacement) => [getReplacementText(replacement), replacement]));
  const glossaryList = element.ownerDocument.createElement('ul');
  glossaryList.classList.add('glossary-list');
  map.forEach(
      (_key, replacement) =>
          glossaryList.appendChild(generateGlossaryElement(replacement)))
}

/**
 * Get the replacement text associated with a particular replacement element
 * @param {HTMLElement} element
 * @returns {string}
 */
function getReplacementText(element) {
  if ('new' in element.dataset) {
    return element.dataset.new;
  } else {
    return element.querySelector('.replacement').dataset.new;
  }
}

/**
 * Copy the element and wrap it in an 'li'
 * @param {HTMLElement} origElement
 * @returns {HTMLElement}
 */
function generateGlossaryElement(origElement) {
  const listItem = origElement.ownerDocument.createElement('li');
  listItem.appendChild(origElement.cloneNode())
  return listItem;
}