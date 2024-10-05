# -*- encoding: utf-8 -*-
# stub: guard-sass 1.6.1 ruby lib

Gem::Specification.new do |s|
  s.name = "guard-sass".freeze
  s.version = "1.6.1".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.6".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Joshua Hawxwell".freeze]
  s.date = "2016-06-04"
  s.description = "Guard::Sass automatically rebuilds sass (like sass --watch)".freeze
  s.email = ["m@hawx.me".freeze]
  s.homepage = "http://rubygems.org/gems/guard-sass".freeze
  s.rubygems_version = "2.5.1".freeze
  s.summary = "Guard gem for Sass".freeze

  s.installed_by_version = "3.5.21".freeze if s.respond_to? :installed_by_version

  s.specification_version = 4

  s.add_runtime_dependency(%q<guard>.freeze, [">= 2.8.0".freeze])
  s.add_runtime_dependency(%q<sass>.freeze, [">= 3.1".freeze])
  s.add_development_dependency(%q<bundler>.freeze, ["~> 1.0".freeze])
  s.add_development_dependency(%q<rspec>.freeze, ["> 2.0.0.rc".freeze])
end
