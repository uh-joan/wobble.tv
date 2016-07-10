class QueuedEvent < ActiveRecord::Base
  belongs_to :caller, polymorphic: true

  serialize :additional_data, Hash

  STATUS = [
      PENDING = 'pending',
      FAILED = 'failed',
      SUCCESS = 'success',
      SKIPPED = 'skipped',
  ]

  def perform(status=SUCCESS)
    yield self.caller
    update_state(status)
  rescue => e
    fail!(e)
    raise
  end

  def success!
    update_state(SUCCESS)
  end

  def pending!
    update_state(PENDING)
  end

  def skipped!
    update_state(SKIPPED)
  end

  def fail!(error)
    backtrace = (error.backtrace || []).take(10).join("\n")
    update_state(FAILED, "#{error.message}\n#{backtrace}")
  end

  private

  def update_state(status, message=nil)
    update_attributes!(status: status, processed_at: Time.now, error_message: message)
  end
end