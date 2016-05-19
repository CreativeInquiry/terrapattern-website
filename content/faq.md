### What's the basic idea? 

Terrapattern is a prototype that provides *similar-image search for satellite photos*&mdash;an open-source, open-ended tool for exploring the unmapped, and mapping the unmappable. Click an interesting spot in a map of New York, San Francisco, or Pittsburgh, and Terrapattern will find other locations that look similar.

* **YOU** click on a "feature of interest" in a satellite image.

* **TERRAPATTERN** returns a batch of the most similar-looking places nearby.

* **YOU** can then download a list of these locations in GeoJSON format.

---
### What can I use Terrapattern for? 

The Terrapattern tool is ideal for locating specialized [nonbuilding structures](https://en.wikipedia.org/wiki/Nonbuilding_structure) and other forms of otherwise unremarkable [soft infrastructure](https://en.wikipedia.org/wiki/Soft_infrastructure) that aren't usually indicated on maps. For example, one of our friends is using it to find disused swimming pools—for [guerilla skateboarding](http://www.epictv.com/media/podcast/inside-californias-guerrilla-pool-skate-scene-%7C-pool-nation-ep-1/600243). 

More generally, we hope you can help us understand how the Terrapattern project could useful to *you*! We especially invite citizen scientists, data journalists, humanitarian researchers, and other domain experts to tell us about how our app is, or could be, of use. For some of the case studies which inspired us, please see our [**about**](about.html) page. 

---
### How does it work? 

Behind the scenes, Terrapattern's search is based on two tricks.

The first trick is a deep convolutional neural network (DCNN). We feed the DCNN hundreds of thousands of satellite images that have categorized in [OpenStreetMap](https://www.openstreetmap.org/), teaching it to predict the category of a place from a satellite photo. In the process, it learns which visual features are important for classifying satellite imagery. After training, we compute descriptions for millions more satellite photos that cover various regions of interest. When we want to find places that are similar to your query, we just find places with similar descriptions.

It can take a long time to search all the descriptions, so we have another trick. The [CoverTree](https://github.com/manzilzaheer/CoverTree) algorithm precomputes relationships between the descriptions, allowing us to do a search in just a second or two.

---

### The results I'm getting don't seem accurate. 

Sure. Here are some reasons why that may be true: 

* The Terrapattern project uses *tile-based* search, not *pixel-based* search. In other words, the tool finds places that are similar to the *map tile* you clicked in—not the exact *object* you clicked on. As a result, the system may be serving up tiles that match your selection in ways that are different than the ones you're expecting. If possible, experiment with selecting a tile that contains a better example of your object of interest.

* The Terrapattern tool is *scale dependent*. Our model is developed from Google map tiles analyzed at [magification level 19](http://gis.stackexchange.com/questions/7430/what-ratio-scales-do-google-maps-zoom-levels-correspond-to). At the latitude of NYC, these 256x256 pixel tiles represent portions of the earth that are roughly 50 meters across. This means that it may be difficult or unreliable to search for features smaller than ~10 meters, or larger than ~100 meters.

* Related to the above, some features fall on the *boundaries* between map tiles. As a result, they may not rise to the top of search results as quickly as features that occur near the center of map tiles. We're working on a fix for this. 

* It's possible that the map tiles returned in response to your searches are fresher than the data we analyzed in May 2016. In other words, the situation on-the-ground may have changed: there could have been new construction, demolition, seasonal variation, etc. 

* It's possible that you may have chosen to search for something that's genuinely *unique*, and there's really nothing else quite like it around. For example, the [Sandcastle Waterpark](https://www.google.com/maps/place/Sandcastle+Water+Park/@40.3980801,-79.9275436,604a,20y,317.39h/data=!3m1!1e3!4m5!3m4!1s0x8834f02d67fb76bd:0xf1b45395cec34844!8m2!3d40.3979202!4d-79.9273153) in Pittsburgh is extremely distinctive. 

---
### I made a cool discovery with Terrapattern. How can I share it?

We'd love to hear your stories and feedback! If you discover something interesting, send a tweet with the hashtag [#terrapattern](https://twitter.com/hashtag/terrapattern) and the URL of your search. We also invite you to complete [this brief visitor survey](http://goo.gl/forms/8T7zY28nHm) to tell us what you think!

---
### How is this project different from related work? 

We suspect that most of the big players in the space of satellite imaging, such as Google, Microsoft, Digital Globe, Planet Labs, and others are exploring the opportunities afforded by machine learning&mdash;particularly in light of recent and significant advances in convolutional neural networks and other deep learning techniques. 

One of the main features which distinguishes the Terrapattern project is our emphasis on allowing our visitors to search, in an open-ended way, for *user-defined* ("out-of-set") categories. By contrast, most of the systems listed above are designed to locate and identify specific things-with-names, such as roads, trails, or crosswalks. We believe we are also among the first researchers to publish a trained model for satellite imagery. For more information, please see our [**about**](about.html) page. 

---
### Why have you only offered three cities? 

It's the scale we could afford. Storing the model data for each metro region requires about 10GB of active RAM. (That's *RAM*&mdash;not hard disk.) To store and serve a searchable model for (say) the entire United States would require nearly 2,000 times as much RAM and CPU power as we're currently leasing, and the development of a much more sophisticated software architecture as well. Think of the *Terrapattern* project as a proof-of-concept probe to test how (or whether) "visual query-by-example" for satellite imagery might become a part of our everyday future. Remember, you saw it here first :)

---
### Why did you select the cities you did? 

Most of our team members currently call Pittsburgh home. We additionally selected New York City and San Francisco because so many of our friends and peers live there&mdash;especially those exploring new intersections of art, design, journalism, technology, data science and social change.

---
### Is this art? 

Maybe. 

---
### Who are you, and who funded this? 

We're a group of new-media artists, creative technologists, and students who are affiliated in various ways with the Frank-Ratchye [STUDIO for Creative Inquiry](studioforcreativeinquiry.org) at Carnegie Mellon University, a lab for experimental research at the intersection of art, science, technology and culture. This project was made possible by a grant in Media Innovation from the [Knight Foundation](http://knightfoundation.org/grants/201551228/) [Prototype Fund](http://www.knightfoundation.org/funding-initiatives/knight-prototype-fund/). For more information, please see our [**team**](team.html) page. 

---
### What data do you collect from this site's visitors? 

*The following statement constitutes our privacy policy:* We are strongly committed to protecting the privacy and anonymity of the visitors to this site. We do not collect or share personal information, and we don't track or profile you. The IP address that is associated with your search(es) is not recorded or shared, and this web site does not use tracking or identifying cookies. Other than our optional [visitor feedback survey](http://goo.gl/forms/8T7zY28nHm), we do not collect or log any user data. Your search information is not stored, and cannot be linked back to you. 

--- 
### How should I cite this project? 

Levin, G., Newbury, D., McDonald, K., Alvarado, I., Tiwari, A., and Zaheer, M. "Terrapattern: Open-Ended, Visual Query-By-Example for Satellite Imagery using Deep Learning", May 2016. [http://terrapattern.com](http://terrapattern.com).