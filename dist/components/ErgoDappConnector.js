"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.promise.finally.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.reduce.js");

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.array-buffer.slice.js");

require("core-js/modules/es.typed-array.uint8-array.js");

require("core-js/modules/es.typed-array.fill.js");

require("core-js/modules/es.typed-array.set.js");

require("core-js/modules/es.typed-array.sort.js");

require("core-js/modules/es.typed-array.to-locale-string.js");

require("core-js/modules/es.json.stringify.js");

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

function classNames() {
  for (var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++) {
    classes[_key] = arguments[_key];
  }

  return classes.filter(Boolean).join(" ");
}

const NANOERG_TO_ERG = 1000000000;

const ErgoDappConnector = _ref => {
  let {
    color,
    wasm,
    walletConnected,
    setWalletConnected,
    startTransactionCounter,
    price,
    setSuccessTx,
    setErrorMessage,
    setSuccessText,
    setLoading,
    receiverWalletAddress,
    setSubmitting
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
      startTx().finally(() => {
        setLoading(false);
      });
    }
  }, [startTransactionCounter]);

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
    if (!ergoWallet) {
      return;
    }

    async function getUtxos(amountToSend) {
      const fee = (0, _bigInteger.default)(wasm.TxBuilder.SUGGESTED_TX_FEE().as_i64().to_str());
      const fullAmount = (0, _bigInteger.default)(1000) * amountToSend + fee;
      const utxos = await ergoWallet.get_utxos(fullAmount.toString());
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
    const amountToSend = (0, _bigInteger.default)(price * 1000000000);
    const amountToSendBoxValue = wasm.BoxValue.from_i64(wasm.I64.from_str(amountToSend.toString()));
    const utxos = await getUtxos(amountToSend);
    let utxosValue = utxos.reduce((acc, utxo) => acc += (0, _bigInteger.default)(utxo.value), (0, _bigInteger.default)(0));
    console.log('utxos', utxosValue, utxos);
    const changeAddr = await ergoWallet.get_change_address();
    const selector = new wasm.SimpleBoxSelector();
    let boxSelection;

    try {
      boxSelection = selector.select(wasm.ErgoBoxes.from_boxes_json(utxos), wasm.BoxValue.from_i64(amountToSendBoxValue.as_i64().checked_add(wasm.TxBuilder.SUGGESTED_TX_FEE().as_i64())), new wasm.Tokens());
    } catch (e) {
      try {
        const missingERGs = (e.split("(")[1].split(" ")[0] / NANOERG_TO_ERG).toFixed(2);
        setErrorMessage("Insufficient funds: " + missingERGs + " ERG missing");
      } catch (e) {
        setErrorMessage("Insufficient funds!");
      }

      return;
    }

    console.log("boxes selected: ".concat(boxSelection.boxes().len()));
    const outputCandidates = wasm.ErgoBoxCandidates.empty();
    let outBoxBuilder;

    try {
      outBoxBuilder = new wasm.ErgoBoxCandidateBuilder(amountToSendBoxValue, wasm.Contract.pay_to_address(wasm.Address.from_base58(receiverWalletAddress)), creationHeight);
      const byteArray = new TextEncoder().encode("insert custom msg here");
      const encodedRef = new Uint8Array(byteArray.buffer);
      outBoxBuilder.set_register_value(4, wasm.Constant.from_byte_array(encodedRef));
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

    const txBuilder = wasm.TxBuilder.new(boxSelection, outputCandidates, creationHeight, wasm.TxBuilder.SUGGESTED_TX_FEE(), wasm.Address.from_base58(changeAddr), wasm.BoxValue.SAFE_USER_MIN(), "oi");
    const dataInputs = new wasm.DataInputs();
    txBuilder.set_data_inputs(dataInputs);
    const tx = parseTransactionData(txBuilder.build().to_json());
    const correctTx = parseTransactionData(wasm.UnsignedTransaction.from_json(_jsonBigint.default.stringify(tx)).to_json());
    correctTx.inputs = correctTx.inputs.map(box => {
      const fullBoxInfo = utxos.find(utxo => utxo.boxId === box.boxId);
      return _objectSpread(_objectSpread({}, fullBoxInfo), {}, {
        extension: {}
      });
    });

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
      setSubmitting(true);
      const txId = await submitTx(signedTx);
      setSubmitting(false);

      if (!txId) {
        console.log("No submitted tx ID");
        return null;
      }

      msg("Transaction submitted");
      return txId;
    }

    processTx(correctTx).then(txId => {
      console.log('[txId]', txId);

      if (txId) {
        let url = "https://explorer.ergoplatform.com/en/transactions/" + txId;
        setSuccessTx({
          txId: txId,
          amountSent: amountToSend.valueOf() / NANOERG_TO_ERG
        });
        setSuccessText({
          text: "Success! Transaction will appear soon: ",
          url: url
        });
      }
    });
  }

  (0, _react.useEffect)(() => {
    if (typeof ergoWallet !== "undefined") {
      // get ERG balance
      ergoWallet.get_balance().then(function (balance) {
        setErgBalance(balance / NANOERG_TO_ERG);
      }); //get Address

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
  }), /*#__PURE__*/_react.default.createElement("span", {
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

var _default = ErgoDappConnector;
exports.default = _default;