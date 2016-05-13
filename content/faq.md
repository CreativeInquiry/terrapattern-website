# Frequently Asked Questions

---

### What's the Basic Idea? 

The Terrapattern project provides *visual query-by-example for satellite imagery*. 

* You click on a "feature of interest" in a satellite image of a given county, and
* The system returns a list of the most similar-looking places within that region.


### What can you use this for? 

One of our friends is using it to find disused swimming pools -- for [guerilla skateboarding](http://www.epictv.com/media/podcast/inside-californias-guerrilla-pool-skate-scene-%7C-pool-nation-ep-1/600243). 

### Is this art? 

Maybe. 

### The results I'm getting don't seem accurate. 

Here are some reasons why that may be true: 

* The Terrapattern project uses *tile-based* search, not *pixel-based* search. In other words, the tool finds places that are similar to the *map tile* you clicked in—not the exact *object* you clicked on. As a result, the system may be serving up tiles that match your selection on different visual features than the ones you're expecting. If possible, experiment with selecting a neighboring tile that better contains your object of interest.

* The Terrapattern tool is *scale dependent*. Our model is built from Google map tiles collected at [magification level 19](http://gis.stackexchange.com/questions/7430/what-ratio-scales-do-google-maps-zoom-levels-correspond-to). At the latitude of NYC, these 256x256 pixel tiles represent portions of the earth with a resolution of 23 centimeters per pixel—a patch of turf roughly 58x58 meters across. This means that it may be difficult or unreliable to search for features smaller than ~10 meters, or larger than ~100 meters.

* It's possible that the map tiles returned in response to your searches are fresher than the data we analyzed. In other words, the situation on the ground may have changed: there could have been some new construction, etc. 

* It's possible that you may have selected something truly unique, and there's nothing else quite like it. For example, the [Sandcastle Waterpark](https://www.google.com/maps/place/Sandcastle+Water+Park/@40.3980801,-79.9275436,604a,20y,317.39h/data=!3m1!1e3!4m5!3m4!1s0x8834f02d67fb76bd:0xf1b45395cec34844!8m2!3d40.3979202!4d-79.9273153) in Pittsburgh is extremely distinctive. 


### I discovered something cool. How can I share it?

We'd love to hear your stories and feedback! If you discover something interesting, send a tweet with the hashtag #terrapattern and the GPS coordinates of your discovery. We also invite you to complete this brief survey to tell us what you think!

### Why have you only offered three cities? 

It's the scale we could afford. Storing the model data for each metro region requires about 10GB of active RAM. (That's *RAM*—not hard disk.) To store and serve a searchable model for (say) the entire United States would require nearly 2,000 times as much RAM and CPU power as we're currently leasing, and the development of a much more sophisticated software architecture as well. Think of the *Terrapattern* project as a proof-of-concept probe to test how (or whether) "visual query-by-example" for satellite imagery could become a part of our everyday future. Remember, you saw it here first. 

### Why did you select the cities you did? 

Most of the members of our team currently call Pittsburgh home, and it's always great to start one's research there. We additionally selected New York City and San Francisco because so many of our friends and peers live there—especially those investigating new intersections of art, design, journalism, technology, data science and social change.

### Who else is doing related work? 

We suspect that most of the big players in the space of satellite imaging, such as Google, Microsoft, Digital Globe, and others are exploring the opportunities afforded by machine learning—particularly in light of recent and significant advances in convolutional neural networks and other deep learning techniques. Some key related projects, initiatives, and papers are:

* [Learning to Detect Roads in High-Resolution Aerial
Images](http://www.cs.toronto.edu/~fritz/absps/road_detection.pdf) by Volodymyr Mnih and Geoffrey Hinton (2010) 
* [Machine Learning for Aerial Image Labeling](https://www.cs.toronto.edu/~vmnih/docs/Mnih_Volodymyr_PhD_Thesis.pdf), Volodymyr Mnih's 2013 doctoral thesis from the University of Toronto
* [Humanitarian Mapping with Deep Learning](https://github.com/larsroemheld/OSM-HOT-ConvNet) by Lars Roemheld (2016)
* [OSM-Crosswalk-Detection](https://github.com/geometalab/OSM-Crosswalk-Detection) by Marcel Huber (2016)
* [DeepOSM](https://github.com/trailbehind/DeepOSM) by Andrew L. Johnson
* [Orbital Insight](https://orbitalinsight.com/). Orbital Insight, Inc. applies machine learning algorithms to satellite imagery, in order to sell "actionable intelligence" (such as big-box store retail performance, or measurements of oil reserves) to hedge funds.
* Artist [Jenny Odell](http://www.jennyodell.com/satellite.html), in her *Satellite Collections* project (2009-2011), presents collections of similar-looking things that she has cut out from Google satellite imagery.

### What data do you collect from your site's visitors? 

We are strongly committed to protecting the privacy of our visitors. We do not collect or share personal information, and we don't track or profile you. The IP address that is associated with your search(es) is not recorded or shared, and this web site does not use tracking or identifying cookies. Other than our visitor feedback survey, which you may elect not to complete, we do not collect or log any user data. Your search information cannot be linked back to you.

### My question's not addressed here!

*We'd love to help. Please feel free to get in touch with us via email at [contact@terrapattern.com](mailto:contact@terrapattern.com).*

