*This project was based on [Nightowl's Connector](https://github.com/nightowlcasino/dApp-connector-react-package).*
# React Ergo Payments
<img src="https://iili.io/hxQWqQ.png" alt="Logo" width="80%">

<br/>

## What is this library?
  The **React Ergo Payments** library is an npm package developed to allow clients to pay/subscribe with ERG within your website. It validates and and submits the client's transaction and your website can do all sorts of fun stuff upon success.
  Including: 
  1. Saving the tx into your database and create active subscriptions depending on timestamp
  2. Triggering a purchase request in your online store
  3. Allow users to pay/donate to specific addresses

<br/>

### Built With

Created using [React.js](https://reactjs.org/) version ^17.1.0 and [Nautilus](https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai).

This package uses WASM, which is not supported by `create-react-app (CRA)`. Follow the guide below to install it in an existing CRA.


<br/>

### Pre-requisites

* Node.js
  ```sh
  https://nodejs.org/
  ```
* Nautilus^0.4.0
  ```sh
  https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai
  ```
<br/>

### Installation

* Install the package:
  ```sh
  npm install react-ergo-payments
  ```

*If you are using CRA, [this](https://dev.to/nicolasrannou/wasm-in-create-react-app-4-in-5mn-without-ejecting-cf6) workaround is needed:*

1. ```npm uninstall react-scripts```
2. ```npm install @craco/craco```
3. ```npm install wasm-loader```
4. Create a config file named **craco.config.js** and add this:
```
  module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const wasmExtensionRegExp = /\.wasm$/;
      webpackConfig.resolve.extensions.push('.wasm');

      webpackConfig.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
            oneOf.exclude.push(wasmExtensionRegExp);
          }
        });
      });

      const wasmLoader = {
        test: /\.wasm$/,
        exclude: /node_modules/,
        loaders: ['wasm-loader'],
      };

      addBeforeLoader(webpackConfig, loaderByName('file-loader'), wasmLoader);

      return webpackConfig;
    },
  },
};
```
<br/>

<!-- USAGE EXAMPLES -->
## Usage

* Load the package asynchronously into the file/component you want:
```
  const [component, setComponent] = React.useState();

  useEffect(() => {
    loadLibrary().then(lib => {
      setComponent(lib);
    })
    return () => setComponent();
  }, []);

  async function loadLibrary() {
      return await import("react-ergo-payments");
  }
```
* Finally, use the component:
```
{ component && <component.ErgoForm /> }
```

**Important: Attributes**

Currently, you can specify 4 attributes:
1. ```receiverWalletAddress``` the wallet your want your clients to pay to
2. ```onSuccess()``` call back -> this processor triggers onSuccess(txId, valueSent)
3. ```price``` (in ERG)
4. ```color``` (see [Nightowl's Connector](https://github.com/nightowlcasino/dApp-connector-react-package) for examples)

So an example in your real-world store would be:

```
function onSuccess(txId, valueSent) {
    // do something with this info
}

{ component && 
<component.ErgoForm 
    price={priceInErg} 
    onSuccess={onSuccess} 
    color={"orange"} 
    receiverWalletAddress={"9iPnRh5gaxxxcCQjUq6cT7FaQpRDpKtu"} /> }
```
*Warning: You need specify the receiverWalletAddress or you will send your funds to my default wallet*

<br/>

<!-- CONTRIBUTING -->
## Contributing

I'm just venturing into blockchain waters for a short time now, so any suggestions and contributions to this open source project are **greatly appreciated**!

<br/>

## Contact
Filipe Sommer - [LinkedIn](https://www.linkedin.com/in/filipe-sommer-505130151/)
