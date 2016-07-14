json.array!(@videos) do |video|
  json.extract! video, :id, :youtube_id, :duration
  json.url video_url(video, format: :json)
end
