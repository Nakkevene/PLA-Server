"use strict";

import express from "express";
import fs from "node:fs";

class PLAServer {
  constructor(PORT) {
    this.Router(PORT);
  }

  Logger = (Data) => {
    console.log(`[PLA-SERVER ${new Date().toISOString()}] ${Data}`);
  };

  Router = (PORT) => {
    const server = express();

    server.all("/", (req, res) => {
      this.Logger(`${req.ip} - ${req.url}`);
      res.status(200).send("PLA-Server");
    });

    server.listen(PORT, () => {
      this.Logger("Listening on port " + PORT);
    });
  };
}

new PLAServer(2929);
