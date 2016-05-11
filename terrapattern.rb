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
require "sass"

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
    get "/bios" do
      send_to_www
      haml :bios
    end

    get "/about" do
      send_to_www
      haml :about
    end

    get "/" do
      haml :interface
    end

    get "/search" do
      json $tile_lookup.lookup(params['lat'], params['lng'], "Allegheny", 19)
    end

  end
end