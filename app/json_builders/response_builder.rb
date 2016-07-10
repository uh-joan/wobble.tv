class ResponseBuilder
  class << self
    def success_json(details={})
      { status: 'success' }.merge(details)
    end

    def error_json(code, details={})
      { status: 'error', code: code }.merge(details)
    end

    def not_found_json(klass)
      self.class.error_json(NgHttpResponses::RECORD_NOT_FOUND, message: "#{klass} not found")
    end
  end

  def initialize(consumer, builder, object, *args)
    @consumer = consumer
    @builder  = builder
    @object   = object
    @args     = args
  end

  def with_events(events)
    @events = events
    self
  end

  def as_json(*args)
    valid? ? success_json : error_json
  end

  private

  def valid?
    !@object.nil?
  end

  def success_json
    json          = self.class.success_json
    json[:data]   = data_as_json
    json[:events] = @events if @events
    json
  rescue => e
    self.class.error_json(NgHttpResponses::INTERNAL_SERVER_ERROR, message: e.message, backtrace: e.backtrace.take(5))
  end

  def error_json
    self.class.error_json(NgHttpResponses::RECORD_NOT_FOUND, message: "#{@builder.build_class} not found")
  end

  def data_as_json
    if @object.respond_to?(:map)
      @object.map do |object|
        @builder.new(@consumer, object, *@args).as_json
      end
    else
      @builder.new(@consumer, @object, *@args).as_json
    end
  end
end