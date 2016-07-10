# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160710124507) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "interval_values", force: :cascade do |t|
    t.integer  "video_id"
    t.string   "action"
    t.float    "start"
    t.float    "end"
    t.integer  "votes"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "interval_values", ["video_id"], name: "index_interval_values_on_video_id", using: :btree

  create_table "queued_events", force: :cascade do |t|
    t.string   "event_type"
    t.integer  "caller_id"
    t.string   "caller_type"
    t.datetime "scheduled_for"
    t.text     "additional_data"
    t.datetime "processed_at"
    t.integer  "processed_with"
    t.string   "status"
    t.integer  "retry_count",     default: 0
    t.text     "error_message"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "queued_events", ["caller_id", "caller_type"], name: "index_queued_events_on_caller_id_and_caller_type", using: :btree
  add_index "queued_events", ["event_type"], name: "index_queued_events_on_event_type", using: :btree
  add_index "queued_events", ["status"], name: "index_queued_events_on_status", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "name"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "role"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "videos", force: :cascade do |t|
    t.string   "youtube_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "duration"
  end

  add_index "videos", ["youtube_id"], name: "index_videos_on_youtube_id", using: :btree

  create_table "votes", force: :cascade do |t|
    t.string   "video_id"
    t.integer  "user_id"
    t.string   "action"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float    "vote_stamp"
  end

  add_index "votes", ["user_id"], name: "index_votes_on_user_id", using: :btree

  add_foreign_key "votes", "users"
end
