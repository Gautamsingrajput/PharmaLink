import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(r'g:\EDI\blockChainPharmaSupplyChain\SupplyChain\backend\.env')
print(f"DEBUG: env_path={env_path}")
print(f"DEBUG: exists={env_path.exists()}")
load_dotenv(dotenv_path=env_path)




RPC_URL = os.getenv("RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
ACCOUNT_ADDRESS = os.getenv("ACCOUNT_ADDRESS")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
