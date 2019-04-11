// d0d01f65f7d300d9cdff9615ac5b23b7
// https://www.food2fork.com/api/search

async function getResult(query) {
  const key = 'd0d01f65f7d300d9cdff9615ac5b23b7';
  const response = await fetch(
    `https://www.food2fork.com/api/search?key=${key}&q=${query}`
  );
  const data = await response.json();
  return data;
}

getResult('coffee').then(data => console.log(data));
