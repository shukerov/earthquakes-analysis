require 'net/http'
require 'json'
require 'date'
# california_data = []
# data["features"].each do |feature|
#    if feature["properties"]["place"].match(/CA|California/)
#       california_data.append(feature)
#    end
# end

# one liner
   # matches = data["features"].select{ |feature|
   #    feature["properties"]["place"].match(/CA|California/)
   # }

   # matches.each do |event|
   #    result_string += Time.at(event["properties"]["time"] / 1000).utc.to_datetime.to_s
   #    result_string += " | " + event["properties"]["place"] + " | "
   #    result_string += "Magnitude: " + event["properties"]["mag"].to_s + "\n"
   # end
#

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
response = Net::HTTP.get(uri)
data = JSON.parse(response)

# log results to file
file = File.open("ruby-output.txt", "w")
file.puts(get_california_data(data))
file.close
