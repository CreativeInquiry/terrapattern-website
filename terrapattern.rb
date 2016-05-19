# Loading Libraries 
require 'sinatra/base'
require "sinatra/reloader" 
require "sinatra/json"
require "sinatra/content_for"
require 'sinatra/flash'
require "sinatra/namespace"
require 'sinatra/partial'
require "sinatra/cookies"
require "sinatra/subdomain"

# Rendering Libraries
require "haml"
require 'tilt/haml'
require "sass"
require 'yaml'

# Terrapattern-specific libraries
require_relative "lib/tile_lookup"
require_relative "lib/markdown_partial"
require_relative "lib/helpers"


#######################################
##          Main Class
#######################################

class Terrapattern < Sinatra::Base
  # enable :sessions
  # set :session_secret, ENV["SESSION_SECRET"]

  # Load the data from the cities config file
  set :city_data, YAML::load(File.open('data/cities.yaml'))["cities"]
  set :city_urls, settings.city_data.collect{|city| city["url_name"]}
  set :city_names, settings.city_data.collect{|city| city["name"]}

  # initialize some of the helper classes
  # TODO: Convert these to proper Sinatra Extensions. (Low priority—they work.)
  $tile_lookup = TileLookup.new
  $markdown = MarkdownPartial.new

  # Register the various extensions and helpers
  register Sinatra::Flash
  register Sinatra::Namespace
  register Sinatra::Partial
  register Sinatra::Subdomain

  helpers Sinatra::JSON
  helpers Sinatra::ContentFor
  helpers Sinatra::TerrapatternHelpers
 
  # Set up some specific functionality for the development environment
  configure :development do
    register Sinatra::Reloader
     also_reload 'lib/markdown_partial.rb' 
     also_reload 'lib/helpers.rb' 
  end

  ##----
  # BELOW HERE ARE ROUTES
  ##----


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
      @geojson = File.read(@city_data["geojson"])
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
      @city_data = settings.city_data.find{|city| city["url_name"] == subdomain.to_s}
      json $tile_lookup.lookup(params['lat'], params['lng'], @city_data["search_locale"], 19, 96, params)
    end

    post "/download" do
    
      content_type :json
    attachment "terrapattern.json"
     params["geojson"]
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