class VotesController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => :create
  before_action :set_vote, only: [:show, :edit, :update, :destroy]

  # GET /votes
  # GET /votes.json
  def index
    @votes = Vote.all
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
    votes_positive_count = Vote.where("video_id = ? AND vote_stamp >= ? AND vote_stamp < ? AND action='up'", params[:video_id], params[:time].to_f, params[:time].to_f+params[:time_step].to_f).count()
    votes_negative_count = Vote.where("video_id = ? AND vote_stamp >= ? AND vote_stamp < ? AND action='down'", params[:video_id], params[:time].to_f, params[:time].to_f+params[:time_step].to_f).count()

    render json: {data: {up: votes_positive_count, down: votes_negative_count} }
  end

  def all_amount
    total_time = params[:total_time].to_f
    time_step = params[:time_step].to_f
    initial_time = 0.0
    time = time_step
    votes = Vote.where("video_id = ?", params[:video_id])
    total_votes = []
    while initial_time<total_time do
      votes_positive_count = votes.where("vote_stamp >= ? AND vote_stamp < ? AND action='up'", initial_time, time).count()
      votes_negative_count = votes.where("vote_stamp >= ? AND vote_stamp < ? AND action='down'", initial_time, time).count()
      total_votes << {up: votes_positive_count, down: votes_negative_count, time: time}
      initial_time = initial_time + time_step
      time = time + time_step
    end
    render json: {data: total_votes }
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
end
