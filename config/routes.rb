Rails.application.routes.draw do
  root 'poems#index'
  devise_for :users

  resources :poems, only: [:index, :new]

  resources :users do
    resources :poems, only: [:new, :show, :index]
  end

  namespace :api do
    namespace :v1 do
      resources :words, only: [:index]
      resources :poems, only: [:new, :create, :update, :show]
    end
  end
end
