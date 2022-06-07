"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

var _react = _interopRequireWildcard(require("react"));

var _ErgoDappConnector = _interopRequireDefault(require("./ErgoDappConnector"));

require("./styles.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ErgoForm(_ref) {
  let {
    price = 0.01,
    receiverWalletAddress = "9iPnRh5ga4Q9yvYXDYn3rFtc8KPeLR8cCQjUq6cT7FaQpRDpKtu",
    onSuccess,
    color = "bsblue"
  } = _ref;
  const [wasm, setWasmSDK] = (0, _react.useState)();
  const [errorText, setErrorText] = (0, _react.useState)("");
  const [successText, setSuccessText] = (0, _react.useState)("");
  const [successTx, setSuccessTx] = (0, _react.useState)();
  const [walletConnected, setWalletConnected] = (0, _react.useState)(false);
  const [startTransactionCounter, setStartTransactionCounter] = (0, _react.useState)(0);
  const [loading, setLoading] = (0, _react.useState)(false);
  const [submitting, setSubmitting] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    loadSDK().then(res => {
      setWasmSDK(res);
    });
    return () => setWasmSDK();
  }, []);
  (0, _react.useEffect)(() => {
    if (!onSuccess) {
      console.log("No onSuccess callback specified");
    } else if (successTx) {
      onSuccess(successTx.txId, successTx.amountSent);
      setSuccessTx();
    }

    return () => setSuccessTx();
  }, [successTx]); // CRA does not support WASM, so we used craco as a workaround. See: https://dev.to/nicolasrannou/wasm-in-create-react-app-4-in-5mn-without-ejecting-cf6

  async function loadSDK() {
    const sdk = await Promise.resolve().then(() => _interopRequireWildcard(require("ergo-lib-wasm-browser")));
    return sdk;
  }

  function validateWalletConnected() {
    if (!walletConnected) {
      setErrorText("Please connect a wallett");
      return false;
    }

    return true;
  }

  function setErrorMessage(msg) {
    setErrorText(msg);
  }

  function resetText() {
    setErrorText(" ");
    setSuccessText();
  }

  function handleSend() {
    resetText();
    setLoading(true);
    let valid = true;
    valid = validateWalletConnected();

    if (valid) {
      setStartTransactionCounter(prev => prev + 1);
    } else {
      setLoading(false);
    }
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "app-container"
  }, /*#__PURE__*/_react.default.createElement("form", {
    className: "form-container"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "text-field-label"
  }, "Wallet"), /*#__PURE__*/_react.default.createElement("div", {
    className: "wallet-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "wallet-button"
  }, /*#__PURE__*/_react.default.createElement(_ErgoDappConnector.default, {
    color: color,
    wasm: wasm,
    walletConnected: walletConnected,
    setSuccessTx: setSuccessTx,
    setWalletConnected: setWalletConnected,
    startTransactionCounter: startTransactionCounter,
    price: price,
    setErrorMessage: setErrorMessage,
    setLoading: setLoading,
    setSubmitting: setSubmitting,
    setSuccessText: setSuccessText,
    receiverWalletAddress: receiverWalletAddress
  })), /*#__PURE__*/_react.default.createElement("a", {
    onClick: handleSend,
    className: "send-button",
    href: "#",
    style: {
      cursor: "pointer"
    }
  }, loading ? "Validating..." : submitting ? "Submitting..." : "Submit")), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontStyle: "italic",
      fontSize: "0.75rem",
      color: errorText ? "#f56565" : "#48bb78"
    }
  }, errorText || (successText === null || successText === void 0 ? void 0 : successText.text)), successText !== null && successText !== void 0 && successText.text ? /*#__PURE__*/_react.default.createElement("a", {
    style: {
      color: "green",
      fontSize: "15px"
    },
    href: successText.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "View Tx") : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null)));
}

var _default = ErgoForm;
exports.default = _default;