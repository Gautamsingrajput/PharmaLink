from web3 import Web3
from web3.middleware import geth_poa_middleware
import json
import os
from config import RPC_URL, PRIVATE_KEY, ACCOUNT_ADDRESS, CONTRACT_ADDRESS

print(f"DEBUG: RPC_URL={RPC_URL}")
print(f"DEBUG: ACCOUNT_ADDRESS={ACCOUNT_ADDRESS}")


# Initialize Web3
w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

# Load ABI
try:
    with open("abi.json", "r") as f:
        abi = json.load(f)
except FileNotFoundError:
    print("Error: abi.json not found.")
    abi = []

# Initialize Contract
account = w3.toChecksumAddress(ACCOUNT_ADDRESS)
address = w3.toChecksumAddress(CONTRACT_ADDRESS)
deployed_contract = w3.eth.contract(address=address, abi=abi)


def send_transaction(function_call):
    """Helper to build, sign, and send a transaction."""
    try:
        transaction = function_call.buildTransaction({
            'from': account,
            'nonce': w3.eth.get_transaction_count(account),
        })
        signed_tx = w3.eth.account.sign_transaction(transaction, PRIVATE_KEY)
        txn_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        txn_receipt = w3.eth.wait_for_transaction_receipt(txn_hash)
        print(f"Transaction Receipt: {txn_receipt}")
        return txn_receipt
    except Exception as e:
        print(f"Transaction failed: {e}")
        return None


def setWorker(name):
    receipt = send_transaction(deployed_contract.functions.setWorker(name))
    return "worker added" if receipt else "failed to add worker"


def AddProduct(name, price, description, reqtemp, manufacturing, ts):
    receipt = send_transaction(deployed_contract.functions.AddProduct(
        name, price, description, reqtemp, manufacturing))
    return "product added" if receipt else "failed to add product"


def AddStatus(location, temp, humidity, heatindex, wid, pid, total_quantity, flag):
    receipt = send_transaction(deployed_contract.functions.AddStatus(
        location, temp, humidity, heatindex, wid, pid, total_quantity, flag))
    return "status added" if receipt else "failed to add status"


def AddData(temp, humidity, heatindex, pid):
    receipt = send_transaction(deployed_contract.functions.AddData(
        temp, humidity, heatindex, pid))
    return "sensor data added" if receipt else "failed to add sensor data"


def getProductsList():
    return deployed_contract.functions.getProductsList().call()


def getWorkersList():
    return deployed_contract.functions.getWorkerssList().call()


def getProductStatus(pid):
    return deployed_contract.functions.getProductStatus(pid).call()


def getProductData(pid):
    return deployed_contract.functions.getProductData(pid).call()


def getProducts():
    return deployed_contract.functions.getProducts().call()


def getProduct(pid):
    return deployed_contract.functions.products(pid).call()
