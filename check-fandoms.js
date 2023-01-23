/**
 * Checks whether 'fandomNames' (ignoring case) is a substring of any of the
 * fandom tags, and if so appends the list of relevant rules.
 *
 * @param {string} fandomNames
 * @param {string} fandomId
 * @param {Element[]} fandomTags
 * @param {Rule[][]} rules
 */
async function updateRulesForFandom(fandomNames, fandomId, fandomTags, rules) {
  const fandomRegex = new RegExp(fandomNames, 'i');
  for (let i = 0; i < fandomTags.length; i++) {
    if (fandomTags[i].innerHTML.match(fandomRegex) !== null) {
      getReplacements(fandomId)
          .then(rulesString => parseRules(rulesString, fandomId))
          .then(rulesArray => rules.push(rulesArray));
      return;
    }
  }
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
 * @param {HTMLElement[]} workFandoms The fandom tags for this work.
 * @returns {Promise<Rule[]>} A list of replacement rules (see rules.js)
 */
async function getReplacementRules(workFandoms) {
  // If there's no fandoms, there can be no replacement rules.
  if (workFandoms.length === 0) {
    console.log('Didn\'t detect any fandoms--no replacements possible.')
    return [];
  }

  const rules = [];

  // To add new fandom, copy commented line and update 'fandom_names' and 'id':
  // await updateRulesForFandom('fandom_names', 'id', workFandoms, rules);
  await updateRulesForFandom(
      'Word of Honor|Faraway Wanderers|Qi Ye', 'word_of_honor', workFandoms,
      rules);
  await updateRulesForFandom('Untamed|Módào', 'mdzs', workFandoms, rules);
  await updateRulesForFandom('Guardian', 'guardian', workFandoms, rules);
  await updateRulesForFandom(
      'Nirvana in Fire', 'nirvana_in_fire', workFandoms, rules);
  await updateRulesForFandom(
      'King\'s Avatar|Quánzhí Gāoshǒu', 'kings_avatar', workFandoms, rules);
  await updateRulesForFandom(
      'TGCF|Tiān Guān Cì Fú|Heaven Official\'s Blessing', 'tgcf', workFandoms,
      rules);
  await updateRulesForFandom(
      'SVSSS|Scum Villain|Scumbag System', 'svsss', workFandoms, rules);
  await updateRulesForFandom(
      'JWQS|Clear and Muddy Loss of Love|Jing Wei Qing Shang', 'jwqs',
      workFandoms, rules);
  await updateRulesForFandom(
      '2ha|erha|Husky and His White Cat Shizun', 'erha', workFandoms, rules);

  // Add non-fandom-specific rules at the end.
  await updateRulesForFandom('', 'generic', workFandoms, rules);

  return sortedRules(rules.flat());
}

/**
 * Loads the replacement string for this fandom from its <fandom>.txt file.
 * @param {Promise<string>} fandom
 */
async function getReplacements(fandom) {
  return getResourceText(fandom);
}