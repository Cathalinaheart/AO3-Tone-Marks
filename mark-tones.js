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
      span.innerHTML +=
          '<span class="audio-guide"><i class="material-icons" style="font-size:100%;cursor: pointer;-ms-transform: translateY(-40%);transform: translateY(-40%);">volume_up</i></span>'
      span.style.cursor = 'pointer';
      span.onclick = () => {
        new Audio(span.dataset.url).play();
      };
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
