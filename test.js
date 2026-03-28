async function test() {
  const url = "https://openlibrary.org/search.json?q=the+lord+of+the+rings&page=1&limit=20";
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'InfiniteScrollLibraryApp/1.0',
      }
    });
    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Body:", text.substring(0, 500));
  } catch (err) {
    console.error(err);
  }
}
test();
