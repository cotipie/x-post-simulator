function generateSearchUrl(searchCommand) {
  const baseUrl = 'https://twitter.com/search';
  const encodedCommand = encodeURIComponent(searchCommand);
  return `${baseUrl}?q=${encodedCommand}&src=typed_query&f=top`;
}

document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const userId = document.getElementById('user-id').value;
  const keyword = document.getElementById('keyword').value;
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const filter = document.getElementById('filter').value;
  const url = document.getElementById('url').value;
  const hashtag = document.getElementById('hashtag').value;
  const exclude = document.getElementById('exclude').value;
  const minRetweets = document.getElementById('min-retweets').value;
  const minFaves = document.getElementById('min-faves').value;
  const location = document.getElementById('location').value;
  const radius = document.getElementById('radius').value;
  const language = document.getElementById('language').value;
  const includeRetweets = document.getElementById('include-retweets').checked;
  const onlyRetweets = document.getElementById('only-retweets').checked;

  let searchCommand = '';

  if (keyword) {
    searchCommand += `${keyword} `;
  }

  if (userId) {
      searchCommand += `from:${userId} `;
  }
  if (startDate) {
    searchCommand += `since:${startDate} `;
  }

  if (endDate) {
    searchCommand += `until:${endDate} `;
  }

  if (filter) {
    searchCommand += `${filter} `;
  }

  if (url) {
    searchCommand += `url:${url} `;
  }

  if (hashtag) {
    searchCommand += `#${hashtag} `;
  }

  if (exclude) {
    searchCommand += `-${exclude} `;
  }

  if (minRetweets) {
    searchCommand += `min_retweets:${minRetweets} `;
  }

  if (minFaves) {
    searchCommand += `min_faves:${minFaves} `;
  }

  if (location && radius) {
    searchCommand += `near:${location} within:${radius} `;
  }

  if (language) {
    searchCommand += `lang:${language} `;
  }

  if (includeRetweets) {
    searchCommand += 'include:nativeretweets ';
  }

  if (onlyRetweets) {
    searchCommand += 'filter:nativeretweets ';
  }

  document.getElementById('result').textContent = searchCommand.trim();
  const searchUrl = generateSearchUrl(searchCommand.trim());
  const searchUrlLink = document.getElementById('search-url');
  searchUrlLink.style.display = 'block';
  searchUrlLink.href = searchUrl;
  searchUrlLink.textContent = 'Xで検索結果を表示';
});

document.getElementById('copy-button').addEventListener('click', function() {
  const result = document.getElementById('result');
  const tempTextarea = document.createElement('textarea');
  tempTextarea.value = result.textContent;
  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextarea);
  alert('検索コマンドがクリップボードにコピーされました。');
});