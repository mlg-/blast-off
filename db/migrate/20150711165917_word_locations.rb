class WordLocations < ActiveRecord::Migration
  def change
    create_table :word_locations do |t|
      t.integer :poem_id, null: false
      t.integer :word_id, null: false
      t.integer :x_position
      t.integer :y_position
    end
  end
end
