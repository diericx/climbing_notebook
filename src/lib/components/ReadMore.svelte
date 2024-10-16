<script lang="ts">
  export let textContent;
  export let readMoreLabel = 'Read more';
  export let readLessLabel = 'Read less';
  export let maxChars: number | undefined = undefined;
  export let maxWords: number | undefined = undefined;
  export let dotDotDot = '...';

  let text: string;
  let isOpen = false;
  const cleanText = textContent;
  $: finalLabel = isOpen ? readLessLabel : readMoreLabel;
  $: maxCharsText = getMaxCharacters(maxChars, isOpen, cleanText, text);
  $: finalText = getMaxWords(maxWords, isOpen, maxCharsText, text);
  $: finalSymbol = isOpen ? '' : dotDotDot;
  $: showButton = !isOpen && isFullText(finalText, cleanText) ? false : true;

  const handleClick = () => {
    isOpen = !isOpen;
  };
  const getMaxCharacters = (
    maxCharacters: number | undefined,
    isOpen: boolean,
    children: string,
    text: string,
  ) => {
    if (maxCharacters) {
      if (isOpen) {
        text = children;
      } else {
        text = children.substring(0, maxCharacters);
      }
      return text;
    } else {
      return children;
    }
  };

  const isFullText = (truncatedText: string, text: string) => {
    return (
      truncatedText &&
      truncatedText.split('').filter((c) => c !== ' ').length ===
        text.split('').filter((c) => c !== ' ').length
    );
  };

  const getMaxWords = (
    maxWords: number | undefined,
    isOpen: boolean,
    children: string,
    text: string,
  ) => {
    if (maxWords) {
      if (isOpen) {
        text = children;
      } else {
        const words = children.split(' ').filter((c) => c !== '');
        text = words.slice(0, maxWords).join(' ');
      }
      return text;
    } else {
      return children;
    }
  };
</script>

<div data-testid="wrapper">
  {finalText}
  <span data-testid="button-wrapper" data-visible={`${showButton}`} class="button-wrapper">
    {!isOpen ? finalSymbol : ''}
    <button data-testid="button" on:click={handleClick} class="button">
      {finalLabel}
    </button>
  </span>
</div>

<style>
  /* custom styles */
  .button-wrapper {
    white-space: nowrap;
    margin-left: -4px;
  }
  span[data-visible='false'] {
    visibility: hidden;
  }
  .button {
    border: 0;
    background-color: transparent;
    text-decoration: underline;
    cursor: pointer;
  }
  .button::first-letter {
    text-transform: uppercase;
  }
  .button:hover {
    text-decoration: none;
  }
</style>
