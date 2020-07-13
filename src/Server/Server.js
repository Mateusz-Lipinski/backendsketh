var http = require("http");
var sha256 = require("js-sha256");
var uartSearch = require("./uartSearch");
const uart = require("./uart");

let pdc_data = {};
const x = async () => {
  uartSearch().then((validPort) => {
    validPort && uart(validPort, (data) => (pdc_data = data), 1000);
  });
};

x();

const auth = (hash) => {
  return (
    "b057ef3671858a91bb8de105124eb13e388e5ed44c6105c8436b343cfbaafdb8" === hash
  );
};

fs = require("fs");

process.on("uncaughtException", function (err) {
  console.error(err);
});

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  ); // If needed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  ); // If needed
  res.setHeader("Access-Control-Allow-Credentials", true); // If needed

  if (req.url === "/favicon.ico") {
    res.writeHead(200, { "Content-Type": "image/x-icon" });
    res.end();
    return;
  }
  const searchParams = decodeURIComponent(req.url).match(
    /(\?|\&)([^=]+)\=([^&]+)/g
  );

  const token =
    searchParams &&
    searchParams.length > 0 &&
    searchParams.find((el) => el.startsWith("?auth=")).replace("?auth=", "");

  const authenticated = auth(token);
  if (!authenticated) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "You have no permission to access this resource",
      })
    );
    return;
  }
  console.log(decodeURIComponent(req.url));
  res.writeHead(200, { "Content-Type": "application/json" });
  if (req.url.slice(0, 4) === "/get") {
    const object = req.url.slice(4).match(/(?<=\().+?(?=\))/g)[0];
    try {
      fs.readFile("Data/data.json", "utf8", function (err, data) {
        if (err) {
          return res.end(err);
        } else {
          dataJSON = JSON.parse(data);
          dataJSON["pdc"] = pdc_data;
          let selected = dataJSON[object];
          if (object === "auth") {
            selected = "ok";
          }
          response = JSON.stringify(
            selected || { error: "Undefined Resource" }
          );
          return res.end(response);
        }
      });
    } catch (err) {
      console.log(err);
      return res.end(JSON.stringify({ error: err }));
    }
  } else if (req.url.slice(0, 4) === "/set") {
    const object = req.url.slice(4).match(/(?<=\().+?(?=\))/g)[0];
    const value = JSON.parse(
      decodeURIComponent(req.url.slice(4).match(/(?<=\().+?(?=\))/g)[1])
    );
    try {
      fs.readFile("Data/data.json", "utf8", function (err, data) {
        if (err) {
          return res.end(err);
        } else {
          dataJSON = JSON.parse(data);
          dataJSON[object] = value;
          fs.writeFile("Data/data.json", JSON.stringify(dataJSON), function (
            err
          ) {
            if (err) throw err;
          });
          response = JSON.stringify(dataJSON[object]);
          return res.end(response);
        }
      });
    } catch (err) {
      console.log(err);
      return res.end(JSON.stringify({ error: "Wrong value" }));
    }
  } else {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unknown command" }));
    return;
  }
});
server.on("error", function (err) {
  console.error(err);
});

server.listen(8080);

console.log("Server started");
