const uart = (path, onData = (data) => console.log(data), inteval = 1000) => {
  const SerialPort = require("serialport");
  const Readline = require("@serialport/parser-readline");

  const port = new SerialPort(path, { baudRate: 115200 });
  const parser = new Readline();
  port.pipe(parser);

  parser.on("data", (line) => {
    try {
      // console.log(line);
      const json = JSON.parse(line.split("=>")[1]);
      // console.log(json);
      response = json;
      onData(json);
    } catch (err) {
      console.log("Error:");
      console.log(line);
    }
  });

  setInterval(() => {
    port.write("status\r");
  }, inteval);
};

module.exports = uart;
