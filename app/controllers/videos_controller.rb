class VideosController < ApplicationController
  before_action :authenticate_user!

  # GET /videos
  # GET /videos.json
  def index
    videos = Video.all.select(:youtube_id, :id)

    render json: {success: 'ok', data: videos }
  end

end
