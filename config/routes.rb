Rails.application.routes.draw do
  resources :votes, defaults: {format: 'json'}, only: [:create, :amount]
  resources :videos, defaults: {format: 'json'}, only: [:index]
  resources :home, only: [:index]

  mount Upmin::Engine => '/admin'
  # root to: 'visitors#index'
  root to: 'main#index'
  devise_for :users
  resources :users

  get 'amount/:video_id/:time_step/:time', defaults: {format: 'json'}, to: 'votes#amount'
  get 'all_amount/:video_id/:time_step/:total_time', defaults: {format: 'json'}, to: 'votes#all_amount'

end
