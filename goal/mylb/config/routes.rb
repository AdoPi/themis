Rails.application.routes.draw do
  resources :user_scores
  resources :leaderboards
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
