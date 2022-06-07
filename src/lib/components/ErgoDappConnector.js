import { useState, useEffect, Fragment } from "react";
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import wallet_black from "./assets/ergo-wallet-black.png";
import wallet_white from "./assets/ergo-wallet-white.png";
import WalletHover from "./WalletModal.js";
import "./styles.css";
import NautilusLogo from "./assets/NautilusLogo.png";
import JSONBigInt from "json-bigint";
import bigInt from "big-integer"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NANOERG_TO_ERG = 1000000000;

const ErgoDappConnector = ({ color, wasm, walletConnected, setWalletConnected, startTransactionCounter, price, setSuccessTx, setErrorMessage, setSuccessText, setLoading, receiverWalletAddress, setSubmitting }) => {
  const [ergoWallet, setErgoWallet] = useState();
  const [ergBalance, setErgBalance] = useState(0);
  const [showSelector, setShowSelector] = useState(false);
  const [walletHover, setWalletHover] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState();

  window.addEventListener("ergo_wallet_disconnected", () => {
    disconnectWallet();
  });

  useEffect(() => {
    document.addEventListener("keydown", escFunctionPress, false);
    const checkWallet = localStorage.getItem("walletConnected");
    if (checkWallet === "true") {
      setDefaultAddress();
      window.ergoConnector.nautilus.connect().then((access_granted) => {
        if (access_granted) {
          setWalletConnected(true);
          window.ergoConnector.nautilus.getContext().then((context) => {
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

  useEffect(() => {
    if (startTransactionCounter) {
        startTx().finally(() => { setLoading(false); });
    }
  }, [startTransactionCounter])

  function escFunctionPress(event) {
    if (event.key === "Escape") {
        setWalletHover(false);
        setShowSelector(false);
    }
  }

  async function getCurrentHeight() {
    let url = "https://api.ergoplatform.com/api/v1/blocks?limit=1";
    return await fetch(url)
        .then(res => res.json())
        .then(data => { return data["total"]; })
  }


  function parseUTXO(json) {
    var newJson = { ...json };
    if (newJson.assets === null) {
        newJson.assets = [];
    }
    return {
        boxId: newJson.boxId,
        value: newJson.value.toString(),
        ergoTree: newJson.ergoTree,
        assets: newJson.assets.map(asset => ({
            tokenId: asset.tokenId,
            amount: asset.amount.toString(),
        })),
        additionalRegisters: newJson.additionalRegisters,
        creationHeight: newJson.creationHeight,
        transactionId: newJson.transactionId,
        index: newJson.index
    };
  } 

  function parseTransactionData(str) {
     let json = JSONBigInt.parse(str);
     return {
        id: json.id,
        inputs: json.inputs,
        dataInputs: json.dataInputs,
        outputs: json.outputs.map(output => parseUTXO(output)),
     }
    }

  async function startTx(e) {
    if (!ergoWallet) {
        return;
    }
    async function getUtxos(amountToSend) {
        const fee = bigInt(wasm.TxBuilder.SUGGESTED_TX_FEE().as_i64().to_str());
        const fullAmount = bigInt(1000) * amountToSend + fee;
        const utxos = await ergoWallet.get_utxos(fullAmount.toString());
        const filteredUtxos = [];
        for (const utxo of utxos) {
            try {
                await wasm.ErgoBox.from_json(JSONBigInt.stringify(utxo));
                filteredUtxos.push(utxo);
            } catch (e) {
                console.log('[getUtxos] UTXO failed parsing: ', utxo, e);
            }
        }
        return filteredUtxos;
    }

    const creationHeight = await getCurrentHeight();
    console.log("creationHeight", creationHeight);

    const amountToSend = bigInt(price * 1000000000);
    const amountToSendBoxValue = wasm.BoxValue.from_i64(wasm.I64.from_str(amountToSend.toString()));
    const utxos = await getUtxos(amountToSend);
    let utxosValue = utxos.reduce((acc, utxo) => acc += bigInt(utxo.value), bigInt(0));
    console.log('utxos', utxosValue, utxos);

    const changeAddr = await ergoWallet.get_change_address();

    const selector = new wasm.SimpleBoxSelector();
    let boxSelection;
    try {
        boxSelection = selector.select(
            wasm.ErgoBoxes.from_boxes_json(utxos),
            wasm.BoxValue.from_i64(amountToSendBoxValue.as_i64().checked_add(wasm.TxBuilder.SUGGESTED_TX_FEE().as_i64())),
            new wasm.Tokens());
    } catch (e) {
      try {
        const missingERGs = (e.split("(")[1].split(" ")[0] / NANOERG_TO_ERG).toFixed(2);
        setErrorMessage("Insufficient funds: " + missingERGs + " ERG missing");
      } catch (e) {
        setErrorMessage("Insufficient funds!");
      }
      return;
    }
    console.log(`boxes selected: ${boxSelection.boxes().len()}`);
    const outputCandidates = wasm.ErgoBoxCandidates.empty();

    let outBoxBuilder;
    try {
        outBoxBuilder = new wasm.ErgoBoxCandidateBuilder(
            amountToSendBoxValue,
            wasm.Contract.pay_to_address(wasm.Address.from_base58(receiverWalletAddress)),
            creationHeight);
            const byteArray = new TextEncoder().encode(`insert custom msg here`);
            const encodedRef = new Uint8Array(byteArray.buffer);
            outBoxBuilder.set_register_value(4, wasm.Constant.from_byte_array(encodedRef));
            console.log('R4:', new TextDecoder().decode(outBoxBuilder.register_value(4).to_byte_array()));
    } catch (e) {
        setErrorMessage("The address you provided is invalid.");
        return;
    }
    try {
        outputCandidates.add(outBoxBuilder.build());
    } catch (e) {
        console.log(`building error: ${e}`);
        throw e;
    }

    const txBuilder = wasm.TxBuilder.new(
        boxSelection,
        outputCandidates,
        creationHeight,
        wasm.TxBuilder.SUGGESTED_TX_FEE(),
        wasm.Address.from_base58(changeAddr),
        wasm.BoxValue.SAFE_USER_MIN(), "oi");
    const dataInputs = new wasm.DataInputs();
    txBuilder.set_data_inputs(dataInputs);

    const tx = parseTransactionData(txBuilder.build().to_json());


    const correctTx = parseTransactionData(wasm.UnsignedTransaction.from_json(JSONBigInt.stringify(tx)).to_json());
    
    correctTx.inputs = correctTx.inputs.map(box => {
        const fullBoxInfo = utxos.find(utxo => utxo.boxId === box.boxId);
        return {
            ...fullBoxInfo,
            extension: {}
        };
    });

    async function signTx(txToBeSigned) {
        try {
            return await ergoWallet.sign_tx(txToBeSigned);
        } catch (err) {
            const msg = `[signTx] Error: ${JSON.stringify(err)}`;
            console.error(msg, err);
            setErrorMessage("Transaction was not signed.");
            return null;
        }
    }

    async function submitTx(txToBeSubmitted) {
        try {
            return await ergoWallet.submit_tx(txToBeSubmitted);
        } catch (err) {
            const msg = `[submitTx] Error: ${JSON.stringify(err)}`;
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
            console.log(`No signed tx`);
            return null;
        }
        msg("Transaction signed - awaiting submission");
        setSubmitting(true);
        const txId = await submitTx(signedTx);
        setSubmitting(false);
        if (!txId) {
            console.log(`No submitted tx ID`);
            return null;
        }
        msg("Transaction submitted");
        return txId;
    }

    processTx(correctTx).then(txId => {
        console.log('[txId]', txId);
        if (txId) {
            let url = "https://explorer.ergoplatform.com/en/transactions/" + txId;
            setSuccessTx({txId: txId, amountSent: amountToSend.valueOf() / NANOERG_TO_ERG});
            setSuccessText({text: "Success! Transaction will appear soon: ", url: url});
        }
    });
}


  useEffect(() => {
    if (typeof ergoWallet !== "undefined") {
      // get ERG balance
      ergoWallet.get_balance().then(function (balance) {
        setErgBalance(balance / NANOERG_TO_ERG);
      });

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
      return (
        str.substring(0, parseInt(len / 2)) +
        sep +
        str.substring(str.length - parseInt(len / 2), str.length)
      );
    }
  };

  function disconnectWallet() {
    if (typeof window.ergo_request_read_access === "undefined") {
    } else {
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
    if (walletConnected) setWalletHover((prev) => !prev);
    else {
      setShowSelector((prev) => !prev);
    }
  };

  const connectNautilus = () => {
    if (!window.ergoConnector) {
      return;
    }
    window.ergoConnector.nautilus.isConnected().then((connected) => {
      if (!walletConnected) {
        window.ergoConnector.nautilus.connect().then((access_granted) => {
          if (access_granted) {
            setWalletConnected(true);
            window.ergoConnector.nautilus.getContext().then((context) => {
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

  return (
    <div className="package-container">
      {showSelector && (
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
            <Menu.Items className="mainMenuItem" style={{ marginTop: "48px" }}>
              <div style={{ marginBottom: "1px" }}>
                <Menu.Item onClick={connectNautilus}>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "item1" : "item2",
                        "item3"
                      )}
                    >
                      <img
                        src={NautilusLogo}
                        style={{
                          height: "30px",
                          marginRight: "48px",
                          marginLeft: "8px",
                        }}
                      />
                      Nautilus
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}

      <div id="header-wallet-wrapper" onClick={handleWalletTrue}>
        <div
          id="header-wallet"
          style={{
            backgroundColor: colorStylingArray[color][0],
            color: colorStylingArray[color][1],
            flexDirection: walletConnected ? "column" : "row",
            border: color === "white" ? "1px solid black" : "",
          }}
        >
          {!walletConnected && (
            <img
              src={
                colorStylingArray[color][1] === "white"
                  ? wallet_white
                  : wallet_black
              }
              id="header-wallet-image"
            />
          )}
          <div id="wallet-connect">
            <span>
              {walletConnected ? (
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <img
                      src={NautilusLogo}
                      style={{ height: "20px", marginLeft: "20px" }}
                    />
                    <span
                      style={{
                        color: colorStylingArray[color][1],
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "150px",
                        marginLeft: "5px",
                      }}
                    >
                      {defaultAddress}
                    </span>
                  </span>
                </span>
              ) : (
                <span style={{color:"white", marginLeft: "-10px"}}>Connect Wallet</span>
              )}
            </span>
          </div>
          {walletHover && walletConnected && (
            <WalletHover 
              disconnect={disconnectWallet}
              ergBalance={ergBalance}
            />
          )}
        </div>
      </div>
    </div>
  );
};

 
export default ErgoDappConnector;