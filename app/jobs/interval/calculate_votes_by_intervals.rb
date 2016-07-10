module Interval
  class CalculateVotesByIntervals
    extend Resque::Plugins::Retry

    @queue = :interval_value

    def self.perform(data)
      queued_event = QueuedEvent.find(data.fetch('queued_event_id'))
      queued_event.perform do |video|
        new(video).perform
      end
    end

    attr_reader :video

    def initialize(video)
      @video = video
    end

    def perform
      total_time = @video.duration
      time_step = 3.0
      initial_time = 0.0
      time = time_step
      votes = Vote.where("video_id = ?", @video.youtube_id)
      # total_votes = []
      while initial_time < total_time do
        votes_positive_count = votes.where("vote_stamp >= ? AND vote_stamp < ? AND action='up'", initial_time, time).count()
        # video.interval_values.create!(action: 'up', start: initial_time, end: time, votes: votes_positive_count)
        votes_negative_count = votes.where("vote_stamp >= ? AND vote_stamp < ? AND action='down'", initial_time, time).count()
        video.interval_values.create!(action: 'up/down', start: initial_time, end: time, votes: votes_positive_count-votes_negative_count)
        # total_votes << {up: votes_positive_count, down: votes_negative_count, time: time}
        initial_time = initial_time + time_step
        time = time + time_step
      end
      # render json: {data: total_votes }
    end

  end
end