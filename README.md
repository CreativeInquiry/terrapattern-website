This is the website and front end for the Terrapattern project.  For more information about the project, please see the main repository at <https://www.github.com/terrapattern>.  

## Installation Instructions:

This site has been developed using [Sinatra](http://www.sinatrarb.com), a Ruby library for small websites.  It uses the standard conventions of a Sinatra project, and is designed to be hosted on [Heroku](http://www.heroku.com).  

Much of the javascript functionality has been added using the wonderful [p5.js library](http://p5js.org), and also through the [Google Maps API](https://developers.google.com/maps/).  

The site's has also made use of the [Bootstrap Framework](http://getbootstrap.com), and the [????? Theme](#).



To run this site locally, you'll need to clone the repo, then run the following commands in your terminal:

```bash
  gem install bundler
  gem install foreman
  bundle install
```

Additionally, you'll need the following environment variables to be set:

    SEARCH_SERVER=<URL to the Search Server>
    # This is the URL to to the service running the search engine.


    GMAPS_KEY=<google api key>
    # This is a Google API Browser key authorized to use the Google Maps Javascript API.

If you'd like the project to have a *tiny* bit of security, you can set these variables.  Note that this uses HTTP basic authentication which is not *actually* secure without using https, but it does prevent random people from stumbling upon things.

    TERRAPATTERN_USERNAME=<username>
    TERRAPATTERN_PASSWORD=<password>

For testing, it can be helpful to modify your ``/etc/hosts`` file by adding the following the lines:

    127.0.0.1 www.terrapattern.dev
    127.0.0.1 pgh.terrapattern.dev
    127.0.0.1 sf.terrapattern.dev
    127.0.0.1 nyc.terrapattern.dev

This allows you to test the multi-domain functionality locally.

## Running the Application

The command to run the server locally is 

```bash
  foreman start
```

## License

The MIT License

Copyright (c) 2010-2016 Golan Levin, David Newbury, Kyle McDonald, 
Irene Alvarado, Aman Tiwari, & Manzil Zaheer. http://www.terrapattern.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.