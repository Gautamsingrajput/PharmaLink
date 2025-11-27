#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// 1. NETWORK CONFIGURATION
const char* ssid = "Mobile";
const char* password = "HP1234567890";

// 2. BACKEND CONFIGURATION
const char* serverName = "http://10.136.239.151:5000/product/data";

// 3. SENSOR CONFIGURATION
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// 4. PRODUCT ID
int productID = 2;

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nConnected! IP Address: ");
  Serial.println(WiFi.localIP());

  dht.begin();
}

void loop() {
  delay(5000);

  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read DHT!");
    return;
  }

  float hic = dht.computeHeatIndex(t, h, false);

  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    String body = "{\"temp\":" + String((int)t) + 
                  ",\"humidity\":" + String((int)h) +
                  ",\"heatindex\":" + String((int)hic) +
                  ",\"pid\":" + String(productID) + "}";

    Serial.println("Sending: " + body);

    int response = http.POST(body);
    Serial.println(response);
    Serial.println(http.getString());

    http.end();
  }
  else {
    Serial.println("WiFi Disconnected");
  }
}
