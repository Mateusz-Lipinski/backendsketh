const uartSearch = () => {
  return new Promise(async (resolve, reject) => {
    const SerialPort = require("serialport");
    const Readline = require("@serialport/parser-readline");

    const ports = [];
    let validPort;
    await SerialPort.list().then((data) => {
      data.forEach((el) => {
        ports.push(el.path);
      });
      console.log(ports);
    });

    ports.forEach((path, index) => {
      const port = new SerialPort(path, { baudRate: 115200 });
      const parser = new Readline();

      parser.on("data", (line) => {
        try {
          if (line.includes("PRL_PDC")) {
            validPort = path;
          }
        } catch (err) {
          console.log(err);
        }
      });

      port.pipe(parser);

      port.write("?\r");
      setTimeout(() => {
        port.close();
        port.destroy();
      }, 1500);
    });

    setTimeout(() => {
      return resolve(validPort);
    }, 2000);
  });
};

// parser.on("data", (line) => {
//     try {
//       console.log(line);
//       const json = JSON.parse(line.split("=>")[1]);
//       console.log(json);
//       response = json;
//       onData(json);
//     } catch (err) {
//       console.log(err);
//     }
//   });

module.exports = uartSearch;
