/**
 * Generate an expandable/collapsable glossary for a work page.
 * @param {HTMLElement[]} replacements
 * @param {HTMLElement} parent
 */
function generateGlossary(replacements, parent) {
  if (replacements.length === 0) {
    console.log(
        'No replacements to make a glossary for--aborting glossary generation.');
    return;
  }

  // Document positioning. Note: this selector only works on a work page.
  const metaDescriptionList = parent.querySelector('dl.work.meta.group');
  if (metaDescriptionList === null) {
    console.log(
        'Unable to determine where to insert glossary--aborting glossary generation.');
    return;
  }

  const glossaryTitle = document.createElement('dt');
  glossaryTitle.textContent = 'Glossary:';
  glossaryTitle.classList.add('tone-glossary');
  metaDescriptionList.appendChild(glossaryTitle);
  const glossaryContents = document.createElement('dd');
  glossaryContents.classList.add('tone-glossary');
  metaDescriptionList.appendChild(glossaryContents);

  // Glossary setup.
  const glossaryList = generateGlossaryList(replacements)
  const showHideButton = document.createElement('button');
  showHideButton.textContent = 'Show tone glossary';
  showHideButton.addEventListener('click', () => {
    if (glossaryList.classList.contains('hide-glossary')) {
      glossaryList.classList.remove('hide-glossary');
      showHideButton.textContent = 'Hide tone glossary';
    } else {
      glossaryList.classList.add('hide-glossary');
      showHideButton.textContent = 'Show tone glossary';
    }
  });
  glossaryContents.appendChild(showHideButton);
  glossaryContents.appendChild(glossaryList);
}

/**
 * Generate a glossary list for a list of replacements, sorting and removing
 * duplicates.
 * @param {HTMLElement[]} replacements
 * @returns {HTMLElement}
 */
function generateGlossaryList(replacements) {
  // Sort replacements and filter by the new (replaced) version of a word, e.g.
  // jiějie
  const map = new Map(
      replacements
          .sort(
              (a, b) =>
                  getReplacementText(a).localeCompare(getReplacementText(b)))
          .map(
              (replacement) => [getReplacementText(replacement), replacement]));
  const glossaryList = document.createElement('ul');
  glossaryList.classList.add('glossary-list');
  glossaryList.classList.add('hide-glossary')
  map.forEach(
      (replacement, _key) =>
          glossaryList.appendChild(generateGlossaryElement(replacement)));
  return glossaryList;
}

/**
 * Get the replacement text associated with a particular replacement element
 * @param {HTMLElement} element
 * @returns {string}
 */
function getReplacementText(element) {
  return element.dataset.new;
}

/**
 * Copy the element and wrap it in an 'li'
 * @param {HTMLElement} origElement
 * @returns {HTMLElement}
 */
function generateGlossaryElement(origElement) {
  const listItem = origElement.ownerDocument.createElement('li');
  listItem.classList.add('glossary-list-item');
  listItem.appendChild(origElement.cloneNode(true));
  return listItem;
}