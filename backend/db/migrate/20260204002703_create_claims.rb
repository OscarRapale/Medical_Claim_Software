class CreateClaims < ActiveRecord::Migration[7.0]
  def change
    create_table :claims do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :claim_import, null: false, foreign_key: true
      t.string :claim_number
      t.date :service_date
      t.decimal :amount
      t.string :status

      t.timestamps
    end
  end
end
