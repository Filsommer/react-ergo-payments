import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import ERGicon from "./assets/ergo-icon.png";

import "./styles.css";
import React from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function WalletHover({
  disconnect,
  sigUSDBalance,
  ergBalance,
  sigRSVBalance,
  ergopadBalance,
  netaBalance,
  paideiaBalance,
}) {

  function handleClearWallet() {
    disconnect();
  }
  return (
    <Menu as="div" className="mainDiv">
      <Transition
        show={true}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="mainMenuItem"
        >
          <div
            style={{
              padding: "0.25rem 0 0.25rem",
              marginBottom: "1px",
              marginTop: "1px",
            }}
          >
            {ergBalance !== 0 && (
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(active ? "item1" : "item2", "item3")}
                  >
                    <img src={ERGicon} className="token-icon-img" />
                    <p>
                      ERG Balance:
                      <br />
                      {ergBalance > 0 ? ergBalance.toFixed(2) : 0} ERG
                    </p>
                  </a>
                )}
              </Menu.Item>
            )}
            <Menu.Item>
              {({ active }) => (
                <a
                  style={{ textAlign: "center" }}
                  href="#"
                  onClick={handleClearWallet}
                  className={classNames(active ? "item1" : "item2", "item3")}
                >
                  <p
                    style={{
                      color: "rgba(205, 10, 10, 0.8)",
                      margin: "0 auto",
                      fontSize: "0.95rem",
                    }}
                  >
                    Clear Wallet
                  </p>
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}