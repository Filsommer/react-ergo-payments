import { Fragment, useState } from "react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import SigRSVicon from "../../assets/sigrsv-icon.svg";
import ERGicon from "../../assets/ergo-icon.svg";

import "../Requirements/Requirements.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function WalletHover({
  disconnect,
  owlBalance,
  sigUSDBalance,
  ergBalance,
}) {
  const [open, setOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  console.log("modal state is: " + modalOpen);
  const triggerModal = () => {
    console.log("I enter triggerModal");
    setModalOpen(!modalOpen);
  };
  return (
    <>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
      <Dialog.Panel>
        <Dialog.Title>Deactivate account</Dialog.Title>
        <Dialog.Description>
          This will permanently deactivate your account
        </Dialog.Description>

        <p>
          Are you sure you want to deactivate your account? All of your data
          will be permanently removed. This action cannot be undone.
        </p>

        <button onClick={() => setModalOpen(false)}>Deactivate</button>
        <button onClick={() => setModalOpen(false)}>Cancel</button>
      </Dialog.Panel>
    </Dialog>
      <Menu as="div" className="mainDiv">
        <Transition
          show={open}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="mainMenuItem">
            <div style={{ padding: "2rem 0 0.25rem", marginBottom: "1px" }}>
              {ergBalance != 0 && (
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "item1" : "item2",
                        "item3"
                      )}
                    >
                      <img src={ERGicon} className="token-icon-img" />
                      <p>
                        ERG Balance:
                        <br />
                        {ergBalance} ERG
                      </p>
                    </a>
                  )}
                </Menu.Item>
              )}
              {sigUSDBalance != 0 && (
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "item1" : "item2",
                        "item3"
                      )}
                    >
                      <img src={SigRSVicon} className="token-icon-img" />
                      <p>
                        SigUSD Balance:
                        <br />
                        {sigUSDBalance} SigUSD
                      </p>
                    </a>
                  )}
                </Menu.Item>
              )}
              {owlBalance != 0 && (
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "item1" : "item2",
                        "item3"
                      )}
                    >
                      <img src={ERGicon} className="token-icon-img" />
                      <p>
                        OWL Balance:
                        <br />
                        {owlBalance} OWL
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
                    onClick={disconnect}
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
    </>
  );
}
