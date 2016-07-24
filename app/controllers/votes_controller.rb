class VotesController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => :create
  before_action :set_vote, only: [:show, :edit, :update, :destroy]

  # GET /votes
  # GET /votes.json
  def index
    # @votes = Vote.all
  end

  # GET /votes/1
  # GET /votes/1.json
  def show
  end

  # GET /votes/new
  def new
    @vote = Vote.new
  end

  # GET /votes/1/edit
  def edit
  end

  # POST /votes
  # POST /votes.json
  def create
    # @vote = Vote.new(vote_params)

    vote = current_user.votes.create!(vote_params)
    video = Video.find_by_youtube_id(vote.video_id)
    p "enqueuing votes by interval for video: #{video.youtube_id}"
    EventFactory::calculate_votes_by_intervals(video)

    render json: {data: vote}
    # respond_to do |format|
    #   if @vote.save
    #     format.html { redirect_to @vote, notice: 'Vote was successfully created.' }
    #     format.json { render :show, status: :created, location: @vote }
    #   else
    #     format.html { render :new }
    #     format.json { render json: @vote.errors, status: :unprocessable_entity }
    #   end
    # end
  rescue
    render json: {error: 'error creating vote'}
  end

  def amount
    # votes_positive_count = Vote.where("video_id = ? AND vote_stamp >= ? AND vote_stamp < ? AND action='up'", params[:video_id], params[:time].to_f, params[:time].to_f+params[:time_step].to_f).count()
    # votes_negative_count = Vote.where("video_id = ? AND vote_stamp >= ? AND vote_stamp < ? AND action='down'", params[:video_id], params[:time].to_f, params[:time].to_f+params[:time_step].to_f).count()

    calculate_votes(params[:time].to_f, params[:time].to_f+params[:time_step].to_f, params[:video_id])
    render json: {data: {up: @votes_positive_count, down: @votes_negative_count} }
  end

  def all_amount
    video = Video.find_by_youtube_id(params[:video_id])
    # interval_values = video.interval_values.all

    # p "count : #{interval_values.count}"

    render json: ResponseBuilder.new(
               Responsible::Consumer.new,
               IntervalBuilder,
               video
           )

  end

  # PATCH/PUT /votes/1
  # PATCH/PUT /votes/1.json
  def update
    respond_to do |format|
      if @vote.update(vote_params)
        format.html { redirect_to @vote, notice: 'Vote was successfully updated.' }
        format.json { render :show, status: :ok, location: @vote }
      else
        format.html { render :edit }
        format.json { render json: @vote.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /votes/1
  # DELETE /votes/1.json
  def destroy
    @vote.destroy
    respond_to do |format|
      format.html { redirect_to votes_url, notice: 'Vote was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_vote
      @vote = Vote.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def vote_params
      params.require(:vote).permit(:video_id, :user_id, :vote_stamp, :action)
    end

  def calculate_votes(initial_time, time, videoId)
    all_up_votes = Vote.where("video_id = ? AND vote_stamp >= ? AND vote_stamp < ? AND action='up'", videoId, initial_time, time)
    up_votes_sorted = all_up_votes.order('created_at DESC')
    up_user_ids = up_votes_sorted.map(&:user_id).uniq

    up_votes=[]
    up_user_ids.each do |u_id|
      up_votes << up_votes_sorted.map{|a| (a[:user_id]==u_id) ? a:nil}.compact.first
    end

    all_down_votes = Vote.where("video_id = ? AND vote_stamp >= ? AND vote_stamp < ? AND action='down'", videoId, initial_time, time)
    down_votes_sorted = all_down_votes.order('created_at DESC')
    down_user_ids = down_votes_sorted.map(&:user_id).uniq

    down_votes=[]
    down_user_ids.each do |u_id|
      down_votes << down_votes_sorted.map{|a| (a[:user_id]==u_id) ? a:nil}.compact.first
    end

    final_up_votes =[]
    final_down_votes =[]
    up_votes.each do |u_vote|
      d_vote = down_votes.map{|a| (a[:user_id]==u_vote.user_id) ? a:nil}.compact.first
      unless d_vote.nil?
        if d_vote.created_at < u_vote.created_at
          final_up_votes << u_vote
        else
          final_down_votes << d_vote
        end
      else
        final_up_votes << u_vote
      end
    end

    down_votes.each do |d_vote|
      u_vote = final_up_votes.map{|a| (a[:user_id]==d_vote.user_id) ? a:nil}.compact.first
      if u_vote.nil?
        already_there = final_down_votes.map{|a| (a[:user_id]==d_vote.user_id) ? a:nil}.compact.first
        final_down_votes << d_vote if already_there.nil?
      end
    end

    @votes_positive_count = final_up_votes.count
    @votes_negative_count = final_down_votes.count
  end
end
