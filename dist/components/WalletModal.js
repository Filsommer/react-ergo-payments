"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WalletHover;

require("core-js/modules/es.number.to-fixed.js");

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@headlessui/react");

var _ergoIcon = _interopRequireDefault(require("./assets/ergo-icon.png"));

require("./styles.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function classNames() {
  for (var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++) {
    classes[_key] = arguments[_key];
  }

  return classes.filter(Boolean).join(" ");
}

function WalletHover(_ref) {
  let {
    disconnect,
    sigUSDBalance,
    ergBalance,
    sigRSVBalance,
    ergopadBalance,
    netaBalance,
    paideiaBalance
  } = _ref;

  function handleClearWallet() {
    disconnect();
  }

  return /*#__PURE__*/_react.default.createElement(_react2.Menu, {
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
    className: "mainMenuItem"
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: "0.25rem 0 0.25rem",
      marginBottom: "1px",
      marginTop: "1px"
    }
  }, ergBalance !== 0 && /*#__PURE__*/_react.default.createElement(_react2.Menu.Item, null, _ref2 => {
    let {
      active
    } = _ref2;
    return /*#__PURE__*/_react.default.createElement("a", {
      href: "#",
      className: classNames(active ? "item1" : "item2", "item3")
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: _ergoIcon.default,
      className: "token-icon-img"
    }), /*#__PURE__*/_react.default.createElement("p", null, "ERG Balance:", /*#__PURE__*/_react.default.createElement("br", null), ergBalance > 0 ? ergBalance.toFixed(2) : 0, " ERG"));
  }), /*#__PURE__*/_react.default.createElement(_react2.Menu.Item, null, _ref3 => {
    let {
      active
    } = _ref3;
    return /*#__PURE__*/_react.default.createElement("a", {
      style: {
        textAlign: "center"
      },
      href: "#",
      onClick: handleClearWallet,
      className: classNames(active ? "item1" : "item2", "item3")
    }, /*#__PURE__*/_react.default.createElement("p", {
      style: {
        color: "rgba(205, 10, 10, 0.8)",
        margin: "0 auto",
        fontSize: "0.95rem"
      }
    }, "Clear Wallet"));
  })))));
}