# README

 Two solutions have been provided to the problem.
 A webpage demonstrates the Javascript solution, and also links to a Ruby solution
 which can be ran in a terminal.

# JS Solution:
 To run the demo press the "Generate JS Output" button below.
 You can then download the generated output by pressing the "Download JS Output" button.

## Notes:
 The time zone of the timestamp is set to zero offset UTC, as the example
 output required. It is represented by Z instead of +00:00 at the end of the string.
 The ruby solution matches the example output exactly using +00:00.

 The endpoint is fetched when the page loads. Meaning that if you press the generate output button
 more than once it won't refresh that data. The page needs to be realoaded.

# Ruby Solution:
 To run the ruby script, press the "Download Ruby Solution". The command "ruby script.rb"
 will run the script and generate an output file "ruby-output.txt". To view the ruby
 code you can press the "View Ruby Solution" button.

# Things I didn't get to:
 ----------------------------
1. Both scripts will crash ungracefully if the data is missing one of desired fields.
 This could be easily fixed by checking for nil values.

2. Both scripts can use some performance improvements. In the ruby script I iterate over the
 data once, then sort it (another iteration), and finally I iterate again to construct
 the output string. This can be improved by matching and storing the matches in a minimum
 heap (where the timestamp is used for comparison). This way we save one iteration over the
 data points, and enjoy a O(1) removal from the heap when constructing the output string.
