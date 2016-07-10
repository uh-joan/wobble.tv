class RenameVideoIdOnIntervalValue < ActiveRecord::Migration
  def change
    rename_column :interval_values, :video_id_id, :video_id
  end
end
