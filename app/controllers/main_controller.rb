
class MainController < ApplicationController
  layout 'application'

  def index

    if !user_signed_in?
      redirect_to home_index_url
    else
      # redirect_to '/#/main'
    end

  end

end
