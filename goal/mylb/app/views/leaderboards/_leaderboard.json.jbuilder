json.extract! leaderboard, :id, :name, :company_name, :created_at, :updated_at
json.url leaderboard_url(leaderboard, format: :json)
