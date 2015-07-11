Rails.application.routes.draw do
  root 'poems#index'
  devise_for :users

  resources :poems, only: [:index, :new]

  namespace :api do
    namespace :v1 do
      resources :words
    end
  end

end
