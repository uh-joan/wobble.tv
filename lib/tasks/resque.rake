# Resque tasks
require 'resque/tasks'
require 'resque/scheduler/tasks'

namespace :resque do
  task :setup => :environment do
    ENV['QUEUE'] ||= '*'

    require 'resque'
    require 'resque-scheduler'

    # you probably already have this somewhere
    Resque.redis = ENV['REDIS_URL']

    # If you want to be able to dynamically change the schedule,
    # uncomment this line.  A dynamic schedule can be updated via the
    # Resque::Scheduler.set_schedule (and remove_schedule) methods.
    # When dynamic is set to true, the scheduler process looks for
    # schedule changes and applies them on the fly.
    # Note: This feature is only available in >=2.0.0.
    # Resque::Scheduler.dynamic = true

    # The schedule doesn't need to be stored in a YAML, it just needs to
    # be a hash.  YAML is usually the easiest.
    # Resque.schedule = YAML.load_file("#{Rails.root}/config/resque.yml")

    # If your schedule already has +queue+ set for each job, you don't
    # need to require your jobs.  This can be an advantage since it's
    # less code that resque-scheduler needs to know about. But in a small
    # project, it's usually easier to just include you job classes here.
    # So, something like this:
    # require 'jobs'

    Resque.before_fork = Proc.new {
      ActiveRecord::Base.establish_connection

      # Open the new separate log file
      logfile = File.open(File.join(Rails.root, 'log', 'resque.log'), 'a')

      # Activate file synchronization
      logfile.sync = true

      # Create a new buffered logger
      Resque.logger = ActiveSupport::Logger.new(logfile)
      Resque.logger.level = Logger::DEBUG
      Resque.logger.info "Resque Logger Initialized!"
    }
  end
end
