class HomeController < ApplicationController

  def index
    @login_url = new_user_session_url
    @home_url = root_path
    render layout: false
  end
end
