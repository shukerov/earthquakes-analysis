require 'net/http'
require 'json'
require 'date'
# readable solution
# returns a string containing the desired output
def get_california_data(data)
   result_string = ""
   california_data = []

   # select California data points, and filter the needed information
   data["features"].each do |feature|

      # earthquake is in California
      if feature["properties"]["place"].match(/CA|California/)

         # filter only needed information
         california_data.append({
            time: feature["properties"]["time"] / 1000, 
            place: feature["properties"]["place"],
            mag: feature["properties"]["mag"].to_s
         })
      end
   end

   # sort the data
   california_data.sort_by! { |h| h[:time] }

   # add to result string
   result_string = california_data.map{ |dp| 
      Time.at(dp[:time]).utc.to_datetime.to_s + " | " +
      dp[:place] + " | Magnitude: " +
      dp[:mag]
   }.join("\n")

   return result_string
end

# json endpoint url
url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
uri = URI(url)

# fetch JSON data
response = Net::HTTP.get_response(uri)

if response.code == '200'
   data = JSON.parse(response.body)
else
   puts "Failed to fetch data"
   exit(1)
end

# log results to file
file = File.open("ruby-output.txt", "w")
file.puts(get_california_data(data))
file.close
