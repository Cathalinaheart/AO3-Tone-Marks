/**
 * Checks the list of work tags to see if they mention this fandom, and if yes,
 * fetches the fandom's rules
 *
 * @param {string} fandomNames alternative fandom names that might be present in
 *     work tags
 * @param {string} fandomId id for fetching the rules
 * @param {Element[]} fandomTags the work's fandom tags
 * @returns {Promise<Rule[]>} the fandom rules, if applicable
 */
async function fetchRelevantFandomRules(fandomNames, fandomId, fandomTags) {
  const fandomRegex = new RegExp(fandomNames, 'i');
  for (let i = 0; i < fandomTags.length; i++) {
    if (fandomTags[i].innerHTML.match(fandomRegex) !== null) {
      return getReplacements(fandomId).then(
          rulesString => parseRules(rulesString, fandomId));
    }
  }
  return [];
}

/**
 * Get an array of fandom tags associated with a work or blurb element.
 * @param {HTMLElement} element
 * @returns {HTMLElement[]}
 */
function getFandomTags(element) {
  return Array.from(element.querySelectorAll('.fandoms .tag,.fandom .tag'));
}

/**
 * Gets the replacement rules for an element, based on its fandom tags.
 *
 * @param {HTMLElement[]} fandomTags
 * @returns {Promise<Rule[]>} A list of replacement rules (see rules.js)
 */
async function getReplacementRules(fandomTags) {
  // If there's no fandoms, there can be no replacement rules.
  if (fandomTags.length === 0) {
    console.log('Didn\'t detect any fandoms--no replacements possible.')
    return [];
  }

  const rules = [
    // To add new fandom, copy commented line and update 'fandom_names' and
    // 'id':
    // fetchRelevantFandomRules('fandom_names', 'id', fandomTags),
    fetchRelevantFandomRules(
        'Word of Honor|Faraway Wanderers|Qi Ye', 'word_of_honor', fandomTags),
    fetchRelevantFandomRules('Untamed|Módào', 'mdzs', fandomTags),
    fetchRelevantFandomRules('Guardian', 'guardian', fandomTags),
    fetchRelevantFandomRules('Nirvana in Fire', 'nirvana_in_fire', fandomTags),
    fetchRelevantFandomRules(
        'King\'s Avatar|Quánzhí Gāoshǒu', 'kings_avatar', fandomTags),
    fetchRelevantFandomRules(
        'TGCF|Tiān Guān Cì Fú|Heaven Official\'s Blessing', 'tgcf', fandomTags),
    fetchRelevantFandomRules(
        'SVSSS|Scum Villain|Scumbag System', 'svsss', fandomTags),
    fetchRelevantFandomRules(
        'JWQS|Clear and Muddy Loss of Love|Jing Wei Qing Shang', 'jwqs',
        fandomTags),
    fetchRelevantFandomRules(
        '2ha|erha|Husky and His White Cat Shizun', 'erha', fandomTags),

    // Add non-fandom-specific rules at the end.
    fetchRelevantFandomRules('', 'generic', fandomTags)
  ];

  return Promise.all(rules).then(rules => sortedRules(rules.flat()));
}

/**
 * Loads the replacement string for this fandom from its <fandom>.txt file.
 * @param {Promise<string>} fandom
 */
async function getReplacements(fandom) {
  return getResourceText(fandom);
}