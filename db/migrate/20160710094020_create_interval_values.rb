class CreateIntervalValues < ActiveRecord::Migration
  def change
    create_table :interval_values do |t|
      t.references :video, index: true
      t.string :action
      t.float :start
      t.float :end
      t.integer :votes

      t.timestamps
    end
  end
end
