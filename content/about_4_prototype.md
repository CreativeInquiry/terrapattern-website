### About our Prototype

*Terrapattern* is a “panoptic perceptron” that allows a user to perform arbitrary *queries-by-example* in satellite imagery. A guest clicks on a “feature of interest” in a satellite image; the *Terrapattern* system presents a batch of the most similar-looking places nearby; and the guest can then download a list of these locations in GeoJSON format.

For our purposes, “interesting” features are anthropogenic or natural phenomena that are not only socially or scientifically meaningful, but also *visually distinctive*—thus lending themselves ideally to machine recognition. Examples could include things like animal herds, methane blowholes, factories, destroyed homes, or logging roads. Many other patterns await discovery.

We aim to test the assumptions: 

* That there are *undiscovered patterns of activity* that are only visible from the vantage point of satellite imagery; 
* That these patterns can *offer insight* into trends, stories and phenomena of social, economic, ecological, anthropological, humanitarian, scientific, artistic or other cultural interest;
* That there exists a subset of such patterns in satellite imagery which, because of their repetition and visual consistency, lend themselves particularly well to automated detection and analysis by means of computer vision and machine learning; 
* That there is (or would be) demand for information about these patterns among domain experts, as well as among journalists, citizen scientists, and others in the Fourth Estate;
* And that it is possible to create software tools which make such workflows easy and reliable, for researchers whose teams might otherwise lack expertise in computer vision and machine learning. 

We emphasize that *Terrapattern* is a limited **prototype**. As of May 2016, it allows users to search in the greater metropolitan regions of three American cities: New York City, San Francisco, and Pittsburgh (Allegheny County). Altogether more than 2,200 square miles (5700 km²) are fully searchable. Allowing high-resolution searches in an area the size of the United States (e.g. ~3.8M mi² or 9.9M km²) is technically and financially beyond the scope of our project at the current time. 
