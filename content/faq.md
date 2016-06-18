### What's the basic idea? 

Terrapattern is a prototype that provides *similar-image search for satellite photos*&mdash;an open-source, open-ended tool for exploring the unmapped, and mapping the unmappable. Click an interesting spot in a map of New York, San Francisco, Detroit or Pittsburgh, and Terrapattern will find other locations that look similar in that city.

* **YOU** click on a "feature of interest" in a satellite image.
* **TERRAPATTERN** returns a batch of the most similar-looking places nearby.
* **YOU** can then download a list of these locations in GeoJSON format.

---
### What can I use Terrapattern for? 

The Terrapattern tool is ideal for locating specialized [nonbuilding structures](https://en.wikipedia.org/wiki/Nonbuilding_structure) and other forms of otherwise unremarkable [soft infrastructure](https://en.wikipedia.org/wiki/Soft_infrastructure) that aren't usually indicated on maps. For example, one of our friends is using it to find disused swimming pools—for [guerilla skateboarding](http://www.epictv.com/media/podcast/inside-californias-guerrilla-pool-skate-scene-%7C-pool-nation-ep-1/600243). 

More generally, we hope you can help us understand how the Terrapattern project could useful to *you*! We especially invite citizen scientists, data journalists, humanitarian researchers, and other domain experts to tell us about how our app is, or could be, of use. For some of the case studies which inspired us, please see our [**about**](about) page. To share some of your own ideas, complete this [**brief survey**](http://goo.gl/forms/8T7zY28nHm).

---
### How does it work? 

Behind the scenes, Terrapattern's search is based on two tricks.

The first trick is a deep convolutional neural network (DCNN). We feed the DCNN hundreds of thousands of satellite images that have been categorized in [OpenStreetMap](https://www.openstreetmap.org/), teaching it to predict the category of a place from a satellite photo. In the process, it learns which visual features are important for classifying satellite imagery. After training, we compute descriptions for millions more satellite photos that cover various regions of interest, such as New York City. When we want to find places that are similar to your query, we just find places with similar descriptions.

It can take a long time to search all the descriptions, so we have another trick. The [CoverTree](https://github.com/manzilzaheer/CoverTree) algorithm precomputes relationships between the descriptions, allowing us to do a search in just a second or two.

---

### The results I'm getting don't seem accurate. 

Sure. Here are some reasons why that may be true: 

* The Terrapattern project uses *tile-based* search, not *pixel-based* search. In other words, the tool finds places that are similar to the *map tile* you clicked in—not the exact *object* you clicked on. As a result, the system may be serving up tiles that match your selection in ways that are different than the ones you're expecting. If possible, experiment with selecting a tile that contains a better example of your object of interest. We're working on some ways of improving this. 
* The Terrapattern tool is *scale dependent*. Our model is developed from Google map tiles analyzed at [magification level 19](http://gis.stackexchange.com/questions/7430/what-ratio-scales-do-google-maps-zoom-levels-correspond-to). At the latitude of New York City, these 256x256 pixel tiles represent portions of the earth that are roughly 50 meters across. This means that it may be difficult or unreliable to search for features smaller than ~10 meters, or larger than ~100 meters.
* Related to the above, some features fall on the *boundaries* between map tiles. As a result, they may not rise to the top of search results as quickly as features that occur near the center of map tiles. We're working on a fix for this, too. 
* It's possible that the map tiles returned in response to your searches are fresher than the data we analyzed in May 2016. In other words, the situation on-the-ground may have changed: there could have been new construction, demolition, seasonal variation, etc. 
* It's possible that you may have chosen to search for something that's genuinely *unique*, and there's really nothing else quite like it around. For example, the [Sandcastle Waterpark](https://www.google.com/maps/place/Sandcastle+Water+Park/@40.3980801,-79.9275436,604a,20y,317.39h/data=!3m1!1e3!4m5!3m4!1s0x8834f02d67fb76bd:0xf1b45395cec34844!8m2!3d40.3979202!4d-79.9273153) in Pittsburgh is extremely distinctive. 

---
### I made a cool discovery with Terrapattern. How can I share it?

We'd love to hear your stories and feedback! If you discover something interesting, send a tweet with the hashtag [#terrapattern](https://twitter.com/hashtag/terrapattern) and the URL of your search. We also invite you to complete [this brief visitor survey](http://goo.gl/forms/8T7zY28nHm) to tell us what you think!

---
### How is this project different from related work? 

We suspect that most of the big players in the space of satellite imaging, such as Google, Microsoft, Digital Globe, Planet.com, and others are exploring the opportunities afforded by machine learning&mdash;particularly in light of recent and significant advances in convolutional neural networks and other deep learning techniques. 

One of the main features which distinguishes the Terrapattern project is our emphasis on allowing our visitors to search, in an open-ended way, for *user-defined* ("out-of-set") categories. By contrast, most of the systems listed in our [**reference**](reference) page are designed to locate and identify specific things-with-names, such as roads, trails, or crosswalks. For more information, please see our [**about**](about) page. 

---
### Why have you offered so few cities? 

We're adding more soon! But for this alpha prototype, this is the scale we could achieve. Storing the model data for each metro region requires about 10GB of active RAM. (That's *RAM*&mdash;not hard disk.) To store and serve a searchable model for (say) the entire United States would require nearly 2,000 times as much RAM and CPU power as we're currently leasing, and the development of a much more sophisticated software architecture as well. Think of the *Terrapattern* project as a proof-of-concept probe to test how (or whether) "visual query-by-example" for satellite imagery might become a part of our everyday future. Remember, you saw it here first :)

---
### Why did you select the cities you did? 

There are many regions of the world that might benefit from being studied or mapped with a tool similar to ours. The work involved in doing so, however, is not trivial. "[Solutionist](https://en.wikipedia.org/wiki/Evgeny_Morozov#To_Save_Everything.2C_Click_Here:_The_Folly_of_Technological_Solutionism)" approaches may well do more harm than good. We caution interested readers not to say "OMG let's use this for all the humanitarian problems", and instead consider partnering with or studying the work of an informed organization, such as the Harvard Humanitarian Initiative's [Satellite Sentinel Propject](http://hhi.harvard.edu/resources/satellite-sentinel-project). 
 
For this alpha prototype, we deliberately sidestepped regions suffering from profound humanitarian or other crises, and instead selected cities primarily for their personal signficance. For example, most of our team members currently call Pittsburgh home, and it was easiest to test our tool in familiar territory. We additionally selected New York City, San Francisco and Detroit because so many of our friends and peers live there&mdash;especially those exploring new intersections of art, design, journalism, technology, data science and social change. In some cases, at our discretion, we have also presented some cities in response to user requests.
 

---
### Is this art? 

Maybe. 

---
### Who are you, and who funded this? 

We're a group of new-media artists, creative technologists, and students who are affiliated in various ways with the Frank-Ratchye [STUDIO for Creative Inquiry](studioforcreativeinquiry.org) at Carnegie Mellon University, a lab for experimental research at the intersection of art, science, technology and culture. This project was made possible by a grant in Media Innovation from the [Knight Foundation](http://knightfoundation.org/grants/201551228/) [Prototype Fund](http://www.knightfoundation.org/funding-initiatives/knight-prototype-fund/). For more information, please see our [**team**](team) page. 

---
### How did you get the idea for Terrapattern?

We first became interested in how satellite imagery could help people make interesting discoveries, in early 2009, when we learned how Dr. Sabine Begall [discovered](http://www.pnas.org/content/105/36/13451.abstract) that cows tend to align themselves with the earth's magnetic field. We became motivated to make an open-source tool in 2014, when we learned about how [Wall Street traders were using insights](http://www.wsj.com/articles/SB10001424052702303497804579240182187225264) from satellite imagery to game the financial system, while ecological and humanitarian initiatives like [MAAP](http://maaproject.org/en/) and the [Satellite Sentinel Project](http://www.satsentinel.org/) were using it to make the world a better place. Of course, like a lot of people, we've also been very impressed and inspired by Google's "[search-by-image](https://www.google.com/intl/es419/insidesearch/features/images/searchbyimage.html)" feature. 

---
### What data do you collect from this site's visitors? 

*The following statement constitutes our privacy policy:* We are strongly committed to protecting the privacy and anonymity of the visitors to this site. We collect visitor data using Google Analytics, and we only share collected information in aggregate (such as most commonly clicked locations). We do not otherwise collect any visitor information, and we don't track or profile you. We also collect user data from the optional [visitor feedback survey](http://goo.gl/forms/8T7zY28nHm).

---
### How is Terrapattern licensed? 

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Terrapattern</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://terrapattern.com" property="cc:attributionName" rel="cc:attributionURL">Golan Levin, David Newbury, Kyle McDonald, Irene Alvarado, Aman Tiwari, and Manzil Zaheer</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>. The Terrapattern code and data files are free software and open source, made available under [the MIT Licence](https://en.wikipedia.org/wiki/MIT_License). 

--- 
### How should I cite this project? 

Levin, G., Newbury, D., McDonald, K., Alvarado, I., Tiwari, A., and Zaheer, M. "Terrapattern: Open-Ended, Visual Query-By-Example for Satellite Imagery using Deep Learning". [*http://terrapattern.com*](http://terrapattern.com), 24 May 2016. 
