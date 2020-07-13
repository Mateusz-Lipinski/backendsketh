const fetch = require("node-fetch");

const measureTime = (func) => {
  var hrstart = process.hrtime();
  func();
  var hrend = process.hrtime(hrstart);
  console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);
};

const getData = () => {
  fetch(
    "http://localhost:8080/get(object4)?auth=b057ef3671858a91bb8de105124eb13e388e5ed44c6105c8436b343cfbaafdb8"
  )
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error(err));
};

const setData = () => {
  const value = JSON.stringify({ fieldName: 122 });
  fetch(
    `http://localhost:8080/set(object4)(${value})?auth=b057ef3671858a91bb8de105124eb13e388e5ed44c6105c8436b343cfbaafdb8`
  )
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error(err));
};

measureTime(setData);
setTimeout(() => measureTime(getData), 100);
