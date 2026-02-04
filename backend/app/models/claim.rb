class Claim < ApplicationRecord
  belongs_to :patient
  belongs_to :claim_import
end
