# About Terrapattern

---


Recent 















---
### Bibliography

Hogenboom, Melissa. "[Watching penguins, and their poo, from space](http://www.bbc.com/earth/story/20141210-surprising-use-of-penguin-poo)". *BBC.com*. 12/10/2014. Accessed 5/14/2016.

Howard, Brian C. "[Tiny Team Uses Satellites to Bust Illegal Fishing Worldwide](http://news.nationalgeographic.com/2015/06/150615-skytruth-pirate-fishing-illegal-big-data-ocean-conservation/)". *NationalGeographic.com*, 6/15/2015. Accessed 5/14/2016.









---
### What's the basic idea? 

Terrapattern is a prototype tool that provides open-ended, *visual query-by-example for satellite imagery*. 

* **YOU** click on a "feature of interest" in a satellite image;
* **TERRAPATTERN** returns a batch of the most similar-looking places nearby.
* **YOU** can then download a list of these locations in GeoJSON format.

---
### What can you use Terrapattern for? 

The Terrapattern tool is ideal for locating specialized [nonbuilding structures](https://en.wikipedia.org/wiki/Nonbuilding_structure) and other forms of otherwise unremarkable [soft infrastructure](https://en.wikipedia.org/wiki/Soft_infrastructure) that aren't usually indicated on maps. For example, one of our friends is using it to find disused swimming pools—for [guerilla skateboarding](http://www.epictv.com/media/podcast/inside-californias-guerrilla-pool-skate-scene-%7C-pool-nation-ep-1/600243). 

More generally, we hope you can help us understand how the Terrapattern project could useful to *you*! We especially invite citizen scientists, data journalists, humanitarian researchers, and other domain experts to tell us about how our app is, or could be, of use. For some of the case studies which inspired us, please see our [*about*](about.html) page. 

---
### The results I'm getting don't seem accurate. 

Here are some reasons why that may be true: 

* The Terrapattern project uses *tile-based* search, not *pixel-based* search. In other words, the tool finds places that are similar to the *map tile* you clicked in—not the exact *object* you clicked on. As a result, the system may be serving up tiles that match your selection in ways that are different than the ones you're expecting. If possible, experiment with selecting a neighboring tile that better contains your object of interest.

* The Terrapattern tool is *scale dependent*. Our model is developed from Google map tiles analyzed at [magification levels 18 and 19](http://gis.stackexchange.com/questions/7430/what-ratio-scales-do-google-maps-zoom-levels-correspond-to). At the latitude of NYC, these 256x256 pixel tiles represent portions of the earth that are roughly 50-100 meters across. This means that it may be difficult or unreliable to search for features smaller than ~10 meters, or larger than ~200 meters.

---
### I made a cool discovery with Terrapattern. How can I share it?

We'd love to hear your stories and feedback! If you discover something interesting, send a tweet with the hashtag [#terrapattern](https://twitter.com/hashtag/terrapattern) and the URL of your search. We also invite you to complete [this brief visitor survey](http://goo.gl/forms/8T7zY28nHm) to tell us what you think!

---
### Why have you only offered three cities? 

It's the scale we could afford. Storing the model data for each metro region requires about 10GB of active RAM. (That's *RAM*—not hard disk.) To store and serve a searchable model for (say) the entire United States would require nearly 2,000 times as much RAM and CPU power as we're currently leasing, and the development of a much more sophisticated software architecture as well. Think of the *Terrapattern* project as a proof-of-concept probe to test how (or whether) "visual query-by-example" for satellite imagery might become a part of our everyday future. Remember, you saw it here first :)

---
### Why did you select the cities you did? 

Most of our team members currently call Pittsburgh home. We additionally selected New York City and San Francisco because so many of our friends and peers live there—especially those exploring new intersections of art, design, journalism, technology, data science and social change.

---
### Who else is creating similar systems? 

We suspect that most of the big players in the space of satellite imaging, such as Google, Microsoft, Digital Globe, Planet Labs, and others are exploring the opportunities afforded by machine learning—particularly in light of recent and significant advances in convolutional neural networks and other deep learning techniques. Some key related papers and projects are:

* [Learning to Detect Roads in High-Resolution Aerial
Images](http://www.cs.toronto.edu/~fritz/absps/road_detection.pdf) by Volodymyr Mnih and Geoffrey E. Hinton (2010), a seminal paper in the application of machine learning to the problem of making assertions about satellite imagery.  
* [Machine Learning for Aerial Image Labeling](https://www.cs.toronto.edu/~vmnih/docs/Mnih_Volodymyr_PhD_Thesis.pdf), Volodymyr Mnih's 2013 doctoral thesis from the University of Toronto, under the advisement of Geoff Hinton. 
* [Humanitarian Mapping with Deep Learning](https://github.com/larsroemheld/OSM-HOT-ConvNet) by Stanford graduate student, Lars Roemheld (2016). Like the *Terrapattern* project, this project uses OpenStreetMap (OSM) to help train a neural net, in order to help support map creation in the developing world.
* [OSM-Crosswalk-Detection](https://github.com/geometalab/OSM-Crosswalk-Detection) by Marcel Huber (2015). Developed at the University of Applied Sciences Rapperswil, this project again trains deep learning models with OSM labels to locate Swiss crosswalks.
* [DeepOSM](https://github.com/trailbehind/DeepOSM) (2016), by Andrew L. Johnson, trains a neural network with OSM labels and infrared images from the U.S. National Agriculture Imagery Program (NAIP), in order to detect unmapped hiking trails.
* [Orbital Insight](https://orbitalinsight.com/) (2014-), a company which applies machine learning algorithms to satellite imagery, in order to sell "actionable intelligence" (such as big-box store retail performance, or measurements of oil reserves) to hedge funds.
* Artist [Jenny Odell](http://www.jennyodell.com/satellite.html), in her *Satellite Collections* project (2009-2011), presents collections of similar-looking things that she has cut out from Google satellite imagery.

One of the main features which distinguishes the Terrapattern project is our emphasis on allowing our visitors to search, in an open-ended way, for user-defined ("out-of-set") categories. By contrast, most of the systems listed above are designed to locate and identify specific things-with-names, such as roads, trails, or crosswalks. For more information, please see our [*about*](about.html) page. 

---
### Who are you, and who funded this? 

We're a group of new-media artists, creative technologists, and students who are affiliated in various ways with the Frank-Ratchye [STUDIO for Creative Inquiry](studioforcreativeinquiry.org) at Carnegie Mellon University, a lab for experimental research at the intersection of art, science, technology and culture. This project was made possible by a grant in Media Innovation from the [Knight Foundation](http://knightfoundation.org/grants/201551228/) [Prototype Fund](http://www.knightfoundation.org/funding-initiatives/knight-prototype-fund/). For more information, please see our [*team*](team.html) page. 

---
### What data do you collect from this site's visitors? 

*This statement constitutes our privacy policy.* We are strongly committed to protecting the privacy and anonymity of the visitors to this site. We do not collect or share personal information, and we don't track or profile you. The IP address that is associated with your search(es) is not recorded or shared, and this web site does not use tracking or identifying cookies. Other than our optional [visitor feedback survey](http://goo.gl/forms/8T7zY28nHm), we do not collect or log any user data. Your search information is not stored, and cannot be linked back to you. 

--- 
### How can I cite this work? 

Levin, G., Newbury, D., McDonald, K., Alvarado, I., Tiwari, A., & Zaheer, M. "Terrapattern: Open-Ended, Visual Query-By-Example for Satellite Imagery using Deep Learning", May 2016. [http://terrapattern.com](http://terrapattern.com).

---
### My question's not addressed here!

*We'd love to help. Please feel free to get in touch with us via email at [contact@terrapattern.com](mailto:contact@terrapattern.com), or connect with lead investigator [@golan](https://twitter.com/golan) on Twitter.*