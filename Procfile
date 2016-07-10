web: web bin/rails server -p $PORT -e $RAILS_ENV
worker: bundle exec rake resque:work QUEUE=interval_value TERM_CHILD=1 RESQUE_TERM_TIMEOUT=10