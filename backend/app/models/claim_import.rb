class ClaimImport < ApplicationRecord
  has_many :claims, dependent: :nullify

  validates :file_name, presence: true
  validates :status, presence: true, inclusion: { in: %w[pending completed failed] }

  def mark_completed!
    update!(status: "completed")
  end

  def mark_failed!
    update!(status: "failed")
  end

  def increment_processed!
    increment!(:processed_records)
  end
end
