import express from "express";
import fs from "node:fs";
import path from "node:path";

class PLA_SERVER {
  constructor(SERV_PORT: number, W1_SLAVES_PATH: string) {
    this.Router(SERV_PORT, W1_SLAVES_PATH);
  }

  Logger = (Data: string): void => {
    console.log(`[PLA-Server ${new Date().toISOString()}] ${Data}`);
  };

  ReadSlave = (W1_Slaves_Path: string, DeviceSerial: string): number => {
    const slavepath: string = path.join(W1_Slaves_Path, DeviceSerial);
    const temppath: string = path.join(slavepath, "/temperature");

    if (fs.existsSync(slavepath)) {
      try {
        const temp: number = parseInt(fs.readFileSync(temppath).toString());
        return temp;
      } catch (error) {
        this.Logger(`Failed to read ${temppath}.`);
        return -1;
      }
    } else return -1;
  };

  Router = (SERV_PORT: number, W1_SLAVES_PATH: string): void => {
    const server = express();

    server.all("/", (req, res) => {
      this.Logger(`IP: ${req.ip} URL: ${req.url} PARAMS: ${req.params}`);
      res.status(200).send("PLA-Server");
    });

    server.get("/w1/:DeviceSerial", (req, res) => {
      this.Logger(`IP: ${req.ip} URL: ${req.url} PARAMS: ${req.params}`);

      const temp: number = this.ReadSlave(
        W1_SLAVES_PATH,
        req.params.DeviceSerial
      );
      if (temp == -1) {
        res.status(500);
        return;
      }

      res.status(200).send(temp);
    });

    server.listen(SERV_PORT, () => {
      this.Logger(`Listening on port ${SERV_PORT}.`);
    });
  };
}

new PLA_SERVER(2929, "/sys/bus/w1/devices");
