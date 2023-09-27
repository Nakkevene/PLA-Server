"use strict";

import express from "express";
import fs from "node:fs";

class PLAServer {
  constructor(PORT: number) {
    this.Router(PORT);
  }

  Logger = (Data: string): void => {
    console.log(`[PLA-SERVER ${new Date().toISOString()}] ${Data}`);
  };

  ReadDeviceSlave = (DeviceSerial: string): number => {
    const raw: string = fs
      .readFileSync(`/sys/bus/w1/devices/${DeviceSerial}/w1_slave`)
      .toString();
    console.log(raw.split("="));
  };

  Router = (PORT: number): void => {
    const server = express();

    server.all("/", (req, res) => {
      this.Logger(`${req.ip} - ${req.url}`);
      res.status(200).send("PLA-Server");
    });

    server.get("/:DeviceSerial", (req, res) => {
      this.Logger(`${req.ip} - ${req.url}`);
      res.status(200).send(this.ReadDeviceSlave(req.params.DeviceSerial));
    });

    server.listen(PORT, () => {
      this.Logger("Listening on port " + PORT);
    });
  };
}

new PLAServer(2929);
