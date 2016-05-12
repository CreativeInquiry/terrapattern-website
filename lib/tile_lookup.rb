require 'csv'
require 'typhoeus'
require 'json'

class TileLookup

  def initialize
    raw_data = CSV.read("data/points.csv", headers: true)
    @lats = []
    @lngs = []

    raw_data.each do |val|
      @lats.push val[0].to_f
      @lngs.push val[1].to_f
    end
    @lats.sort!
    @lngs.sort!
  end


  def id_to_coords(filename)
    filename.split("_")[1..2].collect{|a| a.to_f}
  end


  def create_geojson(data)
    features = data.collect do |datum|
      tsne = {
        cluster: {x: datum[:tsne][0], y: datum[:tsne][1]}}
      {type: "Feature", id: datum[:filename], properties: tsne, geometry: {type: "Point", coordinates: datum[:coords].reverse}}
    end  
    obj = {type: "FeatureCollection", features: features}
  end

  def lookup(lat, lng, location="Allegheny", zoom="19", limit="50")
    lat = lat.to_f
    lng = lng.to_f
    if lat >=0
      tile_lat = @lats.bsearch{|i| i>= lat }
    else
      tile_lat = @lats.reverse.bsearch{|i| i<= lat }
    end
    if lng >= 0
      tile_lng = @lngs.bsearch{|i| i>= lng }
    else
      tile_lng = @lngs.reverse.bsearch{|i| i <= lng }
    end
    id  = "#{location}_#{tile_lat}_#{tile_lng}_z#{zoom}.png"

    obj = {lat: tile_lat, lng: tile_lng, id: id, base_lat: lat, base_lng: lng}

    uri = "#{ENV["SEARCH_SERVER"]}/?filename=#{id}&limit=#{limit}"
    puts "Searching for #{uri}"
    results = Typhoeus.get(uri)
    data = JSON.parse(results.body)
    processed_data = data["matches"].collect do |point|
      {
       filename: point["filename"],
       coords: id_to_coords(point["filename"]),
       tsne: point["tsne_pos"]} 
    end
    create_geojson processed_data
  end
end