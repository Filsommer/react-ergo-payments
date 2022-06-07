import React, { useEffect, useState } from "react";
import ErgoDappConnector from "./ErgoDappConnector";
import "./styles.css";


function ErgoForm({price=0.01, receiverWalletAddress="9iPnRh5ga4Q9yvYXDYn3rFtc8KPeLR8cCQjUq6cT7FaQpRDpKtu", onSuccess, color="bsblue"}) {

    const [wasm, setWasmSDK] = useState();
    const [errorText, setErrorText] = useState("");
    const [successText, setSuccessText] = useState("");
    const [successTx, setSuccessTx] = useState();
    const [walletConnected, setWalletConnected] = useState(false);
    const [startTransactionCounter, setStartTransactionCounter] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadSDK().then(res => {
            setWasmSDK(res);
        })
        return () => setWasmSDK();
    }, []);

    useEffect(() => {
        if (!onSuccess) {
            console.log("No onSuccess callback specified")
        } else if (successTx) {
            onSuccess(successTx.txId, successTx.amountSent);
            setSuccessTx();
        }
        return () => setSuccessTx();
    }, [successTx]);

    // CRA does not support WASM, so we used craco as a workaround. See: https://dev.to/nicolasrannou/wasm-in-create-react-app-4-in-5mn-without-ejecting-cf6
    async function loadSDK() {
        const sdk = await import("ergo-lib-wasm-browser");
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

    return (
        <div className="app-container">
            <form className="form-container">
                <label className="text-field-label">
                    Wallet
                </label>
                <div className="wallet-container">
                    <div className="wallet-button">
                        <ErgoDappConnector color={color} wasm={wasm} walletConnected={walletConnected} setSuccessTx={setSuccessTx} setWalletConnected={setWalletConnected} 
                                            startTransactionCounter={startTransactionCounter} price={price} setErrorMessage={setErrorMessage} 
                                            setLoading={setLoading} setSubmitting={setSubmitting}
                                            setSuccessText={setSuccessText} receiverWalletAddress={receiverWalletAddress}/>
                    </div>
                    <a onClick={handleSend} className="send-button" href="#" style={{cursor: "pointer"}}>
                        {loading ? "Validating..." : (submitting ? "Submitting..." : "Submit")}
                    </a>
                </div>
                <span style={{fontStyle: "italic", fontSize: "0.75rem", color: (errorText ? "#f56565" : "#48bb78")}}>{errorText || successText?.text}</span>
                {successText?.text ? <a style={{color: "green", fontSize: "15px"}} href={successText.url} target="_blank" rel="noopener noreferrer">View Tx</a>: <></>}
            </form>
      </div>
    );
}

export default ErgoForm;