## Taser
This repository contains the Taser tool for generating taint specifications for Node.js modules, as described in the
2020 ICSE paper *Extracting Taint Specifications for JavaScript Libraries* (Link will follow later). 
Taser uses a dynamic analysis to monitor how an application (client) interacts with a module (library).
Based on the recorded observations, Taser builds a taint specification model of the module consisting of taint propagations and additional sinks.
The taint propagations relate tainted entry points of the module, e.g., function arguments, with exit points of the library, e.g., function return values.
The additional sinks relate module entry points with predefined sinks, for example, if a function argument flows into an [exec](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) call, then that constitutes an additional sink.

## Installation
Requirements
- NodeProf (follow installation instructions [here](https://github.com/Haiyang-Sun/nodeprof.js))
- [npm](https://www.npmjs.com/get-npm) 
- Mac or Linux to use the `instrumented-node/node` script.

Run `npm install` to install the remaining dependencies.

Set the environment variable NODE_PROF_LOCATION to point to your NodeProf installation folder.

## Usage
To run the analysis on `example.js`:
```
POLICY_FILE="{TaserFolder}/src/DefaultPolicy.js" POLICY_OUT="model.json" LIBRARY_UNDER_TEST="lodash" bash -c './instrumented-node/node example.js'
```
Where you replace `{TaserFolder}` with an absolute path to the Taser project folder.

The `POLICY_FILE` contains the predefined set of sinks, `POLICY_OUT` is for setting the model output file, and `LIBRARY_UNDER_TEST` specifies which module the taint specifiactions are generated for.

## Data
The [new-lgtm-alerts](data/new-lgtm-alerts.md) contains the set of LGTM alerts reports from RQ3 in the paper.

## License

Copyright 2020 the authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

