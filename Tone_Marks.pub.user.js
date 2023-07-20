// ==UserScript==
// @name         Tone Marks
// @namespace    http://tampermonkey.net/
// @version      4.5.2
// clang-format off
// @description  Add tone marks on Ao3 works
// @author       Cathalinaheart, irrationalpie7
// @match        https://archiveofourown.org/*
// @updateURL    https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/Tone_Marks.pub.user.js
// @downloadURL  https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/Tone_Marks.pub.user.js
//
// @require      monkey-compatibility.js
// @require      replace.js
// @require      check-fandoms.js
// @require      show-glossary.js
// @require      mark-tones.js
// @resource     glossary_css glossary.css
// Generic and per-fandom replacement rules:
// @resource     generic resources/generic.txt
// @resource     guardian resources/guardian.txt
// @resource     kings_avatar resources/kings_avatar.txt
// @resource     mdzs resources/mdzs.txt
// @resource     nirvana_in_fire resources/nirvana_in_fire.txt
// @resource     tgcf resources/tgcf.txt
// @resource     word_of_honor resources/word_of_honor.txt
// @resource     svsss resources/svsss.txt
// @resource     jwqs resources/jwqs.txt
// @resource     erha resources/erha.txt
// clang-format on
// @grant GM.getResourceUrl
// @grant GM_getResourceText
// @grant GM_addStyle
// ==/UserScript==

(async function() {
  'use strict';

  await doToneMarksReplacement(/*includeAudio=*/ false);

  injectCssResource('glossary_css');
})();
