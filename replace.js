/**
 * Replaces all occurrences that match 'from' in main's innerHTML with a
 * span whose text is 'to'.
 *
 * @param {{innerHTML: string}} main
 * @param {Rule} rule
 */
function replaceTextOnPage(main, rule) {
  main.innerHTML = main.innerHTML.replace(rule.regex, (match) => {
    if (match.startsWith('<')) {
      // Skip matches occurring inside incomplete html tags. This avoids
      // e.g. replacing within the href for a work tag.
      return match;
    }
    return rule.toHtmlString(match);
  });
}

/**
 * Alters the parent of textNode to replace textNode with whatever html is in
 * newInnerHtml. Siblings of textNode remain unchanged.
 *
 * @param {Text} textNode
 * @param {string} newInnerHtml
 */
function replaceTextNode(textNode, newInnerHtml) {
  textNode.parentNode.replaceChild(
      textNode.ownerDocument.createRange().createContextualFragment(
          newInnerHtml),
      textNode);
}

/**
 * Replaces all matches in element.innerHTML with their replacements, as
 * encoded in the rules string.
 *
 * @param {Rule[]} replacements
 * @param {HTMLElement} element
 */
function recursiveReplace(replacements, element) {
  // Snapshot the children to iterate over them without having to worry about
  // whether the list changes as we go along.
  const currentChildren = Array.from(element.childNodes);
  for (const child of currentChildren) {
    if (child.nodeType === Node.TEXT_NODE) {
      const newInnerHtml = replaceText(replacements, child.textContent)
      if (newInnerHtml !== child.textContent) {
        replaceTextNode(child, newInnerHtml);
      }
    } else {
      recursiveReplace(replacements, child);
    }
  }
}

/**
 * Replace text (which is not html) according to the rules in the replacements
 * list, resulting in text with html markup.
 *
 * @param {Rule[]} replacements
 * @param {string} text
 * @returns {string} replacement text, which may have html formatting
 */
function replaceText(replacements, text) {
  // pretend text is part of an element
  const simplifiedElement = {innerHTML: text};
  replacements.forEach(rule => {
    replaceTextOnPage(simplifiedElement, rule);
  });
  return simplifiedElement.innerHTML;
}

/**
 * Replaces all matches in element.innerHTML with their replacements, as
 * encoded in the rules string.
 *
 * @param {Rule[]} replacements
 * @param {HTMLElement} element
 */
function replaceAll(replacements, element) {
  recursiveReplace(replacements, element);
}
