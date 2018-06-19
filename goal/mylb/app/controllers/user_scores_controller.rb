class UserScoresController < ApplicationController
  before_action :set_user_score, only: [:show, :edit, :update, :destroy]

  # GET /user_scores
  # GET /user_scores.json
  def index
    @user_scores = UserScore.all
  end

  # GET /user_scores/1
  # GET /user_scores/1.json
  def show
  end

  # GET /user_scores/new
  def new
    @user_score = UserScore.new
  end

  # GET /user_scores/1/edit
  def edit
  end

  # POST /user_scores
  # POST /user_scores.json
  def create
    @user_score = UserScore.new(user_score_params)

    respond_to do |format|
      if @user_score.save
        format.html { redirect_to @user_score, notice: 'User score was successfully created.' }
        format.json { render :show, status: :created, location: @user_score }
      else
        format.html { render :new }
        format.json { render json: @user_score.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user_scores/1
  # PATCH/PUT /user_scores/1.json
  def update
    respond_to do |format|
      if @user_score.update(user_score_params)
        format.html { redirect_to @user_score, notice: 'User score was successfully updated.' }
        format.json { render :show, status: :ok, location: @user_score }
      else
        format.html { render :edit }
        format.json { render json: @user_score.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_scores/1
  # DELETE /user_scores/1.json
  def destroy
    @user_score.destroy
    respond_to do |format|
      format.html { redirect_to user_scores_url, notice: 'User score was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_score
      @user_score = UserScore.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_score_params
      params.require(:user_score).permit(:user_name, :points, :leaderboard_id)
    end
end
