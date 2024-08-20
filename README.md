# Failure injection for AWS Lambda - failure-lambda
**[Description](#description) |**
**[How to with SSM Parameter](#how-to-install-with-parameter-in-ssm-parameter-store) |**
**[How to with AppConfig](#how-to-install-with-hosted-configuration-in-aws-appconfig) |**
**[Usage](#usage) |**
**[Examples](#examples) |**
**[Notes](#notes) |**
**[Changelog](CHANGELOG.md)**


## Description

`failure-lambda` is a small Node module for injecting failure into AWS Lambda (https://aws.amazon.com/lambda). It offers a simple failure injection wrapper for your Lambda handler where you then can choose to inject failure by setting the `failureMode` to `latency`, `exception`, `denylist`, `diskspace` or `statuscode`. You control your failure injection using SSM Parameter Store or [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html).

## How to install with parameter in SSM Parameter Store

1. Install `failure-lambda` module using NPM.
```bash
npm install failure-lambda
```
2. Add the module to your Lambda function code.
```js
const failureLambda = require('failure-lambda')
```
3. Wrap your handler.
```js
exports.handler = failureLambda(async (event, context) => {
  ...
})
```
4. Create a parameter in SSM Parameter Store.
```json
{"isEnabled": false, "failureMode": "latency", "rate": 1, "minLatency": 100, "maxLatency": 400, "exceptionMsg": "Exception message!", "statusCode": 404, "diskSpace": 100, "denylist": ["s3.*.amazonaws.com", "dynamodb.*.amazonaws.com"]}
```
```bash
aws ssm put-parameter --region eu-west-1 --name failureLambdaConfig --type String --overwrite --value "{\"isEnabled\": false, \"failureMode\": \"latency\", \"rate\": 1, \"minLatency\": 100, \"maxLatency\": 400, \"exceptionMsg\": \"Exception message!\", \"statusCode\": 404, \"diskSpace\": 100, \"denylist\": [\"s3.*.amazonaws.com\", \"dynamodb.*.amazonaws.com\"]}"
```
5. Add an environment variable to your Lambda function with the key FAILURE_INJECTION_PARAM and the value set to the name of your parameter in SSM Parameter Store.
6. Add permissions to the parameter for your Lambda function.
7. Try it out!

## How to install with hosted configuration in AWS AppConfig

1. Install `failure-lambda` module using NPM.
```bash
npm install failure-lambda
```
2. Add the module to your Lambda function code.
```js
const failureLambda = require('failure-lambda')
```
3. Wrap your handler.
```js
exports.handler = failureLambda(async (event, context) => {
  ...
})
```
4. Create Application, Environment, Configuration Profile, and Hosted Configuration in AppConfig console.
5. Deploy a version of the configuration.
6. Add the AWS AppConfig layer for Lambda extensions to your Lambda function. [See details](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-integration-lambda-extensions.html).
7. Add environment variables to your Lambda function.
```bash
FAILURE_APPCONFIG_APPLICATION: YOUR APPCONFIG APPLICATION
FAILURE_APPCONFIG_ENVIRONMENT: YOUR APPCONFIG ENVIRONMENT
FAILURE_APPCONFIG_CONFIGURATION: YOUR APPCONFIG CONFIGURATION PROFILE
```
8. Add permissions to the AppConfig Application, Environment, and Configuration Profile for your Lambda function.
9. Try it out!

## Usage

Edit the values of your parameter in SSM Parameter Store or hosted configuration in AWS AppConfig to use the failure injection module.

* `isEnabled: true` means that failure is injected into your Lambda function.
* `isEnabled: false` means that the failure injection module is disabled and no failure is injected.
* `failureMode` selects which failure you want to inject. The options are `latency`, `exception`, `denylist`, `diskspace` or `statuscode` as explained below.
* `rate` controls the rate of failure. 1 means that failure is injected on all invocations and 0.5 that failure is injected on about half of all invocations.
* `minLatency` and `maxLatency` is the span of latency in milliseconds injected into your function when `failureMode` is set to `latency`.
* `exceptionMsg` is the message thrown with the exception created when `failureMode` is set to `exception`.
* `statusCode` is the status code returned by your function when `failureMode` is set to `statuscode`.
* `diskSpace` is size in MB of the file created in tmp when `failureMode` is set to `diskspace`.
* `denylist` is an array of regular expressions, if a connection is made to a host matching one of the regular expressions it will be blocked.

## Examples

In the subfolder `example` is a sample application which will install an AWS Lambda function, an Amazon DynamoDB table, and a parameter in SSM Parameter Store. You can install it using AWS SAM, AWS CDK, or Serverless Framework.

### AWS SAM
```bash
cd example/sam
npm install
sam build
sam deploy --guided
```

### AWS CDK
```bash
cd example/cdk
npm install
cdk deploy
```

### Serverless Framework
```bash
cd example/sls
npm install
sls deploy
```

## Notes

This module is a fork of Gunnar Grosch's [failure-lambda](https://github.com/gunnargrosch/failure-lambda).

Inspired by Yan Cui's articles on latency injection for AWS Lambda (https://hackernoon.com/chaos-engineering-and-aws-lambda-latency-injection-ddeb4ff8d983) and Adrian Hornsby's chaos injection library for Python (https://github.com/adhorn/aws-lambda-chaos-injection/).
