require 'net/http'
require 'json'
require 'date'

url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
uri = URI(url)

response = Net::HTTP.get(uri)
data = JSON.parse(response)

# california_data = []
# data["features"].each do |feature|
#    if feature["properties"]["place"].match(/CA|California/)
#       california_data.append(feature)
#    end
# end

# one liner
a = data["features"].select{|feature| feature["properties"]["place"].match(/CA|California/)}
# a = a["properties"].sort_by["time"]

a.each do |event|
   print Time.at(event["properties"]["time"] / 1000).utc.to_datetime
   print " | " + event["properties"]["place"] + " | "
   puts "Magnitude: " + event["properties"]["mag"].to_s
end
