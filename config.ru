# $stdout.sync = true

require './terrapattern'

use Rack::Session::Cookie, :secret => ENV["SESSION_SECRET"]
use Rack::Deflater
# 

use Rack::Auth::Basic, "Restricted Area" do |username, password|
  username == ENV["TERRAPATTERN_USERNAME"] and password == ENV["TERRAPATTERN_PASSWORD"]
end

run Rack::URLMap.new "/" => Terrapattern