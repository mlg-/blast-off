class WordLocation < ActiveRecord::Base
  has_many :words
  has_many :poems

  validates :word_id, presence: true
  validates :poem_id, presence: true
end