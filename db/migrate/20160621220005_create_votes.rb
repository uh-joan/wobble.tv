class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.string :video_id
      t.references :user, index: true, foreign_key: true
      t.float :vote_stamp
      t.string :action

      t.timestamps null: false
    end
  end
end
