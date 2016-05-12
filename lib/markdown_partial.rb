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

  def insert_content(id)
    unless @memoed_content[id]
      content = File.read("content/#{id}.md")
      markdown_text =   @markdown.render(content)
      @memoed_content[id] = markdown_text
    end  
    return @memoed_content[id]
  end

end