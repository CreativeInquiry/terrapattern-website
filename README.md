This is the codebase for the user interface for the Terrapattern project.

For information about the project itself, or to try out the project, please see the [Terrapattern website at http://www.terrapattern.com](http://www.terrapattern.com). 

For technical details about the machine learning and search code, please see the repository at <https://www.github.com/CreativeInquiry/terrapattern>.   

## Team

Terrapattern is a project of [**Golan Levin**](http://flong.com/), [**David Newbury**](http://www.workergnome.com/), [**Kyle McDonald**](http://kylemcdonald.net/), 
[**Irene Alvarado**](http://www.irenealvarado.com/), [**Aman Tiwari**](http://amantiwari.com/), and [**Manzil Zaheer**](http://manzil.ml/). 

Terrapattern was made possible through a Media Innovation [Prototype Fund](http://www.knightfoundation.org/grants/201551228/) grant from the [John S. and James L. Knight Foundation](http://www.knightfoundation.org/), which supports transformational ideas that promote quality journalism, advance media innovation, engage communities and foster the arts. The Knight Foundation believes that democracy thrives when people and communities are informed and engaged.

----------------------------------------------------------------------------

## Technical Details

This site has been developed using [Sinatra](http://www.sinatrarb.com), a Ruby library for small websites.  It uses the standard conventions of a Sinatra project, and is designed to be hosted on [Heroku](http://www.heroku.com).  

Much of the javascript functionality has been added using the wonderful [p5.js library](http://p5js.org), and also through the [Google Maps API](https://developers.google.com/maps/).  

The site's has also made use of the [Bootstrap Framework](http://getbootstrap.com), and the [????? Theme](#).

If you're interested in trying to run a version of Terrapattern yourself, note that this project requires a **search server** from which to request search results.  This is a completely separate process, and in our implementation is running on a Google App Engine server out in the cloud. To configure and run your own search server, please see the documentation in the [main terrapattern repository](https://www.github.com/terrapattern).

## Installation Instructions:

To run this site locally, you'll need to clone the repo, then run the following commands in your terminal:

```bash
  gem install bundler
  gem install foreman
  bundle install
```

#### Memcached for Caching

The application also uses [memcached](https://memcached.org) for caching and assumes that you have it installed locally for testing.  Our production version uses [Memcached-Cloud](https://redislabs.com/memcached-cloud), but for development you should use a locally-hosted version using the default configuration (no username/password, standard port, etc).

On OSX, the easiest way to install this is via homebrew:

```bash
  brew install memcached
```

The Procfile will automatically start up an instance of memcached for running.

#### Environment Variables for Configuration

You'll need the following environment variables to be set:

    SEARCH_SERVER=<URL to the Search Server>
    # This is the URL to to the service running the search engine.

    GMAPS_KEY=<google api key>
    # This is a Google API Browser key authorized to use the Google Maps Javascript API.

If you'd like the project to have a *tiny* bit of security, you can set these variables.  Note that this uses HTTP basic authentication which is not *actually* secure without using https, but it does prevent random people from stumbling upon things.

    TERRAPATTERN_USERNAME=<username>
    TERRAPATTERN_PASSWORD=<password>

#### Local Routes

For testing, it can be helpful to modify your ``/etc/hosts`` file by adding the following the lines:

    127.0.0.1 www.terrapattern.dev
    127.0.0.1 pgh.terrapattern.dev
    127.0.0.1 sf.terrapattern.dev
    127.0.0.1 nyc.terrapattern.dev
    127.0.0.1 detroit.terrapattern.dev
    127.0.0.1 berlin.terrapattern.dev

This makes those domains resolve to your local computer and will allow you to test the multi-domain functionality locally.  

**Note that <localhost:5100> will not work.  You must have an explicit subdomain set.**
 
----------------------------------------------------------------------------

## Running the Application

The command to run the server locally is 

```bash
  foreman start
```

## Adding Additional Cities

The Terrapattern project is designed to allow easy integration of additional cities or regions into the project.

To add a new city, you'll need to do 5 things:

1. Add the tiles to the search server.
    *(Note that doing this is outside the scope of this document)*
2. Add an entry to ``cities.yaml`` for the new region
3. Add a geojson file for the new city.
4. (optionally) add a geojson file for the water features for the region.
5. Add the tile lat/lng pairs into the ``lat_lngs.json`` file

#### cities.yaml

<config/cities.yaml> is the main configuration file for the cities data.  Each supported city should have a block of metadata associated with it. To add a new city, you must a new block.  There are instructions within the comments within this file, but some additional notes are useful:

The ``name`` parameter is used throughout the interface to label the city.  It can be anything you like, but if it gets long wrapping may become an issue.

The ``url_name`` parameter indicates what subdomain this city will live under.  Obviously, it must be unique, and it must conform to standard URL requirements.  We recommend a single, lowercase, ascii word.  

The ``search_locale`` parameter is used to indicate which set of tiles searches are performed against.  It must exactly match the index variable set on the search server and is case sensitive.  

The ``center`` parameters indicate where the map will be centered on initial load.  Obviously, it should be within the search region.  We recommend finding some distinctive landmark for the region.

The ``bounding box`` parameters are used across the project, and should be set to the min and max values of the possible tile center latitude and longitude.  If these values are incorrect, the minimap will be distorted and pins will not appear centered in the search results.  

the ``geojson`` parameter should be the local path to a geojson file containing a single polygon.  This should be the polygon used during the data model construction phase to select which tiles were downloaded.  

the ``water`` parameter is also a geojson file, with a single MultiPolygon containing geometry that will display on the map.  We typically use this to help people understand the geography of the object.  Note that this will NOT clip to the mini-map boundaries, and that drawing this can be computationally expensive.  Use the simplest geometry you can.  Also note that this does not use a sophisticated geojson parser, so don't do anything clever with the geojson file—it's just looking for arrays of lat/lng points at the right locations.

#### lat_lngs.json

<data/lat_lngs.json> is a list of possible latitudes and longitudes for each region.  Within this json file, each region has an object, named with the `url_name` parameter for the region as defined within the `cities.yaml` file.  Each object contains two arrays, one for latitude and one for longitude.  These arrays should contain the possible latitude and longitude points for each tile.  They should be unique values, and there is no correlation between lat and lng.  These are used to make link clicked points with the potential tile ids.


----------------------------------------------------------------------------

## License

A one-sentence summary of our license would be: "**give us proper visible credit, and keep a public version of your derivative code available for others**".

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Terrapattern</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">Golan Levin, David Newbury, Kyle McDonald, Irene Alvaredo, Aman Tiwari, and Manzil Zaheer,</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>. 



The Terrapattern code is made available under the MIT License.

Copyright (c) 2010-2016 Golan Levin, David Newbury, Kyle McDonald, Irene Alvarado, Aman Tiwari, & Manzil Zaheer. http://www.terrapattern.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the right to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

**The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.**

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.