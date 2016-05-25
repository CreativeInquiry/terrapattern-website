# Loading Libraries 
require 'sinatra/base'
require "sinatra/reloader" 
require "sinatra/json"
require "sinatra/content_for"
require "sinatra/namespace"
require 'sinatra/partial'
require "sinatra/subdomain"

# Rendering Libraries
require "haml"
require 'tilt/haml'
require "sass"
require 'yaml'

#Caching Libaries
require 'dalli'
require "rack-cache"

# Terrapattern-specific libraries
require_relative "lib/tile_lookup"
require_relative "lib/markdown_partial"
require_relative "lib/helpers"


#######################################
##          Main Class
#######################################

class Terrapattern < Sinatra::Base



  # Register the various extensions and helpers
  register Sinatra::Namespace
  register Sinatra::Partial
  register Sinatra::Subdomain

  helpers Sinatra::JSON
  helpers Sinatra::ContentFor
  helpers Sinatra::TerrapatternHelpers
 
  configure do

      # Caching Info
      set :server_start_time, Time.now
      set :cache_max_age, 60*5
      set :static_cache_control, [:public, :max_age => settings.cache_max_age]


      # Load the data from the cities config file
      set :city_data, YAML::load(File.open('data/cities.yaml'))["cities"]
      settings.city_data.each do |city|
        city["geojson"] =  File.exist?(city["geojson"]) ? File.read(city["geojson"]) : nil
        city["water"] = File.exist?(city["water"]) ? File.read(city["water"]) : nil
      end

      set :city_urls, settings.city_data.collect{|city| city["url_name"]}
      set :city_names, settings.city_data.collect{|city| city["name"]}


      # initialize some of the helper classes
      # TODO: Convert these to proper Sinatra Extensions. (Low priority—they work.)
      $tile_lookup = TileLookup.new
      $markdown = MarkdownPartial.new


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
      $cache = Dalli::Client.new(ENV["MEMCACHEDCLOUD_SERVERS"].split(','), dalli_config)
  end

  # Set up some specific functionality for the development environment
  configure :development do
    register Sinatra::Reloader
     also_reload 'lib/markdown_partial.rb' 
     also_reload 'lib/helpers.rb' 
  end

  ##----
  # BELOW HERE ARE ROUTES
  ##----

  before do
    last_modified settings.server_start_time
    etag settings.server_start_time.to_s
    expires settings.cache_max_age, :public, :must_revalidate
  end


  # Handle the landing page
  subdomain :www do
    get '/' do
      
      @use_alt_header = true
      haml :index
    end
  end
 
  subdomain do

    # The actual Terrapattern interface
    get "/" do
      send_to_www unless settings.city_urls.include? subdomain
      @city_data = settings.city_data.find{|city| city["url_name"] == subdomain.to_s}
      @exhibition_mode = (params["exhibit"] == "true")
      haml :interface
    end

    # Static pages.  Note that they will redirect to the www subdomain.
    get "/team" do
      send_to_www
      haml :team
    end

    get "/about" do
      send_to_www
      haml :about
    end

    get "/faq" do
      send_to_www
      haml :faq
    end

    get "/references" do
      send_to_www
      haml :references
    end

    # JSON route for connecting to the search implementation
    get "/search" do
      redirect("/") unless settings.city_urls.include? subdomain
      zoom_level = 19
      result_count = 96
      key = [subdomain.to_s,zoom_level,result_count,params.values].flatten.join("_")
      content = $cache.get(key)
      unless content
        @city_data = settings.city_data.find{|city| city["url_name"] == subdomain.to_s}
        content =  $tile_lookup.lookup(params['lat'], params['lng'], @city_data["search_locale"], zoom_level, result_count, params)
        $cache.set(key,content)
      end
      json content
    end

    post "/download" do
      content_type :json
      nameparts = ["terrapattern"]  
      obj = JSON.parse(params["geojson"])
      obj = {"properties" =>  {"note": "This collection of points represents a results set of visually similar locations.  It was created using Terrapattern.", "url": "http://www.terrapattern.com", "timestamp": Time.now.to_s}}.merge(obj)
      id = obj["features"][0]["id"].gsub("_z19.png","").to_s
      attachment "terrapattern_#{id}.json"
      JSON.pretty_generate(obj)
    end

    # Special helper for the Markdown images.
    get '/images/*.*' do |file,ext|
      path = "content/images/#{file}.#{ext}"
      unless File.exist? path
        pass
      end
      content_type ext.to_sym
      File.read(path, mode: "rb")
    end

  end
end