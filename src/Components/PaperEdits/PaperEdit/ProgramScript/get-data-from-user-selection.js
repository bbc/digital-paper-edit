/**
 * Gets the start and end time for a range of words elements selected by a user on the page
 * https://github.com/OpenNewsLabs/autoEdit_2/blob/master/lib/app/views/transcription_view.js#L47
 *
 * TODO: check in chrome, firefox, and safari?
 */

function parseWordElDataset(wordEl) {

  return {
    start: wordEl.dataset.start,
    end: wordEl.dataset.end,
    text: wordEl.dataset.text,
    speaker: wordEl.dataset.speaker,
    transcriptId: wordEl.dataset.transcriptId
  };
}

/**
 * TODO: at the moment only works for selections within a paragraph
 * @param {*} e - browser event
 * @returns - an object with start and end time - eg {stat: "23.03", end: "39.61"}
 */
function getDataFromUserWordsSelection(e) {
  // https://stackoverflow.com/questions/11300590/how-to-captured-selected-text-range-in-ios-after-text-selection-expansion
  // https://jsfiddle.net/JasonMore/gWZfb/
  if (!window.getSelection().isCollapsed) {
    const selectedRange = window.getSelection().getRangeAt(0).cloneContents();

    // Seems like this work no matter if the selection is made left to right
    // or right to left form the user
    const words = selectedRange.querySelectorAll('.words');
    if (words.length !== 0) {
      window.words = words;

      return {
        start: parseFloat(words[0].dataset.start),
        end: parseFloat(words[words.length - 1].dataset.end),
        transcriptId: words[0].dataset.transcriptId,
        speaker: words[0].dataset.speaker,
        // words: words
        words: Array.from(words).map((w) => {return parseWordElDataset(w);})
      };
    }
    else {
      // handles selection of single word
      // if selected a single word - then selection is on text element
      // and we want to get to parent element, span with words class
      const word = window.getSelection().anchorNode.parentElement;
      if (word.className === 'words') {
        return {
          start: parseFloat(word.dataset.start),
          end: parseFloat(word.dataset.end),
          transcriptId: words[0].dataset.transcriptId,
          speaker: words[0].dataset.speaker,
          words: words
        };
      }

      return false;
    }
  }

  return false;
}

export default getDataFromUserWordsSelection;