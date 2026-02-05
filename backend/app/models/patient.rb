class Patient < ApplicationRecord
  has_many :claims, dependent: :destroy

  validates :first_name, presence:true
  validates :last_name, presence: true
  validates :dob, presence: true
  validates :first_name, uniqueness: { scope: [:last_name, :dob], message: "Patient with this name and DOB already exists" }

  def full_name
    "#{first_name} #{last_name}"
  end
end
