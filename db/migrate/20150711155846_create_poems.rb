class CreatePoems < ActiveRecord::Migration
  def change
    create_table :poems do |t|
      t.integer :user_id, null: false
      t.string :title
    end
  end
end
