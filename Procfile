web: bundle exec puma -t 5:5 -p ${PORT:-3000} -e ${RACK_ENV:-development}
worker: bundle exec rake resque:work QUEUE=interval_value TERM_CHILD=1 RESQUE_TERM_TIMEOUT=10