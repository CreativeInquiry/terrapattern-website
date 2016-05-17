module Sinatra
  module TerrapatternHelpers

    # Handle redirecting to the www subdomain if not already there
    def send_to_www
      redirect request.url.sub(/:\/\/(?:\w+?\.)/, '://www.'), 301 unless request.host =~ /^www/
      return nil
    end

    # Wrap the markdown helper.  Kludge for not being a real Sinatra extension.
    def insert_content(id, city_name=nil)
      $markdown.insert_content(id, city_name)
    end

    def subdomain_url(name)
      if settings.environment == :development
        "http://#{name}.terrapattern.dev:#{request.port}"
      else
        "http://#{name}.terrapattern.com"
      end
    end

  end
  helpers TerrapatternHelpers
end