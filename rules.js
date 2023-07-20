class Rule {
  /**
   * @param {string[]} words
   * @param {string} replacement
   * @param {string?} audio_url
   * @param {string} source
   */
  constructor(words, replacement, audio_url, source) {
    this.words = words;
    this.regex = wordsMatchRegex(words);
    this.replacement = replacement;
    this.audio_url = audio_url ? audio_url : 'None';
    this.source = source;
  }

  /**
   * Returns the url, or 'None' if there is none.
   * @returns {string}
   */
  prettyAudioUrl() {
    return this.audio_url ? this.audio_url : 'None';
    ;
  }

  /**
   * @returns {boolean}
   */
  hasAudioUrl() {
    return this.audio_url && this.audio_url !== 'None';
  }

  /**
   * Wraps the replacement text in a span and returns the span as a string.
   *
   * The span will have class 'replacement' and attributes 'data-orig' with
   * the original match and 'data-new' with the replacement text.
   *
   * @param {string} match The original text which is being replaced
   * @return {string}
   */
  toHtmlString(match) {
    return `<span class="replacement" lang="zh-Latn-pinyin"
              data-orig="${match}"
              data-new="${escaped(this.replacement)}"
              data-url="${this.prettyAudioUrl()}"
              data-fandom="${this.source}">
              ${escaped(this.replacement)}
            </span>`;
  }

  toString() {
    return `[${this.words.join(' ')}|${this.replacement} (${this.source})]`;
  }

  /**
   * Checks whether applying this rule would prevent the other rule from being
   * applied.
   *
   * For example, if this rule is "jiang|Jiāng" and it's applied first, and the
   * other rule is "jiang hu|Jiānghú", then (broadly speaking) by the time we
   * get to the check for "jiang hu" we'll see "Jiāng hu" and not realize we
   * need to replace the hu.
   *
   * @param {Rule} otherRule
   */
  conflictsWith(otherRule) {
    // It turns out RegExp preserves state when it's a global regex, so let's
    // remove that state before and after using the regex.
    this.regex.lastIndex = 0;
    // To extend the jiang/jianghu metaphor, test whether the regex for "jiang"
    // would find something to replace in "jiang hu"
    let result = this.regex.test(otherRule.words.join(' '));
    this.regex.lastIndex = 0;
    return result;
  }
}

/**
 * Parses a replacements string into an array of Rules.
 *
 * @param {string} replacements
 * @param {string} source E.g. 'mdzs' for rules coming from mdzs.txt
 * @returns {Rule[]}
 */
function parseRules(replacements, source) {
  return replacements
      .split('\n')
      // Trim comments (anything after #) and whitespace.
      .map(line => line.split('#')[0].trim())
      // Remove empty lines.
      .filter(line => line.length > 0)
      // Parse rules
      .reduce((rules, line) => {
        const match = line.split('|');

        // Check replacement validity.
        if (match.length < 2 || match[1].trim() === '') {
          console.log(
              `Invalid replacement rule--no replacement specified:\n${line}`);
          return rules;
        }

        rules.push(new Rule(
            /* words = */ match[0].split(' ').filter(match => match.length > 0),
            /* replacement = */ match[1].trim(),
            /* audio_url = */ match.length >= 3 ? match[2].trim() : 'None',
            /* source = */ source));
        return rules;
      }, []);
}

/**
 * Makes a copy of the rules, sorted such that rules which would conflict with
 * other rules are moved to the end of the list, and the second of any pair of
 * mutually conflicting rules gets discarded.
 *
 * @param {Rule[]} rules
 * @param {boolean} recheck Whether we should recursively recheck conflicting
 *     rules for conflicts even if no good or duplicate rules were found on this
 *     iteration. Defaults to true.
 * @returns {Rule[]}
 */
function sortedRules(rules, recheck = true) {
  const goodRules = [];
  let conflictingRules = [];
  let numDiscarded = 0;
  const debug = false;

  for (let i = 0; i < rules.length; i++) {
    const currentRule = rules[i];
    // Check for duplicates between currentRule and the set of conflicting
    // rules. Discarding duplicate rules needs to take precedence over marking a
    // rule as conflicting, so we perform this check before anything else.
    //
    // The rule that's already been placed in the set of conflictingRules must
    // have come from a previous index since it's already been processed, so we
    // discard currentRule.
    const duplicateRule = conflictingRules.find(
        testRule =>
            (currentRule.conflictsWith(testRule) &&
             testRule.conflictsWith(currentRule)));
    if (duplicateRule !== undefined) {
      numDiscarded++;
      if (debug) {
        // Place the currentRule second in this log line so they're numbered in
        // accordance with their position in the original list. Hopefully that
        // makes debugging less confusing.
        console.log(`Found duplicates: ${duplicateRule} and ${i}: ${
            currentRule}, discarding ${i}.`);
      }
      if (currentRule.replacement === duplicateRule.replacement &&
          !duplicateRule.hasAudioUrl()) {
        duplicateRule.audio_url = currentRule.audio_url;
      }
      // Discard currentRule without adding it to any list
      continue;
    }

    // Check for conflicts later in the unprocessed list
    let foundConflict = false;
    for (let j = i + 1; j < rules.length; j++) {
      if (currentRule.conflictsWith(rules[j])) {
        foundConflict = true;
        if (debug) {
          console.log(`Conflict between ${i}: ${currentRule} and ${j}: ${
              rules[j]}; moving ${i} to end`);
        }
        conflictingRules.push(currentRule);
        break;
      }
    }
    if (foundConflict) {
      continue;
    }

    // Check for conflicts with other rules that have already been marked
    // conflicting.
    const conflictingRule =
        conflictingRules.find(testRule => currentRule.conflictsWith(testRule));
    if (conflictingRule !== undefined) {
      if (debug) {
        console.log(`Conflict between ${i}: ${currentRule} and other: ${
            conflictingRule}; moving ${i} to end`);
      }
      conflictingRules.push(currentRule);
      continue;
    }

    // No conflict or duplicate discovered!
    goodRules.push(currentRule);
  }

  if (conflictingRules.length > 0) {
    console.log(`While sorting tone replacement rules, found ${
        conflictingRules
            .length} conflicting rules (moved to end) and discarded ${
        numDiscarded} possibly duplicate rules:`);
    console.log(conflictingRules.map(rule => rule.toString()));
    if (conflictingRules.length < rules.length) {
      // If we made progress, don't worry about infinite recursion.
      conflictingRules = sortedRules(conflictingRules, true);
    } else if (recheck) {
      // If we didn't make progress, try one last time.
      conflictingRules = sortedRules(conflictingRules, false);
    } else {
      console.log(`Aborting with ${conflictingRules.length} conflicts left;
              unable to reduce further`);
      console.log(conflictingRules.map(rule => rule.toString()));
    }
  }

  return [...goodRules, ...conflictingRules];
}


/**
 * Replaces special html characters.
 * @param {string} unsafe
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
 * Returns a regex to match a sequence of words, allowing an
 * optional dash (-) or space ( ) between each word. The beginning
 * and end of the matching sequence must be at a word boundary.
 *
 * The regex will also match an incomplete html tag preceding the
 * match, which you can check for to avoid replacing within an html
 * tag's attributes.
 *
 * @param {string[]} words
 * @return {RegExp}
 */
function wordsMatchRegex(words) {
  // Use negative look-behind and look-ahead to make sure the character(s)
  // around a match aren't letters, whether or not they have accent marks.
  return new RegExp(
      // optionally match an incomplete html tag
      '(<[a-z]+ [^>]*)?' +
          // Check for word boundary to make sure we're not e.g. replacing lan
          // in the word plant or the second jie in jiějie
          '(?<![a-zA-ZÀ-öø-ɏ])' +
          '(' +
          words
              .map(
                  word =>
                      escaped(word).replace(/([.?*+^$[\]\\(){}|])/g, '\\$1'))
              .join('( |-|\')?') +
          ')' +
          // Check word boundary
          '(?![a-zA-ZÀ-öø-ɏ])',
      'gi');
}