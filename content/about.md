# About Terrapattern

### A Prototype for Visual Query-by-Example in Satellite Imagery

---
### Overview

There has never been a more exciting time to observe human activity and understand the patterns of humanity’s impact on the world. We aim to help people discover such patterns in satellite imagery, with the help of deep learning machine vision techniques. **We present *Terrapattern*, an open-source prototype for discovering “patterns of interest” in unlabeled satellite imagery, with an open-ended, visual query-by-example interface.** Our tool is ideal for locating specialized nonbuilding structures and other forms of soft infrastructure that aren't usually indicated on maps. 

---
### Motivation and Intended Use

It has been predicted that, within the next five years, access to daily-updated, whole-earth satellite imagery with sub-meter resolution will become widely available online. There will be many important stories about natural and human activities latent in this data. Without special effort, however, it is doubtful that this imagery will have annotation layers that make such stories discoverable.In light of this, the *Terrapattern* project is intended to provide users—such as journalists, citizen scientists, humanitarian agencies, social justice activists, archaeologists, urban planners, and other researchers—with the ability to easily search for visually consistent “patterns of interest”.  We are particularly keen to help people identify, characterize and track indicators which have not been detected or measured previously, and which have sociological, humanitarian, or scientific significance. 

Our goal is to provide a geospatial software tool that makes it easy for interested domain experts, who may lack expertise in machine vision, to specify the thing that they are interested in; to automatically find more instances of that thing; and to have those instances reported in a common data format that allows for further study. 

---
### About the Prototype

*Terrapattern* is a “panoptic perceptron” that allows a user to perform *queries-by-example* in satellite imagery. A user clicks on a “feature of interest” in a satellite image; the *Terrapattern* system returns a batch of the most similar-looking places nearby; the user can then download the list of these locations in GeoJSON format.

We emphasize that *Terrapattern* is a **prototype**. As of May 2016, it allows users to search in the greater metropolitan regions of three American cities: New York City, San Francisco, and Pittsburgh (Allegheny County). Altogether more than 2,200 square miles (5700 km²) are fully searchable. Allowing high-resolution searches in an area the size of the United States (e.g. 3.8M mi² or 9.9M km²) is technically and financially beyond the scope of this project. 

Technically, the Terrapattern tool uses a model convolutional neural network the Tensorflow

Terrapattern has limitations 





[//]: # (See slideshow code at http://www.w3schools.com/howto/howto_js_slideshow.asp)


 

---
# Inspirations
Previously, work of this kind has been highly bespoke, customized in idiosyncratic ways for specific problems by isolated teams.

<img width="240" height="135" src="images/16x9_oil_tanks_orbital_insight.jpg" "Orbital Insight, Inc. measures the shadows on oil tanks with floating lids to estimate the size of a region's oil reserves. They then sell this information to hedge funds and other market speculators. Image credit: Orbital Insight." />
<img width="240" height="135" src="images/16x9_tukul_detector_hhi.jpg" alt="Researchers can detect mass atrocities by identifying domestic dwellings, known as 'tukuls', that have been razed in South Sudan. Image credit: The Signal Program on Human Security and Technology at the Harvard Humanitarian Initiative." />
<img width="240" height="135" src="images/16x9_illegal_logging_roads_maap.jpg" "Aerial view of illegal logging roads in the Amazon rainforest. Image credit:  Monitoring of the Andean Amazon Project." />
<img width="240" height="135" src="images/16x9_illegal_gold_mine_aca.jpg" />
<img width="240" height="135" src="images/16x9_penguin_poop_digitalglobe.jpg" alt="Satellite views of penguin poop can help track wildlife populations and their diet. Image credit: DigitalGlobe/BAS." />
<img width="240" height="135" src="images/16x9_right_whales_fretwell.jpg" "Processed satellite images of southern right whales. Image credit: Peter Fretwell et al." />
<img width="240" height="135" src="images/16x9_parcak_space_archaeology_nasa.jpg" alt="'Space archaeologist' Sarah Parcak has discovered ancient Egyptian pyramids using satellite imagery and computer vision. Image credit: NASA" />
<img width="240" height="135" src="images/16x9_magnetic_deer_alignment_begall.png" alt="Examinations of cattle and deer from satellite images reveal that they align their body axes along the earth's magnetic field. Image credit: Begall et al." />

DataKind roof




first spotted by a helicopter pilot in 2013.
In an ominous positive feedback loop, a recently discovered crater in the thawing Siberian permafrost is spewing methane, a potent greenhouse gas, into the atmosphere. Photo by Marya Zulinova, press service of the Governor, Yamal-Nenets Autonomous District (YaNAO).



* Catching pirate fishers

* new logging roads in the central Peruvian Amazon

Speculative: Concentrated Animal Feeding Operations, or CAFOs; URANIUM MILL TAILINGS DEPOSITS Uranium mill tailings deposits

* "Gamma Gardens", also called radiation farms, are tomic Gardening/ Radiation Farms)
http://pruned.blogspot.com/2011/04/atomic-gardens.html mutation breeding

The Signal Program worked with 2014 HHI
fellow Michael Hughes last year to develop
a prototype feature extraction algorithm,
called “Tukul Detector”. The Tukul DetecSIGNAL
PROGRAM
ON HUMAN SECURITY AND
TECHNOLOGY
tor identifies and counts traditional African
huts, known as “tukuls”, that are routinely
present in satellite imagery of rural regions
in Africa. 



For our purposes, “interesting” patterns are anthropogenic and/or natural phenomena that are not only socially or scientifically meaningful, but also visually distinctive—thus lending themselves ideally to machine recognition. Examples could include problems like monitoring elephant herds, counting Siberian methane blowholes, identifying destroyed homes, measuring reservoir loss, or tracing the paths of the logging roads that precede deforestation. Many other patterns await discovery.
 Whether these patterns concern elephants, parking lots, logging roads, oil tanks, swimming pools, construction sites, munitions craters, methane blowholes, or other phenomena, we cannot predict: it is only important that the patterns of interest are visually consistent enough for algorithmic detection and analysis.



[Orbital Insight](https://orbitalinsight.com/) (2014-), a company which applies machine learning algorithms to satellite imagery, in order to sell "actionable intelligence" (such as big-box store retail performance, or measurements of oil reserves) to hedge funds.


---
### What can you use Terrapattern for? 



---
### The results I'm getting don't seem accurate. 

Here are some reasons why that may be true: 

* The Terrapattern project uses *tile-based* search, not *pixel-based* search. In other words, the tool finds places that are similar to the *map tile* you clicked in—not the exact *object* you clicked on. As a result, the system may be serving up tiles that match your selection in ways that are different than the ones you're expecting. If possible, experiment with selecting a neighboring tile that better contains your object of interest.

* The Terrapattern tool is *scale dependent*. Our model is developed from Google map tiles analyzed at [magification levels 18 and 19](http://gis.stackexchange.com/questions/7430/what-ratio-scales-do-google-maps-zoom-levels-correspond-to). At the latitude of NYC, these 256x256 pixel tiles represent portions of the earth that are roughly 50-100 meters across. This means that it may be difficult or unreliable to search for features smaller than ~10 meters, or larger than ~200 meters.

---
### I made a cool discovery with Terrapattern. How can I share it?

We'd love to hear your stories and feedback! If you discover something interesting, send a tweet with the hashtag [#terrapattern](https://twitter.com/hashtag/terrapattern) and the URL of your search. We also invite you to complete [this brief visitor survey](http://goo.gl/forms/8T7zY28nHm) to tell us what you think!

 Think of the *Terrapattern* project as a proof-of-concept probe to test how (or whether) "visual query-by-example" for satellite imagery might become a part of our everyday future. Remember, you saw it here first :)
 
---
### Who else is creating similar systems? 

We suspect that most of the big players in the space of satellite imaging, such as Google, Microsoft, Digital Globe, Planet Labs, and others are exploring the opportunities afforded by machine learning—particularly in light of recent and significant advances in convolutional neural networks and other deep learning techniques. Some key related papers and projects 

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