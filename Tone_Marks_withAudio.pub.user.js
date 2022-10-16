// ==UserScript==
// @name         Tone Marks with Audio
// @namespace    http://tampermonkey.net/
// @version      4.0.4
// @description  Add tone marks on Ao3 works, and add quick audio guide clips were available
// @author       Cathalinaheart, irrationalpie7
// @match        https://archiveofourown.org/*
// clang-format off
// @updateURL    https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/Tone_Marks_withAudio.pub.user.js
// @downloadURL  https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/Tone_Marks_withAudio.pub.user.js
//
// Generic and per-fandom replacement rules:
// @resource     generic https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/resources/generic.txt
// @resource     guardian https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/resources/guardian.txt
// @resource     kings_avatar https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/resources/kings_avatar.txt
// @resource     mdzs https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/resources/mdzs.txt
// @resource     nirvana_in_fire https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/resources/nirvana_in_fire.txt
// @resource     tgcf https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/resources/tgcf.txt
// @resource     word_of_honor https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/resources/word_of_honor.txt
// @resource     svsss https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/resources/svsss.txt
// @resource     jwqs https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/resources/jwqs.txt
// @resource     erha https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/resources/erha.txt
// @resource     audioplay https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/resources/playaudio.min.js
// @resource     IMPORTED_CSS https://fonts.googleapis.com/icon?family=Material+Icons
// clang-format on
// @grant unsafeWindow
// @grant GM.getResourceUrl
// @grant GM_xmlhttpRequest
// @grant      GM_getResourceText
// @grant      GM_addStyle
// ==/UserScript==

(function() {
'use strict';

async function doTheThing() {
  // Url of the ao3 page.
  const url = unsafeWindow.location.href;
  // Document structure of the ao3 page.
  const document = unsafeWindow.document;

  // Check whether this page is an ao3 work.
  const works_regex = /https:\/\/archiveofourown\.org(\/.*)?\/works\/[0-9]+.*/;
  // Check whether it's an editing page.
  const edit_page_regex = /\/works\/[0-9]+\/edit/;

  if (url.match(works_regex) !== null) {
    if (url.match(edit_page_regex) === null && !url.includes('works/new')) {
      console.log('On a works page, potentially making pinyin replacements...')
          // Don't make replacements on the new work/edit work (tag) page,
          // that sounds confusing.
          await doReplacements(document.getElementById('main'));
    }
  } else {
    console.log(
        'Not on a works page; going to try to do pinyin replacement per blurb...')
    // Get all the work/series blurbs
    const blurbs = Array.from(document.querySelectorAll('.blurb'));
    for (let i = 0; i < blurbs.length; i++) {
      await doReplacements(blurbs[i]);
    }
  }

  // Clean up re-replacements.
  const replacements = Array.from(document.querySelectorAll('.replacement'));
  replacements.forEach(function(span) {
    span.innerHTML = span.dataset.new;
  });
}
doTheThing();

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

GM_xmlhttpRequest({
  method : "GET",
  // from other domain than the @match one (.org / .com):
  url : "https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/playaudio.min.js",
  onload : (ev) =>
  {
    let e = document.createElement('script');
    e.innerText = ev.responseText;
    document.head.appendChild(e);
  }
});

const my_css = GM_getResourceText("IMPORTED_CSS");
GM_addStyle(my_css);

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
  if(audio_url === 'None'){
  return '<span class="replacement" data-orig="' + match + '" data-new="' +
      escaped(replacement) + '">' + escaped(replacement) + '</span>';
  }else{
  return '<span onclick="playAudio(\''+ audio_url + '\');" style="cursor: pointer;" class="replacement" data-orig="' + match + '" data-new="' +
      escaped(replacement) + '">' + escaped(replacement) + '</span><span class="audio-guide" onclick="playAudio(\''+ audio_url + '\');"><i class="material-icons" style="font-size:100%;cursor: pointer;-ms-transform: translateY(-40%);transform: translateY(-40%);">volume_up</i></span>';
}};

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
 * Checks whether 'fandom' (ignoring case) is a substring of any of the
 * fandom tags.
 *
 * @param {string} fandom
 * @param {Element[]} fandomTags
 * @returns {boolean}
 */
function hasFandom(fandom, fandomTags) {
  const fandomRegex = new RegExp(fandom, 'i');
  for (let i = 0; i < fandomTags.length; i++) {
    if (fandomTags[i].innerHTML.match(fandomRegex) !== null) {
      return true;
    }
  }
  return false;
}

/**
 * Replaces pinyin for all text in element, using the fandoms in the
 * element's work tags to decide which rules to use.
 *
 * @param {HTMLElement} element
 */
async function doReplacements(element) {
  // Having a simplified element to pass to 'replaceAll' allows us to
  // avoid re-rendering the element every time its inner html gets
  // updated.
  const simplifiedElement = {innerHTML: element.innerHTML};

  // Anything with a 'tag' class that's a descendant of something with a
  // 'fandom' or 'fandoms' class.
  const workFandoms =
      Array.from(element.querySelectorAll('.fandoms .tag,.fandom .tag'));
   if (hasFandom('Word of Honor|Faraway Wanderers|Qi Ye', workFandoms)) {
     replaceAll(await getReplacements('word_of_honor'), simplifiedElement);
   }
  if (hasFandom('Untamed|Módào', workFandoms)) {
    replaceAll(await getReplacements('mdzs'), simplifiedElement);
  }
   if (hasFandom('Guardian', workFandoms)) {
     replaceAll(await getReplacements('guardian'), simplifiedElement);
   }
   if (hasFandom('Nirvana in Fire', workFandoms)) {
     replaceAll(await getReplacements('nirvana_in_fire'), simplifiedElement);
   }
   if (hasFandom('King\'s Avatar|Quánzhí Gāoshǒu', workFandoms)) {
     replaceAll(await getReplacements('kings_avatar'), simplifiedElement);
   }
   if (hasFandom(
           'TGCF|Tiān Guān Cì Fú|Heaven Official\'s Blessing', workFandoms)) {
     replaceAll(await getReplacements('tgcf'), simplifiedElement);
   }
  if (hasFandom(
           'SVSSS|Scum Villain|Scumbag System', workFandoms)) {
     replaceAll(await getReplacements('svsss'), simplifiedElement);
   }
  if (hasFandom(
           'JWQS|Clear and Muddy Loss of Love|Jing Wei Qing Shang', workFandoms)) {
     replaceAll(await getReplacements('jwqs'), simplifiedElement);
   }
  if (hasFandom(
           '2ha|erha|Husky and His White Cat Shizun', workFandoms)) {
     replaceAll(await getReplacements('erha'), simplifiedElement);
   }
   replaceAll(await getReplacements('generic'), simplifiedElement);

  // Return now if it turns out we didn't make any changes.
  if (simplifiedElement.innerHTML === element.innerHTML) {
    console.log('No matching fandoms, or no text found that needed replacing.');
    return;
  }

  // Actually replace element's innerHTML.
  element.innerHTML = simplifiedElement.innerHTML;
}

/**
 * Gets the replacement string for this fandom from its <fandom>.txt file.
 * @param {string} fandom
 */
async function getReplacements(fandom) {
  return GM.getResourceUrl(fandom)
      .then(url => fetch(url))
      .then(resp => resp.text())
      .catch(function(error) {
        console.log('Request failed', error);
        return null;
      });
}

/**
 * Turns a long replacements string into a list of match objects, where:
 *  - match.words is an array of strings that form the individual words to
 * match
 *  - match.replacement is the text to replace that sequence with
 *
 * @param {string} replacements
 * @returns {{words:string[],replacement:string, audio_url:string}[]}
 */
function splitReplacements(replacements) {
  return replacements.split('\n')
      .map(function(line) {
        return line.trim();
      })
      .filter(function(line) {
        return line.length > 0 && !line.startsWith('#');
      })
      .map(function(line) {
        const match = line.split('|');
        if(match.length === 3){
        return {
          words: match[0].split(' ').filter(match => match.length > 0),
          replacement: match[1].trim(),
          audio_url: match[2].trim()
        };} else{
          return {
          words: match[0].split(' ').filter(match => match.length > 0),
          replacement: match[1].trim(),
          audio_url: 'None'
        };
        }
      });
}

/**
 * Replaces all matches in element.innerHTML with their replacements, as
 * encoded in the rules string.
 *
 * @param {string} allReplacementsString
 * @param {{innerHTML: string}} element
 */
function replaceAll(allReplacementsString, element) {
  // Avoid updating element.innerHTML until the very end.
  const simplifiedElement = {innerHTML: element.innerHTML};
  const replacements = splitReplacements(allReplacementsString);
  replacements.forEach(function(rule) {
    replaceTextOnPage(
        simplifiedElement, wordsMatchRegex(rule.words), rule.replacement, rule.audio_url);
  });
  element.innerHTML = simplifiedElement.innerHTML;
}
})();
