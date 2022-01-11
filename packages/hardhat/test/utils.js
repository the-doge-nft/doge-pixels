function range(n) {
  return [...Array(n).keys()];
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function randFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = {
  range,
  shuffle,
  randFromArray
}
