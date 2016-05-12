$stdout.sync = true

require './terrapattern'

use Rack::Deflater
# 

if ENV["TERRAPATTERN_USERNAME"] && ENV["TERRAPATTERN_PASSWORD"]
  use Rack::Auth::Basic, "Restricted Area" do |username, password|
    username == ENV["TERRAPATTERN_USERNAME"] and password == ENV["TERRAPATTERN_PASSWORD"]
  end
end

run Rack::URLMap.new "/" => Terrapattern