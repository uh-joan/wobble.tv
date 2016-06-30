class HomeController < ApplicationController

  def index
    @signin_url = new_user_session_url
    @signup_url = new_user_registration_path
    @home_url = root_path
    render layout: false
  end
end
