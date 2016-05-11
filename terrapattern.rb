# ------------------- Loading Libraries ---------------------------------------
require 'sinatra/base'
require "sinatra/reloader" 
require "sinatra/json"
require "sinatra/content_for"
require 'sinatra/flash'
require "sinatra/namespace"
require 'sinatra/partial'
require "sinatra/cookies"

require "haml"
require "sass"

require_relative "lib/tile_lookup"
require_relative "lib/markdown_partial"


class Terrapattern < Sinatra::Base
  enable :sessions
  set :session_secret, ENV["SESSION_SECRET"]
  $tile_lookup = TileLookup.new
  $markdown = MarkdownPartial.new

  register Sinatra::Flash
  register Sinatra::Namespace
  register Sinatra::Partial

  helpers Sinatra::JSON
  helpers Sinatra::ContentFor

  helpers do 
    def insert_content(id)
      $markdown.insert_content(id)
    end
  end
 
  configure :development do
    register Sinatra::Reloader
     also_reload 'lib/markdown_partial.rb' 
  end

  get '/' do
    haml :index
  end

  get "/search" do
    json $tile_lookup.lookup(params['lat'], params['lng'], "Allegheny", 19)
  end

end