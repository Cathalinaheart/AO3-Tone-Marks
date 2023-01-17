/**
 * Checks whether 'fandomNames' (ignoring case) is a substring of any of the
 * fandom tags, and if so appends the relevant rules.
 *
 * @param {string} fandomNames
 * @param {string} fandomId
 * @param {Element[]} fandomTags
 * @param {{asString:string}} rules
 */
async function updateRulesForFandom(fandomNames, fandomId, fandomTags, rules) {
  const fandomRegex = new RegExp(fandomNames, 'i');
  for (let i = 0; i < fandomTags.length; i++) {
    if (fandomTags[i].innerHTML.match(fandomRegex) !== null) {
      rules.asString += await getReplacements(fandomId) + '\n';
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
 *
 * @returns {{words:string[],replacement:string, audio_url:string}[]} A list of
 *     replacement rules. Each rule consists of a list of word(s) to replace,
 *     what they should be replaced with, and potentially an audio_url with
 *     pronunciation.
 */
async function getReplacementRules(workFandoms) {
  // If there's no fandoms, there can be no replacement rules.
  if (workFandoms.length === 0) {
    console.log('Didn\'t detect any fandoms--no replacements possible.')
    return [];
  }

  // Yay hacky mutable string.
  const rules = {asString: ''}

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

  return splitReplacements(rules.asString);
}

/**
 * Loads the replacement string for this fandom from its <fandom>.txt file.
 * @param {string} fandom
 */
async function getReplacements(fandom) {
  return getResourceText(fandom);
}

/**
 * Turns a long replacements string into a list of match objects, where:
 *  - match.words is an array of strings that form the individual words to
 * match
 *  - match.replacement is the text to replace that sequence with
 *  - match.audio_url is an optional url pointing to audio that pronounces this
 * text.
 *
 * @param {string} replacements
 * @returns {{words:string[],replacement:string, audio_url:string}[]}
 */
function splitReplacements(replacements) {
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
          return;
        }

        rules.push({
          words: match[0].split(' ').filter(match => match.length > 0),
          replacement: match[1].trim(),
          // Set audio_url if it exists, otherwise set to 'None'.
          audio_url: match.length >= 3 ? match[2].trim() : 'None'
        });
      }, []);
}