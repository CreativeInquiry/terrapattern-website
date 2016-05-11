# ------------------- Loading Libraries ---------------------------------------
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
  enable :sessions
  set :session_secret, ENV["SESSION_SECRET"]
  set :city_data, YAML::load(File.open('data/cities.yaml'))["cities"]
  set :city_urls, settings.city_data.collect{|city| city["url_name"]}
  set :city_names, settings.city_data.collect{|city| city["name"]}
  $tile_lookup = TileLookup.new
  $markdown = MarkdownPartial.new

  register Sinatra::Flash
  register Sinatra::Namespace
  register Sinatra::Partial
  register Sinatra::Subdomain

  helpers Sinatra::JSON
  helpers Sinatra::ContentFor

  helpers Sinatra::TerrapatternHelpers
  helpers do 
    def insert_content(id)
      $markdown.insert_content(id)
    end
  end
 
  configure :development do
    register Sinatra::Reloader
     also_reload 'lib/markdown_partial.rb' 
     also_reload 'lib/helpers.rb' 
  end

  subdomain :www do
    get '/' do
      haml :index
    end
  end
 
  subdomain do
    get "/team" do
      send_to_www
      haml :team
    end

    get "/about" do
      send_to_www
      haml :about
    end

    get "/" do
      send_to_www unless settings.city_urls.include? subdomain
      @city_data = settings.city_data.find{|city| city["url_name"] == subdomain.to_s}
      @geojson = File.read(@city_data["geojson"])
      haml :interface
    end

    get "/search" do
      redirect("/") unless settings.city_urls.include? subdomain
      city_data = settings.city_data.find{|city| city["url_name"] == subdomain.to_s}
      json $tile_lookup.lookup(params['lat'], params['lng'], city_data["search_locale"], 19)
    end

  end
end