// ==UserScript==
// @name         Tone Marks with Audio
// @namespace    http://tampermonkey.net/
// @version      4.4
// clang-format off
// @description  Add tone marks on Ao3 works, and add quick audio guide clips where available
// @author       Cathalinaheart, irrationalpie7
// @match        https://archiveofourown.org/*
// @updateURL    https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/Tone_Marks_withAudio.pub.user.js
// @downloadURL  https://github.com/Cathalinaheart/AO3-Tone-Marks/raw/main/Tone_Marks_withAudio.pub.user.js
//
// @require      audio.js
// @require      replace.js
// @require      check-fandoms.js
// @require      show-glossary.js
// @require      mark-tones.js
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

  const icon_css = GM_getResourceText('IMPORTED_CSS');
  GM_addStyle(icon_css);
  const audio_button_css = GM_getResourceText('audio_css');
  GM_addStyle(audio_button_css);
  const glossary_css = GM_getResourceText('glossary_css');
  GM_addStyle(glossary_css);
})();
