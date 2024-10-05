# -*- encoding: utf-8 -*-
# stub: guard-coffeescript 2.0.1 ruby lib

Gem::Specification.new do |s|
  s.name = "guard-coffeescript".freeze
  s.version = "2.0.1".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.6".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Michael Kessler".freeze]
  s.date = "2015-01-12"
  s.description = "Guard::CoffeeScript automatically generates your JavaScripts from your CoffeeScripts".freeze
  s.email = ["michi@flinkfinger.com".freeze]
  s.homepage = "http://github.com/netzpirat/guard-coffeescript".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.4.3".freeze
  s.summary = "Guard gem for CoffeeScript".freeze

  s.installed_by_version = "3.5.21".freeze if s.respond_to? :installed_by_version

  s.specification_version = 4

  s.add_runtime_dependency(%q<guard>.freeze, [">= 2.1.0".freeze])
  s.add_runtime_dependency(%q<guard-compat>.freeze, ["~> 1.1".freeze])
  s.add_runtime_dependency(%q<coffee-script>.freeze, [">= 2.2.0".freeze])
  s.add_development_dependency(%q<bundler>.freeze, [">= 0".freeze])
end
