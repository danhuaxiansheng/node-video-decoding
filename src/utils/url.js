function setGetParams(url, params = {}) {
  let list = [];
  Object.keys(params).forEach((d, key) => {
    let val = params[d] ?? "";
    list.push(d + "=" + val);
  });
  return url + "?" + encodeURI(list.join("&"));
}

module.exports = {
  setGetParams,
};
