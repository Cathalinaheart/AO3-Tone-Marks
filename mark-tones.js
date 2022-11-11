/**
 * Place tone marks in work or work blurbs on the current page.
 * @param {boolean} includeAudio whether to include audio pronunciation
 */
async function doToneMarksReplacement(includeAudio) {
  // Url of the ao3 page.
  const url = location.href;

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

  // Clean up re-replacements and add audio functionality.
  const replacements = Array.from(document.querySelectorAll('.replacement'));
  replacements.forEach(span => {
    span.innerHTML = span.dataset.new;
    if (includeAudio && span.dataset.url !== 'None') {
      addAudioButtonAround(span);
    }
  });
}

/**
 * Replaces pinyin for all text in element, using the fandoms in the
 * element's work tags to decide which rules to use.
 *
 * @param {HTMLElement} element
 */
async function doReplacements(element) {
  const rules = await getReplacementRules(getFandomTags(element));
  replaceAll(rules, element);
}


/**
 * Surround span with a button that plays/pauses the audio.
 * @param {HTMLElement} span
 */
function addAudioButtonAround(span) {
  // Append an icon and audio element to the span.
  span.innerHTML += `
  <span class="audio-guide">
    <audio src="${span.dataset.url}" preload="none" class="tone-audio">
    </audio>
    <span class="material-icons" style="font-size:100%;-ms-transform: translateY(-40%);transform: translateY(-40%);">
      volume_up
    </span>
  </span>`;

  // Wrap it in a button.
  // Note: it's fine for the <audio> element to be a child of the button since
  // it doesn't have controls.
  const button = document.createElement('button');
  button.classList.add('tone-audio-button');
  button.appendChild(span);
  span.parentNode.replaceChild(button, span);
  button.addEventListener('click', () => {
    const audio = button.querySelector('.tone-audio');
    if (audio.paused) {
      console.log('let\'s play!: ' + span.textContent);
      audio.play();
    } else {
      console.log('let\'s pause!: ' + span.textContent);
      audio.pause();
    }
  });
}