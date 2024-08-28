"use strict";

const injectFailureInternal = require("./failure").injectFailureInternal;
const https = require("https");

const remoteCallingLambda = async (event, context) => {
  const fetch = require("node-fetch");
  const response = await fetch(
    "https://raw.githubusercontent.com/steadybit/failure-lambda/main/package.json",
    { agent: new https.Agent({ keepAlive: false }) }, // keepAlive is enabled by default in node >= 19
  );
  const json = await response.json();
  return {
    statusCode: 200,
    body: json.name,
  };
};

describe("failure", () => {
  describe("latency", () => {
    it("should inject an latency", async () => {
      const logSpy = jest.spyOn(console, "log");
      const config = {
        isEnabled: false,
        failureMode: "latency",
        rate: 1,
        minLatency: 600,
        maxLatency: 600,
      };

      const start = Date.now();
      const wrapped = injectFailureInternal(remoteCallingLambda, config);
      const response = await wrapped();
      expect(response.statusCode).toEqual(200);
      const originalLatency = Date.now() - start;
      console.log("original latency " + originalLatency);

      config.isEnabled = true;
      const start2 = Date.now();
      const response2 = await wrapped();
      expect(response2.statusCode).toEqual(200);
      const newLatency = Date.now() - start2;
      console.log("new latency " + newLatency);
      expect(newLatency).toBeGreaterThan(600);
      expect(newLatency).toBeGreaterThan(originalLatency + 200);

      expect(logSpy).toHaveBeenCalledWith("Injecting 600 ms latency.");
    });
  });
  describe("exception", () => {
    it("should inject an exception", async () => {
      const logSpy = jest.spyOn(console, "log");
      const config = {
        isEnabled: true,
        failureMode: "exception",
        rate: 1,
        exceptionMsg: "Test exception!!!",
      };

      const wrapped = injectFailureInternal(remoteCallingLambda, config);
      await expect(wrapped).rejects.toThrow("Test exception!!!");
      expect(logSpy).toHaveBeenCalledWith(
        "Injecting exception message: Test exception!!!",
      );
    });
  });
  describe("statuscode", () => {
    it("should inject an exception", async () => {
      const logSpy = jest.spyOn(console, "log");
      const config = {
        isEnabled: true,
        failureMode: "statuscode",
        rate: 1,
        statusCode: 404,
      };

      const wrapped = injectFailureInternal(remoteCallingLambda, config);

      expect(await wrapped()).toEqual({ statusCode: 404 });
      expect(logSpy).toHaveBeenCalledWith("Injecting status code: 404");
    });
  });
  describe("denylist", () => {
    it("should block traffic", async () => {
      const logSpy = jest.spyOn(console, "log");
      const config = {
        isEnabled: true,
        failureMode: "denylist",
        rate: 1,
        denylist: [".*"],
      };

      const wrapped = injectFailureInternal(remoteCallingLambda, config);
      await expect(wrapped).rejects.toThrow(
        "request to https://raw.githubusercontent.com/steadybit/failure-lambda/main/package.json failed, reason: socket hang up",
      );
      expect(logSpy).toHaveBeenCalledWith(
        "Intercepted network connection to raw.githubusercontent.com",
      );

      config.isEnabled = false;
      const response = await wrapped();
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual("@steadybit/failure-lambda");
    });
  });
});
