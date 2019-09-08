https://opendata.transport.nsw.gov.au/node/2171/exploreapi#!/default/get_spatial

[x] road_traffic_counts_station_reference 
[x] road_traffic_counts_yearly_summary 
[x] road_traffic_counts_hourly_permanent 
[x] road_traffic_counts_hourly_sample 

```
$ curl -X GET --header 'Accept: application/json' --header 'Authorization: apikey RxApztuMcUyI8dvS9QwfDI8uihAGeVPemwEk' 'https://api.transport.nsw.gov.au/v1/roads/spatial?format=geojson&q=select%20*%20from%20{}%20' > {}.json
```

e.g.
```
curl -X GET --header 'Accept: application/json' --header 'Authorization: apikey RxApztuMcUyI8dvS9QwfDI8uihAGeVPemwEk' 'https://api.transport.nsw.gov.au/v1/roads/spatial?format=geojson&q=select%20*%20from%20road_traffic_counts_hourly_sample%20' > yearlySample.json
```

curl -X GET --header 'Accept: application/json' --header 'Authorization: apikey RxApztuMcUyI8dvS9QwfDI8uihAGeVPemwEk' 'https://api.transport.nsw.gov.au/v1/roads/spatial?format=geojson&q=select%20*%20from%20road_traffic_counts_station_reference%20where%20suburb="ultimo"%20' 


https://opendata.transport.nsw.gov.au/dataset/street-parking