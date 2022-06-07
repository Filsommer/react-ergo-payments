"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErgoAdmin = ErgoAdmin;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

var _ErgoDappConnectorAdmin = require("./ErgoDappConnectorAdmin");

var _react = _interopRequireWildcard(require("react"));

var _ergoIcon = _interopRequireDefault(require("./assets/ergo-icon.png"));

require("./styles.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ErgoAdmin() {
  const [wasm, setWasmSDK] = (0, _react.useState)();
  const receiverAddressRef = (0, _react.useRef)("");
  const amountRef = (0, _react.useRef)(0);
  const [errorText, setErrorText] = (0, _react.useState)("");
  const [successText, setSuccessText] = (0, _react.useState)("");
  const [walletConnected, setWalletConnected] = (0, _react.useState)(false);
  const [startTransactionCounter, setStartTransactionCounter] = (0, _react.useState)(0);
  const [loading, setLoading] = (0, _react.useState)(false);
  const [subsList, setSubsList] = (0, _react.useState)([{
    customer: "9f7cjURdZ25W5JfFfLxDbkP17EVwDpLUDCZFfeKoUNpRkTfju6s",
    status: "active",
    product: "Premium",
    created: "31-05-2022"
  }, {
    customer: "9i7PQe39RNwJw5edVbeYbTdtWL45zdooTgTwUraJKRSWyHAmCtp",
    status: "active",
    product: "Premium",
    created: "29-05-2022"
  }]);
  (0, _react.useEffect)(() => {
    loadSDK().then(res => {
      setWasmSDK(res);
    });
    return () => setWasmSDK();
  }, []); // CRA does not support WASM, so we used craco as a workaround. See: https://dev.to/nicolasrannou/wasm-in-create-react-app-4-in-5mn-without-ejecting-cf6

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

  function validateAmount() {
    var _amountRef$current, _amountRef$current2;

    if (!(amountRef !== null && amountRef !== void 0 && (_amountRef$current = amountRef.current) !== null && _amountRef$current !== void 0 && _amountRef$current.value) || isNaN(amountRef === null || amountRef === void 0 ? void 0 : (_amountRef$current2 = amountRef.current) === null || _amountRef$current2 === void 0 ? void 0 : _amountRef$current2.value)) {
      setErrorText("Please choose a valid amount");
      return false;
    }

    return true;
  }

  function validateReceiverAddress() {
    var _receiverAddressRef$c;

    if (!(receiverAddressRef !== null && receiverAddressRef !== void 0 && (_receiverAddressRef$c = receiverAddressRef.current) !== null && _receiverAddressRef$c !== void 0 && _receiverAddressRef$c.value)) {
      setErrorText("Please provide an address");
      return false;
    }

    return true;
  }

  function setErrorMessage(msg) {
    setErrorText(msg);
  }

  function handleInputChange(e, type) {
    e.stopPropagation();
    resetText();
    type === "amount" ? validateAmount() : validateReceiverAddress();
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
    valid = valid && validateReceiverAddress();
    valid = valid && validateAmount();

    if (valid) {
      setStartTransactionCounter(prev => prev + 1);
    }

    setLoading(false);
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-app-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "form-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "erg-icon"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _ergoIcon.default,
    width: "40px",
    alt: "Ergo Icon"
  }), /*#__PURE__*/_react.default.createElement("label", {
    className: "title-label"
  }, "Admin Panel")), walletConnected ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "labels-container"
  }, ["Customer", "Status", "Product", "Created (UTC)"].map((column, index) => {
    return /*#__PURE__*/_react.default.createElement("label", {
      className: index === 0 ? "column-label customer" : "column-label"
    }, " ", column, " ");
  })), subsList && subsList.map((prop, index) => {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "rows-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "row-item customer"
    }, " ", prop.customer, " "), /*#__PURE__*/_react.default.createElement("div", {
      className: "row-item",
      style: {
        color: prop.status === "active" ? "green" : "default"
      }
    }, " ", prop.status, " "), /*#__PURE__*/_react.default.createElement("div", {
      className: "row-item"
    }, " ", prop.product, " "), /*#__PURE__*/_react.default.createElement("div", {
      className: "row-item"
    }, " ", prop.created, " "));
  })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-wallet-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "wallet-button"
  }, /*#__PURE__*/_react.default.createElement(_ErgoDappConnectorAdmin.ErgoDappConnectorAdmin, {
    color: "bsblue",
    wasm: wasm,
    walletConnected: walletConnected,
    setWalletConnected: setWalletConnected,
    startTransactionCounter: startTransactionCounter,
    receiverWalletAddress: receiverAddressRef.current.value,
    sendValue: amountRef.current.value * 1000000000,
    setErrorMessage: setErrorMessage,
    setLoading: setLoading,
    setSuccessText: setSuccessText,
    setSubsList: setSubsList
  }), loading ? /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: "grey",
      fontSize: "15px"
    }
  }, "Loading subscriptions...") : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null)))));
}