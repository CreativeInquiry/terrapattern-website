This is the website and front end for the Terrapattern project.

## Installation Instructions:

This site has been developed using [Sinatra](http://www.sinatrarb.com), a Ruby library for small websites.  It uses the standard conventions of a Sinatra project, and is designed to be hosted on [Heroku](http://www.heroku.com).  


To run this site locally, you'll need to clone the repo, then run the following commands in your terminal:

```bash
  gem install bundler
  gem install foreman
  bundle install
```

Additionally, You'll need the following environment variables to be set:

    # This is the URL to to the service running the search engine.
    SEARCH_SERVER=<URL to the Search Server>
    # This is a Google API Browser key authorized to use the Google Maps Javascript API.
    GMAPS_KEY=<google api key>

If you'd like the project to have a *tiny* bit of security, you can set these variables.  Note that this uses HTTP basic authentication is not *actually* secure without using https, but it does prevent random people from stumbling upon things.

    TERRAPATTERN_USERNAME=<username>
    TERRAPATTERN_PASSWORD=<password>

For testing, it can be helpful to modify your ``/etc/hosts`` file by adding the following the lines:

    127.0.0.1 www.terrapattern.dev
    127.0.0.1 pgh.terrapattern.dev
    127.0.0.1 detroit.terrapattern.dev

This allows you to test the multi-domain functionality locally.

## Running the Application

The command to run the server locally is 

```bash
  foreman start
```