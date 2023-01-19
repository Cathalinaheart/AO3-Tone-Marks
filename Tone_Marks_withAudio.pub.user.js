// ==UserScript==
// @name         Tone Marks with Audio
// @namespace    http://tampermonkey.net/
// @version      4.5
// clang-format off
// @description  Add tone marks on Ao3 works, and add quick audio guide clips where available
// @author       Cathalinaheart, irrationalpie7
// @match        https://archiveofourown.org/*
// @updateURL    https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/Tone_Marks_withAudio.pub.user.js
// @downloadURL  https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/Tone_Marks_withAudio.pub.user.js
//
// @require      monkey-compatibility.js
// @require      audio.js
// @require      replace.js
// @require      check-fandoms.js
// @require      show-glossary.js
// @require      mark-tones.js
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
// @resource     IMPORTED_CSS https://fonts.googleapis.com/icon?family=Material+Icons
// @resource     audio_css audio.css
// @resource     glossary_css glossary.css
// clang-format on
// @grant GM.getResourceUrl
// @grant GM_getResourceText
// @grant GM_addStyle
// ==/UserScript==

(async function() {
  'use strict';

  await doToneMarksReplacement(/*includeAudio=*/ true);

  injectCssResource('IMPORTED_CSS');
  injectCssResource('audio_css');
  injectCssResource('glossary_css');
})();
