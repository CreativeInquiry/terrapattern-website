# $stdout.sync = true

require './terrapattern'

use Rack::Deflater, include: ["text/html", "application/json", "text/css", "text/javascript"]
# 

memcache_servers = ENV["MEMCACHEDCLOUD_SERVERS"] || "localhost"
use Rack::Cache,
  verbose: true,
  metastore:   "memcached://#{memcache_servers}",
  entitystore: "memcached://#{memcache_servers}"


if ENV["TERRAPATTERN_USERNAME"] && ENV["TERRAPATTERN_PASSWORD"]
  use Rack::Auth::Basic, "Restricted Area" do |username, password|
    username == ENV["TERRAPATTERN_USERNAME"] and password == ENV["TERRAPATTERN_PASSWORD"]
  end
end

run Rack::URLMap.new "/" => Terrapattern