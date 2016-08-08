class VideosController < ApplicationController
  # before_action :authenticate_user!
  skip_before_filter :verify_authenticity_token, :only => :index
  before_action :set_video, only: [:show, :edit, :update, :destroy]

  # GET /videos
  # GET /videos.json
  def index
    videos = Video.all.select(:youtube_id, :id)
    respond_to do |format|
      format.html { @videos=Video.all }
      format.json { render json: {success: 'ok', data: videos } }
      # format.json { render :show, status: :created, location: @video }
    end

  end

  # GET /videos/1
  # GET /videos/1.json
  def show
    render json: {success: 'ok', data: @video }
  end

  # GET /videos/new
  def new
    @video = Video.new
  end

  # GET /videos/1/edit
  def edit
  end

  # POST /videos
  # POST /videos.json
  def create
    @video = Video.new(video_params)

    respond_to do |format|
      if @video.save
        EventFactory::calculate_votes_by_intervals(@video)
        format.html { redirect_to @video, notice: 'Video was successfully created.' }
        format.json { render json: {success: 'ok', data: @video } }
      else
        format.html { render :new }
        format.json { render json: @video.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /videos/1
  # PATCH/PUT /videos/1.json
  def update
    # if @video.update(video_params)
    #   render json: {success: 'ok', data: @video }
    # else
    #   render json: {error: 'error', data: @video.errors }
    # end
    respond_to do |format|
      if @video.update(video_params)
        format.html { redirect_to @video, notice: 'Video was successfully updated.' }
        format.json { render :show, status: :ok, location: @video }
      else
        format.html { render :edit }
        format.json { render json: @video.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /videos/1
  # DELETE /videos/1.json
  def destroy
    EventFactory::remove_votes_by_intervals(@video)
    # @video.destroy
    # render json: {success: 'ok', data: 'Video was successfully destroyed.' }
    respond_to do |format|
      format.html { redirect_to videos_url, notice: "Video #{@video.youtube_id} and the intervals enqueued to be destroyed. Be patient." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_video
      @video = Video.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def video_params
      params.require(:video).permit(:youtube_id, :duration)
    end
end
