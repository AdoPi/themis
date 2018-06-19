class CreateUserScores < ActiveRecord::Migration[5.2]
  def change
    create_table :user_scores do |t|
      t.string :user_name
      t.integer :points
      t.belongs_to :leaderboard, foreign_key: true

      t.timestamps
    end
  end
end
