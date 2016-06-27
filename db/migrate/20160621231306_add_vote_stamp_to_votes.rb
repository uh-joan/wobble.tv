class AddVoteStampToVotes < ActiveRecord::Migration
  def change
    add_column :votes, :vote_stamp, :float
  end
end
