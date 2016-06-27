class DropVotesColumn < ActiveRecord::Migration
  def change
    remove_column :votes, :vote_stamp
  end
end
