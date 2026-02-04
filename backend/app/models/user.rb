class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: { case_sensitive: false}, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :role, presence: true, inclusion: { in: %w[admin staff] }

  before_save :downcase_email

  def admin? 
    role == "admin"
  end

  def staff?
    role == "staff"
  end

  private

  def downcase_email
    self.email = email.downcase
  end
end
