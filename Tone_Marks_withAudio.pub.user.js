// ==UserScript==
// @name         Tone Marks with Audio
// @namespace    http://tampermonkey.net/
// @version      4.1.0.3
// clang-format off
// @description  Add tone marks on Ao3 works, and add quick audio guide clips where available
// @author       Cathalinaheart, irrationalpie7
// @match        https://archiveofourown.org/*
// @updateURL    https://github.com/irrationalpie/AO3-Tone-Marks/raw/refactor/Tone_Marks_withAudio.pub.user.js
// @downloadURL  https://github.com/irrationalpie/AO3-Tone-Marks/raw/refactor/Tone_Marks_withAudio.pub.user.js
//
// @require      replace.js
// @require      check-fandoms.js
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
// @connect raw.githubusercontent.com
// @connect github.com
// @grant GM_getResourceText
// @grant GM_addStyle
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

GM_xmlhttpRequest({
  method: 'GET',
  // from other domain than the @match one (.org / .com):
  url:
      'https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/playaudio.min.js',
  onload: (ev) => {
    let e = document.createElement('script');
    e.innerText = ev.responseText;
    document.head.appendChild(e);
  }
});

const my_css = GM_getResourceText('IMPORTED_CSS');
GM_addStyle(my_css);

/**
 * Replaces pinyin for all text in element, using the fandoms in the
 * element's work tags to decide which rules to use.
 *
 * @param {HTMLElement} element
 */
async function doReplacements(element) {
  const rules = await getReplacementRules(getFandomTags(element));

  let innerHTMLSnapshot;
  let simplifiedElement;
  do {
    // Having a simplified element to pass to 'replaceAll' allows us to
    // avoid re-rendering the element every time its inner html gets
    // updated.
    // Taking a snapshot of the current innerhtml allows us to check whether
    // other scripts have altered the DOM while we were doing our replacing, and
    // try again so as not to erase those effects.
    innerHTMLSnapshot = element.innerHTML;
    simplifiedElement = {innerHTML: innerHTMLSnapshot};

    replaceAll(rules, simplifiedElement);
    // Return now if it turns out we didn't make any changes.
    if (simplifiedElement.innerHTML === element.innerHTML) {
      console.log(
          'No matching fandoms, or no text found that needed replacing.');
      return;
    }
  } while (innerHTMLSnapshot !== element.innerHTML);

  // Actually replace element's innerHTML.
  element.innerHTML = simplifiedElement.innerHTML;
}
})();
