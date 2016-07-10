module EventFactory
  extend self

  def enqueue(params)
    p "********** enqueue, params: #{params.inspect}"
    return if params[:disallow_duplicate_events] && existing_event(params)
    delay        = params[:delay] || 0.seconds

    10.times do
      @queued_event = QueuedEvent.create!(
          event_type:      params.fetch(:event).to_s,
          caller:          params.fetch(:caller),
          scheduled_for:   delay.from_now,
          additional_data: params[:additional_data] || {},
          status:          QueuedEvent::PENDING,
          retry_count:     params[:retry_count] || 0
      )
      begin
        p "********** queued_event created is: #{@queued_event.inspect}"
        qe = QueuedEvent.find(@queued_event.id)
        # puts "********** queued_event found with id: #{qe.inspect}"
        p "********** qe found: #{qe.inspect}"
        @queued_event = qe
        p "********** queued_event assigned is: #{@queued_event.inspect}"

        if params[:delay]
          Resque.enqueue_in(
              delay,
              params.fetch(:event),
              queued_event_id: qe.id,
              retry_count:     qe.retry_count,
              details:         qe.attributes.slice('event_type', 'caller_type', 'caller_id', 'additional_data', 'scheduled_for')
          )
          p "********** enqueued in resque with delay, delay: #{delay}, event: #{params.fetch(:event)}, queued_event_id: #{qe.id}, retry_count: #{qe.retry_count}, details: #{qe.attributes.slice('event_type', 'caller_type', 'caller_id', 'additional_data')}"

        else
          Resque.enqueue(
              params.fetch(:event),
              queued_event_id: qe.id,
              retry_count:     qe.retry_count,
              details:         qe.attributes.slice('event_type', 'caller_type', 'caller_id', 'additional_data')
          )
          p "********** enqueued in resque, event: #{params.fetch(:event)}, queued_event_id: #{qe.id}, retry_count: #{qe.retry_count}, details: #{qe.attributes.slice('event_type', 'caller_type', 'caller_id', 'additional_data')}"
        end

        break
      rescue
        # puts "********** NOT FOUND queued_event with id: #{@queued_event.id}"
        p "********** NOT FOUND queued_event: #{@queued_event.inspect}"
      end
      sleep 1
    end
  end

  def requeue(params)
    begin
      queued_event = QueuedEvent.find(params[:queued_event_id])
      Resque.enqueue(
          eval(params.fetch(:event)),
          queued_event_id: queued_event.id,
          retry_count:     queued_event.retry_count,
          details:         queued_event.attributes.slice('event_type', 'caller_type', 'caller_id', 'additional_data')
      )
    rescue
      queued_event.update_attribute(:status, "failed")
      p "Error for QueuedEvent: #{queued_event.id}. Caller ID: #{queued_event.caller_id}. Caller Type: #{queued_event.caller_type}"
    end
  end

  def calculate_votes_by_intervals(model, opts ={})
    p "********** in calculate votes: #{model.inspect}"
    enqueue(event: Interval::CalculateVotesByIntervals, caller: model, additional_data: opts)
  end

end