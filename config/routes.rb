Rails.application.routes.draw do
  resources :votes, defaults: {format: 'json'}, only: [:create, :amount]
  resources :home, only: [:index]

  mount Upmin::Engine => '/admin'
  # root to: 'visitors#index'
  root to: 'main#index'
  devise_for :users
  resources :users

  get 'amount/:video_id/:time', defaults: {format: 'json'}, to: 'votes#amount'

end
