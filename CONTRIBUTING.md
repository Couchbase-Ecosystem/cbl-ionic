# Contributing

Whether you have a fix for a typo in a component, a bugfix, or a new feature, we'd love to collaborate.

## Steps for Contributing to a Project
1. Sign the Contributor License Agreement:
   1. [Join the code review site](http://review.couchbase.org/).
   2. Log into the review site.
   3. [Fill out the agreement](http://review.couchbase.org/#/settings/agreements) under *Settings > Agreements*.

And while we welcome questions, we prefer to answer questions on our [developer forums](https://forums.couchbase.com/) rather than in Github issues.
   
## Development Requirements
- Javascript
    - [Node 18](https://formulae.brew.sh/formula/node@18) or higher
- Capacitor
    - [Capacitor v6 cli](https://capacitorjs.com/docs/getting-started)
    - [Understanding on Capacitor Plugins Development](https://capacitorjs.com/docs/plugins/creating-plugins)
- IDEs
    - [Visual Studio Code](https://code.visualstudio.com/download)
        - [Visual Studio Code Ionic Extension](https://capacitorjs.com/docs/vscode/getting-started)
    - [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
    - [Cursor](https://www.cursor.com/)
- iOS Development
    - A modern Mac 
    - [XCode 15](https://developer.apple.com/xcode/) or higher installed and working (XCode 15 installed is preferred per Capacitor v6 requirements)
    - [XCode Command Line Tools](https://developer.apple.com/download/more/) installed 
    - [Simulators](https://developer.apple.com/documentation/safari-developer-tools/installing-xcode-and-simulators) downloaded and working
    - [Homebrew](https://brew.sh/) 
    - [Cocopods](https://formulae.brew.sh/formula/cocoapods)
   
    - A valid Apple Developer account and certificates installed and working
- Android Development
    - [Android Studio](https://developer.android.com/studio?gad_source=1&gclid=CjwKCAjwzN-vBhAkEiwAYiO7oALYfxbMYW_zkuYoacS9TX16aItdvLYe6GB7_j1QwvXBjFDRkawfUBoComcQAvD_BwE&gclsrc=aw.ds) installed and working
    - Android SDK 34 >= installed and working (with command line tools)
    - Java SDK v17 installed and working with Android Studio
    - Java SDK v17 configured for Gradle builds in Android Studio
    - An Android Emulator downloaded and working 

## Plugin Project Structure

- **`src/definitions.ts`** - interface definition for the plugin.  This defines the interface `IonicCouchbaseLitePlugin` that inherits from the interface `ICoreEngine`.  `IonicCouchbaseLitePlugin` is used by Capacitor to connect to the Engine that implements the bridge between the Javascript code in cblite JS npm package and the native code in the iOS and Android projects.  This file is used to define the methods that the plugin supports.  The names of the methods in this file must match the names of the methods in the native implementation which are defined in both interface files.  
- **`src/ionic-couchbase-lite.ts`** -   This maps the defines the interface `IonicCouchbaseLitePlugin` and registers the plugin for mapping to the native code with the code 'CblIonicPlugin'.  This MUST match what's defined in the native implementation files or the mapping will not work. 
- **`src/couchbase-lite/engine/capacitor-engine.ts`** - the main implementation of methods that are defined in the plugin for Ionic.  Names MUST match the names from the native implementation in Swift/Java/Kotlin.  The Typescript code will usually call implementations that try to match the Couchbase Lite SDK.  Example the Database.ts file tries to separate out things like opening and closing a database to match the Couchbase Lite SDK.  
- **`ios/Plugin/`** this is the iOS native implementation of the plugin.  The file brakedown is:
    - **`ios/CblIonicPluginPlugin.h`** - the interface for the main plugin.  The name must match the name of the plugin.
    - **`ios/CblIonicPluginPlugin.m`** - the main implementation of the plugin. This defines the plugin using the CAP_PLUGIN Macro, and
    each method the plugin supports using the CAP_PLUGIN_METHOD macro. 
    - **`ios/CblIonicPlugin.swift`** - the main implementation of the plugin bridge to Native code.  Note this mostly calls shared code from the cbl-js-swift repo that is used to share the implementation between various frameworks like Ionic, React Native, etc.  
- **`android/src/`** this is the Android native implementation of the plugin.  The file brakedown is:
    - **`main/java/io/ionic/enterprise/couchbaselite/IonicCouchbaseLitePlugin.java`** - the main implementation of the plugin and bridge.  The name must match the name of the plugin.

## Shared Libraries and Tests
### [cblite-js](https://github.com/Couchbase-Ecosystem/cblite-js)
- `cblite` this is the Javascript implementation of the Couchbase Lite SDK which includes definitions for the main classes and methods in the Couchbase Lite SDK.  This is used by the plugin to call the native code.  This is added to the project via Git Submodule to the /src/cblite-js directory.

### [cblite-tests](https://github.com/Couchbase-Ecosystem/cblite-js-tests)
- `cblite-tests` this is the Javascript end to end (e2e) test that are used to fully test the plugin to validate that all functionality works.  This includes a custom test runner that can be used by any UI to run the tests.  This is added to the project via Git Submodule to the /example/src/cblite-tests directory so that the test library dependencies are available to the test runner but don't affect the main project.

### [cbl-js-swift](https://github.com/Couchbase-Ecosystem/cbl-js-swift)
This is the Swift implementation of the Couchbase Lite SDK which includes definitions for the main classes and methods in the Couchbase Lite SDK.  This is used by the plugin to call the native code.  This is added to the project via Git Submodule to the /src/ios/Plugin/cbl-js-swift directory.

## Local Setup

### How to Build the Plugin
Because the project uses submodules to manage the shared libraries and tests, you need to clone the repo with the submodules.  Failure to follow these directions will result in the build failing.  

1. Fork and clone this repo.  You will need to also clone all the submodules for the shared libraries and tests and update them with the latest version of each of those modules code.  Run the following commands from the root of the cbl-ionic repo:
    ```shell
    git clone --recurse-submodules git@github.com:Couchbase-Ecosystem/cbl-ionic.git
    cd cbl-ionic
    git submodule update --remote --recursive
    ```  
 
2. Install the dependencies on main project.

    ```shell
    npm install
    ```
3. Install SwiftLint if you're on macOS.

    ```shell
    brew install swiftlint
    ```
4. Run npm build verify to build Javascript - from project root and validate platform code works.

    ```shell
    npm run verify
    ```

### Example App
To test the plugin an Example app has been provided.  To build the example app follow the instructions below:

1.  Install the dependencies for the example app.  Run the following commands from the root of the cbl-ionic directory:
    ```shell
    cd example
    npm install
    ```
2. Run verify that will do a build and set up the platform code for iOS and Android:
    ```shell
    npm run verify
    ```
3. Run the example app.  From the root of the example directory run the following command:
    
    **iOS** 
    ```shell
    ionic capacitor run ios -l --external
    ```

    **Android**
    ```shell
    ionic capacitor run android -l --external
    ```

### Scripts

#### `npm run build`

Build npm module and the plugin web assets.

It will compile the TypeScript code from the `src/` into ESM JavaScript in `dist/esm/`. These files are used in apps with bundlers when your plugin is imported.

Then, Rollup will bundle the code `dist/plugin.js` with the other two npm packages included. This file is used in apps without bundlers by including it as a script in `index.html`.

#### `npm run verify`

Build and validate the Typescript and native projects to make sure they build.  This automatically installs the shared libraries dependencies for iOS and Android and builds the native projects.

This is useful to run in CI to verify that the plugin builds for all platforms.

#### `npm run lint` / `npm run fmt`

Check formatting and code quality, auto format/autofix if possible.

This template is integrated with ESLint, Prettier, and SwiftLint. Using these tools is completely optional, but the [Capacitor Community](https://github.com/capacitor-community/) strives to have consistent code style and structure for easier cooperation.

Any new features should be published with e2e tests that are ran against the example app.

## TODO - Publishing

