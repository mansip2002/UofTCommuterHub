import requests

def geocode_address_osm(address):
    base_url = "https://nominatim.openstreetmap.org/search"
    
    if "Ontario" or "ON" not in address :
        address += ", Ontario"

    if "Canada" or "CA" not in address : 
        address += ", Canada"

    params = {"q": address, "format": "json"}
    try:
        response = requests.get(base_url, params=params, timeout=10)  # Set timeout to 10 seconds
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)
        data = response.json()

        if data:
            latitude = float(data[0]["lat"])
            longitude = float(data[0]["lon"])
            return latitude, longitude
        else:
            print("Nominatim geocoding failed. Trying backup.")
            return geocode_address_geocodemaps(address)

    except requests.Timeout:
        print("Nominatim request timed out. Trying backup.")
        return geocode_address_geocodemaps(address)

    except requests.RequestException as e:
        print(f"Nominatim request failed: {e}")
        return geocode_address_geocodemaps(address)

def geocode_address_geocodemaps(address):
    api_key = "65a73b36d1e45548490526ikt0237ab"  
    base_url_geocode_maps = f"https://geocode.maps.co/search?q={address}&api_key={api_key}"
    response_geocode_maps = requests.get(base_url_geocode_maps, timeout=10)
    data = response_geocode_maps.json()

    if data and isinstance(data, list) and "lat" in data[0] and "lon" in data[0]:
            latitude = float(data[0]["lat"])
            longitude = float(data[0]["lon"])
            return latitude, longitude
    else:
        print("Geocodemaps geocoding failed. No results.")
        return None
