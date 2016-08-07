module Interval
  class RemoveVotesByIntervals
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
      IntervalValue.where(video_id: @video.id).destroy_all
      @video.destroy
    end

  end

end