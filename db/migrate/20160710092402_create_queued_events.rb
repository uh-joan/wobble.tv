class CreateQueuedEvents < ActiveRecord::Migration
  def change
    create_table :queued_events do |t|
      t.string :event_type, index: true
      t.integer :caller_id
      t.string :caller_type
      t.datetime :scheduled_for
      t.text :additional_data
      t.datetime :processed_at
      t.integer :processed_with
      t.string :status, index: true
      t.integer :retry_count, default: 0
      t.text :error_message

      t.timestamps
    end

    add_index :queued_events, [:caller_id, :caller_type]
  end
end