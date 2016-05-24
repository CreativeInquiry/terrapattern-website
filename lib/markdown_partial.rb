require 'redcarpet'

class MarkdownPartial

  def initialize
 
    @memoed_content = {}
 
    # Set up Markdown rendering for content
    markdown_options = {
      tables: true, 
      autolink: true, 
      strikethrough: true, 
      no_intra_emphasis: true, 
      space_after_headers: false
    }
    
    markdown_html_options = {
      with_toc_data: true
    }

    @markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(markdown_html_options), markdown_options)
  end

  def insert_content(id, city_name=nil, suffix=nil)

   key = [id,city_name,suffix].compact.join("_")
   if ENV["environment"] == "development" || @memoed_content[key].nil?
      content = File.read("content/#{id}.md")
      if suffix
        content += "#{suffix}"
      end
      markdown_text =   @markdown.render(content)
      if city_name
        markdown_text.gsub!("$CITY", city_name)
      end

      @memoed_content[key] = markdown_text
   end  

    return @memoed_content[key]
  end

end