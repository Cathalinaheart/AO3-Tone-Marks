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
  if (audio_url === 'None') {
    return '<span class="replacement" data-orig="' + match + '" data-new="' +
        escaped(replacement) + '">' + escaped(replacement) + '</span>';
  } else {
    return '<span onclick="playAudio(\'' + audio_url +
        '\');" style="cursor: pointer;" class="replacement" data-orig="' +
        match + '" data-new="' + escaped(replacement) + '">' +
        escaped(replacement) +
        '</span><span class="audio-guide" onclick="playAudio(\'' + audio_url +
        '\');"><i class="material-icons" style="font-size:100%;cursor: pointer;-ms-transform: translateY(-40%);transform: translateY(-40%);">volume_up</i></span>';
  }
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
 * Replaces all matches in element.innerHTML with their replacements, as
 * encoded in the rules string.
 *
 * @param {{words:string[],replacement:string, audio_url:string}[]} replacements
 * @param {{innerHTML: string}} element
 */
function replaceAll(replacements, element) {
  // Avoid updating element.innerHTML until the very end.
  const simplifiedElement = {innerHTML: element.innerHTML};
  replacements.forEach(function(rule) {
    replaceTextOnPage(
        simplifiedElement, wordsMatchRegex(rule.words), rule.replacement,
        rule.audio_url);
  });
  element.innerHTML = simplifiedElement.innerHTML;
}