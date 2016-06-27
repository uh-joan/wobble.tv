json.array!(@votes) do |vote|
  json.extract! vote, :id, :video_id, :user_id, :vote_stamp, :action
  json.url vote_url(vote, format: :json)
end
