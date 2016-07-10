class IntervalBuilder < Responsible::Base
  def self.build_class
    'Video'
  end

  data_object_name :video

  def initialize(consumer, video)
    super(consumer, video)
  end

  property :intervals

  def intervals
    video.interval_values.order(:end).map do |values|
      SingleIntervalBuilder.new(consumer, values)
    end
  end

  class SingleIntervalBuilder < Responsible::Base
    def self.build_class
      'IntervalValue'
    end

    def initialize(consumer, interval_value)
      super(consumer, interval_value)
    end

    data_object_name :interval_value

    property :votes, delegate: true
    property :time

    def time
      interval_value.end
    end
  end

#   {up: votes_positive_count, down: votes_negative_count, time: time}

end
