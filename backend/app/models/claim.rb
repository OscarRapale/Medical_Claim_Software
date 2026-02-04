class Claim < ApplicationRecord
  belongs_to :patient
  belongs_to :claim_import, optional: true

  validates :claim_number, presence: true, uniqueness: true
  validates :service_date, presence: true
  validates :amount, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :status, presence: true, inclusion: { in: %w[pending submitted denied paid] }
  
  scope :pending, -> { where(status: "pending") }
  scope :submitted, -> { where(status: "submitted") }
  scope :denied, -> { where(status: "denied") }
  scope :paid, -> { where(status: "paid") }
end
