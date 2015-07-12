class Poem < ActiveRecord::Base
  has_many :word_locations
  belongs_to :user
  # validates :user_id, presence: true
end