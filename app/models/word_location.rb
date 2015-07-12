class WordLocation < ActiveRecord::Base
  belongs_to :poem
  has_one :word

  validates :word_id, presence: true
  validates :poem_id, presence: true
end