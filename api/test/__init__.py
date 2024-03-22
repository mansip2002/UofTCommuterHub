from datetime import datetime
from geopy.distance import geodesic
from lib.geocode import geocode_address_osm
from lib.geocode import geocode_address_geocodemaps

def get_coordinates(address):
    location = geocode_address_osm(address)
    if location:
        return location[0], location[1]
    else:
        raise ValueError(f"Could not find coordinates for address: {address}")

def euclidean_distance(address1, address2):
    lat1, lon1 = get_coordinates(address1)
    lat2, lon2 = get_coordinates(address2)
    return geodesic((lat1, lon1), (lat2, lon2)).kilometers

def time_difference(start_time1, start_time2):
    time_format = "%H:%M:%S"
    start_datetime1 = datetime.strptime(start_time1, time_format)
    start_datetime2 = datetime.strptime(start_time2, time_format)
    
    # Calculate the time difference in seconds
    time_difference_seconds = (start_datetime2 - start_datetime1).total_seconds()

    time_difference_hours = time_difference_seconds / 3600
    
    return time_difference_hours