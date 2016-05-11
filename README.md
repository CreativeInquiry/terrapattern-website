### Existing Cities

To install, download the repo, then run

    gem install foreman
    gem install bundler
    bundle install

The command to run the server locally is 

    foreman start

You'll need the following env variables to be set:

    SESSION_SECRET=<random string>
    SEARCH_SERVER=<URL to the Search Server>
    TERRAPATTERN_USERNAME=<username>
    TERRAPATTERN_PASSWORD=<password>
    GMAPS_KEY=<google api key>

For testing, it's helpful to modify your ``/etc/hosts`` file by adding the following the lines:

    127.0.0.1 www.terrapattern.dev
    127.0.0.1 pgh.terrapattern.dev
    127.0.0.1 detroit.terrapattern.dev
