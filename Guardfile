# A sample Guardfile
# More info at https://github.com/guard/guard#readme

require 'uglifier'
require 'yui/compressor'
require 'fileutils'

# Specs
guard 'coffeescript', :input => 'spec', :output => 'spec/compiled', :patterns => [%r{^.+\.(?:coffee|coffee\.md|litcoffee)$}], :all_on_start => true

# Core Code

FileUtils.mkdir_p File.join(File.dirname(__FILE__), 'build', 'js')
FileUtils.mkdir_p File.join(File.dirname(__FILE__), 'build', 'css')

guard 'coffeescript', :input => 'lib/js',   :output => 'build/js',  :patterns => [%r{^.+\.(?:coffee|coffee\.md|litcoffee)$}], :all_on_start => true
guard 'sass',         :input => 'lib/css',  :output => 'build/css', :all_on_start => true, :line_numbers => true

guard 'concat',
      :all_on_start => true,
      :type => "js",
      :files => %w(vendor/jquery build/js/jquery-include vendor/diff/diff_match_patch build/js/dom build/js/core),
      :input_dir => ".",
      :output => "build/selectorgadget_combined"

guard 'concat',
      :all_on_start => true,
      :type => "css",
      :files => %w(build/css/selectorgadget),
      :input_dir => ".",
      :output => "build/selectorgadget_combined"

guard :shell, :all_on_start => true do
  # Minify JS
  watch %r{build/selectorgadget_combined.js} do |m|
    puts "Compressing build/selectorgadget_combined.js"
    File.open("build/selectorgadget_combined.min.js", 'w') do |file|
      file.print Uglifier.compile(File.read('build/selectorgadget_combined.js'))
    end
  end

  # Run build_chrome.sh after JS compression
  watch %r{build/selectorgadget_combined.min.js} do |m|
    puts "Running build_chrome.sh"
    system("bin/bundle_chrome.sh")
  end
end
