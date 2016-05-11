module Sinatra
  module TerrapatternHelpers

    def send_to_www
      redirect request.url.sub(/:\/\/(?:\w+?\.)/, '://www.'), 301 unless request.host =~ /^www/
      return nil
    end

    

  end
  helpers TerrapatternHelpers
end