class CreateClaimImports < ActiveRecord::Migration[7.0]
  def change
    create_table :claim_imports do |t|
      t.string :file_name, null: false
      t.integer :total_records, default: 0
      t.integer :processed_records, default: 0
      t.string :status, null: false, default: "pending"

      t.timestamps
    end
  end
end
