# $stdout.sync = true

require './terrapattern'

if ENV["RACK_ENV"] == "production"
  use Rack::Deflater, include: ["text/html", "application/json", "text/css", "text/javascript", "application/pdf"]

  dalli_config = {
    :username => ENV["MEMCACHEDCLOUD_USERNAME"],
    :password => ENV["MEMCACHEDCLOUD_PASSWORD"],
    :failover => true,
    :socket_timeout => 1.5,
    :socket_failure_delay => 0.2,
    :pool_size => 5,
    :compress => true,
    :expires_in => 24*60*60
  }
  cache = Dalli::Client.new(ENV["MEMCACHEDCLOUD_SERVERS"].split(','), dalli_config)


  use Rack::Cache,
    verbose: true,
    metastore:   cache,
    entitystore: cache

  if ENV["TERRAPATTERN_USERNAME"] && ENV["TERRAPATTERN_PASSWORD"]
    use Rack::Auth::Basic, "Restricted Area" do |username, password|
      username == ENV["TERRAPATTERN_USERNAME"] and password == ENV["TERRAPATTERN_PASSWORD"]
    end
  end
end



run Rack::URLMap.new "/" => Terrapattern