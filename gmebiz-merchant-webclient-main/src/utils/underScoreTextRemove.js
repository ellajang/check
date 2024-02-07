function handleUnderscoreTextRemove(inputString) {
  if(inputString === undefined || inputString === null) {
    return '';
  }

  let words = inputString?.toLowerCase()?.split('_');

  let formattedWords = words?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1));

  let formattedString = formattedWords?.join(' ');

  return formattedString;
}

export default handleUnderscoreTextRemove;
