"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErgoDappConnectorAdmin = void 0;

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.async-iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.reduce.js");

require("core-js/modules/es.json.stringify.js");

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.array-buffer.slice.js");

require("core-js/modules/es.typed-array.uint8-array.js");

require("core-js/modules/es.typed-array.fill.js");

require("core-js/modules/es.typed-array.set.js");

require("core-js/modules/es.typed-array.sort.js");

require("core-js/modules/es.typed-array.to-locale-string.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.array.sort.js");

require("core-js/modules/es.parse-int.js");

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@headlessui/react");

var _ergoWalletBlack = _interopRequireDefault(require("./assets/ergo-wallet-black.png"));

var _ergoWalletWhite = _interopRequireDefault(require("./assets/ergo-wallet-white.png"));

var _WalletModal = _interopRequireDefault(require("./WalletModal.js"));

require("./styles.css");

var _NautilusLogo = _interopRequireDefault(require("./assets/NautilusLogo.png"));

var _jsonBigint = _interopRequireDefault(require("json-bigint"));

var _bigInteger = _interopRequireDefault(require("big-integer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

function classNames() {
  for (var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++) {
    classes[_key] = arguments[_key];
  }

  return classes.filter(Boolean).join(" ");
}

const NANOERG_TO_ERG = 1000000000;
const APP_NAME = "test_app";

class Subscription {
  constructor(customer, status, product, created) {
    this.customer = customer;
    this.status = status;
    this.product = product;
    this.created = created;
  }

}

const ErgoDappConnectorAdmin = _ref => {
  let {
    color,
    wasm,
    walletConnected,
    setWalletConnected,
    startTransactionCounter,
    receiverWalletAddress,
    sendValue,
    setErrorMessage,
    setSuccessText,
    setLoading,
    setSubsList
  } = _ref;
  const [ergoWallet, setErgoWallet] = (0, _react.useState)();
  const [ergBalance, setErgBalance] = (0, _react.useState)(0);
  const [showSelector, setShowSelector] = (0, _react.useState)(false);
  const [walletHover, setWalletHover] = (0, _react.useState)(false);
  const [defaultAddress, setDefaultAddress] = (0, _react.useState)();
  window.addEventListener("ergo_wallet_disconnected", () => {
    disconnectWallet();
  });
  (0, _react.useEffect)(() => {
    document.addEventListener("keydown", escFunctionPress, false);
    const checkWallet = localStorage.getItem("walletConnected");

    if (checkWallet === "true") {
      setDefaultAddress();
      window.ergoConnector.nautilus.connect().then(access_granted => {
        if (access_granted) {
          setWalletConnected(true);
          window.ergoConnector.nautilus.getContext().then(context => {
            setErgoWallet(context);
          });
        } else {
          setWalletConnected(false);
        }
      });
      setDefaultAddress(localStorage.getItem("walletAddress"));
      setWalletConnected(true);
    }
  }, []);
  (0, _react.useEffect)(() => {
    if (startTransactionCounter) {
      try {
        startTx();
        console.log("wut");
      } catch (e) {
        console.log("mega error");
      }
    }
  }, [startTransactionCounter]);

  function fetchSubs() {
    console.log(ergoWallet);
  }

  function escFunctionPress(event) {
    if (event.key === "Escape") {
      setWalletHover(false);
      setShowSelector(false);
    }
  }

  async function getCurrentHeight() {
    let url = "https://api.ergoplatform.com/api/v1/blocks?limit=1";
    return await fetch(url).then(res => res.json()).then(data => {
      return data["total"];
    });
  }

  async function getTxInfo(tx) {
    let url = "https://api.ergoplatform.com/api/v1/transactions/" + tx;
    return await fetch(url).then(res => res.json()).then(data => {
      return data;
    });
  }

  function parseUTXO(json) {
    var newJson = _objectSpread({}, json);

    if (newJson.assets === null) {
      newJson.assets = [];
    }

    return {
      boxId: newJson.boxId,
      value: newJson.value.toString(),
      ergoTree: newJson.ergoTree,
      assets: newJson.assets.map(asset => ({
        tokenId: asset.tokenId,
        amount: asset.amount.toString()
      })),
      additionalRegisters: newJson.additionalRegisters,
      creationHeight: newJson.creationHeight,
      transactionId: newJson.transactionId,
      index: newJson.index
    };
  }

  function parseTransactionData(str) {
    let json = _jsonBigint.default.parse(str);

    return {
      id: json.id,
      inputs: json.inputs,
      dataInputs: json.dataInputs,
      outputs: json.outputs.map(output => parseUTXO(output))
    };
  }

  async function startTx(e) {
    console.log("starting...");

    if (!ergoWallet) {
      return;
    }

    ergoWallet.get_balance().then(async function (balance) {
      async function getUtxos(amountToSend) {
        const fee = (0, _bigInteger.default)(wasm.TxBuilder.SUGGESTED_TX_FEE().as_i64().to_str());
        const fullAmount = (0, _bigInteger.default)(1000) * amountToSend + fee;
        console.log(fullAmount);
        const utxos = await ergoWallet.get_utxos(fullAmount.toString());
        console.log("utxos: ", utxos);
        const filteredUtxos = [];

        for (const utxo of utxos) {
          try {
            await wasm.ErgoBox.from_json(_jsonBigint.default.stringify(utxo));
            filteredUtxos.push(utxo);
          } catch (e) {
            console.log('[getUtxos] UTXO failed parsing: ', utxo, e);
          }
        }

        return filteredUtxos;
      }

      const creationHeight = await getCurrentHeight();
      console.log("creationHeight", creationHeight);
      const amountToSend = (0, _bigInteger.default)(sendValue);
      console.log("wasm", wasm);
      const amountToSendBoxValue = wasm.BoxValue.from_i64(wasm.I64.from_str(amountToSend.toString()));
      const utxos = await getUtxos(amountToSend);
      let utxosValue = utxos.reduce((acc, utxo) => acc += (0, _bigInteger.default)(utxo.value), (0, _bigInteger.default)(0));
      console.log('utxos', utxosValue, utxos);
      const changeValue = utxosValue - amountToSend - (0, _bigInteger.default)(wasm.TxBuilder.SUGGESTED_TX_FEE().as_i64().to_str());
      console.log("".concat(changeValue, " | cv.ts() = ").concat(changeValue.toString()));
      const changeAddr = await ergoWallet.get_change_address();
      console.log("changeAddr = ".concat(JSON.stringify(changeAddr)));
      const selector = new wasm.SimpleBoxSelector();
      let boxSelection;

      try {
        boxSelection = selector.select(wasm.ErgoBoxes.from_boxes_json(utxos), wasm.BoxValue.from_i64(amountToSendBoxValue.as_i64().checked_add(wasm.TxBuilder.SUGGESTED_TX_FEE().as_i64())), new wasm.Tokens());
      } catch (e) {
        console.log(e);
        const missingERGs = (e.split("(")[1].split(" ")[0] / NANOERG_TO_ERG).toFixed(2);
        setErrorMessage("Insufficient funds: " + missingERGs + " ERG missing");
        return;
      }

      console.log("boxes selected: ".concat(boxSelection.boxes().len()));
      const outputCandidates = wasm.ErgoBoxCandidates.empty();
      console.log("boxes selected2: ".concat(boxSelection.boxes().len()));
      const sub_type = "Sponsor";
      let outBoxBuilder;

      try {
        outBoxBuilder = new wasm.ErgoBoxCandidateBuilder(amountToSendBoxValue, wasm.Contract.pay_to_address(wasm.Address.from_base58(receiverWalletAddress)), creationHeight);
        const byteArray = new TextEncoder().encode("".concat(APP_NAME, ";", "Sponsor"));
        const encodedRef = new Uint8Array(byteArray.buffer);
        outBoxBuilder.set_register_value(4, wasm.Constant.from_byte_array(encodedRef));
        console.log("outBoxBuilder.register_value(4)", outBoxBuilder.register_value(4));
        console.log('R4:', new TextDecoder().decode(outBoxBuilder.register_value(4).to_byte_array()));
      } catch (e) {
        console.log(e);
        setErrorMessage("The address you provided is invalid.");
        return;
      }

      try {
        outputCandidates.add(outBoxBuilder.build());
      } catch (e) {
        console.log("building error: ".concat(e));
        throw e;
      }

      console.log("utxosvalue: ".concat(utxosValue.toString()));
      const txBuilder = wasm.TxBuilder.new(boxSelection, outputCandidates, creationHeight, wasm.TxBuilder.SUGGESTED_TX_FEE(), wasm.Address.from_base58(changeAddr), wasm.BoxValue.SAFE_USER_MIN(), "oi");
      const dataInputs = new wasm.DataInputs();
      txBuilder.set_data_inputs(dataInputs);
      console.log(txBuilder.build().to_json());
      const tx = parseTransactionData(txBuilder.build().to_json());
      console.log("tx: ".concat(_jsonBigint.default.stringify(tx)));
      console.log("original id: ".concat(tx.id));
      const correctTx = parseTransactionData(wasm.UnsignedTransaction.from_json(_jsonBigint.default.stringify(tx)).to_json());
      console.log("correct tx: ".concat(_jsonBigint.default.stringify(correctTx)));
      console.log("new id: ".concat(correctTx.id));
      correctTx.inputs = correctTx.inputs.map(box => {
        console.log("box: ".concat(_jsonBigint.default.stringify(box)));
        const fullBoxInfo = utxos.find(utxo => utxo.boxId === box.boxId);
        return _objectSpread(_objectSpread({}, fullBoxInfo), {}, {
          extension: {}
        });
      });
      console.log("".concat(_jsonBigint.default.stringify(correctTx)));

      async function signTx(txToBeSigned) {
        try {
          return await ergoWallet.sign_tx(txToBeSigned);
        } catch (err) {
          const msg = "[signTx] Error: ".concat(JSON.stringify(err));
          console.error(msg, err);
          setErrorMessage("Transaction was not signed.");
          return null;
        }
      }

      async function submitTx(txToBeSubmitted) {
        try {
          return await ergoWallet.submit_tx(txToBeSubmitted);
        } catch (err) {
          const msg = "[submitTx] Error: ".concat(JSON.stringify(err));
          console.error(msg, err);
          setErrorMessage("Transaction submission error.");
          return null;
        }
      }

      async function processTx(txToBeProcessed) {
        const msg = s => {
          console.log('[processTx]', s);
        };

        const signedTx = await signTx(txToBeProcessed);

        if (!signedTx) {
          console.log("No signed tx");
          return null;
        }

        msg("Transaction signed - awaiting submission");
        const txId = await submitTx(signedTx);

        if (!txId) {
          console.log("No submitted tx ID");
          return null;
        }

        msg("Transaction submitted - thank you for your donation!");
        return txId;
      }

      processTx(correctTx).then(txId => {
        console.log('[txId]', txId);

        if (txId) {
          let url = "https://explorer.ergoplatform.com/en/transactions/" + txId;
          console.log("url:", url);
          setSuccessText({
            text: "Success! Transaction will appear soon: ",
            url: url
          });
        }
      });
    });
  }

  async function getSubsFromSingleAddress(address) {
    let url = "https://api.ergoplatform.com/api/v1/addresses/" + address + "/transactions?offset=0&limit=150";
    const subs = [];
    return await fetch(url).then(res => res.json()).then(data => {
      console.log("data", data);
      data.items.forEach(entry => {
        const output = entry.outputs[0];

        if (output.additionalRegisters.R4 && output.additionalRegisters.R4.serializedValue === "0e1566696c736f6d6d657240686f746d61696c2e636f6d" && [5000000].includes(output.value)) {
          subs.push(new Subscription(entry.inputs[0].address, "active", "Premium", new Date(entry.timestamp).toUTCString().split(", ")[1].split("GMT")[0]));
        }
      });
      return subs;
    });
  }

  async function getSubsFromAllAddresses(usedAddresses) {
    let totalSubs = [];
    var _iteratorAbruptCompletion = false;
    var _didIteratorError = false;

    var _iteratorError;

    try {
      for (var _iterator = _asyncIterator(usedAddresses), _step; _iteratorAbruptCompletion = !(_step = await _iterator.next()).done; _iteratorAbruptCompletion = false) {
        const address = _step.value;
        console.log("address", address);
        totalSubs = totalSubs.concat(await getSubsFromSingleAddress(address));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (_iteratorAbruptCompletion && _iterator.return != null) {
          await _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    ;
    return totalSubs.sort((a, b) => {
      return new Date(b.created) - new Date(a.created);
    });
  }

  async function getAllSubs() {
    const usedAddresses = await ergoWallet.get_used_addresses();
    return await getSubsFromAllAddresses(usedAddresses);
  }

  (0, _react.useEffect)(() => {
    if (typeof ergoWallet !== "undefined") {
      // get ERG balance
      ergoWallet.get_balance().then(function (balance) {
        setErgBalance(balance / NANOERG_TO_ERG);
      });
      setLoading(true);
      console.log("fetching...");
      setSubsList && getAllSubs().then(resp => {
        setLoading(false);
        console.log("final subs:", resp);
        setSubsList(resp);
      });
      /*ergoWallet.get_utxos().then(function (resp) {
        console.log("utxo::: ", resp)
        resp.filter(entry => entry.additionalRegisters.R4 === "0e1566696c736f6d6d657240686f746d61696c2e636f6d").forEach(entry => {
          getTxInfo(entry.transactionId).then(resp => {
            console.log("aaa", resp);
          });
        })
      });*/
      //get Address

      ergoWallet.get_change_address().then(function (address) {
        localStorage.setItem("walletAddress", address);
        setDefaultAddress(truncate(address, 14, "..."));
        localStorage.setItem("walletConnected", "true");
      });
    }
  }, [ergoWallet]);
  const colorStylingArray = {
    orange: ["#ff5e18", "black"],
    white: ["white", "black"],
    black: ["black", "white"],
    green: ["#00b300", "white"],
    purple: ["#8c00ff", "white"],
    blue: ["#00b3ff", "white"],
    red: ["#ff0000", "white"],
    yellow: ["#ffd800", "black"],
    brown: ["#964B00", "white"],
    pink: ["#ff00ff", "white"],
    teal: ["#00b3b3", "white"],
    cyan: ["#00b3ff", "white"],
    coral: ["#FF6F61", "white"],
    emerald: ["#009B77", "white"],
    darkred: ["#9B2335", "white"],
    inkwell: ["#363945", "white"],
    darkgreen: ["#006400", "white"],
    darkblue: ["#00008B", "white"],
    darkpurple: ["#301934", "white"],
    darkorange: ["#ff8c00", "white"],
    bsblue: ["#4299e1", "white"]
  };

  const truncate = (str, len, sep) => {
    if (str.length < len) {
      return str;
    } else {
      return str.substring(0, parseInt(len / 2)) + sep + str.substring(str.length - parseInt(len / 2), str.length);
    }
  };

  function disconnectWallet() {
    if (typeof window.ergo_request_read_access === "undefined") {} else {
      if (walletConnected) {
        setWalletConnected(false);
        setErgoWallet();
        setDefaultAddress("");
        localStorage.removeItem("walletAddress");
        localStorage.removeItem("walletConnected");
        window.ergoConnector.nautilus.disconnect();
      }
    }
  }

  const toggleSelector = () => {
    if (!walletConnected) setShowSelector(!showSelector);
  };

  const handleWalletTrue = () => {
    if (walletConnected) setWalletHover(prev => !prev);else {
      setShowSelector(prev => !prev);
    }
  };

  const connectNautilus = () => {
    if (!window.ergoConnector) {
      return;
    }

    window.ergoConnector.nautilus.isConnected().then(connected => {
      if (!walletConnected) {
        window.ergoConnector.nautilus.connect().then(access_granted => {
          if (access_granted) {
            setWalletConnected(true);
            window.ergoConnector.nautilus.getContext().then(context => {
              console.log("context", context);
              setErgoWallet(context);
            });
          } else {
            setWalletConnected(false);
          }
        });
        toggleSelector();
      } else {
        // Already connected
        toggleSelector();
        return;
      }
    });
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "package-container"
  }, showSelector && /*#__PURE__*/_react.default.createElement(_react2.Menu, {
    as: "div",
    className: "mainDiv"
  }, /*#__PURE__*/_react.default.createElement(_react2.Transition, {
    show: true,
    as: _react.Fragment,
    enter: "transition ease-out duration-100",
    enterFrom: "transform opacity-0 scale-95",
    enterTo: "transform opacity-100 scale-100",
    leave: "transition ease-in duration-75",
    leaveFrom: "transform opacity-100 scale-100",
    leaveTo: "transform opacity-0 scale-95"
  }, /*#__PURE__*/_react.default.createElement(_react2.Menu.Items, {
    className: "mainMenuItem",
    style: {
      marginTop: "48px"
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginBottom: "1px"
    }
  }, /*#__PURE__*/_react.default.createElement(_react2.Menu.Item, {
    onClick: connectNautilus
  }, _ref2 => {
    let {
      active
    } = _ref2;
    return /*#__PURE__*/_react.default.createElement("a", {
      href: "#",
      className: classNames(active ? "item1" : "item2", "item3")
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: _NautilusLogo.default,
      style: {
        height: "30px",
        marginRight: "48px",
        marginLeft: "8px"
      }
    }), "Nautilus");
  }))))), /*#__PURE__*/_react.default.createElement("div", {
    id: "header-wallet-wrapper",
    onClick: handleWalletTrue
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "header-wallet",
    style: {
      backgroundColor: colorStylingArray[color][0],
      color: colorStylingArray[color][1],
      flexDirection: walletConnected ? "column" : "row",
      border: color === "white" ? "1px solid black" : ""
    }
  }, !walletConnected && /*#__PURE__*/_react.default.createElement("img", {
    src: colorStylingArray[color][1] === "white" ? _ergoWalletWhite.default : _ergoWalletBlack.default,
    id: "header-wallet-image"
  }), /*#__PURE__*/_react.default.createElement("div", {
    id: "wallet-connect"
  }, /*#__PURE__*/_react.default.createElement("span", null, walletConnected ? /*#__PURE__*/_react.default.createElement("span", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      gap: "5px"
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _NautilusLogo.default,
    style: {
      height: "20px",
      marginLeft: "20px"
    }
  }), /*#__PURE__*/_react.default.createElement("p", {
    style: {
      color: colorStylingArray[color][1],
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "150px",
      marginLeft: "5px"
    }
  }, defaultAddress))) : /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: "white",
      marginLeft: "-10px"
    }
  }, "Connect Wallet"))), walletHover && walletConnected && /*#__PURE__*/_react.default.createElement(_WalletModal.default, {
    disconnect: disconnectWallet,
    ergBalance: ergBalance
  }))));
};

exports.ErgoDappConnectorAdmin = ErgoDappConnectorAdmin;