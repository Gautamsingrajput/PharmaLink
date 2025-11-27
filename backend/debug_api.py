import requests
import json

BASE_URL = "http://localhost:5000"
PRODUCT_ID = 1  # Assuming product ID 1 exists, or we can try to find one

def test_endpoint(url):
    print(f"Testing {url}...")
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"Response Text: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 20)

# 1. Get all products to find a valid ID
print("Fetching all products...")
try:
    response = requests.get(f"{BASE_URL}/product/")
    products = response.json()
    print(f"Found {len(products)} products.")
    if len(products) > 0:
        # The first element of the product tuple is the ID
        # In the smart contract: struct Product { uint256 id; ... }
        # web3 returns a list/tuple. id is at index 0.
        # But wait, is it a list of lists?
        # getProducts() returns Product[] memory.
        first_product = products[0]
        print(f"First Product: {first_product}")
        
        # ID might be an integer or a hex string depending on how it's returned
        # In the previous steps, we saw `parseInt(row[0]._hex)` in frontend, 
        # which implies the frontend receives an object with _hex for BigNumbers if using ethers.js directly.
        # But here we are using Python backend which uses web3.py. 
        # web3.py usually converts uint256 to int.
        
        pid = first_product[0]
        print(f"Using Product ID: {pid}")
        
        # 2. Test Single Product Fetch
        test_endpoint(f"{BASE_URL}/product/{pid}")
        
        # 3. Test Status Fetch
        test_endpoint(f"{BASE_URL}/product/status/{pid}")
    else:
        print("No products found to test individual endpoints.")
except Exception as e:
    print(f"Failed to fetch products list: {e}")
