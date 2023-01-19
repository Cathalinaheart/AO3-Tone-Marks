/**
 * Fetch the text of a (script)monkey resource.
 * @param {string} resourceName
 */
async function getResourceText(resourceName) {
  try {
    return GM_getResourceText(resourceName);
  } catch (e) {
    if (e instanceof ReferenceError) {
      return GM.getResourceUrl(resourceName)
          .then(url => fetch(url))
          .then(resp => resp.text())
          .catch(function(error) {
            console.log('Request failed', error);
            return null;
          });
    }
  }
}

/**
 * Inject this css resource into the current page.
 * @param {string} cssResourceName
 */
async function injectCssResource(cssResourceName) {
  const cssText = await getResourceText(cssResourceName);
  try {
    GM_addStyle(cssText);
  } catch (e) {
    if (e instanceof ReferenceError) {
      var style = document.createElement('style');
      style.innerHTML = cssText;
      document.head.appendChild(style);
    }
  }
}