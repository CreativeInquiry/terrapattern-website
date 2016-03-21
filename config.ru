# $stdout.sync = true

require './terrapattern'

# use Rack::Session::Cookie, :secret => ENV["SESSION_SECRET"]
# use Rack::Deflater
# 

use Rack::Auth::Basic, "Restricted Area" do |username, password|
  username == 'terrapattern' and password == 'banjo'
end


run Rack::URLMap.new "/" => Terrapattern





