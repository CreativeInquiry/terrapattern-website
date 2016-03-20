# $stdout.sync = true

require './terrapattern'

# use Rack::Session::Cookie, :secret => ENV["SESSION_SECRET"]
# use Rack::Deflater

run Rack::URLMap.new "/" => Terrapattern





