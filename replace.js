/**
 * Replaces special html characters.
 * @param {string} str
 * @returns {string}
 */
function escaped(unsafe) {
  return (unsafe + '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll('\'', '&#039;');
}

/**
 * Returns a regex to match a sequence of words, allowing an optional
 * dash (-) or space ( ) between each word. The beginning and end of the
 * matching sequence must be at a word boundary.
 *
 * The regex will also match an incomplete html tag preceding the match,
 * which you can check for to avoid replacing within an html tag's
 * attributes.
 *
 * @param {string[]} words
 * @return {RegExp}
 */
function wordsMatchRegex(words) {
  return new RegExp(
      '(<[a-z]+ [^>]*)?\\b(' +
          words
              .map(
                  word =>
                      escaped(word).replace(/([.?*+^$[\]\\(){}|])/g, '\\$1'))
              .join('( |-)?') +
          ')\\b',
      'gi');
}

/**
 * Wraps the replacement text in a span and returns the span as a string.
 *
 * The span will have class 'replacement' and attributes 'data-orig' with
 * the original match and 'data-new' with the replacement text.
 * @param {string} replacement The new text
 * @param {string} match The original text which is being replaced
 * @return {string}
 */
function replacementHtml(replacement, match, audio_url) {
  return '<span class="replacement" data-orig="' + match + '" data-new="' +
      escaped(replacement) + '" data-url="' + audio_url + '">' +
      escaped(replacement) + '</span>';
}

/**
 * Replaces all occurrences that match 'from' in main's innerHTML with a
 * span whose text is 'to'.
 *
 * @param {{innerHTML: string}} main
 * @param {RegExp} from
 * @param {string} to
 */
function replaceTextOnPage(main, from, to, audio_url) {
  main.innerHTML = main.innerHTML.replace(from, (match) => {
    if (match.startsWith('<')) {
      // Skip matches occurring inside incomplete html tags. This avoids
      // e.g. replacing within the href for a work tag.
      return match;
    }
    return replacementHtml(to, match, audio_url);
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
 * @param {{words:string[],replacement:string, audio_url:string}[]} replacements
 * @param {HTMLElement} element
 */
function recursiveReplace(replacements, element) {
  // Track text nodes that will be replaced with a mix of text nodes and
  // elements.
  const textReplacements = [];
  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      const newInnerHtml = replaceText(replacements, child.textContent)
      if (newInnerHtml !== child.textContent) {
        // If we made the replacement here, we'd alter the number of
        // children and potentially reprocess some of them, so we put
        // that off until the end.
        textReplacements.push({child, newInnerHtml});
      }
    } else {
      recursiveReplace(replacements, child);
    }
  }
  // Make the replacements.
  for (const textReplacement of textReplacements) {
    replaceTextNode(textReplacement.child, textReplacement.newInnerHtml);
  }
}

/**
 * Replace text (which is not html) according to the rules in the replacements
 * list, resulting in text with html markup.
 *
 * @param {{words:string[],replacement:string, audio_url:string}[]} replacements
 * @param {string} text
 * @returns {string} replacement text, which may have html formatting
 */
function replaceText(replacements, text) {
  // pretend text is part of an element
  const simplifiedElement = {innerHTML: text};
  replacements.forEach(rule => {
    replaceTextOnPage(
        simplifiedElement, wordsMatchRegex(rule.words), rule.replacement,
        rule.audio_url);
  });
  return simplifiedElement.innerHTML;
}

/**
 * Replaces all matches in element.innerHTML with their replacements, as
 * encoded in the rules string.
 *
 * @param {{words:string[],replacement:string, audio_url:string}[]} replacements
 * @param {HTMLElement} element
 */
function replaceAll(replacements, element) {
  recursiveReplace(replacements, element);
}