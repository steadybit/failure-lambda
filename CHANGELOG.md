# Changelog

## 2024-xx-xx (next release) v0.5.0

- Updated dependencies.
- Disable mitm in case of an exception. ([PR](https://github.com/steadybit/failure-lambda/pull/12))

---

# Changelog before fork

## 2022-02-14 v0.4.4

- Switch to node-fetch@2.

## 2022-02-14 v0.4.3

- Updated dependencies.

## 2021-03-16 v0.4.2

- Puts the mitm object in the library global namespace so that it persists across function invocations.
- Syntax formatting.

## 2020-10-26 v0.4.1

- Made AppConfig Lambda extension port configurable using environment variable.

## 2020-10-25 v0.4.0

- Added optional support for AWS AppConfig, allowing to validate failure configuration, deploy configuration using gradual or non-gradual deploy strategy, monitor deployed configuration with automatical rollback if CloudWatch Alarms is configured, and caching of configuration.
- Hardcoded default configuration with `isEnabled: false`, to use if issues loading configuration from Parameter Store or AppConfig.

## 2020-10-21 v0.3.1

- Change mitm mode back to connect to fix issue with all connections being blocked.

## 2020-08-24 v0.3.0

- Changed mitm mode from connect to connection for quicker enable/disable of failure injection.
- Renamed block list failure injection to denylist (breaking change for that failure mode).
- Updated dependencies.

## 2020-02-17 v0.2.0

- Added block list failure.
- Updated example application to store file in S3 and item in DynamoDB.

## 2020-02-13 v0.1.1

- Fixed issue with exception injection not throwing the exception.

## 2019-12-30 v0.1.0

- Added disk space failure.
- Updated example application to store example file in tmp.

## 2019-12-23 v0.0.1

- Initial release
