class Video < ActiveRecord::Base
  has_many :interval_values
end
