class CreateWords < ActiveRecord::Migration
  def change
    create_table :words do |word|
      word.string :word
      word.string :part_of_speech
      word.boolean :flarf
    end
  end
end