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
      time_step = 1.0
      initial_time = 0.0
      time = time_step

      interval_values = @video.interval_values
      @votes = Vote.where("video_id = ?", @video.youtube_id)

      if (interval_values.count > 0)
        interval_values.each do |v|
          total_votes = calculate_votes(v.start, v.end)
          v.update_attributes!(votes: total_votes)
        end
      else
        while initial_time < total_time do
          total_votes = calculate_votes(initial_time, time)

          video.interval_values.create!(action: 'up/down', start: initial_time, end: time, votes: total_votes)

          # total_votes << {up: votes_positive_count, down: votes_negative_count, time: time}
          initial_time = initial_time + time_step
          time = time + time_step
        end
      end


      # render json: {data: total_votes }
    end

    def calculate_votes(initial_time, time)
      all_up_votes = @votes.where("vote_stamp >= ? AND vote_stamp < ? AND action='up'", initial_time, time)
      up_votes_sorted = all_up_votes.order('created_at DESC')
      up_user_ids = up_votes_sorted.map(&:user_id).uniq

      up_votes=[]
      up_user_ids.each do |u_id|
        up_votes << up_votes_sorted.map{|a| (a[:user_id]==u_id) ? a:nil}.compact.first
      end

      all_down_votes = @votes.where("vote_stamp >= ? AND vote_stamp < ? AND action='down'", initial_time, time)
      down_votes_sorted = all_down_votes.order('created_at DESC')
      down_user_ids = down_votes_sorted.map(&:user_id).uniq

      down_votes=[]
      down_user_ids.each do |u_id|
        down_votes << down_votes_sorted.map{|a| (a[:user_id]==u_id) ? a:nil}.compact.first
      end

      final_up_votes =[]
      final_down_votes =[]
      up_votes.each do |u_vote|
        d_vote = down_votes.map{|a| (a[:user_id]==u_vote.user_id) ? a:nil}.compact.first
        unless d_vote.nil?
          if d_vote.created_at < u_vote.created_at
            final_up_votes << u_vote
          else
            final_down_votes << d_vote
          end
        else
          final_up_votes << u_vote
        end
      end

      down_votes.each do |d_vote|
        u_vote = final_up_votes.map{|a| (a[:user_id]==d_vote.user_id) ? a:nil}.compact.first
        if u_vote.nil?
          already_there = final_down_votes.map{|a| (a[:user_id]==d_vote.user_id) ? a:nil}.compact.first
          final_down_votes << d_vote if already_there.nil?
        end
      end

      final_up_votes.count - final_down_votes.count
    end

  end
end