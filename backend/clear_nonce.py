from web3 import Web3
from web3.middleware import geth_poa_middleware
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(r'g:\EDI\blockChainPharmaSupplyChain\SupplyChain\backend\.env')
load_dotenv(dotenv_path=env_path)

RPC_URL = os.getenv("RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
ACCOUNT_ADDRESS = os.getenv("ACCOUNT_ADDRESS")

if not RPC_URL or not PRIVATE_KEY or not ACCOUNT_ADDRESS:
    print("Error: Missing environment variables.")
    exit(1)

w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

if not w3.is_connected():
    print("Error: Could not connect to blockchain.")
    exit(1)

account = w3.to_checksum_address(ACCOUNT_ADDRESS)

# Get Nonces
latest_nonce = w3.eth.get_transaction_count(account, 'latest')
pending_nonce = w3.eth.get_transaction_count(account, 'pending')

print(f"Account: {account}")
print(f"Latest (Confirmed) Nonce: {latest_nonce}")
print(f"Pending Nonce: {pending_nonce}")

if pending_nonce > latest_nonce:
    print(f"There are {pending_nonce - latest_nonce} pending transactions.")
    
    # Send a replacement transaction for the *latest* nonce to clear the clog
    print("Attempting to clear the first stuck transaction...")
    
    try:
        tx = {
            'nonce': latest_nonce,
            'to': account,
            'value': 0,
            'gas': 21000,
            'gasPrice': w3.to_wei('50', 'gwei'), # High gas price to replace
            'chainId': w3.eth.chain_id
        }
        
        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        print(f"Replacement transaction sent! Hash: {tx_hash.hex()}")
        
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print("Transaction confirmed! Nonce cleared.")
        
    except Exception as e:
        print(f"Error sending replacement transaction: {e}")

else:
    print("No pending transactions detected (Pending == Latest).")
