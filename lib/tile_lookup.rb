require 'csv'
require 'typhoeus'
require 'json'

class TileLookup

  def initialize

    data = JSON.parse(File.read("data/lat_lngs.json"))

    @lats = [] 
    @lngs = []
    
    data.each do |key, val|
      @lats.push val["lat"]
      @lngs.push val["lng"]
    end

    @lats.flatten!
    @lngs.flatten!
  end


  def id_to_coords(filename,loc)
    filename.gsub("#{loc}_","").split("_")[0..1].collect{|a| a.to_f}
  end


  def create_geojson(data)
    features = data.collect do |datum|
      tsne = {
        cluster: {x: datum[:tsne][0], y: datum[:tsne][1]}}
      {type: "Feature", id: datum[:filename], properties: tsne, geometry: {type: "Point", coordinates: datum[:coords].reverse}}
    end  
    obj = {type: "FeatureCollection", features: features}
  end

  def lookup(lat, lng, location="Allegheny", zoom="19", limit="96", opts ={})
    lat = lat.to_f
    lng = lng.to_f
    
    tile_lat = @lats.min_by { |x| (x - lat).abs } 
    tile_lng = @lngs.min_by { |x| (x - lng).abs } 


    id  = "#{location}_#{tile_lat}_#{tile_lng}_z#{zoom}.png"

    obj = {lat: tile_lat, lng: tile_lng, id: id, base_lat: lat, base_lng: lng}

    uri = "#{ENV["SEARCH_SERVER"]}/?filename=#{id}&limit=#{limit}&level=#{zoom}&region=#{location}"
    uri += "&perplexity=#{opts["perplexity"]}"       if opts["perplexity"]
    uri += "&learning_rate=#{opts["learning_rate"]}" if opts["learning_rate"]
    uri += "&earlyx=#{opts["earlyx"]}"               if opts["earlyx"]
    uri += "&metric=#{opts["metric"]}"               if opts["metric"]
    uri += "&pca=#{opts["pca"]}"                     if opts["pca"]
    uri += "&pca_only=#{opts["pca_only"]}"           if opts["pca_only"]

    puts "Searching for #{uri}"
    results = Typhoeus.get(uri)
    data = JSON.parse(results.body)
    processed_data = data["matches"].collect do |point|
      {
       filename: point["filename"],
       coords: id_to_coords(point["filename"],location),
       tsne: point["tsne_pos"]} 
    end
    create_geojson processed_data
  end
end