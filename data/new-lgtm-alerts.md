# Summary
| Rule ID | New alerts | True positives | False positives |
| --- | :---: | :---: | :---: |
| [js/command-line-injection](#commandlineinjection) | 2 | 2 | 0 |
| [js/file-access-to-http](#fileaccesstohttp) | 64 | 5+ | 0+ |
| [js/path-injection](#pathinjection) | 29 | 3+ | 2+ |
| [js/reflected-xss](#reflectedxss) | 5 | 4 | 1 |
| [js/regex-injection](#regexinjection) | 13 | 4+ | 1+ |
| [js/remote-property-injection](#remotepropertyinjection) | 20 | 5+ | 0+ |
| [js/user-controlled-bypass](#usercontrolledbypass) | 2 | 0 | 2 |
| [js/xss](xss) | 1 | 1 | 0 |
| Total | 136 | 24+ | 6+ |

# Details

Below, we list the new alerts organized by the project in which they were found, with links to the corresponding source locations on GitHub.

**Note**: Two projects, https://github.com/alejandroMonroy/curso-node-heroku and https://github.com/ninjapanda47/finders-fee-deploy, have been deleted from GitHub since we did our initial experiments and hence cannot be included. They each contained two new alerts form `js/file-access-to-http`, so the total number of new alerts for this rule shown below is 60 instead of the 64 mentioned in the table above.

## <a name="commandlineinjection"></a> + js\/command-line-injection (2)
### + js\/command-line-injection for davros (1)
  - [davros: server\/publishing.js:33:19:33:73](https://github.com/mnutt/davros/blob/d9896a7e957f6964ae94cfe6bf10c46efdca9455/server/publishing.js#L33) [true positive]
    ```js
    //    if(stat) {
    //      var sessionId = req.headers['x-sandstorm-session-id'];
            return exec("./sandstorm-integration/bin/getPublicId " + sessionId);
    //    }
    //  }).then((result) => {
    ```
    - This command depends on \[a user-provided value\]\(1\).
    - Related locations:
      - (1) [davros: server\/publishing.js:32:23:32:60](https://github.com/mnutt/davros/blob/d9896a7e957f6964ae94cfe6bf10c46efdca9455/server/publishing.js#L32)
### + js\/command-line-injection for new18 (1)
  - [new18: screenshot-server\/index.js:43:14:43:17](https://github.com/wrenth04/new18/blob/229a72cb5b47251343a44805e331134d8de8a334/screenshot-server/index.js#L43) [true positive]
    ```js
    //    .replace(/jpg/g, namejpg);
    //
        await exec(cmd);
    //  await exec(resizeCmd);
    //
    ```
    - This command depends on \[a user-provided value\]\(1\).
    - Related locations:
      - (1) [new18: screenshot-server\/index.js:35:21:35:28](https://github.com/wrenth04/new18/blob/229a72cb5b47251343a44805e331134d8de8a334/screenshot-server/index.js#L35)
##  <a name="fileaccesstohttp"></a> + js\/file-access-to-http (60)
### + js\/file-access-to-http for tootspace-s3 (5)
  - [tootspace-s3: server.js:58:13:58:56](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L58) [true positive]
    ```js
    //    var existsPath = prefix + '.exists';
    //
          request({url: bucketBase + accountPath, json: true}, function (err, resp, body) {
    //      // Check for existing registration
    //      if (200 === resp.statusCode) {
    ```
    - \[File data\]\(1\) flows directly to outbound network request
    - \[File data\]\(2\) flows directly to outbound network request
    - Related locations:
      - (1) [tootspace-s3: server.js:190:16:190:51](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L190)
      - (2) [tootspace-s3: server.js:190:16:190:51](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L190)
  - [tootspace-s3: server.js:58:19:58:43](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L58) [true positive]
    ```js
    //    var existsPath = prefix + '.exists';
    //
          request({url: bucketBase + accountPath, json: true}, function (err, resp, body) {
    //      // Check for existing registration
    //      if (200 === resp.statusCode) {
    ```
    - \[File data\]\(1\) flows directly to outbound network request
    - \[File data\]\(2\) flows directly to outbound network request
    - Related locations:
      - (1) [tootspace-s3: server.js:190:16:190:51](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L190)
      - (2) [tootspace-s3: server.js:190:16:190:51](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L190)
  - [tootspace-s3: server.js:67:15:67:38](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L67) [true positive]
    ```js
    //      }
    //
            request(bucketBase + existsPath, function (err, resp, body) {
    //        // Check for taken nickname
    //        if (200 === resp.statusCode) {
    ```
    - \[File data\]\(1\) flows directly to outbound network request
    - \[File data\]\(2\) flows directly to outbound network request
    - Related locations:
      - (1) [tootspace-s3: server.js:190:16:190:51](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L190)
      - (2) [tootspace-s3: server.js:190:16:190:51](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L190)
  - [tootspace-s3: server.js:127:13:130:6](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L127) [true positive]
    ```js
    //    var accountPath = '/users/amazon/' + user_id + '.json';
    //
          request({
    //      url: bucketBase + accountPath,
    //      json: true
    ```
    - \[File data\]\(1\) flows directly to outbound network request
    - \[File data\]\(2\) flows directly to outbound network request
    - Related locations:
      - (1) [tootspace-s3: server.js:190:16:190:51](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L190)
      - (2) [tootspace-s3: server.js:190:16:190:51](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L190)
  - [tootspace-s3: server.js:128:12:128:36](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L128) [true positive]
    ```js
    //
    //    request({
            url: bucketBase + accountPath,
    //      json: true
    //    }, function (err, resp, body) {
    ```
    - \[File data\]\(1\) flows directly to outbound network request
    - \[File data\]\(2\) flows directly to outbound network request
    - Related locations:
      - (1) [tootspace-s3: server.js:190:16:190:51](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L190)
      - (2) [tootspace-s3: server.js:190:16:190:51](https://github.com/lmorchard/tootspace-s3/blob/b8c717c3611c3e9673e70ba338427e38afefbdd8/server.js#L190)
### + js\/file-access-to-http for DO080 (2)
  - [DO080: apps\/hexboard\/server\/hexboard\/pod.js:114:26:114:41](https://github.com/Dnefedkin/DO080/blob/604b1f1e544ec8860046f4314db0924cc52adb1f/apps/hexboard/server/hexboard/pod.js#L114)
    ```js
    //    delete env.watchOptions.qs.latestResourceVersion;
    //    console.log(tag, 'list options', env.listOptions.url);
          var stream = request(env.listOptions, function(error, response, body) {
    //      if (error) {
    //        console.log(tag, 'error:',error);
    ```
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [DO080: apps\/hexboard\/node\_modules\/config-multipaas\/node\_modules\/config-chain\/index.js:66:15:66:44](https://github.com/Dnefedkin/DO080/blob/604b1f1e544ec8860046f4314db0924cc52adb1f/apps/hexboard/node_modules/config-multipaas/node_modules/config-chain/index.js#L66)
  - [DO080: apps\/hexboard\/server\/hexboard\/pod.js:153:26:153:42](https://github.com/Dnefedkin/DO080/blob/604b1f1e544ec8860046f4314db0924cc52adb1f/apps/hexboard/server/hexboard/pod.js#L153)
    ```js
    //  return Rx.Observable.create(function(observer) {
    //    console.log(tag, 'watch options', env.watchOptions.url, env.watchOptions.qs);
          var stream = request(env.watchOptions);
    //    stream.on('error', function(error) {
    //      console.log(tag, 'error:', error);
    ```
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [DO080: apps\/hexboard\/node\_modules\/config-multipaas\/node\_modules\/config-chain\/index.js:66:15:66:44](https://github.com/Dnefedkin/DO080/blob/604b1f1e544ec8860046f4314db0924cc52adb1f/apps/hexboard/node_modules/config-multipaas/node_modules/config-chain/index.js#L66)
### + js\/file-access-to-http for onepage-opensource (2)
  - [onepage-opensource: node\_modules\/nodemon\/node\_modules\/update-notifier\/node\_modules\/latest-version\/node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/18F/onepage-opensource/blob/3e9600d6c594a75ee4280ad608736332631d4798/node_modules/nodemon/node_modules/update-notifier/node_modules/latest-version/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [onepage-opensource: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/18F/onepage-opensource/blob/3e9600d6c594a75ee4280ad608736332631d4798/node_modules/nodemon/bin/nodemon.js#L13)
  - [onepage-opensource: node\_modules\/nodemon\/node\_modules\/update-notifier\/node\_modules\/latest-version\/node\_modules\/package-json\/node\_modules\/got\/index.js:136:24:136:28](https://github.com/18F/onepage-opensource/blob/3e9600d6c594a75ee4280ad608736332631d4798/node_modules/nodemon/node_modules/update-notifier/node_modules/latest-version/node_modules/package-json/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [onepage-opensource: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/18F/onepage-opensource/blob/3e9600d6c594a75ee4280ad608736332631d4798/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for practice (3)
  - [practice: nodejs\_test\/koa2\/HelloKoa2\/node\_modules\/got\/index.js:136:24:136:28](https://github.com/381510688/practice/blob/5cdfdd2221afb6e9f90082682bd747e8231d2f41/nodejs_test/koa2/HelloKoa2/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [practice: nodejs\_test\/koa2\/HelloKoa2\/node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/381510688/practice/blob/5cdfdd2221afb6e9f90082682bd747e8231d2f41/nodejs_test/koa2/HelloKoa2/node_modules/nodemon/bin/nodemon.js#L13)
  - [practice: nodejs\_test\/koa2\/HelloKoa2\/node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/381510688/practice/blob/5cdfdd2221afb6e9f90082682bd747e8231d2f41/nodejs_test/koa2/HelloKoa2/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [practice: nodejs\_test\/koa2\/HelloKoa2\/node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/381510688/practice/blob/5cdfdd2221afb6e9f90082682bd747e8231d2f41/nodejs_test/koa2/HelloKoa2/node_modules/nodemon/bin/nodemon.js#L13)
  - [practice: vue-test\/node\_modules\/agent-base\/patch-core.js:52:32:52:39](https://github.com/381510688/practice/blob/5cdfdd2221afb6e9f90082682bd747e8231d2f41/vue-test/node_modules/agent-base/patch-core.js#L52)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [practice: nodejs\_test\/koa2\/HelloKoa2\/node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/381510688/practice/blob/5cdfdd2221afb6e9f90082682bd747e8231d2f41/nodejs_test/koa2/HelloKoa2/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for api-rest-example (2)
  - [api-rest-example: node\_modules\/got\/index.js:136:24:136:28](https://github.com/AlvaroDelgadillo/api-rest-example/blob/92620011e3dd36bee387cbc45925517cc4ce0054/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [api-rest-example: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/AlvaroDelgadillo/api-rest-example/blob/92620011e3dd36bee387cbc45925517cc4ce0054/node_modules/nodemon/bin/nodemon.js#L13)
  - [api-rest-example: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/AlvaroDelgadillo/api-rest-example/blob/92620011e3dd36bee387cbc45925517cc4ce0054/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [api-rest-example: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/AlvaroDelgadillo/api-rest-example/blob/92620011e3dd36bee387cbc45925517cc4ce0054/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for CleanOutLoudWeb (2)
  - [CleanOutLoudWeb: node\_modules\/got\/index.js:136:24:136:28](https://github.com/Hoppe2808/CleanOutLoudWeb/blob/b398e11a2f425b2f9c2fd21052f43643f47f41c0/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [CleanOutLoudWeb: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/Hoppe2808/CleanOutLoudWeb/blob/b398e11a2f425b2f9c2fd21052f43643f47f41c0/node_modules/nodemon/bin/nodemon.js#L13)
  - [CleanOutLoudWeb: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/Hoppe2808/CleanOutLoudWeb/blob/b398e11a2f425b2f9c2fd21052f43643f47f41c0/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [CleanOutLoudWeb: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/Hoppe2808/CleanOutLoudWeb/blob/b398e11a2f425b2f9c2fd21052f43643f47f41c0/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for local-doc (2)
  - [local-doc: node\_modules\/got\/index.js:136:24:136:28](https://github.com/JPinkney/local-doc/blob/84b0496586a8f2a88ae4028238fe7b10b5e3dc35/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [local-doc: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/JPinkney/local-doc/blob/84b0496586a8f2a88ae4028238fe7b10b5e3dc35/node_modules/nodemon/bin/nodemon.js#L13)
  - [local-doc: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/JPinkney/local-doc/blob/84b0496586a8f2a88ae4028238fe7b10b5e3dc35/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [local-doc: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/JPinkney/local-doc/blob/84b0496586a8f2a88ae4028238fe7b10b5e3dc35/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for CodaisseurAdvancedSession_API (2)
  - [CodaisseurAdvancedSession\_API: node\_modules\/got\/index.js:136:24:136:28](https://github.com/JTBreunissen/CodaisseurAdvancedSession_API/blob/2b9ddceadc3a94b540ef14c7f891f012700ecbb5/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [CodaisseurAdvancedSession\_API: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/JTBreunissen/CodaisseurAdvancedSession_API/blob/2b9ddceadc3a94b540ef14c7f891f012700ecbb5/node_modules/nodemon/bin/nodemon.js#L13)
  - [CodaisseurAdvancedSession\_API: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/JTBreunissen/CodaisseurAdvancedSession_API/blob/2b9ddceadc3a94b540ef14c7f891f012700ecbb5/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [CodaisseurAdvancedSession\_API: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/JTBreunissen/CodaisseurAdvancedSession_API/blob/2b9ddceadc3a94b540ef14c7f891f012700ecbb5/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for guodaddy (2)
  - [guodaddy: node\_modules\/got\/index.js:136:24:136:28](https://github.com/JoshuaKomala/guodaddy/blob/39a0f9649afd3711be4b5b92c11752f8a3e917d2/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [guodaddy: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/JoshuaKomala/guodaddy/blob/39a0f9649afd3711be4b5b92c11752f8a3e917d2/node_modules/nodemon/bin/nodemon.js#L13)
  - [guodaddy: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/JoshuaKomala/guodaddy/blob/39a0f9649afd3711be4b5b92c11752f8a3e917d2/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [guodaddy: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/JoshuaKomala/guodaddy/blob/39a0f9649afd3711be4b5b92c11752f8a3e917d2/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for trippinceylon-backend (2)
  - [trippinceylon-backend: node\_modules\/got\/index.js:136:24:136:28](https://github.com/SamPiy93/trippinceylon-backend/blob/bd3d548f0eda8a249f7567eb9c826ba032aef111/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [trippinceylon-backend: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/SamPiy93/trippinceylon-backend/blob/bd3d548f0eda8a249f7567eb9c826ba032aef111/node_modules/nodemon/bin/nodemon.js#L13)
  - [trippinceylon-backend: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/SamPiy93/trippinceylon-backend/blob/bd3d548f0eda8a249f7567eb9c826ba032aef111/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [trippinceylon-backend: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/SamPiy93/trippinceylon-backend/blob/bd3d548f0eda8a249f7567eb9c826ba032aef111/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for omdbclone (2)
  - [omdbclone: node\_modules\/got\/index.js:136:24:136:28](https://github.com/abhisharkjangir/omdbclone/blob/e8d7ef794648ad2e5f9de7ec98e939d0d16e1e37/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [omdbclone: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/abhisharkjangir/omdbclone/blob/e8d7ef794648ad2e5f9de7ec98e939d0d16e1e37/node_modules/nodemon/bin/nodemon.js#L13)
  - [omdbclone: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/abhisharkjangir/omdbclone/blob/e8d7ef794648ad2e5f9de7ec98e939d0d16e1e37/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [omdbclone: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/abhisharkjangir/omdbclone/blob/e8d7ef794648ad2e5f9de7ec98e939d0d16e1e37/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for socket-middleware (2)
  - [socket-middleware: node\_modules\/got\/index.js:136:24:136:28](https://github.com/abhishekg785/socket-middleware/blob/0f3596c4d585a57d69aff296e1200790e3eeddca/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [socket-middleware: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/abhishekg785/socket-middleware/blob/0f3596c4d585a57d69aff296e1200790e3eeddca/node_modules/nodemon/bin/nodemon.js#L13)
  - [socket-middleware: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/abhishekg785/socket-middleware/blob/0f3596c4d585a57d69aff296e1200790e3eeddca/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [socket-middleware: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/abhishekg785/socket-middleware/blob/0f3596c4d585a57d69aff296e1200790e3eeddca/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for document-download-prototypes (2)
  - [document-download-prototypes: node\_modules\/got\/index.js:136:24:136:28](https://github.com/alphagov/document-download-prototypes/blob/db1e7d56ec69c57ed848f28029b4f10c78a90720/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [document-download-prototypes: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/alphagov/document-download-prototypes/blob/db1e7d56ec69c57ed848f28029b4f10c78a90720/node_modules/nodemon/bin/nodemon.js#L13)
  - [document-download-prototypes: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/alphagov/document-download-prototypes/blob/db1e7d56ec69c57ed848f28029b4f10c78a90720/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [document-download-prototypes: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/alphagov/document-download-prototypes/blob/db1e7d56ec69c57ed848f28029b4f10c78a90720/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for myReactTemplate (2)
  - [myReactTemplate: graphql-server\/node\_modules\/got\/index.js:136:24:136:28](https://github.com/avinashsivaraman/myReactTemplate/blob/c511461d3a93b7aebf60637b8028a1da23470eed/graphql-server/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [myReactTemplate: graphql-server\/node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/avinashsivaraman/myReactTemplate/blob/c511461d3a93b7aebf60637b8028a1da23470eed/graphql-server/node_modules/nodemon/bin/nodemon.js#L13)
  - [myReactTemplate: graphql-server\/node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/avinashsivaraman/myReactTemplate/blob/c511461d3a93b7aebf60637b8028a1da23470eed/graphql-server/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [myReactTemplate: graphql-server\/node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/avinashsivaraman/myReactTemplate/blob/c511461d3a93b7aebf60637b8028a1da23470eed/graphql-server/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for lipdnet (2)
  - [lipdnet: website\/node\_modules\/nodemon\/node\_modules\/update-notifier\/node\_modules\/latest-version\/node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/chrismheiser/lipdnet/blob/6d322111d420e79e1ebfabe6938bb1c86c679d83/website/node_modules/nodemon/node_modules/update-notifier/node_modules/latest-version/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [lipdnet: website\/node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/chrismheiser/lipdnet/blob/6d322111d420e79e1ebfabe6938bb1c86c679d83/website/node_modules/nodemon/bin/nodemon.js#L13)
  - [lipdnet: website\/node\_modules\/nodemon\/node\_modules\/update-notifier\/node\_modules\/latest-version\/node\_modules\/package-json\/node\_modules\/got\/index.js:136:24:136:28](https://github.com/chrismheiser/lipdnet/blob/6d322111d420e79e1ebfabe6938bb1c86c679d83/website/node_modules/nodemon/node_modules/update-notifier/node_modules/latest-version/node_modules/package-json/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [lipdnet: website\/node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/chrismheiser/lipdnet/blob/6d322111d420e79e1ebfabe6938bb1c86c679d83/website/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for Auction_Project (2)
  - [Auction\_Project: node\_modules\/got\/index.js:136:24:136:28](https://github.com/emlop/Auction_Project/blob/a6dee151995f19b000010d6f8d5d76f40bd2ca2d/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [Auction\_Project: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/emlop/Auction_Project/blob/a6dee151995f19b000010d6f8d5d76f40bd2ca2d/node_modules/nodemon/bin/nodemon.js#L13)
  - [Auction\_Project: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/emlop/Auction_Project/blob/a6dee151995f19b000010d6f8d5d76f40bd2ca2d/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [Auction\_Project: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/emlop/Auction_Project/blob/a6dee151995f19b000010d6f8d5d76f40bd2ca2d/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for cradle (2)
  - [cradle: test\/helpers\/seed.js:33:15:37:8](https://github.com/flatiron/cradle/blob/1042ee4774ce7be862d2bbad01a33842a65a4a36/test/helpers/seed.js#L33)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [cradle: test\/helpers\/seed.js:7:28:7:109](https://github.com/flatiron/cradle/blob/1042ee4774ce7be862d2bbad01a33842a65a4a36/test/helpers/seed.js#L7)
  - [cradle: test\/helpers\/seed.js:35:14:35:81](https://github.com/flatiron/cradle/blob/1042ee4774ce7be862d2bbad01a33842a65a4a36/test/helpers/seed.js#L35)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [cradle: test\/helpers\/seed.js:7:28:7:109](https://github.com/flatiron/cradle/blob/1042ee4774ce7be862d2bbad01a33842a65a4a36/test/helpers/seed.js#L7)
### + js\/file-access-to-http for koa2-angular-mongodb (2)
  - [koa2-angular-mongodb: node\_modules\/got\/index.js:136:24:136:28](https://github.com/i5coding/koa2-angular-mongodb/blob/6b17c65ba5c7ebae045575dd5153ddb4b14732e6/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [koa2-angular-mongodb: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/i5coding/koa2-angular-mongodb/blob/6b17c65ba5c7ebae045575dd5153ddb4b14732e6/node_modules/nodemon/bin/nodemon.js#L13)
  - [koa2-angular-mongodb: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/i5coding/koa2-angular-mongodb/blob/6b17c65ba5c7ebae045575dd5153ddb4b14732e6/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [koa2-angular-mongodb: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/i5coding/koa2-angular-mongodb/blob/6b17c65ba5c7ebae045575dd5153ddb4b14732e6/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for light-bootstrap-dashboard (2)
  - [light-bootstrap-dashboard: node\_modules\/got\/index.js:136:24:136:28](https://github.com/indeu/light-bootstrap-dashboard/blob/6e025ac13fab310291a77e26794623983c6ebf4a/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [light-bootstrap-dashboard: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/indeu/light-bootstrap-dashboard/blob/6e025ac13fab310291a77e26794623983c6ebf4a/node_modules/nodemon/bin/nodemon.js#L13)
  - [light-bootstrap-dashboard: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/indeu/light-bootstrap-dashboard/blob/6e025ac13fab310291a77e26794623983c6ebf4a/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [light-bootstrap-dashboard: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/indeu/light-bootstrap-dashboard/blob/6e025ac13fab310291a77e26794623983c6ebf4a/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for bamnode (2)
  - [bamnode: node\_modules\/got\/index.js:136:24:136:28](https://github.com/juliofalbo/bamnode/blob/02e78bef3ace5c8150957b7f2202beee00fd6c81/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [bamnode: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/juliofalbo/bamnode/blob/02e78bef3ace5c8150957b7f2202beee00fd6c81/node_modules/nodemon/bin/nodemon.js#L13)
  - [bamnode: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/juliofalbo/bamnode/blob/02e78bef3ace5c8150957b7f2202beee00fd6c81/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [bamnode: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/juliofalbo/bamnode/blob/02e78bef3ace5c8150957b7f2202beee00fd6c81/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for felinorte (2)
  - [felinorte: node\_modules\/got\/index.js:136:24:136:28](https://github.com/krthr/felinorte/blob/5f1514b2c1270c68c8ae9218d046dba190bdc042/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [felinorte: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/krthr/felinorte/blob/5f1514b2c1270c68c8ae9218d046dba190bdc042/node_modules/nodemon/bin/nodemon.js#L13)
  - [felinorte: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/krthr/felinorte/blob/5f1514b2c1270c68c8ae9218d046dba190bdc042/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [felinorte: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/krthr/felinorte/blob/5f1514b2c1270c68c8ae9218d046dba190bdc042/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for Ironshop (2)
  - [Ironshop: node\_modules\/got\/index.js:136:24:136:28](https://github.com/mariapottage/Ironshop/blob/1735c64bbe1fa01b0ccf99b888cc0fef8d8784b6/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [Ironshop: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/mariapottage/Ironshop/blob/1735c64bbe1fa01b0ccf99b888cc0fef8d8784b6/node_modules/nodemon/bin/nodemon.js#L13)
  - [Ironshop: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/mariapottage/Ironshop/blob/1735c64bbe1fa01b0ccf99b888cc0fef8d8784b6/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [Ironshop: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/mariapottage/Ironshop/blob/1735c64bbe1fa01b0ccf99b888cc0fef8d8784b6/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for drawGuess (2)
  - [drawGuess: drawGuess-api\/node\_modules\/got\/index.js:136:24:136:28](https://github.com/mysteriousLee/drawGuess/blob/bb627290ba4372a958de61c88969f9636618911f/drawGuess-api/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [drawGuess: drawGuess-api\/node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/mysteriousLee/drawGuess/blob/bb627290ba4372a958de61c88969f9636618911f/drawGuess-api/node_modules/nodemon/bin/nodemon.js#L13)
  - [drawGuess: drawGuess-api\/node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/mysteriousLee/drawGuess/blob/bb627290ba4372a958de61c88969f9636618911f/drawGuess-api/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [drawGuess: drawGuess-api\/node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/mysteriousLee/drawGuess/blob/bb627290ba4372a958de61c88969f9636618911f/drawGuess-api/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for c2s-use-current-location-prototype (2)
  - [c2s-use-current-location-prototype: node\_modules\/got\/index.js:136:24:136:28](https://github.com/nhsuk/c2s-use-current-location-prototype/blob/b008c98bdb62ad15fcb6d818be9b3053c76d88d9/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [c2s-use-current-location-prototype: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/nhsuk/c2s-use-current-location-prototype/blob/b008c98bdb62ad15fcb6d818be9b3053c76d88d9/node_modules/nodemon/bin/nodemon.js#L13)
  - [c2s-use-current-location-prototype: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/nhsuk/c2s-use-current-location-prototype/blob/b008c98bdb62ad15fcb6d818be9b3053c76d88d9/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [c2s-use-current-location-prototype: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/nhsuk/c2s-use-current-location-prototype/blob/b008c98bdb62ad15fcb6d818be9b3053c76d88d9/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for AroundTheWODTEST (2)
  - [AroundTheWODTEST: node\_modules\/got\/index.js:136:24:136:28](https://github.com/nicolaGuerrieri/AroundTheWODTEST/blob/15f197154ee2b49623e18940abef49f13120b26a/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [AroundTheWODTEST: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/nicolaGuerrieri/AroundTheWODTEST/blob/15f197154ee2b49623e18940abef49f13120b26a/node_modules/nodemon/bin/nodemon.js#L13)
  - [AroundTheWODTEST: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/nicolaGuerrieri/AroundTheWODTEST/blob/15f197154ee2b49623e18940abef49f13120b26a/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [AroundTheWODTEST: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/nicolaGuerrieri/AroundTheWODTEST/blob/15f197154ee2b49623e18940abef49f13120b26a/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for HealthCareSystem (2)
  - [HealthCareSystem: node\_modules\/got\/index.js:136:24:136:28](https://github.com/orionkoepke/HealthCareSystem/blob/df946c92f0640b64615d37b6b5065f0aecab7d7c/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [HealthCareSystem: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/orionkoepke/HealthCareSystem/blob/df946c92f0640b64615d37b6b5065f0aecab7d7c/node_modules/nodemon/bin/nodemon.js#L13)
  - [HealthCareSystem: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/orionkoepke/HealthCareSystem/blob/df946c92f0640b64615d37b6b5065f0aecab7d7c/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [HealthCareSystem: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/orionkoepke/HealthCareSystem/blob/df946c92f0640b64615d37b6b5065f0aecab7d7c/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for pay-link-set-up (2)
  - [pay-link-set-up: node\_modules\/got\/index.js:136:24:136:28](https://github.com/stephenjoe1/pay-link-set-up/blob/0e37f99e5a9a9ad121d085f13582fc9ef28f052a/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [pay-link-set-up: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/stephenjoe1/pay-link-set-up/blob/0e37f99e5a9a9ad121d085f13582fc9ef28f052a/node_modules/nodemon/bin/nodemon.js#L13)
  - [pay-link-set-up: node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/stephenjoe1/pay-link-set-up/blob/0e37f99e5a9a9ad121d085f13582fc9ef28f052a/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [pay-link-set-up: node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/stephenjoe1/pay-link-set-up/blob/0e37f99e5a9a9ad121d085f13582fc9ef28f052a/node_modules/nodemon/bin/nodemon.js#L13)
### + js\/file-access-to-http for Node-Angular (2)
  - [Node-Angular: userStory\/node\_modules\/got\/index.js:136:24:136:28](https://github.com/tjtanvir666/Node-Angular/blob/fb58fb3ebf737ef4bd0947e185bc21b1e6a190c6/userStory/node_modules/got/index.js#L136)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [Node-Angular: userStory\/node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/tjtanvir666/Node-Angular/blob/fb58fb3ebf737ef4bd0947e185bc21b1e6a190c6/userStory/node_modules/nodemon/bin/nodemon.js#L13)
  - [Node-Angular: userStory\/node\_modules\/package-json\/index.js:6:6:6:9](https://github.com/tjtanvir666/Node-Angular/blob/fb58fb3ebf737ef4bd0947e185bc21b1e6a190c6/userStory/node_modules/package-json/index.js#L6)
    - \[File data\]\(1\) flows directly to outbound network request
    - Related locations:
      - (1) [Node-Angular: userStory\/node\_modules\/nodemon\/bin\/nodemon.js:13:22:13:69](https://github.com/tjtanvir666/Node-Angular/blob/fb58fb3ebf737ef4bd0947e185bc21b1e6a190c6/userStory/node_modules/nodemon/bin/nodemon.js#L13)
##  <a name="pathinjection"></a> + js\/path-injection (29)
### + js\/path-injection for server-examples (1)
  - [server-examples: nodejs\/nodejs.js:134:12:134:23](https://github.com/FineUploader/server-examples/blob/3ada78700b8d913be5ad8c9ddf3183c9a23e7fe6/nodejs/nodejs.js#L134) [true positive]
    ```js
    //        dirToDelete = uploadedFilesPath + uuid;
    //
          rimraf(dirToDelete, function(error) {
    //        if (error) {
    //            console.error("Problem deleting file! " + error);
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - Related locations:
      - (1) [server-examples: nodejs\/nodejs.js:131:16:131:31](https://github.com/FineUploader/server-examples/blob/3ada78700b8d913be5ad8c9ddf3183c9a23e7fe6/nodejs/nodejs.js#L131)
      - (2) [server-examples: nodejs\/nodejs.js:131:16:131:31](https://github.com/FineUploader/server-examples/blob/3ada78700b8d913be5ad8c9ddf3183c9a23e7fe6/nodejs/nodejs.js#L131)
      - (3) [server-examples: nodejs\/nodejs.js:131:16:131:31](https://github.com/FineUploader/server-examples/blob/3ada78700b8d913be5ad8c9ddf3183c9a23e7fe6/nodejs/nodejs.js#L131)
### + js\/path-injection for ungit (2)
  - [ungit: source\/git-api.js:597:21:597:71](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L597) [false positive due to analysis imprecision]
    ```js
    //      .then(gitPromise.bind(null, ['rm', '-f', req.query.submoduleName], req.query.path))
    //      .then(() => {
              rimraf.sync(path.join(req.query.path, req.query.submodulePath));
    //        rimraf.sync(path.join(req.query.path, '.git', 'modules', req.query.submodulePath));
    //      });
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - This path depends on \[a user-provided value\]\(5\).
    - This path depends on \[a user-provided value\]\(6\).
    - This path depends on \[a user-provided value\]\(7\).
    - Related locations:
      - (1) [ungit: source\/git-api.js:597:31:597:45](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L597)
      - (2) [ungit: source\/git-api.js:597:31:597:45](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L597)
      - (3) [ungit: source\/git-api.js:597:31:597:45](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L597)
      - (4) [ungit: source\/git-api.js:597:31:597:45](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L597)
      - (5) [ungit: source\/git-api.js:597:47:597:70](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L597)
      - (6) [ungit: source\/git-api.js:597:47:597:70](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L597)
      - (7) [ungit: source\/git-api.js:597:47:597:70](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L597)
  - [ungit: source\/git-api.js:598:21:598:90](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L598) [false positive due to analysis imprecision]
    ```js
    //      .then(() => {
    //        rimraf.sync(path.join(req.query.path, req.query.submodulePath));
              rimraf.sync(path.join(req.query.path, '.git', 'modules', req.query.submodulePath));
    //      });
    //
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - This path depends on \[a user-provided value\]\(5\).
    - This path depends on \[a user-provided value\]\(6\).
    - This path depends on \[a user-provided value\]\(7\).
    - Related locations:
      - (1) [ungit: source\/git-api.js:598:31:598:45](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L598)
      - (2) [ungit: source\/git-api.js:598:31:598:45](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L598)
      - (3) [ungit: source\/git-api.js:598:31:598:45](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L598)
      - (4) [ungit: source\/git-api.js:598:31:598:45](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L598)
      - (5) [ungit: source\/git-api.js:598:66:598:89](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L598)
      - (6) [ungit: source\/git-api.js:598:66:598:89](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L598)
      - (7) [ungit: source\/git-api.js:598:66:598:89](https://github.com/FredrikNoren/ungit/blob/c3163d116f5f566565f3099859d5fbd00534ea0d/source/git-api.js#L598)
### + js\/path-injection for chrome (1)
  - [chrome: src\/routes.ts:158:12:158:20](https://github.com/browserless/chrome/blob/b864b2d781406733aed28fa705bdf93daacaea57/src/routes.ts#L158) [true positive]
    ```ts
    //    }
    //
          rimraf(filePath, _.noop);
    //
    //    return res.sendStatus(204);
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - Related locations:
      - (1) [chrome: src\/routes.ts:145:18:145:31](https://github.com/browserless/chrome/blob/b864b2d781406733aed28fa705bdf93daacaea57/src/routes.ts#L145)
      - (2) [chrome: src\/routes.ts:145:18:145:31](https://github.com/browserless/chrome/blob/b864b2d781406733aed28fa705bdf93daacaea57/src/routes.ts#L145)
      - (3) [chrome: src\/routes.ts:145:18:145:31](https://github.com/browserless/chrome/blob/b864b2d781406733aed28fa705bdf93daacaea57/src/routes.ts#L145)
### + js\/path-injection for DockerSecurityPlayground (9)
  - [DockerSecurityPlayground: app\/data\/labels.js:60:31:60:40](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/data/labels.js#L60) [true positive]
    ```js
    //  async.waterfall([
    //    // If success open JSON File
          (cb) => jsonfile.readFile(labelname, cb),
    //  ],
    //  // Ok it's terminated with an   array of objects
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - This path depends on \[a user-provided value\]\(5\).
    - This path depends on \[a user-provided value\]\(6\).
    - This path depends on \[a user-provided value\]\(7\).
    - This path depends on \[a user-provided value\]\(8\).
    - This path depends on \[a user-provided value\]\(9\).
    - This path depends on \[a user-provided value\]\(10\).
    - ... (5 more messages)
    - Related locations:
      - (1) [DockerSecurityPlayground: app\/handlers\/labels.js:29:39:29:54](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L29)
      - (2) [DockerSecurityPlayground: app\/handlers\/labels.js:29:39:29:54](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L29)
      - (3) [DockerSecurityPlayground: app\/handlers\/labels.js:29:39:29:54](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L29)
      - (4) [DockerSecurityPlayground: app\/handlers\/labels.js:29:56:29:74](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L29)
      - (5) [DockerSecurityPlayground: app\/handlers\/labels.js:29:56:29:74](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L29)
      - (6) [DockerSecurityPlayground: app\/handlers\/labels.js:29:56:29:74](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L29)
      - (7) [DockerSecurityPlayground: app\/handlers\/labels.js:46:55:46:70](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L46)
      - (8) [DockerSecurityPlayground: app\/handlers\/labels.js:46:55:46:70](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L46)
      - (9) [DockerSecurityPlayground: app\/handlers\/labels.js:46:55:46:70](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L46)
      - (10) [DockerSecurityPlayground: app\/handlers\/labels.js:67:55:67:70](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L67)
      - ... (5 more related locations)
  - [DockerSecurityPlayground: app\/data\/labels.js:76:31:76:40](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/data/labels.js#L76)
    ```js
    //  labelname = labelname || '';
    //  async.waterfall([
          (cb) => jsonfile.readFile(labelname, cb),
    //    // Now update array
    //    (jsonObj, cb) => {
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - This path depends on \[a user-provided value\]\(5\).
    - This path depends on \[a user-provided value\]\(6\).
    - This path depends on \[a user-provided value\]\(7\).
    - This path depends on \[a user-provided value\]\(8\).
    - This path depends on \[a user-provided value\]\(9\).
    - This path depends on \[a user-provided value\]\(10\).
    - ... (8 more messages)
    - Related locations:
      - (1) [DockerSecurityPlayground: app\/handlers\/labels.js:106:55:106:70](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L106)
      - (2) [DockerSecurityPlayground: app\/handlers\/labels.js:106:55:106:70](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L106)
      - (3) [DockerSecurityPlayground: app\/handlers\/labels.js:106:55:106:70](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L106)
      - (4) [DockerSecurityPlayground: app\/handlers\/labels.js:133:55:133:70](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L133)
      - (5) [DockerSecurityPlayground: app\/handlers\/labels.js:133:55:133:70](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L133)
      - (6) [DockerSecurityPlayground: app\/handlers\/labels.js:133:55:133:70](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labels.js#L133)
      - (7) [DockerSecurityPlayground: app\/handlers\/labs.js:160:17:160:25](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L160)
      - (8) [DockerSecurityPlayground: app\/handlers\/labs.js:160:17:160:25](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L160)
      - (9) [DockerSecurityPlayground: app\/handlers\/labs.js:160:17:160:25](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L160)
      - (10) [DockerSecurityPlayground: app\/handlers\/labs.js:164:19:164:27](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L164)
      - ... (8 more related locations)
  - [DockerSecurityPlayground: app\/data\/labs.js:109:14:109:39](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/data/labs.js#L109)
    ```js
    //    (up, cb) => {
    //      userPath = up;
            rimraf(path.join(userPath, name), cb);
    //    },
    //    (cb) => LabStates.exists(path.basename(userPath), name, cb),
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - Related locations:
      - (1) [DockerSecurityPlayground: app\/handlers\/labs.js:98:26:98:44](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L98)
      - (2) [DockerSecurityPlayground: app\/handlers\/labs.js:98:26:98:44](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L98)
      - (3) [DockerSecurityPlayground: app\/handlers\/labs.js:98:26:98:44](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L98)
  - [DockerSecurityPlayground: app\/data\/labs.js:231:25:231:40](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/data/labs.js#L231)
    ```js
    //    (cfile, cb) => {
    //      const informationFile = path.join(homedir(), cfile.mainDir, nameRepo, nameLab, 'information.json');
            jsonfile.readFile(informationFile, cb);
    //    }],
    //    (err, jsonDescription) => {
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - This path depends on \[a user-provided value\]\(5\).
    - This path depends on \[a user-provided value\]\(6\).
    - Related locations:
      - (1) [DockerSecurityPlayground: app\/handlers\/labs.js:110:37:110:52](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L110)
      - (2) [DockerSecurityPlayground: app\/handlers\/labs.js:110:37:110:52](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L110)
      - (3) [DockerSecurityPlayground: app\/handlers\/labs.js:110:37:110:52](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L110)
      - (4) [DockerSecurityPlayground: app\/handlers\/labs.js:110:54:110:72](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L110)
      - (5) [DockerSecurityPlayground: app\/handlers\/labs.js:110:54:110:72](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L110)
      - (6) [DockerSecurityPlayground: app\/handlers\/labs.js:110:54:110:72](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L110)
  - [DockerSecurityPlayground: app\/data\/network.js:62:25:62:36](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/data/network.js#L62)
    ```js
    //      yamlFile = path.join(homedir(), config.mainDir, namerepo, namelab, 'docker-compose.yml');
    //
            jsonfile.readFile(networkfile, cb);
    //    },
    //    (network, cb) => {
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - This path depends on \[a user-provided value\]\(5\).
    - This path depends on \[a user-provided value\]\(6\).
    - This path depends on \[a user-provided value\]\(7\).
    - This path depends on \[a user-provided value\]\(8\).
    - This path depends on \[a user-provided value\]\(9\).
    - This path depends on \[a user-provided value\]\(10\).
    - ... (29 more messages)
    - Related locations:
      - (1) [DockerSecurityPlayground: app\/handlers\/docker-images.js:49:48:49:67](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/docker-images.js#L49)
      - (2) [DockerSecurityPlayground: app\/handlers\/docker-images.js:49:48:49:67](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/docker-images.js#L49)
      - (3) [DockerSecurityPlayground: app\/handlers\/docker-images.js:49:48:49:67](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/docker-images.js#L49)
      - (4) [DockerSecurityPlayground: app\/handlers\/docker-images.js:49:69:49:87](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/docker-images.js#L49)
      - (5) [DockerSecurityPlayground: app\/handlers\/docker-images.js:49:69:49:87](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/docker-images.js#L49)
      - (6) [DockerSecurityPlayground: app\/handlers\/docker-images.js:49:69:49:87](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/docker-images.js#L49)
      - (7) [DockerSecurityPlayground: app\/handlers\/docker-images.js:64:52:64:71](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/docker-images.js#L64)
      - (8) [DockerSecurityPlayground: app\/handlers\/docker-images.js:64:52:64:71](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/docker-images.js#L64)
      - (9) [DockerSecurityPlayground: app\/handlers\/docker-images.js:64:52:64:71](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/docker-images.js#L64)
      - (10) [DockerSecurityPlayground: app\/handlers\/docker-images.js:64:73:64:91](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/docker-images.js#L64)
      - ... (29 more related locations)
  - [DockerSecurityPlayground: app\/data\/repos.js:96:20:96:48](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/data/repos.js#L96)
    ```js
    //    },
    //    // Remove directory from the main directory
          (cb) => rimraf(path.join(mainDir, reponame), cb),
    //    (cb) => get(cb),
    //    // Remove from repos.json
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - Related locations:
      - (1) [DockerSecurityPlayground: app\/handlers\/repos.js:21:26:21:41](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/repos.js#L21)
      - (2) [DockerSecurityPlayground: app\/handlers\/repos.js:21:26:21:41](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/repos.js#L21)
      - (3) [DockerSecurityPlayground: app\/handlers\/repos.js:21:26:21:41](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/repos.js#L21)
  - [DockerSecurityPlayground: app\/handlers\/labs.js:341:25:341:58](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L341)
    ```js
    //    // get all labels of lab to import
    //    (cb) => {
            jsonfile.readFile(path.join(srcPath, 'labels.json'), cb);
    //    },
    //    (jsonData, cb) => {
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - This path depends on \[a user-provided value\]\(5\).
    - This path depends on \[a user-provided value\]\(6\).
    - Related locations:
      - (1) [DockerSecurityPlayground: app\/handlers\/labs.js:272:54:272:62](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L272)
      - (2) [DockerSecurityPlayground: app\/handlers\/labs.js:272:54:272:62](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L272)
      - (3) [DockerSecurityPlayground: app\/handlers\/labs.js:272:54:272:62](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L272)
      - (4) [DockerSecurityPlayground: app\/handlers\/labs.js:272:73:272:81](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L272)
      - (5) [DockerSecurityPlayground: app\/handlers\/labs.js:272:73:272:81](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L272)
      - (6) [DockerSecurityPlayground: app\/handlers\/labs.js:272:73:272:81](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/labs.js#L272)
  - [DockerSecurityPlayground: app\/handlers\/network.js:215:15:215:30](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/network.js#L215)
    ```js
    //    // Zip has been saved, destroy directory
    //     if(wasDir) {
             rimraf(destinationPath, cb);
    //       destinationPath = `${destinationPath}.zip`;
    //     }
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - This path depends on \[a user-provided value\]\(5\).
    - This path depends on \[a user-provided value\]\(6\).
    - This path depends on \[a user-provided value\]\(7\).
    - This path depends on \[a user-provided value\]\(8\).
    - This path depends on \[a user-provided value\]\(9\).
    - This path depends on \[a user-provided value\]\(10\).
    - ... (2 more messages)
    - Related locations:
      - (1) [DockerSecurityPlayground: app\/handlers\/network.js:183:18:183:26](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/network.js#L183)
      - (2) [DockerSecurityPlayground: app\/handlers\/network.js:183:18:183:26](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/network.js#L183)
      - (3) [DockerSecurityPlayground: app\/handlers\/network.js:183:18:183:26](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/network.js#L183)
      - (4) [DockerSecurityPlayground: app\/handlers\/network.js:183:18:183:26](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/network.js#L183)
      - (5) [DockerSecurityPlayground: app\/handlers\/network.js:183:18:183:26](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/network.js#L183)
      - (6) [DockerSecurityPlayground: app\/handlers\/network.js:183:18:183:26](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/network.js#L183)
      - (7) [DockerSecurityPlayground: app\/handlers\/network.js:184:17:184:25](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/network.js#L184)
      - (8) [DockerSecurityPlayground: app\/handlers\/network.js:184:17:184:25](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/network.js#L184)
      - (9) [DockerSecurityPlayground: app\/handlers\/network.js:184:17:184:25](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/network.js#L184)
      - (10) [DockerSecurityPlayground: app\/handlers\/network.js:184:17:184:25](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/network.js#L184)
      - ... (2 more related locations)
  - [DockerSecurityPlayground: app\/handlers\/tree\_routes.js:150:18:150:26](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/tree_routes.js#L150)
    ```js
    //        if (errCanDelete) appUtils.response('DELETE FILE', res, errCanDelete);
    //        else if (stats.isDirectory()) {
                rimraf(filename, (innerErr) => {
    //            appUtils.response('DELETE FILE', res, innerErr);
    //          });
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - Related locations:
      - (1) [DockerSecurityPlayground: app\/handlers\/tree\_routes.js:142:20:142:32](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/tree_routes.js#L142)
      - (2) [DockerSecurityPlayground: app\/handlers\/tree\_routes.js:142:20:142:32](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/tree_routes.js#L142)
      - (3) [DockerSecurityPlayground: app\/handlers\/tree\_routes.js:142:20:142:32](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/tree_routes.js#L142)
      - (4) [DockerSecurityPlayground: app\/handlers\/tree\_routes.js:142:20:142:32](https://github.com/giper45/DockerSecurityPlayground/blob/e06c115bfab07ff6cad879526dff0de94180fdfb/app/handlers/tree_routes.js#L142)
### + js\/path-injection for HEAD (1)
  - [HEAD: src\/webui\/backend\/lib\/performances.js:156:25:156:26](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/lib/performances.js#L156)
    ```js
    //        let p = path.join(dir, id)
    //        if (fs.existsSync(p) && fs.lstatSync(p).isDirectory()) {
                  rimraf.sync(p, {}, function(e) {
    //                if (e) console.log(e)
    //            })
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - This path depends on \[a user-provided value\]\(5\).
    - This path depends on \[a user-provided value\]\(6\).
    - This path depends on \[a user-provided value\]\(7\).
    - This path depends on \[a user-provided value\]\(8\).
    - This path depends on \[a user-provided value\]\(9\).
    - This path depends on \[a user-provided value\]\(10\).
    - ... (1 more messages)
    - Related locations:
      - (1) [HEAD: src\/webui\/backend\/entry.js:129:88:129:106](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L129)
      - (2) [HEAD: src\/webui\/backend\/entry.js:129:88:129:106](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L129)
      - (3) [HEAD: src\/webui\/backend\/entry.js:129:88:129:106](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L129)
      - (4) [HEAD: src\/webui\/backend\/entry.js:132:39:132:55](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L132)
      - (5) [HEAD: src\/webui\/backend\/entry.js:132:39:132:55](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L132)
      - (6) [HEAD: src\/webui\/backend\/entry.js:150:88:150:106](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L150)
      - (7) [HEAD: src\/webui\/backend\/entry.js:150:88:150:106](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L150)
      - (8) [HEAD: src\/webui\/backend\/entry.js:150:88:150:106](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L150)
      - (9) [HEAD: src\/webui\/backend\/entry.js:152:80:152:96](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L152)
      - (10) [HEAD: src\/webui\/backend\/entry.js:152:80:152:96](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L152)
      - ... (1 more related locations)
### + js\/path-injection for mock-node (2)
  - [mock-node: server.js:324:16:324:70](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/server.js#L324)
    ```js
    //      if (index > -1) {
    //        router.stack.splice(index, 1);
              rimraf(path.join(__dirname, 'stubs', encodeRoutePath(_route)), function () {});
    //      }
    //      var newRoutes = config.routes.filter(function (route) {
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - This path depends on \[a user-provided value\]\(5\).
    - This path depends on \[a user-provided value\]\(6\).
    - Related locations:
      - (1) [mock-node: server.js:446:19:446:27](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/server.js#L446)
      - (2) [mock-node: server.js:446:19:446:27](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/server.js#L446)
      - (3) [mock-node: server.js:446:19:446:27](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/server.js#L446)
      - (4) [mock-node: server.js:451:19:451:34](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/server.js#L451)
      - (5) [mock-node: server.js:451:19:451:34](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/server.js#L451)
      - (6) [mock-node: server.js:451:19:451:34](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/server.js#L451)
  - [mock-node: src\/server.es6:314:12:314:66](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/src/server.es6#L314)
    ```es6
    //  if (index > -1) {
    //    router.stack.splice(index, 1);
          rimraf(path.join(__dirname, 'stubs', encodeRoutePath(_route)), () => {});
    //  }
    //  let newRoutes = config.routes.filter((route) => route.route != _route);
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - This path depends on \[a user-provided value\]\(5\).
    - This path depends on \[a user-provided value\]\(6\).
    - Related locations:
      - (1) [mock-node: src\/server.es6:418:15:418:23](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/src/server.es6#L418)
      - (2) [mock-node: src\/server.es6:418:15:418:23](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/src/server.es6#L418)
      - (3) [mock-node: src\/server.es6:418:15:418:23](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/src/server.es6#L418)
      - (4) [mock-node: src\/server.es6:423:15:423:30](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/src/server.es6#L423)
      - (5) [mock-node: src\/server.es6:423:15:423:30](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/src/server.es6#L423)
      - (6) [mock-node: src\/server.es6:423:15:423:30](https://github.com/ianunay/mock-node/blob/a88dd2e191349d5fdf62a2a8170284f616fd7b1a/src/server.es6#L423)
### + js\/path-injection for mediacenterjs (2)
  - [mediacenterjs: index.js:149:12:149:18](https://github.com/jansmolders86/mediacenterjs/blob/063393c69ef20b60c652947d0c69975d7a573701/index.js#L149)
    ```js
    //        , publicdir = './public/'+module+'/';
    //
          rimraf(appDir, function (e){
    //        if(e){
    //            logger.error('Error removing module',{error: e})
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - Related locations:
      - (1) [mediacenterjs: index.js:144:27:144:35](https://github.com/jansmolders86/mediacenterjs/blob/063393c69ef20b60c652947d0c69975d7a573701/index.js#L144)
      - (2) [mediacenterjs: index.js:144:27:144:35](https://github.com/jansmolders86/mediacenterjs/blob/063393c69ef20b60c652947d0c69975d7a573701/index.js#L144)
      - (3) [mediacenterjs: index.js:144:27:144:35](https://github.com/jansmolders86/mediacenterjs/blob/063393c69ef20b60c652947d0c69975d7a573701/index.js#L144)
  - [mediacenterjs: index.js:154:12:154:21](https://github.com/jansmolders86/mediacenterjs/blob/063393c69ef20b60c652947d0c69975d7a573701/index.js#L154)
    ```js
    //        }
    //    });
          rimraf(publicdir, function (e) {
    //        if(e) {
    //            logger.error('Error removing module',{error:e})
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - Related locations:
      - (1) [mediacenterjs: index.js:144:27:144:35](https://github.com/jansmolders86/mediacenterjs/blob/063393c69ef20b60c652947d0c69975d7a573701/index.js#L144)
      - (2) [mediacenterjs: index.js:144:27:144:35](https://github.com/jansmolders86/mediacenterjs/blob/063393c69ef20b60c652947d0c69975d7a573701/index.js#L144)
      - (3) [mediacenterjs: index.js:144:27:144:35](https://github.com/jansmolders86/mediacenterjs/blob/063393c69ef20b60c652947d0c69975d7a573701/index.js#L144)
### + js\/path-injection for expressCart (1)
  - [expressCart: routes\/product.js:411:16:411:49](https://github.com/mrvautin/expressCart/blob/ff9107e6b5e2b80f865442c43bafe9516ae80650/routes/product.js#L411)
    ```js
    //        }
    //        // delete any images and folder
              rimraf('public/uploads/' + req.params.id, (err) => {
    //            if(err){
    //                console.info(err.stack);
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - Related locations:
      - (1) [expressCart: routes\/product.js:411:36:411:49](https://github.com/mrvautin/expressCart/blob/ff9107e6b5e2b80f865442c43bafe9516ae80650/routes/product.js#L411)
      - (2) [expressCart: routes\/product.js:411:36:411:49](https://github.com/mrvautin/expressCart/blob/ff9107e6b5e2b80f865442c43bafe9516ae80650/routes/product.js#L411)
      - (3) [expressCart: routes\/product.js:411:36:411:49](https://github.com/mrvautin/expressCart/blob/ff9107e6b5e2b80f865442c43bafe9516ae80650/routes/product.js#L411)
### + js\/path-injection for cgm-remote-monitor (1)
  - [cgm-remote-monitor: lib\/api\/alexa\/index.js:52:27:52:33](https://github.com/nightscout/cgm-remote-monitor/blob/f81298fb287e4a93c4e05ef23bca5b2ac2bf6b78/lib/api/alexa/index.js#L52)
    ```js
    //            }
    //            ctx.language.set(locale);
                  moment.locale(locale);
    //        }
    //
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - Related locations:
      - (1) [cgm-remote-monitor: lib\/api\/alexa\/index.js:46:15:46:23](https://github.com/nightscout/cgm-remote-monitor/blob/f81298fb287e4a93c4e05ef23bca5b2ac2bf6b78/lib/api/alexa/index.js#L46)
      - (2) [cgm-remote-monitor: lib\/api\/alexa\/index.js:46:15:46:23](https://github.com/nightscout/cgm-remote-monitor/blob/f81298fb287e4a93c4e05ef23bca5b2ac2bf6b78/lib/api/alexa/index.js#L46)
      - (3) [cgm-remote-monitor: lib\/api\/alexa\/index.js:46:15:46:23](https://github.com/nightscout/cgm-remote-monitor/blob/f81298fb287e4a93c4e05ef23bca5b2ac2bf6b78/lib/api/alexa/index.js#L46)
      - (4) [cgm-remote-monitor: lib\/api\/alexa\/index.js:46:15:46:23](https://github.com/nightscout/cgm-remote-monitor/blob/f81298fb287e4a93c4e05ef23bca5b2ac2bf6b78/lib/api/alexa/index.js#L46)
### + js\/path-injection for urllib (1)
  - [urllib: lib\/urllib.js:1199:36:1199:39](https://github.com/node-modules/urllib/blob/061f60075249c136b1ca7e1e2519dae25cb9e55d/lib/urllib.js#L1199)
    ```js
    //function parseContentType(str) {
    //  try {
          return contentTypeParser.parse(str);
    //  } catch (err) {
    //    // ignore content-type error, tread as default
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - Related locations:
      - (1) [urllib: lib\/urllib.js:715:23:715:26](https://github.com/node-modules/urllib/blob/061f60075249c136b1ca7e1e2519dae25cb9e55d/lib/urllib.js#L715)
      - (2) [urllib: lib\/urllib.js:715:23:715:26](https://github.com/node-modules/urllib/blob/061f60075249c136b1ca7e1e2519dae25cb9e55d/lib/urllib.js#L715)
      - (3) [urllib: lib\/urllib.js:715:23:715:26](https://github.com/node-modules/urllib/blob/061f60075249c136b1ca7e1e2519dae25cb9e55d/lib/urllib.js#L715)
      - (4) [urllib: lib\/urllib.js:715:23:715:26](https://github.com/node-modules/urllib/blob/061f60075249c136b1ca7e1e2519dae25cb9e55d/lib/urllib.js#L715)
### + js\/path-injection for manager (2)
  - [manager: cloudify-stage\/backend\/source\/SourceHandler.js:71:20:71:31](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/source/SourceHandler.js#L71)
    ```js
    //        logger.debug('extracting', archivePath, extractFolder);
    //
              decompress(archivePath, extractFolder).then(files => {
    //            let tree = _scanArchive(extractFolder);
    //            callback(null, tree);
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - Related locations:
      - (1) [manager: cloudify-stage\/backend\/routes\/SourceBrowser.js:35:22:35:43](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/routes/SourceBrowser.js#L35)
      - (2) [manager: cloudify-stage\/backend\/routes\/SourceBrowser.js:35:22:35:43](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/routes/SourceBrowser.js#L35)
      - (3) [manager: cloudify-stage\/backend\/routes\/SourceBrowser.js:35:22:35:43](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/routes/SourceBrowser.js#L35)
  - [manager: cloudify-stage\/backend\/source\/SourceHandler.js:147:22:147:34](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/source/SourceHandler.js#L147)
    ```js
    //    function browseArchiveFile(path, callback) {
    //        var absolutePath = pathlib.join(_getRootFolder(), path);
              fsp.readFile(absolutePath, 'utf-8').then(function(content) {
    //            callback(null, content);
    //        }).catch(function(err){
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - Related locations:
      - (1) [manager: cloudify-stage\/backend\/routes\/SourceBrowser.js:14:16:14:30](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/routes/SourceBrowser.js#L14)
      - (2) [manager: cloudify-stage\/backend\/routes\/SourceBrowser.js:14:16:14:30](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/routes/SourceBrowser.js#L14)
      - (3) [manager: cloudify-stage\/backend\/routes\/SourceBrowser.js:14:16:14:30](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/routes/SourceBrowser.js#L14)
### + js\/path-injection for yaktime (1)
  - [yaktime: src\/tape.ts:26:46:26:57](https://github.com/yknx4/yaktime/blob/0fb773b2c495079a3a535ef0dad8465aa5fd6b92/src/tape.ts#L26)
    ```ts
    //
    //  if (contentType == null) return
        const parsedContentType = contentTypeParse(contentType)
    //
    //  return identityEncoding && isContentTypeHumanReadable(parsedContentType)
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - This path depends on \[a user-provided value\]\(5\).
    - This path depends on \[a user-provided value\]\(6\).
    - This path depends on \[a user-provided value\]\(7\).
    - This path depends on \[a user-provided value\]\(8\).
    - Related locations:
      - (1) [yaktime: src\/record.test.ts:49:39:49:42](https://github.com/yknx4/yaktime/blob/0fb773b2c495079a3a535ef0dad8465aa5fd6b92/src/record.test.ts#L49)
      - (2) [yaktime: src\/record.test.ts:49:39:49:42](https://github.com/yknx4/yaktime/blob/0fb773b2c495079a3a535ef0dad8465aa5fd6b92/src/record.test.ts#L49)
      - (3) [yaktime: src\/record.test.ts:49:39:49:42](https://github.com/yknx4/yaktime/blob/0fb773b2c495079a3a535ef0dad8465aa5fd6b92/src/record.test.ts#L49)
      - (4) [yaktime: src\/record.test.ts:49:39:49:42](https://github.com/yknx4/yaktime/blob/0fb773b2c495079a3a535ef0dad8465aa5fd6b92/src/record.test.ts#L49)
      - (5) [yaktime: src\/record.test.ts:62:33:62:36](https://github.com/yknx4/yaktime/blob/0fb773b2c495079a3a535ef0dad8465aa5fd6b92/src/record.test.ts#L62)
      - (6) [yaktime: src\/record.test.ts:62:33:62:36](https://github.com/yknx4/yaktime/blob/0fb773b2c495079a3a535ef0dad8465aa5fd6b92/src/record.test.ts#L62)
      - (7) [yaktime: src\/record.test.ts:62:33:62:36](https://github.com/yknx4/yaktime/blob/0fb773b2c495079a3a535ef0dad8465aa5fd6b92/src/record.test.ts#L62)
      - (8) [yaktime: src\/record.test.ts:62:33:62:36](https://github.com/yknx4/yaktime/blob/0fb773b2c495079a3a535ef0dad8465aa5fd6b92/src/record.test.ts#L62)
  - [orion.client: modules\/orionode\/lib\/fileUtil.js:256:9:256:16](https://github.com/eclipse/orion.client/blob/f7619bc2a0b7f57c8bbc5af09eb291430da24baa/modules/orionode/lib/fileUtil.js#L256)
    ```js
    // */
    //exports.rumRuff = function(dirpath, callback) {
      	rimraf(dirpath, callback);
    //};
    //
    ```
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - Related locations:
      - (1) [orion.client: modules\/orionode\/lib\/git\/clone.js:389:18:389:26](https://github.com/eclipse/orion.client/blob/f7619bc2a0b7f57c8bbc5af09eb291430da24baa/modules/orionode/lib/git/clone.js#L389
)
      - (2) [orion.client: modules\/orionode\/lib\/git\/clone.js:389:18:389:26](https://github.com/eclipse/orion.client/blob/f7619bc2a0b7f57c8bbc5af09eb291430da24baa/modules/orionode/lib/git/clone.js#L389
)
      - (3) [orion.client: modules\/orionode\/lib\/git\/clone.js:389:18:389:26](https://github.com/eclipse/orion.client/blob/f7619bc2a0b7f57c8bbc5af09eb291430da24baa/modules/orionode/lib/git/clone.js#L389
)
### + js\/path-injection for juttle (3)
  - [juttle: test\/adapters\/http\/test-server.js:86:46:86:63](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L86)
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - Related locations:
      - (1) [juttle: test\/adapters\/http\/test-server.js:83:41:83:61](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L83)
      - (2) [juttle: test\/adapters\/http\/test-server.js:83:41:83:61](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L83)
      - (3) [juttle: test\/adapters\/http\/test-server.js:83:41:83:61](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L83)
      - (4) [juttle: test\/adapters\/http\/test-server.js:83:41:83:61](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L83)
  - [juttle: test\/adapters\/http\/test-server.js:127:46:127:63](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L127)
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - Related locations:
      - (1) [juttle: test\/adapters\/http\/test-server.js:124:41:124:61](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L124)
      - (2) [juttle: test\/adapters\/http\/test-server.js:124:41:124:61](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L124)
      - (3) [juttle: test\/adapters\/http\/test-server.js:124:41:124:61](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L124)
      - (4) [juttle: test\/adapters\/http\/test-server.js:124:41:124:61](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L124)
  - [juttle: test\/adapters\/http\/test-server.js:200:46:200:63](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L200)
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - This path depends on \[a user-provided value\]\(4\).
    - Related locations:
      - (1) [juttle: test\/adapters\/http\/test-server.js:197:41:197:61](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L197)
      - (2) [juttle: test\/adapters\/http\/test-server.js:197:41:197:61](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L197)
      - (3) [juttle: test\/adapters\/http\/test-server.js:197:41:197:61](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L197)
      - (4) [juttle: test\/adapters\/http\/test-server.js:197:41:197:61](https://github.com/juttle/juttle/blob/21b49f96a0e0b2098de1673c3645a6cb673ea5a8/test/adapters/http/test-server.js#L197)
### + js\/path-injection for manager (1)
  - [manager: cloudify-stage\/backend\/node\_modules\/decompress\/index.js:93:56:93:61](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/node_modules/decompress/index.js#L93)
    - This path depends on \[a user-provided value\]\(1\).
    - This path depends on \[a user-provided value\]\(2\).
    - This path depends on \[a user-provided value\]\(3\).
    - Related locations:
      - (1) [manager: cloudify-stage\/backend\/routes\/SourceBrowser.js:35:22:35:43](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/routes/SourceBrowser.js#L35)
      - (2) [manager: cloudify-stage\/backend\/routes\/SourceBrowser.js:35:22:35:43](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/routes/SourceBrowser.js#L35)
      - (3) [manager: cloudify-stage\/backend\/routes\/SourceBrowser.js:35:22:35:43](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/routes/SourceBrowser.js#L35)
##  <a name="reflectedxss"></a> + js\/reflected-xss (5)
### + js\/reflected-xss for ampersand (2)
  - [ampersand: template\/express\/fakeApi.js:62:14:62:19](https://github.com/AmpersandJS/ampersand/blob/fb3ae351479df153fa4dd4f642eafed8bec3cd84/template/express/fakeApi.js#L62) [true positive]
    ```js
    //    var found = get(req.params.id);
    //    res.status(found ? 200 : 404);
          res.send(found);
    //};
    //
    ```
    - Cross-site scripting vulnerability due to \[user-provided value\]\(1\).
    - Cross-site scripting vulnerability due to \[user-provided value\]\(2\).
    - Related locations:
      - (1) [ampersand: template\/express\/fakeApi.js:53:18:53:26](https://github.com/AmpersandJS/ampersand/blob/fb3ae351479df153fa4dd4f642eafed8bec3cd84/template/express/fakeApi.js#L53)
      - (2) [ampersand: template\/express\/fakeApi.js:53:18:53:26](https://github.com/AmpersandJS/ampersand/blob/fb3ae351479df153fa4dd4f642eafed8bec3cd84/template/express/fakeApi.js#L53)
  - [ampersand: template\/express\/fakeApi.js:69:14:69:19](https://github.com/AmpersandJS/ampersand/blob/fb3ae351479df153fa4dd4f642eafed8bec3cd84/template/express/fakeApi.js#L69) [true positive]
    ```js
    //    if (found) people = _.without(people, found);
    //    res.status(found ? 200 : 404);
          res.send(found);
    //};
    //
    ```
    - Cross-site scripting vulnerability due to \[user-provided value\]\(1\).
    - Cross-site scripting vulnerability due to \[user-provided value\]\(2\).
    - Related locations:
      - (1) [ampersand: template\/express\/fakeApi.js:53:18:53:26](https://github.com/AmpersandJS/ampersand/blob/fb3ae351479df153fa4dd4f642eafed8bec3cd84/template/express/fakeApi.js#L53)
      - (2) [ampersand: template\/express\/fakeApi.js:53:18:53:26](https://github.com/AmpersandJS/ampersand/blob/fb3ae351479df153fa4dd4f642eafed8bec3cd84/template/express/fakeApi.js#L53)
### + js\/reflected-xss for atom-elmjutsu (1)
  - [atom-elmjutsu: lib\/hot-reloader.js:34:11:39:40](https://github.com/halohalospecial/atom-elmjutsu/blob/b03a91252921f24c761c27f783c4cdd0e51261fb/lib/hot-reloader.js#L34) [true positive]
    ```js
    //        const hotReloadingHost = atom.config.get('elmjutsu.hotReloadingHost');
    //        res.send(
                hotReloadingCode
    //            .replace('HOST', hotReloadingHost)
    //            .replace('PORT', this.server.address().port)
    ```
    - Cross-site scripting vulnerability due to \[user-provided value\]\(1\).
    - Related locations:
      - (1) [atom-elmjutsu: lib\/hot-reloader.js:26:44:26:58](https://github.com/halohalospecial/atom-elmjutsu/blob/b03a91252921f24c761c27f783c4cdd0e51261fb/lib/hot-reloader.js#L26)
### + js\/reflected-xss for manager (1)
  - [manager: cloudify-stage\/backend\/routes\/SourceBrowser.js:25:58:25:65](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/routes/SourceBrowser.js#L25) [false positive due to analysis imprecision]
    ```js
    //                next(err);
    //            } else {
                      res.contentType('application/text').send(content);
    //            }
    //        });
    ```
    - Cross-site scripting vulnerability due to \[user-provided value\]\(1\).
    - Related locations:
      - (1) [manager: cloudify-stage\/backend\/routes\/SourceBrowser.js:14:16:14:30](https://github.com/org-mano/manager/blob/c5e9a4dfcaffa22c71b35276d5feaea7037fd7e8/cloudify-stage/backend/routes/SourceBrowser.js#L14)
### + js\/reflected-xss for isomorphic-tutorial (1)
  - [isomorphic-tutorial: lib\/api.js:46:14:46:18](https://github.com/spikebrehm/isomorphic-tutorial/blob/41eb69ceca26ce283212a00911465ccb3fce608e/lib/api.js#L46) [true positive]
    ```js
    //  var post = _.find(posts, function(p) { return p.id === id });
    //  if (post) {
          res.send(post);
    //  } else {
    //    res.send(404, {error: 'Not found.'});
    ```
    - Cross-site scripting vulnerability due to \[user-provided value\]\(1\).
    - Related locations:
      - (1) [isomorphic-tutorial: lib\/api.js:31:14:31:22](https://github.com/spikebrehm/isomorphic-tutorial/blob/41eb69ceca26ce283212a00911465ccb3fce608e/lib/api.js#L31)
##  <a name="regexinjection"></a> + js\/regex-injection (13)
### + js\/regex-injection for ftd-web (1)
  - [ftd-web: lib\/findthedude.js:491:43:491:86](https://github.com/FindTheDude/ftd-web/blob/1c514cf9e6bf5acef5355e5c403c7ed11c3ac083/lib/findthedude.js#L491) [true positive]
    ```js
    //        userIds.forEach( function( friendId ){
    //
                  var images       = glob.sync( facesDirectory + "/" + friendId + "/*.jpeg" );
    //            if( images.length > 1 ){
    //                images.forEach( function( file ){
    ```
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - Related locations:
      - (1) [ftd-web: server\/lib\/controllers\/friends.js:25:21:25:42](https://github.com/FindTheDude/ftd-web/blob/1c514cf9e6bf5acef5355e5c403c7ed11c3ac083/server/lib/controllers/friends.js#L25)
### + js\/regex-injection for HEAD (3)
  - [HEAD: src\/webui\/backend\/lib\/performances.js:27:37:27:63](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/lib/performances.js#L27) [true positive]
    ```js
    //
    //        for (let dir of dirs) {
                  let subDirs = glob.sync(path.join(dir, '**', '*/'))
    //
    //            for (let i = 0; i < subDirs.length; i++) {
    ```
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - Related locations:
      - (1) [HEAD: src\/webui\/backend\/entry.js:124:55:124:73](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L124)
  - [HEAD: src\/webui\/backend\/lib\/performances.js:50:35:50:57](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/lib/performances.js#L50) [true positive]
    ```js
    //        if (fs.existsSync(p) && fs.lstatSync(p).isDirectory()) {
    //            let performancePath = path.dirname(id),
                      files = glob.sync(path.join(p, '*.yaml')).sort(naturalSort)
    //
    //            performancePath = performancePath === '.' ? '' : performancePath
    ```
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - This regular expression is constructed from a \[user-provided value\]\(2\).
    - This regular expression is constructed from a \[user-provided value\]\(3\).
    - This regular expression is constructed from a \[user-provided value\]\(4\).
    - This regular expression is constructed from a \[user-provided value\]\(5\).
    - Related locations:
      - (1) [HEAD: src\/webui\/backend\/entry.js:124:55:124:73](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L124)
      - (2) [HEAD: src\/webui\/backend\/entry.js:129:88:129:106](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L129)
      - (3) [HEAD: src\/webui\/backend\/entry.js:132:39:132:55](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L132)
      - (4) [HEAD: src\/webui\/backend\/entry.js:142:92:142:110](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L142)
      - (5) [HEAD: src\/webui\/backend\/entry.js:145:40:145:56](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L145)
  - [HEAD: src\/webui\/backend\/lib\/performances.js:102:31:102:59](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/lib/performances.js#L102) [true positive]
    ```js
    //            let ids = timelines.map(t => t.id),
    //                deleteIds = _.pullAll(
                          glob.sync(path.join(dir, id, '*.yaml')).map(f => path.relative(dir, f).replace(this.ext, '')), ids)
    //
    //            deleteIds.forEach(function(id) {
    ```
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - This regular expression is constructed from a \[user-provided value\]\(2\).
    - Related locations:
      - (1) [HEAD: src\/webui\/backend\/entry.js:129:88:129:106](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L129)
      - (2) [HEAD: src\/webui\/backend\/entry.js:132:39:132:55](https://github.com/hansonrobotics/HEAD/blob/88cd3a862f709da21fd7c6ba50ac22d57ae5f996/src/webui/backend/entry.js#L132)
### + js\/regex-injection for goof (1)
  - [goof: routes\/index.js:64:22:64:26](https://github.com/snyk/goof/blob/4093e6762c70c8e30023ed36d0ea1d3910a8c4f7/routes/index.js#L64) [false positive due to spurious sink]
    ```js
    //    time = time.replace(/\n$/, '');
    //
          var period = hms(time);
    //
    //    console.log('period: ' + period);
    ```
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - Related locations:
      - (1) [goof: routes\/index.js:80:14:80:22](https://github.com/snyk/goof/blob/4093e6762c70c8e30023ed36d0ea1d3910a8c4f7/routes/index.js#L80)
### + js\/regex-injection for react-pwa-reference (1)
  - [react-pwa-reference: src\/application\/server\/statics.js:31:12:31:44](https://github.com/localnerve/react-pwa-reference/blob/46b4f6f0ce66aead268a9cac23587b08357ce436/src/application/server/statics.js#L31)
    ```js
    //      // If a newer version exists, rewrite and serve that.
    //      const urlMatch = req.url.replace(/[a-f0-9]+\./, '*.');
            glob(settings.dist.baseDir + urlMatch, {
    //        silent: true
    //      }, (matchError, matches) => {
    ```
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - Related locations:
      - (1) [react-pwa-reference: src\/application\/server\/statics.js:30:24:30:31](https://github.com/localnerve/react-pwa-reference/blob/46b4f6f0ce66aead268a9cac23587b08357ce436/src/application/server/statics.js#L30)
### + js\/regex-injection for angularjs-periscope (3)
  - [angularjs-periscope: periscope.js:138:15:138:71](https://github.com/mrajcok/angularjs-periscope/blob/6c2176171b6225679ce13fa304740cf2ed6786ac/periscope.js#L138)
    ```js
    //function removeImageAndGraphvisFiles(instanceId) {
    //  if(instanceId) {
          glob.sync(IMAGES_DIR + '/' + instanceId + '_*' + IMAGE_FILE_SUFFIX)
    //      .forEach(function(f) { fs.unlinkSync(f); });
    //    glob.sync(ARTIFACTS_DIR + '/' + instanceId + '_*' + GRAPHVIZ_FILE_SUFFIX)
    ```
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - This regular expression is constructed from a \[user-provided value\]\(2\).
    - Related locations:
      - (1) [angularjs-periscope: periscope.js:869:20:869:28](https://github.com/mrajcok/angularjs-periscope/blob/6c2176171b6225679ce13fa304740cf2ed6786ac/periscope.js#L869)
      - (2) [angularjs-periscope: periscope.js:875:31:875:39](https://github.com/mrajcok/angularjs-periscope/blob/6c2176171b6225679ce13fa304740cf2ed6786ac/periscope.js#L875)
  - [angularjs-periscope: periscope.js:140:15:140:77](https://github.com/mrajcok/angularjs-periscope/blob/6c2176171b6225679ce13fa304740cf2ed6786ac/periscope.js#L140)
    ```js
    //    glob.sync(IMAGES_DIR + '/' + instanceId + '_*' + IMAGE_FILE_SUFFIX)
    //      .forEach(function(f) { fs.unlinkSync(f); });
          glob.sync(ARTIFACTS_DIR + '/' + instanceId + '_*' + GRAPHVIZ_FILE_SUFFIX)
    //      .forEach(function(f) { fs.unlinkSync(f); });
    //  } else {
    ```
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - This regular expression is constructed from a \[user-provided value\]\(2\).
    - Related locations:
      - (1) [angularjs-periscope: periscope.js:869:20:869:28](https://github.com/mrajcok/angularjs-periscope/blob/6c2176171b6225679ce13fa304740cf2ed6786ac/periscope.js#L869)
      - (2) [angularjs-periscope: periscope.js:875:31:875:39](https://github.com/mrajcok/angularjs-periscope/blob/6c2176171b6225679ce13fa304740cf2ed6786ac/periscope.js#L875)
  - [angularjs-periscope: periscope.js:180:15:180:40](https://github.com/mrajcok/angularjs-periscope/blob/6c2176171b6225679ce13fa304740cf2ed6786ac/periscope.js#L180)
    ```js
    //function removeStateFiles(instanceId) {
    //  if(instanceId) {
          glob.sync(stateFilename(instanceId)).forEach(function(f) {
    //    fs.unlinkSync(f); });
    //  } else {
    ```
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - Related locations:
      - (1) [angularjs-periscope: periscope.js:869:20:869:28](https://github.com/mrajcok/angularjs-periscope/blob/6c2176171b6225679ce13fa304740cf2ed6786ac/periscope.js#L869)
### + js\/regex-injection for conduit (1)
  - [conduit: server\/export\/export.js:192:10:192:49](https://github.com/ngageoint/conduit/blob/b0bf9884d1903b626ca223c12d909c73cb5aeadc/server/export/export.js#L192)
    ```js
    // */
    //var deleteTemporaryFiles = function (fileName) {
          glob(fileName.replace(/\.[^/.]+$/, "") + '*', function(err, files) {
    //        for(var i = 0; i < files.length; i++) {
    //            (function(thisFile) {
    ```
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - Related locations:
      - (1) [conduit: index.js:210:17:210:35](https://github.com/ngageoint/conduit/blob/b0bf9884d1903b626ca223c12d909c73cb5aeadc/index.js#L210)
### + js\/regex-injection for intern (1)
  - [intern: src\/lib\/node\/util.ts:46:26:46:33](https://github.com/theintern/intern/blob/dec2d1d531c4c7658c54642af41666985b8d7d12/src/lib/node/util.ts#L46)
    ```ts
    //
    //  const allPaths = includes
          .map(pattern => glob(pattern, { ignore: excludes }))
    //    .reduce((allFiles, files) => allFiles.concat(files), paths);
    //  const uniquePaths: { [name: string]: boolean } = {};
    ```
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - Related locations:
      - (1) [intern: src\/lib\/middleware\/resolveSuites.ts:9:25:9:36](https://github.com/theintern/intern/blob/dec2d1d531c4c7658c54642af41666985b8d7d12/src/lib/middleware/resolveSuites.ts#L9)
### + js\/regex-injection for webdrivercss-adminpanel (1)
  - [webdrivercss-adminpanel: server\/controllers\/api.js:144:25:144:59](https://github.com/webdriverio-boneyard/webdrivercss-adminpanel/blob/957c8435f708102e362b705ac8a83bb8e3b69364/server/controllers/api.js#L144)
    ```js
    //            }
    //
                  return glob(projectPath + '/**/*.baseline.png', done);
    //        },
    //        /**
    ```
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - Related locations:
      - (1) [webdrivercss-adminpanel: server\/controllers\/api.js:120:16:120:31](https://github.com/webdriverio-boneyard/webdrivercss-adminpanel/blob/957c8435f708102e362b705ac8a83bb8e3b69364/server/controllers/api.js#L120)
### + js\/regex-injection for traceur-compiler (1)
  - [traceur-compiler: test\/modular\/NodeTraceurTestRunner.js:26:14:26:21](https://github.com/google/traceur-compiler/blob/caa7b751d5150622e13cdd18865e09681d8c6691/test/modular/NodeTraceurTestRunner.js#L26)
    - This regular expression is constructed from a \[user-provided value\]\(1\).
    - Related locations:
      - (1) [traceur-compiler: demo\/expressServer.js:28:31:28:49](https://github.com/google/traceur-compiler/blob/caa7b751d5150622e13cdd18865e09681d8c6691/demo/expressServer.js#L28)
##  <a name="remotepropertyinjection"></a> + js\/remote-property-injection (20)
### + js\/remote-property-injection for hud-disaster-data (3)
  - [hud-disaster-data: app\/lib\/middleware\/localAPI.js:67:11:67:17](https://github.com/18F/hud-disaster-data/blob/63b2486f0fbad6106c5f3de79a47794ffb1a453e/app/lib/middleware/localAPI.js#L67) [true positive]
    ```js
    //    _.each(argument, val => {
    //      var arg = {}
            arg[column] = val
    //      console.log(`applying arg: ${JSON.stringify(arg)}`)
    //      compositeResult = _.concat(compositeResult, _.filter(result, arg))
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [hud-disaster-data: app\/lib\/controllers\/api.js:286:17:286:36](https://github.com/18F/hud-disaster-data/blob/63b2486f0fbad6106c5f3de79a47794ffb1a453e/app/lib/controllers/api.js#L286)
  - [hud-disaster-data: app\/lib\/middleware\/localAPI.js:80:47:80:50](https://github.com/18F/hud-disaster-data/blob/63b2486f0fbad6106c5f3de79a47794ffb1a453e/app/lib/middleware/localAPI.js#L80) [true positive]
    ```js
    //    result = _.map(result, rec => {
    //      var retValue = {}
            _.forEach(selectCols, col => { retValue[col] = rec[col] })
    //      return retValue
    //    })
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [hud-disaster-data: app\/lib\/controllers\/api.js:277:14:277:30](https://github.com/18F/hud-disaster-data/blob/63b2486f0fbad6106c5f3de79a47794ffb1a453e/app/lib/controllers/api.js#L277)
  - [hud-disaster-data: app\/lib\/middleware\/localAPI.js:92:13:92:16](https://github.com/18F/hud-disaster-data/blob/63b2486f0fbad6106c5f3de79a47794ffb1a453e/app/lib/middleware/localAPI.js#L92) [true positive]
    ```js
    //  var summary = {}
    //  _.forEach(summaryCols, (col) => {
          summary[col] = _.sumBy(data, rec => rec[col])
    //  })
    //  if (_.indexOf(summaryCols, 'numberOfRecords') > -1) summary['numberOfRecords'] = numberOfRecords
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [hud-disaster-data: app\/lib\/controllers\/api.js:277:14:277:30](https://github.com/18F/hud-disaster-data/blob/63b2486f0fbad6106c5f3de79a47794ffb1a453e/app/lib/controllers/api.js#L277)
### + js\/remote-property-injection for communityservice (2)
  - [communityservice: src\/server\/v1\/query-parser.js:506:16:506:19](https://github.com/DBCDK/communityservice/blob/72fef47ff37f72924141fc4d79381956d2a2c10c/src/server/v1/query-parser.js#L506) [true positive]
    ```js
    //        return;
    //      }
            formular[key] = context => {
    //        if (_.isNil(context.deleted_epoch) || settings.options.includes('include-deleted')) {
    //          return _.get(context, value);
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [communityservice: src\/server\/v1\/query.js:44:35:44:43](https://github.com/DBCDK/communityservice/blob/72fef47ff37f72924141fc4d79381956d2a2c10c/src/server/v1/query.js#L44)
  - [communityservice: src\/server\/v1\/query-parser.js:527:14:527:17](https://github.com/DBCDK/communityservice/blob/72fef47ff37f72924141fc4d79381956d2a2c10c/src/server/v1/query-parser.js#L527) [true positive]
    ```js
    //    }
    //    // console.log(`subquery: ${subquery.querying}`);
          formular[key] = subquery.querying;
    //    return;
    //  });
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [communityservice: src\/server\/v1\/query.js:44:35:44:43](https://github.com/DBCDK/communityservice/blob/72fef47ff37f72924141fc4d79381956d2a2c10c/src/server/v1/query.js#L44)
### + js\/remote-property-injection for new-website (2)
  - [new-website: apiServer.js:81:14:81:19](https://github.com/cdnjs/new-website/blob/01583f7b0340d597692f92d9792922273cfb2698/apiServer.js#L81)
    ```js
    //      };
    //      _.each(fields, function (field) {
              data[field] = library[field] || null;
    //      });
    //
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [new-website: apiServer.js:89:37:89:53](https://github.com/cdnjs/new-website/blob/01583f7b0340d597692f92d9792922273cfb2698/apiServer.js#L89)
  - [new-website: apiServer.js:148:11:148:16](https://github.com/cdnjs/new-website/blob/01583f7b0340d597692f92d9792922273cfb2698/apiServer.js#L148)
    ```js
    //  if (fields && results.length > 0) {
    //    _.each(fields, function (field) {
            ret[field] = results[0][field] || null;
    //    });
    //
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [new-website: apiServer.js:132:37:132:53](https://github.com/cdnjs/new-website/blob/01583f7b0340d597692f92d9792922273cfb2698/apiServer.js#L132)
### + js\/remote-property-injection for old-website (1)
  - [old-website: api.js:44:9:44:14](https://github.com/cdnjs/old-website/blob/7bce33a7e8baedea3a7a3ac3eb785b790b8c156b/api.js#L44)
    ```js
    //
    //		_.each(fields, function(field){
      			data[field] = package[field] || null;
    //		});
    //		return data;
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [old-website: api.js:27:36:27:52](https://github.com/cdnjs/old-website/blob/7bce33a7e8baedea3a7a3ac3eb785b790b8c156b/api.js#L27)
### + js\/remote-property-injection for iloveopensource (1)
  - [iloveopensource: app\/utils\/git-request.js:85:23:85:27](https://github.com/codio/iloveopensource/blob/a3419cd770b0fa73db46941bc3cb96216ab10c31/app/utils/git-request.js#L85)
    ```js
    //                var url = section[0].replace(/<(.*)>/, '$1').trim().replace('https://api.github.com/', '');
    //                var name = section[1].replace(/rel="(.*)"/, '$1').trim().toLowerCase();
                      links[name] = url;
    //            });
    //        }
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [iloveopensource: app\/utils\/git-request.js:26:52:26:60](https://github.com/codio/iloveopensource/blob/a3419cd770b0fa73db46941bc3cb96216ab10c31/app/utils/git-request.js#L26)
### + js\/remote-property-injection for scrapoxy (1)
  - [scrapoxy: server\/proxies\/master\/sanitize\/index.js:33:13:33:16](https://github.com/fabienvauchelles/scrapoxy/blob/5d3fe9ff3923b973640d4697af1ce4b522d574e9/server/proxies/master/sanitize/index.js#L33)
    ```js
    //        }
    //
              res[key] = val;
    //    });
    //
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [scrapoxy: server\/proxies\/master\/index.js:144:39:144:48](https://github.com/fabienvauchelles/scrapoxy/blob/5d3fe9ff3923b973640d4697af1ce4b522d574e9/server/proxies/master/index.js#L144)
### + js\/remote-property-injection for lightning (1)
  - [lightning: app\/controllers\/session.js:313:57:313:58](https://github.com/lightning-viz/lightning/blob/d4d2d5fc6971a660df587950852d0384d459128d/app/controllers/session.js#L313)
    ```js
    //                            _.each(req.body.data, function(d, i) {
    //                                if(i < viz.data[fieldName].length) {
                                          viz.data[fieldName][i] = viz.data[fieldName][i].concat(d);
    //                                }
    //                            });
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [lightning: app\/controllers\/session.js:311:36:311:44](https://github.com/lightning-viz/lightning/blob/d4d2d5fc6971a660df587950852d0384d459128d/app/controllers/session.js#L311)
### + js\/remote-property-injection for orcinus (1)
  - [orcinus: apis\/service.js:17:26:17:31](https://github.com/orcinustools/orcinus/blob/405c8042fd38675cf9039f382c1d275d3116aadc/apis/service.js#L17)
    ```js
    //    }
    //
          filters.filters.name[idSVC] = true;
    //    utils.debug(filters)
    //    req.app.locals.orcinus.listServices(filters,function (err, data) {
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [orcinus: lib\/utils.js:34:17:34:25](https://github.com/orcinustools/orcinus/blob/405c8042fd38675cf9039f382c1d275d3116aadc/lib/utils.js#L34)
### + js\/remote-property-injection for ophan-sparklines (2)
  - [ophan-sparklines: app.js:60:15:60:18](https://github.com/stephanfowler/ophan-sparklines/blob/b1f3268271063ea7294b9b811ddb88a74706d867/app.js#L60)
    ```js
    //   
    //    _.each(query, function(val, key, query) {
              query[key] = _.isArray(val) ? val[0] : val;
    //    });
    //
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [ophan-sparklines: app.js:35:30:35:37](https://github.com/stephanfowler/ophan-sparklines/blob/b1f3268271063ea7294b9b811ddb88a74706d867/app.js#L35)
  - [ophan-sparklines: modules\/sparks.js:87:36:87:37](https://github.com/stephanfowler/ophan-sparklines/blob/b1f3268271063ea7294b9b811ddb88a74706d867/modules/sparks.js#L87)
    ```js
    //                if (graph.data) {
    //                    _.each(s.data, function(d, i) {
                              graph.data[i] = (graph.data[i] || 0) + d;
    //                    });
    //                } else {
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [ophan-sparklines: app.js:72:42:72:47](https://github.com/stephanfowler/ophan-sparklines/blob/b1f3268271063ea7294b9b811ddb88a74706d867/app.js#L72)
### + js\/remote-property-injection for balmung (4)
  - [balmung: lib\/settings.js:101:18:101:21](https://github.com/suguru/balmung/blob/c8709124a767d35b1c5395a4371e5c09518fd175/lib/settings.js#L101)
    ```js
    //  var set = function(values, name) {
    //    _.each(values, function(value, key) {
            sets[name][key] = value;
    //    });
    //  };
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [balmung: lib\/settings.js:40:37:40:42](https://github.com/suguru/balmung/blob/c8709124a767d35b1c5395a4371e5c09518fd175/lib/settings.js#L40)
  - [balmung: lib\/settings.js:161:14:161:18](https://github.com/suguru/balmung/blob/c8709124a767d35b1c5395a4371e5c09518fd175/lib/settings.js#L161)
    ```js
    //      }
    //      if (file.$settings) {
              flat[name] = file.$settings;
    //      }
    //    });
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - A \[user-provided value\]\(2\) is used as a property name to write to.
    - Related locations:
      - (1) [balmung: lib\/settings.js:40:37:40:42](https://github.com/suguru/balmung/blob/c8709124a767d35b1c5395a4371e5c09518fd175/lib/settings.js#L40)
      - (2) [balmung: lib\/settings.js:40:37:40:42](https://github.com/suguru/balmung/blob/c8709124a767d35b1c5395a4371e5c09518fd175/lib/settings.js#L40)
  - [balmung: lib\/settings.js:226:22:226:26](https://github.com/suguru/balmung/blob/c8709124a767d35b1c5395a4371e5c09518fd175/lib/settings.js#L226)
    ```js
    //      if (_.isObject(value)) {
    //        if (_.isEmpty(value)) {
                delete obj[name];
    //        } else {
    //          removeEmpties(value);
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [balmung: lib\/settings.js:40:37:40:42](https://github.com/suguru/balmung/blob/c8709124a767d35b1c5395a4371e5c09518fd175/lib/settings.js#L40)
  - [balmung: lib\/settings.js:230:24:230:28](https://github.com/suguru/balmung/blob/c8709124a767d35b1c5395a4371e5c09518fd175/lib/settings.js#L230)
    ```js
    //          removeEmpties(value);
    //          if (_.isEmpty(value)) {
                  delete obj[name];
    //          }
    //        }
    ```
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [balmung: lib\/settings.js:40:37:40:42](https://github.com/suguru/balmung/blob/c8709124a767d35b1c5395a4371e5c09518fd175/lib/settings.js#L40)
### + js\/remote-property-injection for pump.io (1)
  - [pump.io: test\/lib\/http.js:438:28:438:32](https://github.com/pump-io/pump.io/blob/99d827d014018e4531e63c1c9cf13da2f7c3891c/test/lib/http.js#L438)
    - A \[user-provided value\]\(1\) is used as a header name.
    - Related locations:
      - (1) [pump.io: test\/lib\/http.js:435:47:435:51](https://github.com/pump-io/pump.io/blob/99d827d014018e4531e63c1c9cf13da2f7c3891c/test/lib/http.js#L435)
### + js\/remote-property-injection for ql.io (1)
  - [ql.io: modules\/console\/test\/test-post-encoded-body.js:88:39:88:50](https://github.com/ql-io/ql.io/blob/18991838d36e845fae18dcefa4f1d58f276014c4/modules/console/test/test-post-encoded-body.js#L88)
    - A \[user-provided value\]\(1\) is used as a property name to write to.
    - Related locations:
      - (1) [ql.io: modules\/console\/test\/test-post-encoded-body.js:80:50:80:55](https://github.com/ql-io/ql.io/blob/18991838d36e845fae18dcefa4f1d58f276014c4/modules/console/test/test-post-encoded-body.
js#L80)
##  <a name="usercontrolledbypass"></a> + js\/user-controlled-bypass (2)
### + js\/user-controlled-bypass for firebase-tools (1)
  - [firebase-tools: src\/auth.js:167:37:167:59](https://github.com/firebase/firebase-tools/blob/9906dea0515c3095d1e8f32aeefc0b81cf5083bf/src/auth.js#L167) [false positive due to analysis imprecision]
    ```js
    //      var query = _.get(url.parse(req.url, true), "query", {});
    //
            if (query.state === _nonce && _.isString(query.code)) {
    //        return _getTokensFromAuthorizationCode(query.code, callbackUrl)
    //          .then(function(result) {
    ```
    - This condition guards a sensitive \[action\]\(1\), but \[a user-provided value\]\(2\) controls it.
    - Related locations:
      - (1) [firebase-tools: src\/auth.js:165:35:165:42](https://github.com/firebase/firebase-tools/blob/9906dea0515c3095d1e8f32aeefc0b81cf5083bf/src/auth.js#L165)
      - (2) [firebase-tools: src\/auth.js:168:16:168:72](https://github.com/firebase/firebase-tools/blob/9906dea0515c3095d1e8f32aeefc0b81cf5083bf/src/auth.js#L168)
### + js\/user-controlled-bypass for verdaccio (1)
  - [verdaccio: src\/lib\/auth-utils.ts:248:9:248:26](https://github.com/verdaccio/verdaccio/blob/7d71b060c4bdc64d023c978aa354c9cf00998161/src/lib/auth-utils.ts#L248) [false positive due to analysis imprecision]
    ```ts
    //    const { scheme, token } = parseAuthTokenHeader(authorizationHeader);
    //
          if (_.isString(token) && scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
    //      return verifyJWTPayload(token, secret);
    //    }
    ```
    - This condition guards a sensitive \[action\]\(1\), but \[a user-provided value\]\(2\) controls it.
    - Related locations:
      - (1) [verdaccio: src\/lib\/auth-utils.ts:249:14:249:45](https://github.com/verdaccio/verdaccio/blob/7d71b060c4bdc64d023c978aa354c9cf00998161/src/lib/auth-utils.ts#L249)
      - (2) [verdaccio: src\/lib\/auth.ts:309:15:309:28](https://github.com/verdaccio/verdaccio/blob/7d71b060c4bdc64d023c978aa354c9cf00998161/src/lib/auth.ts#L309)
##  <a name="xss"></a> + js\/xss (1)
### + js\/xss for nodewiki (1)
  - [nodewiki: static\/socketio.js:102:46:102:63](https://github.com/nhoss2/nodewiki/blob/e83ebd9a7be7cd4ae02deab7b4a0c14dc64ac3ca/static/socketio.js#L102) [true positive]
    ```js
    //        });
    //      } else {
              $('#content #markdown_content').html(data.fileContents);
    //        rawMd = data.rawMd;
    //        fileName = data.fileName;
    ```
    - Cross-site scripting vulnerability due to \[user-provided value\]\(1\).
    - Related locations:
      - (1) [nodewiki: nodewiki.js:166:35:166:39](https://github.com/nhoss2/nodewiki/blob/e83ebd9a7be7cd4ae02deab7b4a0c14dc64ac3ca/nodewiki.js#L166)
