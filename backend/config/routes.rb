Rails.application.routes.draw do
  # Authentication routes
  post "/auth/login", to: "authentication#login"
  post "/auth/register", to: "authentication#register"
  get "/auth/me", to: "authentication#me"

  # Health check
  get "/health", to: proc { [200, {}, ["OK"]] }
end