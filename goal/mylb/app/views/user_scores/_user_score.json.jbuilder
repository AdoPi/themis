json.extract! user_score, :id, :user_name, :points, :leaderboard_id, :created_at, :updated_at
json.url user_score_url(user_score, format: :json)
