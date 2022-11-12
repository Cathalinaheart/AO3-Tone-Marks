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

  if (includeAudio) {
    GM_addStyle(`
      .tone-audio-button {
        position: relative;
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
        outline: inherit;
        box-shadow: none;
        vertical-align: baseline;
        border-radius: 0;
      }

      .hidden-progress {
        visibility: hidden;
      }
      
      .tone-audio-button progress {
        position: absolute;
        height: .3em;
        top: -.15em;
        width: 100%;
      }

      .tone-audio-button:hover {
        border-bottom: 1px solid;
      }

      .tone-audio-button:focus {
        outline: 1px dotted;
      }`);
  }
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
    <progress value="0" max="100" class="hidden-progress"></progress>
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
  // First, replace, so the original parent still knows *where* to replace
  span.parentNode.replaceChild(button, span);
  // Then, insert the span back into the tree as the button's child.
  button.appendChild(span);

  // Listen for play/pause.
  button.addEventListener('click', () => {
    const audio = button.querySelector('.tone-audio');
    const progress = button.querySelector('progress');
    if (progress.classList.contains('hidden-progress')) {
      progress.classList.remove('hidden-progress');
      audio.addEventListener('timeupdate', () => {
        progress.value = audio.currentTime * 100 / audio.duration;
      });
    }
    if (audio.paused) {
      console.log('let\'s play!: ' + span.dataset.new);
      audio.play();
    } else {
      console.log('let\'s pause!: ' + span.dataset.new);
      audio.pause();
    }
  });
}