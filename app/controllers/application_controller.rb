class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  # before_action :authenticate_user!

  # before_filter :cor
  # def cor
  #   headers["Access-Control-Allow-Origin"]  = "*"
  #   headers["Access-Control-Allow-Methods"] = %w{GET POST PUT DELETE}.join(",")
  #   headers["Access-Control-Allow-Headers"] = %w{Origin Accept Content-Type X-Requested-With X-CSRF-Token}.join(",")
  #   head(:ok) if request.request_method == "OPTIONS"
  # end


  # rescue_from ActionController::InvalidAuthenticityToken, :with => :bad_token
  # def bad_token
  #   p "Session expired"
  # end
  #
  # def index
  # end

  layout 'vanilla'

  private

  def after_sign_in_path_for(resource)
    root_path
  end

end
