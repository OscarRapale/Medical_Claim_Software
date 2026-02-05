class AuthenticationController < ApplicationController
  skip_before_action :authorize_request, only: [:login, :register]

  # POST /auth/login
  def login
    user = User.find_by(email: params[:email]&.downcase)

    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: {
        token: token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }, status: :ok
      else
        render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  # POST /auth/register
  def register
    user = User.new(user_params)

    if user.save
      token = JsonWebToken.encode(user_id: user.id)
      render json: { 
        token: token, 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        } 
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /auth/me
  def me
    render json: { 
      user: { 
        id: current_user.id, 
        email: current_user.email, 
        role: current_user.role 
      } 
    }, status: :ok
  end

  private

  def user_params
    params.permit(:email, :password, :password_confirmation, :role)
  end
end