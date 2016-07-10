require 'resque'
require 'resque-retry'
require 'resque-scheduler'
require 'resque/scheduler/server'

require 'resque/failure/airbrake'
require 'resque/failure/redis'

Resque::Failure::MultipleWithRetrySuppression.classes = [Resque::Failure::Redis, Resque::Failure::Airbrake]
Resque::Failure.backend = Resque::Failure::MultipleWithRetrySuppression